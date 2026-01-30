/**
 * Exit Intent Detection & Recovery Modal
 * Prevents user abandonment during test flow
 */

const ExitIntent = {
  shown: false,
  enabled: true,

  // Translations
  translations: {
    en: {
      title: "Wait! Don't leave yet",
      subtitle: "You're so close to discovering your results!",
      progress: "Your progress will be lost",
      cta: "Continue My Test",
      dismiss: "Leave anyway"
    },
    ko: {
      title: "잠깐! 아직 가지 마세요",
      subtitle: "결과 확인까지 거의 다 왔어요!",
      progress: "진행 상황이 저장되지 않아요",
      cta: "테스트 계속하기",
      dismiss: "그냥 나갈게요"
    },
    ja: {
      title: "ちょっと待って！",
      subtitle: "結果まであと少し!",
      progress: "進捗が失われます",
      cta: "テストを続ける",
      dismiss: "離れる"
    },
    zh: {
      title: "等等！别走",
      subtitle: "你离结果只有一步之遥！",
      progress: "您的进度将丢失",
      cta: "继续测试",
      dismiss: "还是离开"
    },
    es: {
      title: "Espera! No te vayas",
      subtitle: "Estas tan cerca de descubrir tus resultados!",
      progress: "Tu progreso se perdera",
      cta: "Continuar mi test",
      dismiss: "Salir de todos modos"
    }
  },

  /**
   * Initialize exit intent detection
   */
  init() {
    // Only enable on test input pages, not result pages
    if (window.location.pathname.includes('/result')) {
      return;
    }

    // Don't show if user already completed a test recently
    if (this.hasRecentCompletion()) {
      return;
    }

    this.bindDesktopExitIntent();
    this.bindMobileBackButton();
    this.bindVisibilityChange();

    window.ExitIntent = this;
  },

  /**
   * Check if user completed a test recently
   */
  hasRecentCompletion() {
    try {
      const completion = localStorage.getItem('last_test_completion');
      if (completion) {
        const timeSince = Date.now() - parseInt(completion);
        // Don't show if completed within last hour
        return timeSince < 60 * 60 * 1000;
      }
    } catch (e) {}
    return false;
  },

  /**
   * Desktop: Mouse leaving viewport
   */
  bindDesktopExitIntent() {
    document.addEventListener('mouseout', (e) => {
      // Check if mouse left the viewport from the top
      if (e.clientY <= 0 && !this.shown && this.enabled) {
        this.triggerExitIntent('mouse_exit');
      }
    });
  },

  /**
   * Mobile: Back button / history navigation
   */
  bindMobileBackButton() {
    // Push a state to detect back button
    if (window.history && window.history.pushState) {
      window.history.pushState({ exitIntentState: true }, '');

      window.addEventListener('popstate', (e) => {
        if (!this.shown && this.enabled) {
          // Re-push state to prevent actual navigation
          window.history.pushState({ exitIntentState: true }, '');
          this.triggerExitIntent('back_button');
        }
      });
    }
  },

  /**
   * Tab visibility change (switching tabs)
   */
  bindVisibilityChange() {
    let tabSwitchCount = 0;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        tabSwitchCount++;
        // Show modal on return if switched tabs multiple times
        if (tabSwitchCount >= 2 && !this.shown && this.enabled) {
          // Will show when they return
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              this.triggerExitIntent('tab_return');
            }
          }, { once: true });
        }
      }
    });
  },

  /**
   * Trigger exit intent modal
   */
  triggerExitIntent(trigger) {
    if (this.shown) return;
    this.shown = true;

    // Track the event
    if (typeof AnalyticsEvents !== 'undefined') {
      AnalyticsEvents.onTestAbandoned(trigger);
      AnalyticsEvents.onRecoveryShown(trigger);
    }

    this.showModal(trigger);
  },

  /**
   * Get current language
   */
  getLang() {
    const html = document.documentElement;
    const lang = html.getAttribute('lang') || 'en';
    return this.translations[lang] ? lang : 'en';
  },

  /**
   * Get translation
   */
  t(key) {
    const lang = this.getLang();
    return this.translations[lang][key] || this.translations.en[key];
  },

  /**
   * Show recovery modal
   */
  showModal(trigger) {
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'exit-intent-modal';
    modal.className = 'exit-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    // Calculate progress if possible
    const progress = this.calculateProgress();

    modal.innerHTML = `
      <div class="exit-modal-content">
        <div class="exit-modal-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="url(#grad)" stroke-width="4" fill="none"/>
            <path d="M32 18V34L42 40" stroke="url(#grad)" stroke-width="4" stroke-linecap="round"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stop-color="#8B5CF6"/>
                <stop offset="100%" stop-color="#EC4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 class="exit-modal-title">${this.t('title')}</h2>
        <p class="exit-modal-subtitle">${this.t('subtitle')}</p>
        ${progress ? `
          <div class="exit-modal-progress">
            <div class="exit-progress-bar">
              <div class="exit-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="exit-progress-text">${progress}% complete</span>
          </div>
        ` : ''}
        <p class="exit-modal-warning">${this.t('progress')}</p>
        <div class="exit-modal-actions">
          <button id="exit-continue-btn" class="exit-btn-primary">
            ${this.t('cta')}
          </button>
          <button id="exit-dismiss-btn" class="exit-btn-secondary">
            ${this.t('dismiss')}
          </button>
        </div>
      </div>
    `;

    // Add styles
    this.injectStyles();

    document.body.appendChild(modal);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });

    // Bind events
    const continueBtn = modal.querySelector('#exit-continue-btn');
    const dismissBtn = modal.querySelector('#exit-dismiss-btn');

    continueBtn.addEventListener('click', () => {
      this.closeModal(modal);
      if (typeof AnalyticsEvents !== 'undefined') {
        AnalyticsEvents.onRecoveryContinued();
      }
    });

    dismissBtn.addEventListener('click', () => {
      this.closeModal(modal);
      this.enabled = false; // Don't show again this session
      // Allow actual navigation
      window.history.back();
    });

    // Close on escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Focus continue button
    continueBtn.focus();
  },

  /**
   * Calculate test progress
   */
  calculateProgress() {
    try {
      const session = sessionStorage.getItem('test_session');
      if (session) {
        const data = JSON.parse(session);
        if (data.questionsAnswered && data.questionCount) {
          return Math.round((data.questionsAnswered / data.questionCount) * 100);
        }
      }
    } catch (e) {}
    return null;
  },

  /**
   * Close modal
   */
  closeModal(modal) {
    modal.classList.remove('visible');
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.remove();
    }, 300);
  },

  /**
   * Inject modal styles
   */
  injectStyles() {
    if (document.getElementById('exit-intent-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'exit-intent-styles';
    styles.textContent = `
      .exit-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .exit-modal-overlay.visible {
        opacity: 1;
      }

      .exit-modal-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 40px;
        max-width: 420px;
        width: 100%;
        text-align: center;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .exit-modal-overlay.visible .exit-modal-content {
        transform: scale(1) translateY(0);
      }

      .exit-modal-icon {
        margin-bottom: 24px;
      }

      .exit-modal-icon svg {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }

      .exit-modal-title {
        color: white;
        font-size: 28px;
        font-weight: 800;
        margin: 0 0 12px;
        line-height: 1.2;
      }

      .exit-modal-subtitle {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        margin: 0 0 24px;
      }

      .exit-modal-progress {
        margin-bottom: 20px;
      }

      .exit-progress-bar {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .exit-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #8B5CF6, #EC4899);
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .exit-progress-text {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
      }

      .exit-modal-warning {
        color: #fcd34d;
        font-size: 14px;
        margin: 0 0 28px;
        padding: 12px 16px;
        background: rgba(252, 211, 77, 0.1);
        border-radius: 10px;
        border: 1px solid rgba(252, 211, 77, 0.2);
      }

      .exit-modal-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .exit-btn-primary {
        width: 100%;
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #8B5CF6, #EC4899);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        min-height: 54px;
      }

      .exit-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
      }

      .exit-btn-secondary {
        width: 100%;
        padding: 14px 24px;
        font-size: 14px;
        font-weight: 500;
        background: transparent;
        color: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        min-height: 44px;
      }

      .exit-btn-secondary:hover {
        color: rgba(255, 255, 255, 0.8);
      }

      @media (max-width: 480px) {
        .exit-modal-content {
          padding: 32px 24px;
        }

        .exit-modal-title {
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Disable exit intent (e.g., after form submission)
   */
  disable() {
    this.enabled = false;
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ExitIntent.init());
} else {
  ExitIntent.init();
}
