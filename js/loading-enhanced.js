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
        { text: 'AI 분석 엔진 초기화 중...', delay: 0 },
        { text: '신경망 패턴 분석 시작...', delay: 300 },
        { text: '<span class="data">2,847,392</span>개 데이터 포인트 로드 완료', delay: 600, type: 'success' },
        { text: '감정 깊이 점수 계산 중...', delay: 900, type: 'processing' },
        { text: '심리학적 프로파일 매칭...', delay: 1200 },
        { text: '글로벌 데이터베이스 접근 중...', delay: 1500 },
        { text: '<span class="highlight">고유 패턴</span> 감지됨!', delay: 1800, type: 'success' },
        { text: '소울 타입 분류 알고리즘 실행...', delay: 2100 },
        { text: '성격 특성 벡터 계산...', delay: 2400, type: 'processing' },
        { text: '상위 <span class="data">3%</span> 희귀도 매칭...', delay: 2700 },
        { text: '최종 결과 생성 중...', delay: 3000 },
        { text: '<span class="success-text">분석 완료!</span> 결과 준비됨', delay: 3300, type: 'success' }
      ],
      en: [
        { text: 'Initializing AI analysis engine...', delay: 0 },
        { text: 'Analyzing neural patterns...', delay: 300 },
        { text: '<span class="data">2,847,392</span> data points loaded', delay: 600, type: 'success' },
        { text: 'Calculating emotional depth score...', delay: 900, type: 'processing' },
        { text: 'Matching psychological profile...', delay: 1200 },
        { text: 'Accessing global database...', delay: 1500 },
        { text: '<span class="highlight">Unique pattern</span> detected!', delay: 1800, type: 'success' },
        { text: 'Running soul type classification...', delay: 2100 },
        { text: 'Computing personality trait vectors...', delay: 2400, type: 'processing' },
        { text: 'Matching top <span class="data">3%</span> rarity...', delay: 2700 },
        { text: 'Generating final results...', delay: 3000 },
        { text: '<span class="success-text">Analysis complete!</span> Results ready', delay: 3300, type: 'success' }
      ],
      ja: [
        { text: 'AI分析エンジン初期化中...', delay: 0 },
        { text: 'ニューラルパターン分析開始...', delay: 300 },
        { text: '<span class="data">2,847,392</span>データポイント読込完了', delay: 600, type: 'success' },
        { text: '感情深度スコア計算中...', delay: 900, type: 'processing' },
        { text: '心理プロファイルマッチング...', delay: 1200 },
        { text: 'グローバルデータベースにアクセス中...', delay: 1500 },
        { text: '<span class="highlight">ユニークパターン</span>検出！', delay: 1800, type: 'success' },
        { text: 'ソウルタイプ分類実行中...', delay: 2100 },
        { text: '性格特性ベクトル計算中...', delay: 2400, type: 'processing' },
        { text: '上位<span class="data">3%</span>レアリティマッチング...', delay: 2700 },
        { text: '最終結果生成中...', delay: 3000 },
        { text: '<span class="success-text">分析完了！</span>結果準備完了', delay: 3300, type: 'success' }
      ],
      zh: [
        { text: '正在初始化AI分析引擎...', delay: 0 },
        { text: '开始分析神经模式...', delay: 300 },
        { text: '<span class="data">2,847,392</span>个数据点加载完成', delay: 600, type: 'success' },
        { text: '正在计算情感深度分数...', delay: 900, type: 'processing' },
        { text: '匹配心理档案...', delay: 1200 },
        { text: '正在访问全球数据库...', delay: 1500 },
        { text: '检测到<span class="highlight">独特模式</span>！', delay: 1800, type: 'success' },
        { text: '运行灵魂类型分类...', delay: 2100 },
        { text: '计算性格特征向量...', delay: 2400, type: 'processing' },
        { text: '匹配前<span class="data">3%</span>稀有度...', delay: 2700 },
        { text: '正在生成最终结果...', delay: 3000 },
        { text: '<span class="success-text">分析完成！</span>结果已准备好', delay: 3300, type: 'success' }
      ],
      es: [
        { text: 'Inicializando motor de análisis AI...', delay: 0 },
        { text: 'Analizando patrones neuronales...', delay: 300 },
        { text: '<span class="data">2,847,392</span> puntos de datos cargados', delay: 600, type: 'success' },
        { text: 'Calculando puntuación de profundidad emocional...', delay: 900, type: 'processing' },
        { text: 'Emparejando perfil psicológico...', delay: 1200 },
        { text: 'Accediendo a base de datos global...', delay: 1500 },
        { text: '¡<span class="highlight">Patrón único</span> detectado!', delay: 1800, type: 'success' },
        { text: 'Ejecutando clasificación de tipo de alma...', delay: 2100 },
        { text: 'Calculando vectores de rasgos de personalidad...', delay: 2400, type: 'processing' },
        { text: 'Emparejando rareza del top <span class="data">3%</span>...', delay: 2700 },
        { text: 'Generando resultados finales...', delay: 3000 },
        { text: '<span class="success-text">¡Análisis completo!</span> Resultados listos', delay: 3300, type: 'success' }
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
        ko: 'AI 분석',
        en: 'AI Analysis',
        ja: 'AI分析',
        zh: 'AI分析',
        es: 'Análisis AI'
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
