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

    // Process queue when consent is granted
    window.addEventListener('consentUpdated', () => {
      if (window.pendingAnalyticsEvents && ConsentManager.hasConsent('analytics')) {
        window.pendingAnalyticsEvents.forEach(event => {
          this.track(event.eventName, { ...event.params, delayed: true });
        });
        window.pendingAnalyticsEvents = [];
      }
    }, { once: true });
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
