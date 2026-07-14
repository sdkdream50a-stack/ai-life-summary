/**
 * Enhanced Loading Screen
 * SmartAITest.com - Stage 1 UX Optimization
 *
 * Features:
 * - Fake terminal log animation (3-5 seconds)
 * - Multilingual support (ko, en, ja, zh, es)
 * - Progressive reveal
 */

class EnhancedLoadingManager {
  constructor(options = {}) {
    this.duration = options.duration || 4000; // 4 seconds default
    this.lang = options.lang || 'ko';
    this.onComplete = options.onComplete || null;
    this.container = null;
    this.progressBar = null;
    this.logContainer = null;
    this.currentProgress = 0;
    this.logs = this.getLogMessages();
  }

  /**
   * Get log messages in all languages
   */
  getLogMessages() {
    const messages = {
      ko: [
        { text: '결과를 준비하고 있어요...', delay: 0 },
        { text: '입력한 내용을 정리하는 중...', delay: 600 },
        { text: '결과를 구성하는 중...', delay: 1200, type: 'processing' },
        { text: '재미있는 결과를 만드는 중...', delay: 1800 },
        { text: '거의 다 됐어요...', delay: 2400 },
        { text: '<span class="success-text">완료!</span> 결과가 준비됐어요', delay: 3000, type: 'success' }
      ],
      en: [
        { text: 'Preparing your result...', delay: 0 },
        { text: 'Reviewing your inputs...', delay: 600 },
        { text: 'Putting your result together...', delay: 1200, type: 'processing' },
        { text: 'Adding the fun details...', delay: 1800 },
        { text: 'Almost there...', delay: 2400 },
        { text: '<span class="success-text">Done!</span> Your result is ready', delay: 3000, type: 'success' }
      ],
      ja: [
        { text: '結果を準備しています...', delay: 0 },
        { text: '入力内容を確認中...', delay: 600 },
        { text: '結果を組み立て中...', delay: 1200, type: 'processing' },
        { text: '楽しい結果を作成中...', delay: 1800 },
        { text: 'もうすぐ完了...', delay: 2400 },
        { text: '<span class="success-text">完了！</span>結果の準備ができました', delay: 3000, type: 'success' }
      ],
      zh: [
        { text: '正在准备你的结果...', delay: 0 },
        { text: '正在整理你的输入...', delay: 600 },
        { text: '正在生成结果...', delay: 1200, type: 'processing' },
        { text: '正在添加趣味细节...', delay: 1800 },
        { text: '即将完成...', delay: 2400 },
        { text: '<span class="success-text">完成！</span>结果已准备好', delay: 3000, type: 'success' }
      ],
      es: [
        { text: 'Preparando tu resultado...', delay: 0 },
        { text: 'Revisando tus respuestas...', delay: 600 },
        { text: 'Armando tu resultado...', delay: 1200, type: 'processing' },
        { text: 'Agregando los detalles divertidos...', delay: 1800 },
        { text: 'Casi listo...', delay: 2400 },
        { text: '<span class="success-text">¡Listo!</span> Tu resultado está preparado', delay: 3000, type: 'success' }
      ]
    };

    return messages[this.lang] || messages.en;
  }

  /**
   * Get status text by language
   */
  getStatusText(key) {
    const texts = {
      processing: {
        ko: '처리 중...',
        en: 'Processing...',
        ja: '処理中...',
        zh: '处理中...',
        es: 'Procesando...'
      },
      aiAnalysis: {
        ko: '결과 계산',
        en: 'Calculating Result',
        ja: '結果を計算中',
        zh: '正在计算结果',
        es: 'Calculando el resultado'
      }
    };

    return texts[key]?.[this.lang] || texts[key]?.en || key;
  }

