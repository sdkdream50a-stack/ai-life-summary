/**
 * GDPR/CCPA Consent Manager with Google Consent Mode v2
 * AdSense always loads (required for review); data collection gated by consent
 */

// Google Consent Mode v2 - region-specific defaults BEFORE any scripts load
// Pattern: granted globally + denied override for EU/EEA/UK/CH
// (Google official recommendation — recovers ~30-50% RPM on non-EU traffic
//  vs blanket-denied while preserving EU/UK opt-in compliance)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Default for everyone NOT covered by a region override below.
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted'
});

// EU 27 + EEA (IS, LI, NO) + UK + CH — opt-in required.
// Banner still shows globally so all users can opt out.
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500,
  'region': [
    'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE',
    'IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK',
    'IS','LI','NO',
    'GB','CH'
  ]
});

// Always load AdSense script (Consent Mode controls data collection)
(function() {
  if (!window.adsenseLoaded) {
    var adScript = document.createElement('script');
    adScript.async = true;
    adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6241798439911569';
    adScript.crossOrigin = 'anonymous';
    document.head.appendChild(adScript);
    window.adsenseLoaded = true;
  }
})();

const ConsentManager = {
  STORAGE_KEY: 'ai-test-consent',
  CONSENT_VERSION: '1.2',

  // Consent categories
  categories: {
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    personalization: false
  },

  // Multilingual translations for global compliance
  translations: {
    en: {
      title: 'We value your privacy',
      desc: 'We use cookies to improve your experience, analyze traffic, and show personalized ads.',
      privacyLink: 'Privacy Policy',
      customize: 'Customize',
      rejectAll: 'Reject All',
      acceptAll: 'Accept All',
      savePrefs: 'Save Preferences',
      necessary: 'Necessary',
      necessaryDesc: 'Required for the website to function properly.',
      analytics: 'Analytics',
      analyticsDesc: 'Help us understand how visitors interact with our site.',
      marketing: 'Marketing',
      marketingDesc: 'Used to show personalized advertisements.',
      hideDetails: 'Hide Details'
    },
    ko: {
      title: '개인정보 보호 안내',
      desc: '더 나은 서비스 제공을 위해 쿠키를 사용합니다. 분석 및 맞춤 광고에 활용됩니다.',
      privacyLink: '개인정보처리방침',
      customize: '설정',
      rejectAll: '모두 거부',
      acceptAll: '모두 동의',
      savePrefs: '설정 저장',
      necessary: '필수',
      necessaryDesc: '웹사이트 기본 기능에 필요합니다.',
      analytics: '분석',
      analyticsDesc: '방문자 이용 패턴 분석에 사용됩니다.',
      marketing: '마케팅',
      marketingDesc: '맞춤형 광고 제공에 사용됩니다.',
      hideDetails: '상세 숨기기'
    },
    ja: {
      title: 'プライバシーについて',
      desc: 'より良いサービス提供のためにCookieを使用しています。',
      privacyLink: 'プライバシーポリシー',
      customize: '設定',
      rejectAll: 'すべて拒否',
      acceptAll: 'すべて同意',
      savePrefs: '設定を保存',
      necessary: '必須',
      necessaryDesc: 'ウェブサイトの基本機能に必要です。',
      analytics: '分析',
      analyticsDesc: '訪問者の利用パターン分析に使用されます。',
      marketing: 'マーケティング',
      marketingDesc: 'パーソナライズ広告の配信に使用されます。',
      hideDetails: '詳細を隠す'
    },
    zh: {
      title: '隐私保护说明',
      desc: '我们使用Cookie来改善您的体验、分析流量并展示个性化广告。',
      privacyLink: '隐私政策',
      customize: '自定义',
      rejectAll: '全部拒绝',
      acceptAll: '全部接受',
      savePrefs: '保存设置',
      necessary: '必要',
      necessaryDesc: '网站正常运行所必需的。',
      analytics: '分析',
      analyticsDesc: '帮助我们了解访问者如何使用网站。',
      marketing: '营销',
      marketingDesc: '用于展示个性化广告。',
      hideDetails: '隐藏详情'
    },
    es: {
      title: 'Valoramos tu privacidad',
      desc: 'Usamos cookies para mejorar tu experiencia, analizar el trafico y mostrar anuncios personalizados.',
      privacyLink: 'Politica de Privacidad',
      customize: 'Personalizar',
      rejectAll: 'Rechazar todo',
      acceptAll: 'Aceptar todo',
      savePrefs: 'Guardar preferencias',
      necessary: 'Necesarias',
      necessaryDesc: 'Requeridas para el funcionamiento del sitio.',
      analytics: 'Analiticas',
      analyticsDesc: 'Nos ayudan a entender como interactuan los visitantes.',
      marketing: 'Marketing',
      marketingDesc: 'Usadas para mostrar anuncios personalizados.',
      hideDetails: 'Ocultar detalles'
    }
  },

  /**
   * Initialize consent manager
   */
  init() {
    // Check for existing consent
    const stored = this.getStoredConsent();

    if (stored && stored.version === this.CONSENT_VERSION) {
      this.categories = stored.categories;
      this.applyConsent();
    } else {
      // Check Do Not Track
      if (this.isDNTEnabled()) {
        this.categories = {
          necessary: true,
          analytics: false,
          marketing: false,
          personalization: false
        };
        this.saveConsent();
        this.applyConsent();
      } else {
        // Show consent banner for new users
        this.showBanner();
      }
    }

    // Expose for external use
    window.ConsentManager = this;
  },

  /**
   * Check if Do Not Track is enabled
   */
  isDNTEnabled() {
    return navigator.doNotTrack === '1' ||
           window.doNotTrack === '1' ||
           navigator.msDoNotTrack === '1';
  },

  /**
   * Get stored consent from localStorage
   */
  getStoredConsent() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Save consent to localStorage
   */
  saveConsent() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        version: this.CONSENT_VERSION,
        categories: this.categories,
        timestamp: Date.now(),
        dnt: this.isDNTEnabled()
      }));
    } catch (e) {
      console.warn('Could not save consent:', e);
    }
  },

  /**
   * Apply consent decisions - update Consent Mode and load scripts
   */
  applyConsent() {
    // Update Google Consent Mode v2
    gtag('consent', 'update', {
      'ad_storage': this.categories.marketing ? 'granted' : 'denied',
      'ad_user_data': this.categories.marketing ? 'granted' : 'denied',
      'ad_personalization': this.categories.marketing ? 'granted' : 'denied',
      'analytics_storage': this.categories.analytics ? 'granted' : 'denied'
    });

    // Analytics (Google Analytics, Clarity)
    if (this.categories.analytics) {
      this.loadAnalytics();
    }

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('consentUpdated', {
      detail: this.categories
    }));
  },

  /**
   * Load Google Analytics
   */
  loadAnalytics() {
    // Google Analytics
    if (!window.gaLoaded && typeof gtag === 'undefined') {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-QDH2KJQT9Y';
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-QDH2KJQT9Y', {
          'anonymize_ip': true,
          'cookie_flags': 'SameSite=None;Secure'
        });
        window.gaLoaded = true;

        // Track consent acceptance
        gtag('event', 'consent_granted', {
          'consent_analytics': true
        });
      };
    }

    // Microsoft Clarity
    if (!window.clarityLoaded) {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "v3dwlpj2g5");
      window.clarityLoaded = true;
    }
  },


  /**
   * Get current language
   */
  getLang() {
    // Check URL path first (e.g., /ko/life-summary/)
    const pathMatch = window.location.pathname.match(/^\/(en|ko|ja|zh|es)\//);
    if (pathMatch) return pathMatch[1];

    // Check localStorage
    const stored = localStorage.getItem('ai-life-summary-lang') ||
                   localStorage.getItem('preferredLanguage');
    if (stored && this.translations[stored]) return stored;

    // Check HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && this.translations[htmlLang]) return htmlLang;

    // Check browser language
    const browserLang = (navigator.language || 'en').split('-')[0];
    return this.translations[browserLang] ? browserLang : 'en';
  },

  /**
   * Get translation string
   */
  t(key) {
    const lang = this.getLang();
    return this.translations[lang]?.[key] || this.translations.en[key] || key;
  },

  /**
   * Show consent banner
   */
  showBanner() {
    // Don't show if already visible
    if (document.getElementById('consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');

    banner.innerHTML = `
      <div class="consent-content">
        <div class="consent-text">
          <h3 class="consent-title">${this.t('title')}</h3>
          <p class="consent-desc">
            ${this.t('desc')}
            <a href="/privacy-policy.html" class="consent-link">${this.t('privacyLink')}</a>
          </p>
        </div>
        <div class="consent-actions">
          <button id="consent-customize" class="consent-btn consent-btn-secondary">
            ${this.t('customize')}
          </button>
          <button id="consent-reject" class="consent-btn consent-btn-secondary">
            ${this.t('rejectAll')}
          </button>
          <button id="consent-accept" class="consent-btn consent-btn-primary">
            ${this.t('acceptAll')}
          </button>
        </div>
      </div>
      <div id="consent-details" class="consent-details hidden">
        <div class="consent-category">
          <label class="consent-toggle">
            <input type="checkbox" checked disabled>
            <span class="consent-toggle-label">${this.t('necessary')}</span>
          </label>
          <p class="consent-category-desc">${this.t('necessaryDesc')}</p>
        </div>
        <div class="consent-category">
          <label class="consent-toggle">
            <input type="checkbox" id="consent-analytics-toggle">
            <span class="consent-toggle-label">${this.t('analytics')}</span>
          </label>
          <p class="consent-category-desc">${this.t('analyticsDesc')}</p>
        </div>
        <div class="consent-category">
          <label class="consent-toggle">
            <input type="checkbox" id="consent-marketing-toggle">
            <span class="consent-toggle-label">${this.t('marketing')}</span>
          </label>
          <p class="consent-category-desc">${this.t('marketingDesc')}</p>
        </div>
        <div class="consent-details-actions">
          <button id="consent-save" class="consent-btn consent-btn-primary">
            ${this.t('savePrefs')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add styles if not already present
    this.injectStyles();

    // Bind events
    this.bindBannerEvents(banner);

    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });
  },

  /**
   * Inject consent banner styles
   */
  injectStyles() {
    if (document.getElementById('consent-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'consent-styles';
    styles.textContent = `
      .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        background: rgba(15, 12, 41, 0.98);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .consent-banner.visible {
        transform: translateY(0);
      }

      .consent-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .consent-text {
        flex: 1;
        min-width: 280px;
      }

      .consent-title {
        color: white;
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 8px;
      }

      .consent-desc {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
      }

      .consent-link {
        color: #a855f7;
        text-decoration: underline;
      }

      .consent-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .consent-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        min-height: 44px;
        min-width: 44px;
      }

      .consent-btn-primary {
        background: linear-gradient(135deg, #8B5CF6, #EC4899);
        color: white;
      }

      .consent-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
      }

      .consent-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .consent-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .consent-details {
        max-width: 1200px;
        margin: 20px auto 0;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .consent-details.hidden {
        display: none;
      }

      .consent-category {
        margin-bottom: 16px;
      }

      .consent-toggle {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .consent-toggle input {
        width: 20px;
        height: 20px;
        accent-color: #8B5CF6;
      }

      .consent-toggle-label {
        color: white;
        font-weight: 600;
        font-size: 15px;
      }

      .consent-category-desc {
        color: rgba(255, 255, 255, 0.5);
        font-size: 13px;
        margin: 6px 0 0 32px;
      }

      .consent-details-actions {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }

      @media (max-width: 640px) {
        .consent-banner {
          padding: 16px;
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        }

        .consent-content {
          flex-direction: column;
          text-align: center;
        }

        .consent-actions {
          width: 100%;
          justify-content: center;
        }

        .consent-btn {
          flex: 1;
          min-width: 100px;
        }
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Bind banner event listeners
   */
  bindBannerEvents(banner) {
    const acceptBtn = banner.querySelector('#consent-accept');
    const rejectBtn = banner.querySelector('#consent-reject');
    const customizeBtn = banner.querySelector('#consent-customize');
    const saveBtn = banner.querySelector('#consent-save');
    const details = banner.querySelector('#consent-details');

    acceptBtn.addEventListener('click', () => {
      this.categories = {
        necessary: true,
        analytics: true,
        marketing: true,
        personalization: true
      };
      this.saveConsent();
      this.applyConsent();
      this.hideBanner(banner);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'consent_accepted');
      }
    });

    rejectBtn.addEventListener('click', () => {
      this.categories = {
        necessary: true,
        analytics: false,
        marketing: false,
        personalization: false
      };
      this.saveConsent();
      this.hideBanner(banner);

      // Still dispatch event even though no tracking
      window.dispatchEvent(new CustomEvent('consentRejected'));
    });

    customizeBtn.addEventListener('click', () => {
      details.classList.toggle('hidden');
      customizeBtn.textContent = details.classList.contains('hidden') ? this.t('customize') : this.t('hideDetails');
    });

    saveBtn.addEventListener('click', () => {
      const analyticsToggle = banner.querySelector('#consent-analytics-toggle');
      const marketingToggle = banner.querySelector('#consent-marketing-toggle');

      this.categories = {
        necessary: true,
        analytics: analyticsToggle.checked,
        marketing: marketingToggle.checked,
        personalization: analyticsToggle.checked
      };

      this.saveConsent();
      this.applyConsent();
      this.hideBanner(banner);
    });
  },

  /**
   * Hide consent banner
   */
  hideBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(() => {
      banner.remove();
    }, 400);
  },

  /**
   * Check if a category is consented
   */
  hasConsent(category) {
    return this.categories[category] === true;
  },

  /**
   * Revoke consent (for settings page).
   * Updates Consent Mode v2 to denied immediately so already-loaded
   * AdSense/GA stop tracking before next pageview.
   */
  revokeConsent() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.categories = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied'
    });
    window.dispatchEvent(new CustomEvent('consentRevoked'));
    this.showBanner();
  }
};

