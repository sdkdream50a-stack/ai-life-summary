/**
 * Gamification UI Components
 * Handles toasts, popups, and feedback animations
 */

class GamificationUI {
  constructor() {
    this.toastContainer = null;
    this.currentPopup = null;
    this.toastQueue = [];
    this.isShowingToast = false;
    this.lang = 'ko';
  }

  /**
   * Initialize UI components
   */
  initialize(lang = 'ko') {
    this.lang = lang;
    this.createToastContainer();
    this.createPopupContainer();
  }

  /**
   * Create toast container
   */
  createToastContainer() {
    if (document.getElementById('gamification-toast-container')) return;

    const container = document.createElement('div');
    container.id = 'gamification-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    this.toastContainer = container;
  }

  /**
   * Create popup container
   */
  createPopupContainer() {
    if (document.getElementById('gamification-popup-container')) return;

    const container = document.createElement('div');
    container.id = 'gamification-popup-container';
    container.className = 'popup-overlay';
    container.innerHTML = '<div class="popup-content"></div>';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Close on backdrop click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.closePopup();
      }
    });
  }

  // ==================== TOASTS ====================

  /**
   * Show XP toast
   */
  showXpToast(amount, reason = null) {
    const messages = {
      ko: {
        test_complete: '테스트 완료!',
        daily_test_complete: '일일 테스트 완료!',
        share_result: '결과 공유!',
        streak_bonus: '스트릭 보너스!',
        badge_earned: '뱃지 획득!',
        friend_joined: '친구 초대 성공!',
        default: 'XP 획득!'
      },
      en: {
        test_complete: 'Test completed!',
        daily_test_complete: 'Daily test completed!',
        share_result: 'Result shared!',
        streak_bonus: 'Streak bonus!',
        badge_earned: 'Badge earned!',
        friend_joined: 'Friend joined!',
        default: 'XP earned!'
      }
    };

    const msg = messages[this.lang] || messages.en;
    const reasonText = reason ? (msg[reason] || msg.default) : msg.default;

    this.queueToast({
      type: 'xp',
      icon: '⭐',
      title: `+${amount} XP`,
      subtitle: reasonText,
      duration: 2500
    });
  }

  /**
   * Show streak toast
   */
  showStreakToast(streakCount, isMilestone = false) {
    const messages = {
      ko: {
        streak: `${streakCount}일 연속!`,
        milestone: `🎉 ${streakCount}일 달성!`
      },
      en: {
        streak: `${streakCount} day streak!`,
        milestone: `🎉 ${streakCount} days achieved!`
      }
    };

    const msg = messages[this.lang] || messages.en;

    this.queueToast({
      type: isMilestone ? 'milestone' : 'streak',
      icon: '🔥',
      title: isMilestone ? msg.milestone : msg.streak,
      subtitle: null,
      duration: isMilestone ? 3500 : 2500
    });
  }

  /**
   * Show generic toast
   */
  showToast(icon, title, subtitle = null, duration = 2500) {
    this.queueToast({
      type: 'generic',
      icon,
      title,
      subtitle,
      duration
    });
  }

  /**
   * Queue a toast
   */
  queueToast(toast) {
    this.toastQueue.push(toast);
    if (!this.isShowingToast) {
      this.processToastQueue();
    }
  }

  /**
   * Process toast queue
   */
  processToastQueue() {
    if (this.toastQueue.length === 0) {
      this.isShowingToast = false;
      return;
    }

    this.isShowingToast = true;
    const toast = this.toastQueue.shift();
    this.displayToast(toast);
  }

  /**
   * Display a toast
   */
  displayToast(toast) {
    const el = document.createElement('div');
    el.className = `gamification-toast toast-${toast.type}`;
    el.innerHTML = `
      <span class="toast-icon">${toast.icon}</span>
      <div class="toast-text">
        <span class="toast-title">${toast.title}</span>
        ${toast.subtitle ? `<span class="toast-subtitle">${toast.subtitle}</span>` : ''}
      </div>
    `;

    this.toastContainer.appendChild(el);

    // Animate in
    requestAnimationFrame(() => {
      el.classList.add('toast-show');
    });

    // Remove after duration
    setTimeout(() => {
      el.classList.remove('toast-show');
      el.classList.add('toast-hide');

      setTimeout(() => {
        el.remove();
        this.processToastQueue();
      }, 300);
    }, toast.duration);
  }

  // ==================== POPUPS ====================

  /**
   * Show badge earned popup
   */
  showBadgePopup(badge, lang = 'ko') {
    const rarityConfig = typeof RARITY_CONFIG !== 'undefined'
      ? RARITY_CONFIG[badge.rarity]
      : { color: '#f59e0b', label: { ko: badge.rarity } };

    const content = `
      <div class="badge-popup">
        <div class="badge-popup-header">
          <span class="confetti-left">🎉</span>
          <span class="badge-popup-title">${this.t('newBadge', lang)}</span>
          <span class="confetti-right">🎉</span>
        </div>

        <div class="badge-popup-emoji bounce-animation">
          ${badge.emoji}
        </div>

        <div class="badge-popup-name">
          "${badge.name[lang] || badge.name.en}"
        </div>

        <div class="badge-popup-rarity" style="color: ${rarityConfig.color}">
          ${rarityConfig.label[lang] || rarityConfig.label.en}
        </div>

        <div class="badge-popup-description">
          ${badge.description[lang] || badge.description.en}
        </div>

        <div class="badge-popup-xp">
          +${badge.xpReward} XP ${this.t('earned', lang)}!
        </div>

        <div class="badge-popup-actions">
          <button class="popup-btn popup-btn-primary" onclick="gamificationUI.closePopup()">
            ${this.t('confirm', lang)}
          </button>
          <button class="popup-btn popup-btn-secondary" onclick="gamificationUI.shareBadge('${badge.id}')">
            ${this.t('share', lang)}
          </button>
        </div>
      </div>
    `;

    this.showPopup(content, 'badge-earned');
    this.playConfetti();
  }

  /**
   * Show level up popup
   */
  showLevelUpPopup(newLevel, levelData, reward = null, lang = 'ko') {
    const levelName = levelData.name[lang] || levelData.name.en;

    const rewardHtml = reward ? `
      <div class="levelup-reward">
        <span class="reward-icon">🎁</span>
        <span class="reward-text">${this.t('unlocked', lang)}: ${reward.description[lang] || reward.description.en}</span>
      </div>
    ` : '';

    const content = `
      <div class="levelup-popup">
        <div class="levelup-header">
          <span class="confetti-left">🎊</span>
          <span class="levelup-title">${this.t('levelUp', lang)}!</span>
          <span class="confetti-right">🎊</span>
        </div>

        <div class="levelup-level scale-animation">
          Level ${newLevel}
        </div>

        <div class="levelup-name">
          ${levelName}
        </div>

        <div class="levelup-message">
          ${this.getLevelMessage(newLevel, lang)}
        </div>

        ${rewardHtml}

        <div class="levelup-actions">
          <button class="popup-btn popup-btn-primary" onclick="gamificationUI.closePopup()">
            ${this.t('confirm', lang)}
          </button>
        </div>
      </div>
    `;

    this.showPopup(content, 'level-up');
    this.playConfetti();
  }

  /**
   * Show streak milestone popup
   */
  showStreakMilestonePopup(milestone, streakCount, lang = 'ko') {
    const content = `
      <div class="streak-popup">
        <div class="streak-popup-header">
          ${milestone.emoji}
        </div>

        <div class="streak-popup-title">
          ${streakCount}${this.t('dayStreak', lang)}!
        </div>

        <div class="streak-popup-subtitle">
          ${this.t('streakCongrats', lang)}
        </div>

        ${milestone.badge ? `
          <div class="streak-popup-badge">
            <span class="badge-icon">${typeof BADGES !== 'undefined' && BADGES[milestone.badge] ? BADGES[milestone.badge].emoji : '🏆'}</span>
            <span class="badge-text">${this.t('badgeEarned', lang)}</span>
          </div>
        ` : ''}

        <div class="streak-popup-xp">
          +${milestone.xpBonus} XP
        </div>

        <div class="streak-popup-actions">
          <button class="popup-btn popup-btn-primary" onclick="gamificationUI.closePopup()">
            ${this.t('confirm', lang)}
          </button>
        </div>
      </div>
    `;

    this.showPopup(content, 'streak-milestone');
    this.playConfetti();
  }

  /**
   * Show login prompt popup
   */
  showLoginPrompt(lang = 'ko', onLogin = null, onGuest = null) {
    const messages = typeof authSystem !== 'undefined'
      ? authSystem.getLoginPromptMessages(lang)
      : this.getDefaultLoginMessages(lang);

    const content = `
      <div class="login-popup">
        <div class="login-popup-header">
          <span class="login-title">${messages.title}</span>
        </div>

        <div class="login-popup-subtitle">
          ${messages.subtitle}
        </div>

        <div class="login-benefits">
          ${messages.benefits.map(b => `
            <div class="benefit-item">
              <span class="benefit-check">✓</span>
              <span>${b}</span>
            </div>
          `).join('')}
        </div>

        <div class="login-buttons">
          <button class="login-btn google-btn" onclick="gamificationUI.handleLogin('google')">
            <span class="btn-icon">🔵</span>
            ${messages.googleBtn}
          </button>
        </div>

        <div class="login-guest">
          <button class="guest-link" onclick="gamificationUI.handleGuestContinue()">
            ${messages.guestBtn} →
          </button>
        </div>
      </div>
    `;

    this.showPopup(content, 'login-prompt');
    this.loginCallbacks = { onLogin, onGuest };
  }

  /**
   * Handle login button click
   */
  async handleLogin(provider) {
    if (typeof authSystem === 'undefined') {
      console.warn('Auth system not available');
      return;
    }

    let result;
    switch (provider) {
      case 'google':
        result = await authSystem.signInWithGoogle();
        break;
      case 'kakao':
        result = await authSystem.signInWithKakao();
        break;
      case 'apple':
        result = await authSystem.signInWithApple();
        break;
      default:
        result = { success: false, error: 'Unknown provider' };
    }

    if (result.success) {
      this.closePopup();
      this.showToast('✅', this.t('loginSuccess', this.lang));
      if (this.loginCallbacks?.onLogin) {
        this.loginCallbacks.onLogin(result.user);
      }
    } else {
      this.showToast('❌', result.error || this.t('loginFailed', this.lang));
    }
  }

  /**
   * Handle guest continue
   */
  handleGuestContinue() {
    this.closePopup();
    if (this.loginCallbacks?.onGuest) {
      this.loginCallbacks.onGuest();
    }
  }

  /**
   * Show popup
   */
  showPopup(content, type = 'generic') {
    const container = document.getElementById('gamification-popup-container');
    if (!container) return;

    const contentEl = container.querySelector('.popup-content');
    contentEl.innerHTML = content;
    contentEl.className = `popup-content popup-${type}`;

    container.style.display = 'flex';
    requestAnimationFrame(() => {
      container.classList.add('popup-show');
    });

    this.currentPopup = { type, content };
  }

  /**
   * Close popup
   */
  closePopup() {
    const container = document.getElementById('gamification-popup-container');
    if (!container) return;

    container.classList.remove('popup-show');
    setTimeout(() => {
      container.style.display = 'none';
    }, 300);

    this.currentPopup = null;
  }

  /**
   * Share badge
   */
  shareBadge(badgeId) {
    // Placeholder for badge sharing
    if (typeof navigator.share !== 'undefined') {
      navigator.share({
        title: 'AI Test Lab - Badge Earned!',
        text: `I earned a new badge!`,
        url: 'https://smartaitest.com'
      });
    }
    this.closePopup();
  }

  // ==================== EFFECTS ====================

  /**
   * Play confetti effect
   */
  playConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#f59e0b', '#6366f1', '#ec4899', '#10b981', '#8b5cf6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
      container.appendChild(confetti);
    }

    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  /**
   * Play sparkle effect on element
   */
  playSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    element.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1000);
  }

  // ==================== TRANSLATIONS ====================

  /**
   * Get translation
   */
  t(key, lang = 'ko') {
    const translations = {
      ko: {
        newBadge: '새 뱃지 획득!',
        earned: '획득',
        confirm: '확인',
        share: '공유하기',
        levelUp: '레벨 업',
        unlocked: '해금',
        dayStreak: '일 연속 참여',
        streakCongrats: '꾸준함이 당신의 힘입니다!',
        badgeEarned: '뱃지 획득!',
        loginSuccess: '로그인 성공!',
        loginFailed: '로그인 실패'
      },
      en: {
        newBadge: 'New Badge Earned!',
        earned: 'earned',
        confirm: 'OK',
        share: 'Share',
        levelUp: 'Level Up',
        unlocked: 'Unlocked',
        dayStreak: ' Day Streak',
        streakCongrats: 'Consistency is your power!',
        badgeEarned: 'Badge Earned!',
        loginSuccess: 'Login successful!',
        loginFailed: 'Login failed'
      }
    };

    const msgs = translations[lang] || translations.en;
    return msgs[key] || key;
  }

  /**
   * Get level message
   */
  getLevelMessage(level, lang = 'ko') {
    const messages = {
      ko: [
        '여정이 시작되었습니다!',
        '탐색을 시작하세요!',
        '점점 성장하고 있어요!',
        '대단해요! 계속 가세요!',
        '절반을 넘었어요!',
        '전문가의 길을 걷고 있어요!',
        '마스터가 되어가고 있어요!',
        '현자의 지혜를 얻었어요!',
        '그랜드마스터의 경지!',
        '전설이 되었습니다!'
      ],
      en: [
        'Your journey begins!',
        'Start exploring!',
        'You\'re growing!',
        'Amazing! Keep going!',
        'Halfway there!',
        'Walking the path of an expert!',
        'Becoming a master!',
        'You\'ve gained the wisdom of a sage!',
        'Grandmaster level!',
        'You\'ve become a legend!'
      ]
    };

    const msgs = messages[lang] || messages.en;
    return msgs[Math.min(level - 1, msgs.length - 1)];
  }

  /**
   * Get default login messages
   */
  getDefaultLoginMessages(lang) {
    return {
      title: lang === 'ko' ? '로그인' : 'Sign In',
      subtitle: lang === 'ko' ? '기록을 저장하세요!' : 'Save your progress!',
      googleBtn: lang === 'ko' ? 'Google로 계속하기' : 'Continue with Google',
      guestBtn: lang === 'ko' ? '로그인 없이 계속하기' : 'Continue as guest',
      benefits: []
    };
  }
}

// Global instance
const gamificationUI = new GamificationUI();

// Auto-initialize when DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    gamificationUI.initialize();
  });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GamificationUI, gamificationUI };
}