  /**
   * Create terminal HTML structure
   */
  createTerminalHTML() {
    return `
      <div class="loading-stage-enhanced">
        <div class="loading-stage-emoji">🔬</div>
        <div class="loading-stage-title">${this.getStatusText('aiAnalysis')}</div>
        <div class="loading-terminal">
          <div class="loading-terminal-header">
            <div class="loading-terminal-dot red"></div>
            <div class="loading-terminal-dot yellow"></div>
            <div class="loading-terminal-dot green"></div>
          </div>
          <div class="loading-log-container">
            <div class="loading-log-scroll" id="loading-log-scroll"></div>
          </div>
          <div class="loading-terminal-progress">
            <div class="loading-terminal-progress-bar">
              <div class="loading-terminal-progress-fill" id="loading-progress-fill" style="width: 0%"></div>
            </div>
            <div class="loading-terminal-status">
              <span id="loading-status-text">${this.getStatusText('processing')}</span>
              <span id="loading-progress-percent">0%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize and run the loading animation
   */
  async run(container) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }

    if (!this.container) {
      console.error('Loading container not found');
      return;
    }

    // Insert terminal HTML
    this.container.innerHTML = this.createTerminalHTML();

    this.logContainer = document.getElementById('loading-log-scroll');
    this.progressBar = document.getElementById('loading-progress-fill');
    this.progressPercent = document.getElementById('loading-progress-percent');
    this.statusText = document.getElementById('loading-status-text');

    // Start animations
    await this.animateLogs();

    // Complete
    if (this.onComplete) {
      this.onComplete();
    }
  }

  /**
   * Animate log lines
   */
  async animateLogs() {
    return new Promise((resolve) => {
      const totalDuration = this.duration;
      const startTime = Date.now();

      // Add log lines with delays
      this.logs.forEach((log, index) => {
        setTimeout(() => {
          this.addLogLine(log.text, log.type);
        }, log.delay);
      });

      // Update progress bar
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);

        this.updateProgress(progress);

        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(resolve, 500);
        }
      }, 50);
    });
  }

  /**
   * Add a log line to the terminal
   */
  addLogLine(text, type = '') {
    const line = document.createElement('div');
    line.className = `loading-log-line ${type}`;
    line.innerHTML = text;
    this.logContainer.appendChild(line);

    // Auto-scroll to bottom
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  /**
   * Update progress bar
   */
  updateProgress(percent) {
    this.currentProgress = percent;
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (this.progressPercent) {
      this.progressPercent.textContent = `${Math.round(percent)}%`;
    }
  }
}

/**
 * Thumb Zone Manager
 * Handles sticky buttons at the bottom for mobile
 */
class ThumbZoneManager {
  constructor() {
    this.stickyContainer = null;
    this.isVisible = false;
  }

  /**
   * Create sticky button container
   */
  createStickyContainer(options = {}) {
    const {
      buttons = [],
      className = '',
      showOnScroll = false
    } = options;

    // Remove existing container if any
    const existing = document.querySelector('.thumb-zone-sticky');
    if (existing) existing.remove();

    // Create container
    this.stickyContainer = document.createElement('div');
    this.stickyContainer.className = `thumb-zone-sticky ${className}`;

    // Add buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem;';

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `thumb-zone-btn ${btn.className || ''}`;
      button.innerHTML = btn.icon ? `<span>${btn.icon}</span><span>${btn.text}</span>` : btn.text;
      if (btn.onClick) {
        button.addEventListener('click', btn.onClick);
      }
      buttonContainer.appendChild(button);
    });

    this.stickyContainer.appendChild(buttonContainer);
    document.body.appendChild(this.stickyContainer);

    // Show immediately or on scroll
    if (showOnScroll) {
      this.setupScrollListener();
    } else {
      this.show();
    }

    return this.stickyContainer;
  }

  /**
   * Create share buttons for result page
   */
  createShareButtons(options = {}) {
    const {
      onDownload,
      onShare,
      downloadText = '이미지 저장',
      shareText = '공유하기'
    } = options;

    return this.createStickyContainer({
      className: 'gradient-bg-sticky',
      buttons: [
        {
          text: downloadText,
          icon: '📥',
          className: 'download',
          onClick: onDownload
        },
        {
          text: shareText,
          icon: '🔗',
          className: 'share secondary',
          onClick: onShare
        }
      ]
    });
  }

  /**
   * Setup scroll listener
   */
  setupScrollListener() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const pastThreshold = currentScrollY > 200;

      if (scrollingDown && pastThreshold) {
        this.show();
      } else if (!pastThreshold) {
        this.hide();
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /**
   * Show sticky container
   */
  show() {
    if (this.stickyContainer) {
      this.stickyContainer.classList.add('visible');
      this.isVisible = true;
    }
  }

  /**
   * Hide sticky container
   */
  hide() {
    if (this.stickyContainer) {
      this.stickyContainer.classList.remove('visible');
      this.isVisible = false;
    }
  }

  /**
   * Remove sticky container
   */
  remove() {
    if (this.stickyContainer) {
      this.stickyContainer.remove();
      this.stickyContainer = null;
      this.isVisible = false;
    }
  }
}

// Global instances
const enhancedLoading = {
  create: (options) => new EnhancedLoadingManager(options),

  // Quick method to run loading
  run: async (container, options = {}) => {
    const manager = new EnhancedLoadingManager(options);
    await manager.run(container);
  }
};

const thumbZone = new ThumbZoneManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedLoadingManager, ThumbZoneManager, enhancedLoading, thumbZone };
}
