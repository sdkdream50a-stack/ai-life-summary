/**
 * Analytics Funnel Events
 * Tracks user journey through tests for conversion optimization
 */

const AnalyticsEvents = {
  // Current session data
  session: {
    testType: null,
    startTime: null,
    questionCount: 0,
    questionsAnswered: 0
  },

  /**
   * Initialize analytics events
   */
  init() {
    this.bindEvents();
    this.bindCanonicalFunnel();
    window.AnalyticsEvents = this;
  },

  /**
   * Safe gtag call - checks consent first
   */
  track(eventName, params = {}) {
    // Check if analytics consent was given
    if (typeof ConsentManager !== 'undefined' && !ConsentManager.hasConsent('analytics')) {
      // Store event for later if consent is given
      this.queueEvent(eventName, params);
      return;
    }

    // Consent alone is not enough. `gtag` is defined from the first line of
    // consent-manager.js as the Consent Mode shim, so it is truthy long before
    // GA4 exists — sending here would push into dataLayer ahead of
    // gtag('config', …), and GA4 drops events that arrive with no property
    // configured. This is the returning-visitor half of the same defect: with
    // consent already stored, on-load events were never queued at all, they
    // were sent straight into that gap. Wait for configuration instead.
    if (!window.gaLoaded) {
      this.queueEvent(eventName, params);
      return;
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        ...params,
        timestamp: Date.now()
      });
    }
  },

  /**
   * Queue events for when consent is granted
   */
  queueEvent(eventName, params) {
    if (!window.pendingAnalyticsEvents) {
      window.pendingAnalyticsEvents = [];
    }
    window.pendingAnalyticsEvents.push({ eventName, params, time: Date.now() });

    // Bind the drain exactly once per page load. Binding per queued event —
    // as this did before — registers N listeners for N events, so the queue
    // is walked N times; only the array being emptied first kept that from
    // duplicating sends.
    if (!this._drainBound) {
      this._drainBound = true;
      window.addEventListener('consentUpdated', () => this.flushQueue());
    }
  },

  /**
   * Send anything queued while analytics was unavailable.
   *
   * Both conditions are re-checked here rather than trusted from the caller:
   * a rejected user must never have their queue transmitted, and GA4 must be
   * configured or the events are dropped on arrival. The queue is detached
   * before sending so a re-entrant call cannot send the same event twice.
   */
  flushQueue() {
    if (typeof ConsentManager !== 'undefined' && !ConsentManager.hasConsent('analytics')) {
      return;
    }
    if (!window.gaLoaded) {
      return;
    }
    const pending = window.pendingAnalyticsEvents || [];
    window.pendingAnalyticsEvents = [];
    pending.forEach(event => {
      this.track(event.eventName, { ...event.params, delayed: true });
    });
  },

  /**
   * Bind automatic event tracking
   */
  bindEvents() {
    // Auto-detect page type and track page view
    this.trackPageView();

    // Listen for test start
    document.addEventListener('click', (e) => {
      const startBtn = e.target.closest('[data-test-start], .test-start-btn, #start-test-btn');
      if (startBtn) {
        this.onTestStarted(startBtn.dataset.testType || this.detectTestType());
      }
    });

    // Listen for share button clicks
    document.addEventListener('click', (e) => {
      const shareBtn = e.target.closest('[data-share], .share-btn, [id^="share-"]');
      if (shareBtn) {
        const platform = shareBtn.dataset.platform || shareBtn.id.replace('share-', '').replace('-btn', '');
        this.onShareClicked(platform);
      }
    });

    // Track result page load
    if (window.location.pathname.includes('/result')) {
      this.onTestCompleted();
    }
  },

  /**
   * Detect current test type from URL
   */
  detectTestType() {
    const path = window.location.pathname;
    if (path.includes('life-summary')) return 'life-summary';
    if (path.includes('compatibility')) return 'compatibility';
    if (path.includes('age-calculator')) return 'age-calculator';
    return 'unknown';
  },

  /**
   * Track page view
   */
  trackPageView() {
    const testType = this.detectTestType();
    const pageType = window.location.pathname.includes('/result') ? 'result' : 'input';

    this.track('page_view', {
      page_type: pageType,
      test_type: testType,
      page_path: window.location.pathname,
      referrer: document.referrer
    });
  },

  /**
   * EVENT: Test started
   */
  onTestStarted(testType) {
    this.session.testType = testType;
    this.session.startTime = Date.now();
    this.session.questionsAnswered = 0;

    this.track('test_started', {
      test_type: testType,
      entry_point: document.referrer ? 'referral' : 'direct',
      device_type: this.getDeviceType()
    });

    // Store in sessionStorage for cross-page tracking
    try {
      sessionStorage.setItem('test_session', JSON.stringify(this.session));
    } catch (e) {}
  },

  /**
   * EVENT: Question answered
   */
  onQuestionAnswered(questionNumber, answer, totalQuestions) {
    this.session.questionsAnswered = questionNumber;

    this.track('question_answered', {
      test_type: this.session.testType || this.detectTestType(),
      question_number: questionNumber,
      total_questions: totalQuestions,
      progress_percent: Math.round((questionNumber / totalQuestions) * 100)
    });

    // Update session
    try {
      sessionStorage.setItem('test_session', JSON.stringify(this.session));
    } catch (e) {}
  },

  /**
   * EVENT: Test completed
   */
  onTestCompleted(resultData = {}) {
    // Restore session if exists
    try {
      const stored = sessionStorage.getItem('test_session');
      if (stored) {
        this.session = JSON.parse(stored);
      }
    } catch (e) {}

    const completionTime = this.session.startTime
      ? Math.round((Date.now() - this.session.startTime) / 1000)
      : null;

    this.track('test_completed', {
      test_type: this.session.testType || this.detectTestType(),
      completion_time_seconds: completionTime,
      questions_answered: this.session.questionsAnswered,
      result_type: resultData.resultType || 'standard',
      ...resultData
    });

    // Clear session
    try {
      sessionStorage.removeItem('test_session');
    } catch (e) {}
  },

  /**
   * EVENT: Share button clicked
   */
  onShareClicked(platform) {
    this.track('share_clicked', {
      test_type: this.detectTestType(),
      platform: platform,
      page_type: window.location.pathname.includes('/result') ? 'result' : 'input'
    });
  },

  /**
   * EVENT: Share completed successfully
   */
  onShareCompleted(platform, method = 'native') {
    this.track('share_completed', {
      test_type: this.detectTestType(),
      platform: platform,
      method: method // 'native', 'clipboard', 'download'
    });
  },

  /**
   * EVENT: Share failed
   */
  onShareFailed(platform, error) {
    this.track('share_failed', {
      test_type: this.detectTestType(),
      platform: platform,
      error: error.toString().substring(0, 100)
    });
  },

  /**
   * EVENT: Ad interaction
   */
  onAdClicked(slotType, adFormat) {
    this.track('ad_clicked', {
      slot_type: slotType,
      ad_format: adFormat,
      page_type: window.location.pathname.includes('/result') ? 'result' : 'input'
    });
  },

  /**
   * EVENT: Test abandoned (called from exit intent)
   */
  onTestAbandoned(reason = 'exit_intent') {
    this.track('test_abandoned', {
      test_type: this.session.testType || this.detectTestType(),
      questions_completed: this.session.questionsAnswered,
      time_spent_seconds: this.session.startTime
        ? Math.round((Date.now() - this.session.startTime) / 1000)
        : 0,
      reason: reason
    });
  },

  /**
   * EVENT: Recovery modal shown
   */
  onRecoveryShown(trigger = 'exit_intent') {
    this.track('recovery_modal_shown', {
      test_type: this.session.testType || this.detectTestType(),
      trigger: trigger,
      questions_completed: this.session.questionsAnswered
    });
  },

  /**
   * EVENT: Recovery successful (user continued)
   */
  onRecoveryContinued() {
    this.track('recovery_continued', {
      test_type: this.session.testType || this.detectTestType(),
      questions_completed: this.session.questionsAnswered
    });
  },

  // ==========================================================================
  // Canonical funnel (S1-1)
  //
  // The legacy events above only ever loaded on noindex leaf pages, so the
  // business funnel was never measured. These are the canonical names, bound
  // by URL shape so no per-page wiring is needed. Everything routes through
  // this.track(), which honours ConsentManager and queues until consent —
  // the consent policy is NOT bypassed here.
  // ==========================================================================

  /** Locale from the URL path, not documentElement.lang (which JS rewrites). */
  detectLocale() {
    const p = window.location.pathname;
    // Translated blog posts live at /blog/{lang}/… with no top-level prefix.
    const blog = p.match(/^\/blog\/(ja|es|ko|zh|en)\//);
    if (blog) return blog[1];
    if (/^\/blog(\/|$)/.test(p)) return 'ko'; // root blog corpus is Korean
    const m = p.match(/^\/(en|ko|ja|zh|es)(\/|$)/);
    return m ? m[1] : 'en';
  },

  /** Test slug from the URL, covering every test the site actually ships. */
  detectTestSlug() {
    const p = window.location.pathname;
    const slugs = [
      'personality-type', 'compatibility', 'age-calculator', 'life-summary',
      'vibe-check', 'kpop-match', 'love-type', 'work-style',
      'communication-style', 'friend-compatibility', 'marriage-compatibility'
    ];
    // longest match first so 'friend-compatibility' wins over 'compatibility'
    return slugs.slice().sort((a, b) => b.length - a.length)
      .find(s => p.includes('/' + s)) || null;
  },

  /** Which kind of surface this page is. */
  detectSurface() {
    const p = window.location.pathname;
    if (/\/result\/?$/.test(p) || /result\.html$/.test(p)) return 'result';
    if (/^\/blog\/[^/]+/.test(p) && !/^\/blog\/?$/.test(p)) return 'article';
    if (/^\/blog\/(ja|es)\/[^/]+/.test(p)) return 'article';
    if (this.detectTestSlug()) return 'test_landing';
    if (/^\/(en|ko|ja|zh|es)\/?$/.test(p) || p === '/' || p === '/index.html') return 'home';
    return 'other';
  },

  /** Params every canonical event carries. */
  baseParams() {
    return {
      locale: this.detectLocale(),
      surface: this.detectSurface(),
      device_type: this.getDeviceType(),
      page_path: window.location.pathname
    };
  },

  /** Fire an event at most once per page load. */
  once(key, eventName, params) {
    this._fired = this._fired || {};
    if (this._fired[key]) return;
    this._fired[key] = true;
    this.track(eventName, { ...this.baseParams(), ...params });
  },

  bindCanonicalFunnel() {
    const surface = this.detectSurface();
    const test = this.detectTestSlug();

    // ---- on load ----------------------------------------------------------
    if (surface === 'home') {
      this.once('home_view', 'home_view', {});
    } else if (surface === 'result') {
      // A result page is only reachable by finishing the test, so its load is
      // the completion signal for this architecture.
      this.once('result_view', 'result_view', { test_type: test });
      this.once('test_complete', 'test_complete', { test_type: test });
    } else if (surface === 'article') {
      this.once('article_view', 'article_view', {
        article_slug: window.location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '')
      });
    }

    // ---- test_start: first real interaction with a quiz --------------------
    if (surface === 'test_landing') {
      const start = () => this.once('test_start', 'test_start', { test_type: test });
      // number inputs count: the birthday tools (age-calculator, life-summary)
      // open on three <input type="number"> fields and have no radio/select on
      // the first step, so without this a real user could answer the whole
      // first step and still register no start. `change` (not `input`) keeps
      // this to a committed value rather than a stray keystroke, and once()
      // still caps it at one per page load.
      document.addEventListener('change', e => {
        if (e.target && e.target.matches('input[type=radio], input[type=checkbox], input[type=number], select')) start();
      }, true);
      document.addEventListener('click', e => {
        if (e.target && e.target.closest(
          '[data-test-start], .test-start-btn, #start-test-btn, .pt-likert-btn, .vc-option, .option-btn, .quiz-option'
        )) start();
      }, true);
      // Birthday-only tools have no questions — submitting the form is the start.
      document.addEventListener('submit', start, true);
    }

    // ---- share_click -------------------------------------------------------
    document.addEventListener('click', e => {
      const el = e.target && e.target.closest(
        '[data-share], .share-btn, [id^="share-"], [onclick*="share"], [onclick*="Share"]'
      );
      if (!el) return;
      this.track('share_click', {
        ...this.baseParams(),
        test_type: test,
        method: this.shareMethodOf(el)
      });
    }, true);

    // ---- deep_dive (FateAIverse referral) ----------------------------------
    this.bindDeepDive(test);

    // ---- article_to_test_click --------------------------------------------
    if (surface === 'article') {
      document.addEventListener('click', e => {
        const a = e.target && e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (/^(https?:)?\/\//.test(href) && !href.includes('smartaitest.com')) return;
        if (!/\/(personality-type|compatibility|age-calculator|life-summary|vibe-check|kpop-match|love-type|work-style|communication-style)\b/.test(href)) return;
        this.track('article_to_test_click', {
          ...this.baseParams(),
          target_href: href,
          article_slug: window.location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '')
        });
      }, true);
    }

    // ---- share_success -----------------------------------------------------
    this.bindShareSuccess(test);
  },

  /** Best-effort share channel label from the clicked control. */
  shareMethodOf(el) {
    const hay = (
      (el.getAttribute('data-platform') || '') + ' ' +
      (el.id || '') + ' ' +
      (el.getAttribute('onclick') || '') + ' ' +
      (el.textContent || '')
    ).toLowerCase();
    const known = ['line', 'kakao', 'twitter', 'facebook', 'instagram', 'threads',
                   'telegram', 'reddit', 'pinterest', 'linkedin', 'whatsapp',
                   'copy', 'link', 'download', 'image', 'native'];
    return known.find(k => hay.includes(k)) || 'unknown';
  },

  /** Impression + click on the FateAIverse deep-dive CTA. */
  bindDeepDive(test) {
    const SEL = 'a[href*="fateaiverse"]';

    document.addEventListener('click', e => {
      const a = e.target && e.target.closest(SEL);
      if (!a) return;
      this.track('deep_dive_click', {
        ...this.baseParams(),
        test_type: test,
        target_href: a.getAttribute('href') || ''
      });
    }, true);

    // Impression. IntersectionObserver is the primary signal, but its callbacks
    // are throttled or dropped entirely in background/automated tabs, so a plain
    // rect check on scroll is kept as a deterministic fallback. Both funnel into
    // once(), so the event is still emitted at most one time per page.
    const nodesIn = () => document.querySelectorAll(SEL);
    const markSeen = () => this.once('deep_dive_impression', 'deep_dive_impression', { test_type: test });

    const isHalfVisible = el => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) return false;
      const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return shown / r.height >= 0.5;
    };

    const checkRects = () => {
      if (this._fired && this._fired.deep_dive_impression) return true;
      for (const n of nodesIn()) if (isHalfVisible(n)) { markSeen(); return true; }
      return false;
    };

    const observe = () => {
      const nodes = nodesIn();
      if (!nodes.length) return;

      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver(entries => {
          entries.forEach(en => {
            if (!en.isIntersecting) return;
            markSeen();
            io.disconnect();
          });
        }, { threshold: 0.5 });
        nodes.forEach(n => io.observe(n));
      }

      if (checkRects()) return;
      const onScroll = () => { if (checkRects()) window.removeEventListener('scroll', onScroll); };
      window.addEventListener('scroll', onScroll, { passive: true });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observe);
    } else {
      observe();
    }
  },

  /**
   * share_success — the only reliable signal on this site is the resolution of
   * the two browser APIs every share path funnels through. Wrapping them once
   * here avoids editing dozens of per-page share handlers.
   */
  bindShareSuccess(test) {
    const self = this;
    const fire = method => self.track('share_success', {
      ...self.baseParams(), test_type: test, method
    });

    if (navigator.share && !navigator.share.__saitWrapped) {
      const orig = navigator.share.bind(navigator);
      const wrapped = function (data) {
        return orig(data).then(r => { fire('native'); return r; });
      };
      wrapped.__saitWrapped = true;
      try { navigator.share = wrapped; } catch (e) {}
    }

    if (navigator.clipboard && navigator.clipboard.writeText &&
        !navigator.clipboard.writeText.__saitWrapped) {
      const orig = navigator.clipboard.writeText.bind(navigator.clipboard);
      const wrapped = function (text) {
        return orig(text).then(r => { fire('copy'); return r; });
      };
      wrapped.__saitWrapped = true;
      try { navigator.clipboard.writeText = wrapped; } catch (e) {}
    }
  },

  /**
   * Get device type
   */
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  /**
   * Manual tracking helper for custom events
   */
  custom(eventName, params = {}) {
    this.track(eventName, {
      custom: true,
      ...params
    });
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AnalyticsEvents.init());
} else {
  AnalyticsEvents.init();
}