// Public API for cookie-settings UI buttons
window.openCookieSettings = function () {
  if (window.ConsentManager && typeof window.ConsentManager.revokeConsent === 'function') {
    window.ConsentManager.revokeConsent();
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ConsentManager.init());
} else {
  ConsentManager.init();
}

// ===== Korean auto-detect language banner =====
// Show one-time top banner to ko-browser visitors on non-ko pages
(function showKoLangBanner() {
  function init() {
    try {
      // Skip if user dismissed
      if (localStorage.getItem('lang-banner-dismissed-ko') === '1') return;

      // Skip on Korean pages (already in ko)
      var path = window.location.pathname;
      if (path === '/ko' || path.indexOf('/ko/') === 0) return;

      // Detect Korean browser preference
      var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (!browserLang.indexOf || browserLang.indexOf('ko') !== 0) return;

      // Build target URL: keep current path but force /ko/ prefix where possible
      var targetUrl = '/ko/';
      var langMatch = path.match(/^\/(en|ja|zh|es)\/(.*)$/);
      if (langMatch) {
        targetUrl = '/ko/' + langMatch[2];
      }

      // Build banner
      var banner = document.createElement('div');
      banner.id = 'ko-lang-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Korean language suggestion');
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99998;background:linear-gradient(90deg,#7c3aed 0%,#ec4899 100%);color:white;padding:10px 16px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.25);';
      banner.innerHTML =
        '<span style="font-weight:500">🇰🇷 한국어 페이지가 준비되어 있습니다</span>' +
        '<a href="' + targetUrl + '" style="background:white;color:#7c3aed;padding:6px 14px;border-radius:8px;font-weight:600;text-decoration:none;font-size:13px;">한국어로 이동 →</a>' +
        '<button type="button" aria-label="닫기" style="background:transparent;border:none;color:white;font-size:20px;cursor:pointer;line-height:1;padding:0 4px;opacity:0.85;">×</button>';
      banner.querySelector('button').addEventListener('click', function () {
        banner.remove();
        try { localStorage.setItem('lang-banner-dismissed-ko', '1'); } catch (e) {}
      });
      document.body.appendChild(banner);
    } catch (e) { /* fail silently */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Global lang-dropdown portal fix =====
// Override inline toggleLangDropdown across the site.
// Reason: kick-navbar uses backdrop-filter which creates a stacking context
// trapping z-index. Move dropdown to body so it escapes navbar context.
window.toggleLangDropdown = function () {
  var dropdown = document.getElementById('lang-dropdown');
  var selector = document.getElementById('lang-selector');
  if (!dropdown || !selector) return;
  var btn = selector.querySelector('button');
  if (!btn) return;
  if (dropdown.parentElement !== document.body) {
    document.body.appendChild(dropdown);
    dropdown.style.position = 'fixed';
    dropdown.style.right = 'auto';
    dropdown.style.zIndex = '2147483647';
  }
  var rect = btn.getBoundingClientRect();
  dropdown.style.top = (rect.bottom + 8) + 'px';
  dropdown.style.left = Math.max(8, rect.right - 112) + 'px';
  dropdown.classList.toggle('hidden');
};
