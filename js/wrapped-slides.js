/**
 * Wrapped Slides Manager
 * Handles slide navigation with swipe and tap
 */

class WrappedSlidesManager {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 8;
    this.slides = [];
    this.progressSegments = [];
    this.isAnimating = false;
    this.autoAdvanceTimer = null;
    this.autoAdvanceDuration = 5000; // 5 seconds per slide
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.lang = 'ko';
    this.stats = null;
  }

  /**
   * Initialize slides
   */
  initialize(stats, lang = 'ko') {
    this.stats = stats;
    this.lang = lang;

    // Get DOM elements
    this.container = document.querySelector('.wrapped-slides');
    this.slides = document.querySelectorAll('.wrapped-slide');
    this.progressSegments = document.querySelectorAll('.wrapped-progress-segment');
    this.totalSlides = this.slides.length;

    // Setup event listeners
    this.setupEventListeners();

    // Render slides content
    this.renderAllSlides();

    // Show first slide
    this.goToSlide(0);

    // Start auto-advance
    this.startAutoAdvance();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Touch events for swipe
    this.container?.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container?.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Click events for tap navigation
    document.querySelector('.wrapped-nav-prev')?.addEventListener('click', () => this.prevSlide());
    document.querySelector('.wrapped-nav-next')?.addEventListener('click', () => this.nextSlide());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Close button
    document.querySelector('.wrapped-close')?.addEventListener('click', () => this.close());

    // Pause auto-advance on interaction
    this.container?.addEventListener('mouseenter', () => this.pauseAutoAdvance());
    this.container?.addEventListener('mouseleave', () => this.startAutoAdvance());
  }

  /**
   * Handle touch start
   */
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.pauseAutoAdvance();
  }

  /**
   * Handle touch end
   */
  handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = this.touchStartX - touchEndX;
    const diffY = this.touchStartY - touchEndY;

    // Horizontal swipe detection (min 50px, more horizontal than vertical)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    } else {
      // Tap detection - check which side was tapped
      const screenWidth = window.innerWidth;
      if (this.touchStartX < screenWidth * 0.3) {
        this.prevSlide();
      } else if (this.touchStartX > screenWidth * 0.7) {
        this.nextSlide();
      }
    }

    this.startAutoAdvance();
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prevSlide();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  /**
   * Go to specific slide
   */
  goToSlide(index) {
    if (this.isAnimating || index < 0 || index >= this.totalSlides) return;

    this.isAnimating = true;
    const prevIndex = this.currentSlide;
    this.currentSlide = index;

    // Update slide classes
    this.slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === index) {
        slide.classList.add('active');
      } else if (i < index) {
        slide.classList.add('prev');
      }
    });

    // Update progress
    this.updateProgress();

    // Reset animation lock
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);

    // Reset auto-advance timer
    this.resetAutoAdvance();
  }

  /**
   * Next slide
   */
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  /**
   * Previous slide
   */
  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    this.progressSegments.forEach((segment, i) => {
      segment.classList.remove('completed', 'active');
      if (i < this.currentSlide) {
        segment.classList.add('completed');
      } else if (i === this.currentSlide) {
        segment.classList.add('active');
      }
    });
  }

  /**
   * Start auto-advance
   */
  startAutoAdvance() {
    this.pauseAutoAdvance();
    this.autoAdvanceTimer = setInterval(() => {
      if (this.currentSlide < this.totalSlides - 1) {
        this.nextSlide();
      } else {
        this.pauseAutoAdvance();
      }
    }, this.autoAdvanceDuration);
  }

  /**
   * Pause auto-advance
   */
  pauseAutoAdvance() {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  /**
   * Reset auto-advance
   */
  resetAutoAdvance() {
    this.startAutoAdvance();
  }

  /**
   * Close wrapped
   */
  close() {
    this.pauseAutoAdvance();
    window.location.href = '../';
  }

  /**
   * Render all slides content
   */
  renderAllSlides() {
    this.renderIntroSlide();
    this.renderTestsSlide();
    this.renderTypeSlide();
    this.renderStreakSlide();
    this.renderCompatibilitySlide();
    this.renderLevelSlide();
    this.renderBadgesSlide();
    this.renderSummarySlide();
  }

  /**
   * Get translation
   */
  t(key) {
    const translations = {
      ko: {
        yearWrapped: '연말결산',
        yourYear: '당신의',
        tapToContinue: '탭하여 계속',
        testsCompleted: '회의 테스트를 했어요',
        yourSoulType: '당신의 소울 타입',
        times: '번',
        bestStreak: '최고 스트릭',
        days: '일 연속',
        bestCompatibility: '최고의 궁합',
        match: '매치',
        levelJourney: '레벨 여정',
        totalXp: '총 XP',
        badgesEarned: '획득한 배지',
        andMore: '개 외',
        yourWrapped: '나의 연말결산',
        shareImage: '이미지 공유',
        backToHome: '홈으로 돌아가기',
        tests: '테스트',
        streak: '스트릭',
        level: '레벨',
        badges: '배지'
      },
      en: {
        yearWrapped: 'Year Wrapped',
        yourYear: 'Your',
        tapToContinue: 'Tap to continue',
        testsCompleted: 'tests completed',
        yourSoulType: 'Your Soul Type',
        times: 'times',
        bestStreak: 'Best Streak',
        days: 'days',
        bestCompatibility: 'Best Compatibility',
        match: 'Match',
        levelJourney: 'Level Journey',
        totalXp: 'Total XP',
        badgesEarned: 'Badges Earned',
        andMore: 'more',
        yourWrapped: 'Your Wrapped',
        shareImage: 'Share Image',
        backToHome: 'Back to Home',
        tests: 'Tests',
        streak: 'Streak',
        level: 'Level',
        badges: 'Badges'
      }
    };

    return translations[this.lang]?.[key] || translations.en[key] || key;
  }

  /**
   * Render intro slide
   */
  renderIntroSlide() {
    const slide = document.querySelector('[data-slide="intro"]');
    if (!slide) return;

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-logo">✨</div>
        <div class="wrapped-year">${this.stats.year}</div>
        <h1 class="wrapped-intro-title">AI Soul ${this.t('yearWrapped')}</h1>
        <p class="wrapped-intro-subtitle">${this.t('yourYear')} ${this.stats.year}${this.lang === 'ko' ? '년' : ''}</p>
      </div>
      <div class="wrapped-tap-hint">
        <span>👆</span>
        <span>${this.t('tapToContinue')}</span>
      </div>
    `;
  }

  /**
   * Render tests slide
   */
  renderTestsSlide() {
    const slide = document.querySelector('[data-slide="tests"]');
    if (!slide) return;

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.stats.year}</div>
        <div class="wrapped-stat-value">${this.stats.totalTests}</div>
        <div class="wrapped-stat-label">${this.t('testsCompleted')}</div>
      </div>
    `;
  }

  /**
   * Render type slide
   */
  renderTypeSlide() {
    const slide = document.querySelector('[data-slide="type"]');
    if (!slide) return;

    const type = this.stats.mostCommonType;
    if (!type) {
      slide.innerHTML = `<div class="wrapped-content"><p>No data</p></div>`;
      return;
    }

    const traitsHtml = type.traits
      ?.slice(0, 4)
      .map(trait => `<span class="wrapped-type-trait">${this.lang === 'ko' ? trait.ko : trait.en}</span>`)
      .join('') || '';

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.t('yourSoulType')}</div>
        <div class="wrapped-type-emoji">${type.emoji}</div>
        <div class="wrapped-type-name">${type.name}</div>
        <div class="wrapped-type-count">${type.count}${this.t('times')} (${type.percentage}%)</div>
        <div class="wrapped-type-traits">${traitsHtml}</div>
      </div>
    `;
  }

  /**
   * Render streak slide
   */
  renderStreakSlide() {
    const slide = document.querySelector('[data-slide="streak"]');
    if (!slide) return;

    const streakEmoji = this.stats.bestStreak >= 30 ? '🔥' :
                       this.stats.bestStreak >= 7 ? '⚡' : '✨';

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.t('bestStreak')}</div>
        <div class="wrapped-streak-flame">${streakEmoji}</div>
        <div class="wrapped-streak-value">${this.stats.bestStreak}</div>
        <div class="wrapped-streak-label">${this.t('days')}</div>
      </div>
    `;
  }

  /**
   * Render compatibility slide
   */
  renderCompatibilitySlide() {
    const slide = document.querySelector('[data-slide="compatibility"]');
    if (!slide) return;

    const compat = this.stats.bestCompatibility;
    if (!compat) {
      slide.innerHTML = `
        <div class="wrapped-content">
          <div class="wrapped-year">${this.t('bestCompatibility')}</div>
          <p style="opacity: 0.7">${this.lang === 'ko' ? '궁합 테스트를 해보세요!' : 'Try a compatibility test!'}</p>
        </div>
      `;
      return;
    }

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.t('bestCompatibility')}</div>
        <div class="wrapped-compat-pair">
          <div class="wrapped-compat-type">
            <span class="wrapped-compat-emoji">${compat.user.emoji}</span>
            <span class="wrapped-compat-name">${compat.user.name}</span>
          </div>
          <span class="wrapped-compat-heart">💕</span>
          <div class="wrapped-compat-type">
            <span class="wrapped-compat-emoji">${compat.partner.emoji}</span>
            <span class="wrapped-compat-name">${compat.partner.name}</span>
          </div>
        </div>
        <div class="wrapped-compat-score">${compat.score}%</div>
        <div class="wrapped-compat-label">${this.t('match')}</div>
      </div>
    `;
  }

  /**
   * Render level slide
   */
  renderLevelSlide() {
    const slide = document.querySelector('[data-slide="level"]');
    if (!slide) return;

    const level = this.stats.levelProgress;
    const xpProgress = level.totalXp > 0 ? Math.min((level.currentXp / 500) * 100, 100) : 0;

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.t('levelJourney')}</div>
        <div class="wrapped-level-journey">
          <div class="wrapped-level-box">
            <span class="wrapped-level-value">Lv.${level.start}</span>
            <span class="wrapped-level-label">Start</span>
          </div>
          <span class="wrapped-level-arrow">→</span>
          <div class="wrapped-level-box">
            <span class="wrapped-level-value">Lv.${level.end}</span>
            <span class="wrapped-level-label">Now</span>
          </div>
        </div>
        <div class="wrapped-xp-total">${this.t('totalXp')}: ${level.totalXp.toLocaleString()}</div>
        <div class="wrapped-xp-bar">
          <div class="wrapped-xp-fill" style="width: ${xpProgress}%"></div>
        </div>
      </div>
    `;
  }

  /**
   * Render badges slide
   */
  renderBadgesSlide() {
    const slide = document.querySelector('[data-slide="badges"]');
    if (!slide) return;

    const badges = this.stats.earnedBadges || [];

    if (badges.length === 0) {
      slide.innerHTML = `
        <div class="wrapped-content">
          <div class="wrapped-year">${this.t('badgesEarned')}</div>
          <p style="opacity: 0.7; margin-top: 2rem;">${this.lang === 'ko' ? '아직 배지가 없어요' : 'No badges yet'}</p>
        </div>
      `;
      return;
    }

    const badgesHtml = badges.map(badge => `
      <div class="wrapped-badge">
        <span class="wrapped-badge-emoji">${badge.emoji}</span>
        <span class="wrapped-badge-name">${badge.name}</span>
      </div>
    `).join('');

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-year">${this.t('badgesEarned')}</div>
        <div class="wrapped-badges-grid">${badgesHtml}</div>
        ${badges.length >= 8 ? `<div class="wrapped-badges-count">+${this.t('andMore')}</div>` : ''}
      </div>
    `;
  }

  /**
   * Render summary slide
   */
  renderSummarySlide() {
    const slide = document.querySelector('[data-slide="summary"]');
    if (!slide) return;

    const type = this.stats.mostCommonType;

    slide.innerHTML = `
      <div class="wrapped-content">
        <div class="wrapped-summary-card">
          <div class="wrapped-summary-header">
            <div class="wrapped-summary-avatar bg-gradient-to-br ${type?.gradient || 'from-indigo-400 to-purple-500'}">
              ${type?.emoji || '✨'}
            </div>
            <div class="wrapped-summary-info">
              <div class="wrapped-summary-name">${this.stats.year} ${this.t('yourWrapped')}</div>
              <div class="wrapped-summary-type">${type?.name || 'AI Soul'}</div>
            </div>
          </div>

          <div class="wrapped-summary-stats">
            <div class="wrapped-summary-stat">
              <div class="wrapped-summary-stat-value">${this.stats.totalTests}</div>
              <div class="wrapped-summary-stat-label">${this.t('tests')}</div>
            </div>
            <div class="wrapped-summary-stat">
              <div class="wrapped-summary-stat-value">${this.stats.bestStreak}</div>
              <div class="wrapped-summary-stat-label">${this.t('streak')}</div>
            </div>
            <div class="wrapped-summary-stat">
              <div class="wrapped-summary-stat-value">Lv.${this.stats.levelProgress.end}</div>
              <div class="wrapped-summary-stat-label">${this.t('level')}</div>
            </div>
            <div class="wrapped-summary-stat">
              <div class="wrapped-summary-stat-value">${this.stats.earnedBadges?.length || 0}</div>
              <div class="wrapped-summary-stat-label">${this.t('badges')}</div>
            </div>
          </div>

          <div class="wrapped-summary-actions">
            <button class="wrapped-share-btn" onclick="wrappedShare.downloadImage()">
              <span>📥</span>
              <span>${this.t('shareImage')}</span>
            </button>
            <button class="wrapped-home-btn" onclick="window.location.href='../'">
              <span>🏠</span>
              <span>${this.t('backToHome')}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
const wrappedSlides = new WrappedSlidesManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WrappedSlidesManager, wrappedSlides };
}
