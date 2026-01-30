/**
 * Viral Hooks Module
 * Implements engagement mechanics and viral features
 * SmartAITest.com
 */

class ViralHooks {
  constructor() {
    this.lang = document.documentElement.lang || 'ko';
    this.tickerInterval = null;
    this.urgencyInterval = null;
    this.fabVisible = false;
    this.shareSectionPassed = false;
  }

  // ==================== TRANSLATIONS ====================

  translations = {
    ko: {
      activity: {
        discovered: '에서 {type} 타입 발견!',
        timeAgo: '{time}초 전'
      },
      urgency: {
        remaining: '오늘 무료 분석 {count}개 남음'
      },
      socialProof: {
        shared: '{count}명이 방금 공유했어요',
        testing: '{count}명이 지금 테스트 중'
      },
      coupleMatch: {
        congrats: '운명적인 만남이에요!',
        shareDestiny: '운명을 공유하세요!',
        perfect: '완벽한 궁합!'
      },
      compare: {
        withFriend: '친구와 비교하기',
        friendName: '친구 이름',
        friendBirthday: '친구 생년월일',
        generate: '비교 이미지 생성',
        cancel: '취소'
      },
      fab: {
        share: '공유'
      }
    },
    en: {
      activity: {
        discovered: 'discovered {type} Type!',
        timeAgo: '{time}s ago'
      },
      urgency: {
        remaining: 'Only {count} free analyses left today'
      },
      socialProof: {
        shared: '{count} people just shared',
        testing: '{count} people testing now'
      },
      coupleMatch: {
        congrats: "It's destiny!",
        shareDestiny: 'Share your destiny!',
        perfect: 'Perfect Match!'
      },
      compare: {
        withFriend: 'Compare with Friend',
        friendName: 'Friend\'s name',
        friendBirthday: 'Friend\'s birthday',
        generate: 'Generate Comparison',
        cancel: 'Cancel'
      },
      fab: {
        share: 'Share'
      }
    },
    ja: {
      activity: {
        discovered: 'で{type}タイプ発見!',
        timeAgo: '{time}秒前'
      },
      urgency: {
        remaining: '今日の無料分析残り{count}個'
      },
      socialProof: {
        shared: '{count}人が今シェアしました',
        testing: '{count}人が今テスト中'
      },
      coupleMatch: {
        congrats: '運命の出会いです!',
        shareDestiny: '運命をシェア!',
        perfect: '完璧な相性!'
      },
      compare: {
        withFriend: '友達と比較',
        friendName: '友達の名前',
        friendBirthday: '友達の生年月日',
        generate: '比較画像を生成',
        cancel: 'キャンセル'
      },
      fab: {
        share: 'シェア'
      }
    },
    zh: {
      activity: {
        discovered: '发现{type}类型!',
        timeAgo: '{time}秒前'
      },
      urgency: {
        remaining: '今日免费分析仅剩{count}个'
      },
      socialProof: {
        shared: '{count}人刚刚分享了',
        testing: '{count}人正在测试'
      },
      coupleMatch: {
        congrats: '命中注定!',
        shareDestiny: '分享你的缘分!',
        perfect: '完美契合!'
      },
      compare: {
        withFriend: '与朋友比较',
        friendName: '朋友的名字',
        friendBirthday: '朋友的生日',
        generate: '生成对比图',
        cancel: '取消'
      },
      fab: {
        share: '分享'
      }
    },
    es: {
      activity: {
        discovered: 'descubrió tipo {type}!',
        timeAgo: 'hace {time}s'
      },
      urgency: {
        remaining: 'Solo {count} análisis gratis hoy'
      },
      socialProof: {
        shared: '{count} personas compartieron',
        testing: '{count} personas probando ahora'
      },
      coupleMatch: {
        congrats: '¡Es el destino!',
        shareDestiny: '¡Comparte tu destino!',
        perfect: '¡Pareja Perfecta!'
      },
      compare: {
        withFriend: 'Comparar con amigo',
        friendName: 'Nombre del amigo',
        friendBirthday: 'Cumpleaños del amigo',
        generate: 'Generar comparación',
        cancel: 'Cancelar'
      },
      fab: {
        share: 'Compartir'
      }
    }
  };

  // Countries and soul types for fake activity
  COUNTRIES = {
    ko: ['한국', '미국', '일본', '브라질', '독일', '영국', '호주', '캐나다', '프랑스', '인도'],
    en: ['Korea', 'USA', 'Japan', 'Brazil', 'Germany', 'UK', 'Australia', 'Canada', 'France', 'India'],
    ja: ['韓国', 'アメリカ', '日本', 'ブラジル', 'ドイツ', 'イギリス', 'オーストラリア', 'カナダ', 'フランス', 'インド'],
    zh: ['韩国', '美国', '日本', '巴西', '德国', '英国', '澳大利亚', '加拿大', '法国', '印度'],
    es: ['Corea', 'EE.UU.', 'Japón', 'Brasil', 'Alemania', 'Reino Unido', 'Australia', 'Canadá', 'Francia', 'India']
  };

  SOUL_TYPES = {
    ko: ['불꽃여우', '다이아몬드사자', '바다곰', '크리스탈나비', '폭풍독수리', '달빛늑대', '황금불사조', '비취거북', '은빛백조', '우주부엉이'],
    en: ['Flame Fox', 'Diamond Lion', 'Ocean Bear', 'Crystal Butterfly', 'Storm Eagle', 'Moonlit Wolf', 'Golden Phoenix', 'Jade Turtle', 'Silver Swan', 'Cosmic Owl'],
    ja: ['炎キツネ', 'ダイヤモンドライオン', '海クマ', 'クリスタル蝶', '嵐イーグル', '月光オオカミ', '黄金フェニックス', '翡翠亀', '銀白鳥', '宇宙フクロウ'],
    zh: ['火焰狐狸', '钻石狮子', '海洋熊', '水晶蝴蝶', '风暴鹰', '月光狼', '金凤凰', '翡翠龟', '银天鹅', '宇宙猫头鹰'],
    es: ['Zorro de Fuego', 'León Diamante', 'Oso Oceánico', 'Mariposa Cristal', 'Águila Tormenta', 'Lobo Lunar', 'Fénix Dorado', 'Tortuga Jade', 'Cisne Plateado', 'Búho Cósmico']
  };

  COUNTRY_FLAGS = ['🇰🇷', '🇺🇸', '🇯🇵', '🇧🇷', '🇩🇪', '🇬🇧', '🇦🇺', '🇨🇦', '🇫🇷', '🇮🇳'];

  // ==================== HELPER METHODS ====================

  t(key, lang = null) {
    const l = lang || this.lang;
    const keys = key.split('.');
    let value = this.translations[l] || this.translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }

  random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Simple hash for consistent percentile
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // ==================== LIVE ACTIVITY TICKER ====================

  initLiveActivityTicker() {
    const container = document.getElementById('viral-activity-ticker');
    if (!container) return;

    // Show first activity immediately
    this.showRandomActivity(container);

    // Rotate every 5-15 seconds
    this.tickerInterval = setInterval(() => {
      this.showRandomActivity(container);
    }, this.randomInt(5000, 15000));

    // Track view
    this.trackEvent('ticker_view');
  }

  showRandomActivity(container) {
    const countries = this.COUNTRIES[this.lang] || this.COUNTRIES.en;
    const types = this.SOUL_TYPES[this.lang] || this.SOUL_TYPES.en;

    const countryIndex = this.randomInt(0, countries.length - 1);
    const country = countries[countryIndex];
    const flag = this.COUNTRY_FLAGS[countryIndex];
    const type = this.random(types);
    const timeAgo = this.randomInt(3, 30);

    const discoveredText = this.t('activity.discovered').replace('{type}', type);
    const timeText = this.t('activity.timeAgo').replace('{time}', timeAgo);

    // Safe DOM construction to prevent XSS
    container.textContent = ''; // Clear existing content
    const content = document.createElement('div');
    content.className = 'viral-ticker-content';

    const dot = document.createElement('span');
    dot.className = 'viral-ticker-dot';

    const flagEl = document.createElement('span');
    flagEl.className = 'viral-ticker-flag';
    flagEl.textContent = flag;

    const text = document.createElement('span');
    text.className = 'viral-ticker-text';
    text.textContent = country + ' ' + discoveredText;

    const time = document.createElement('span');
    time.className = 'viral-ticker-time';
    time.textContent = '(' + timeText + ')';

    content.appendChild(dot);
    content.appendChild(flagEl);
    content.appendChild(text);
    content.appendChild(time);
    container.appendChild(content);

    // Add slide animation
    container.classList.remove('viral-ticker-animate');
    void container.offsetWidth; // Force reflow
    container.classList.add('viral-ticker-animate');
  }

  // ==================== URGENCY COUNTER ====================

  initUrgencyCounter() {
    const container = document.getElementById('viral-urgency-badge');
    if (!container) return;

    this.updateUrgencyCount(container);

    // Update every 30-60 seconds
    this.urgencyInterval = setInterval(() => {
      this.updateUrgencyCount(container);
    }, this.randomInt(30000, 60000));
  }

  updateUrgencyCount(container) {
    // Decrease throughout day: 500 at midnight → ~50 by 11pm
    const now = new Date();
    const hoursElapsed = now.getHours() + (now.getMinutes() / 60);
    const hoursRemaining = 24 - hoursElapsed;

    // Base calculation with some randomness
    const baseRemaining = Math.floor(500 * (hoursRemaining / 24));
    const remaining = baseRemaining + this.randomInt(-20, 50);
    const finalCount = Math.max(37, Math.min(500, remaining)); // Clamp between 37-500

    const text = this.t('urgency.remaining').replace('{count}', finalCount);

    container.innerHTML = `
      <span class="viral-urgency-icon">⚡</span>
      <span class="viral-urgency-text">${text}</span>
    `;

    // Pulse animation when low
    if (finalCount < 100) {
      container.classList.add('viral-urgency-pulse');
    }
  }

  // ==================== ENHANCED HERO COUNTER ====================

  initHeroSoulsCounter() {
    const counterEl = document.getElementById('test-counter');
    if (!counterEl) return;

    // Simulate live increments every 5-30 seconds
    setInterval(() => {
      const currentText = counterEl.textContent;
      const currentNum = parseInt(currentText.replace(/[^0-9]/g, '')) || 1000000;
      const increment = this.randomInt(1, 5);
      const newNum = currentNum + increment;

      counterEl.textContent = newNum.toLocaleString() + '+';
      counterEl.classList.add('viral-counter-bounce');

      setTimeout(() => {
        counterEl.classList.remove('viral-counter-bounce');
      }, 300);
    }, this.randomInt(5000, 30000));
  }

  // ==================== FLOATING SHARE FAB ====================

  initFloatingFAB() {
    // Only on result pages
    if (!document.querySelector('[data-result-page]') &&
        !window.location.pathname.includes('result')) return;

    const fab = this.createFAB();
    document.body.appendChild(fab);

    // Show FAB after scrolling past share section
    const shareSection = document.getElementById('share-section') ||
                         document.querySelector('[data-share-section]') ||
                         document.querySelector('.share-container');

    if (shareSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            this.showFAB(fab);
          } else if (entry.isIntersecting) {
            this.hideFAB(fab);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(shareSection);
    } else {
      // No share section found, show after 3 seconds
      setTimeout(() => this.showFAB(fab), 3000);
    }
  }

  createFAB() {
    const fab = document.createElement('div');
    fab.id = 'viral-share-fab';
    fab.className = 'viral-fab viral-fab-hidden';
    fab.innerHTML = `
      <button class="viral-fab-main" aria-label="${this.t('fab.share')}">
        <svg class="viral-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
      </button>
      <div class="viral-fab-menu">
        <button class="viral-fab-item" data-share="twitter" aria-label="Twitter">
          <span>𝕏</span>
        </button>
        <button class="viral-fab-item" data-share="facebook" aria-label="Facebook">
          <span>f</span>
        </button>
        <button class="viral-fab-item" data-share="copy" aria-label="Copy Link">
          <span>🔗</span>
        </button>
        <button class="viral-fab-item" data-share="image" aria-label="Download Image">
          <span>📷</span>
        </button>
      </div>
    `;

    // Event listeners
    const mainBtn = fab.querySelector('.viral-fab-main');
    mainBtn.addEventListener('click', () => {
      fab.classList.toggle('viral-fab-open');
      this.trackEvent('fab_click');
    });

    fab.querySelectorAll('.viral-fab-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const shareType = btn.dataset.share;
        this.handleFABShare(shareType);
      });
    });

    return fab;
  }

  showFAB(fab) {
    if (this.fabVisible) return;
    this.fabVisible = true;
    fab.classList.remove('viral-fab-hidden');
    fab.classList.add('viral-fab-visible');
  }

  hideFAB(fab) {
    if (!this.fabVisible) return;
    this.fabVisible = false;
    fab.classList.remove('viral-fab-visible', 'viral-fab-open');
    fab.classList.add('viral-fab-hidden');
  }

  handleFABShare(type) {
    const url = window.location.href;
    const title = document.title;

    switch (type) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          if (typeof gamificationUI !== 'undefined') {
            gamificationUI.showToast('✅', this.lang === 'ko' ? '링크 복사됨!' : 'Link copied!');
          }
        });
        break;
      case 'image':
        // Trigger existing share image generator
        if (typeof openShareModal === 'function') {
          openShareModal();
        } else if (typeof ShareImageGenerator !== 'undefined') {
          // Try to open share modal
          const modal = document.getElementById('share-modal');
          if (modal) modal.classList.remove('hidden');
        }
        break;
    }

    this.trackEvent('fab_share', { method: type });
  }

  // ==================== SOCIAL PROOF TOASTS ====================

  showSocialProofToast(delay = 15000) {
    setTimeout(() => {
      const count = this.randomInt(15, 45);
      const text = this.t('socialProof.shared').replace('{count}', count);

      if (typeof gamificationUI !== 'undefined') {
        gamificationUI.showToast('📲', text);
      }

      this.trackEvent('social_proof_toast');
    }, delay);
  }

  showTestingNowToast() {
    const count = this.randomInt(50, 200);
    const text = this.t('socialProof.testing').replace('{count}', count);

    if (typeof gamificationUI !== 'undefined') {
      gamificationUI.showToast('🔥', text);
    }
  }

  // ==================== COMPARISON STATS ====================

  calculatePercentile(value, category = 'general') {
    // Hash-based for consistency
    const hash = this.simpleHash(String(value) + category);
    const percentile = 65 + (hash % 30); // 65-95% range
    return percentile;
  }

  showComparisonStats() {
    const statsContainers = document.querySelectorAll('[data-comparison-stat]');

    statsContainers.forEach(container => {
      const value = container.dataset.value;
      const category = container.dataset.category || 'general';
      const percentile = this.calculatePercentile(value, category);

      const statText = document.createElement('span');
      statText.className = 'viral-comparison-stat';

      const labels = {
        ko: `상위 ${100 - percentile}%보다 높음`,
        en: `Higher than ${100 - percentile}% of users`,
        ja: `${100 - percentile}%より上位`,
        zh: `高于${100 - percentile}%的用户`,
        es: `Mayor que el ${100 - percentile}% de usuarios`
      };

      statText.textContent = labels[this.lang] || labels.en;
      container.appendChild(statText);
    });
  }

  // ==================== COUPLE MATCH ALERT (>=90%) ====================

  showCoupleMatchAlert(score) {
    if (score < 90) return;

    // Play confetti
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#8b5cf6', '#fbbf24']
      });
    }

    // Create celebration modal
    const modal = document.createElement('div');
    modal.className = 'viral-couple-modal';
    modal.innerHTML = `
      <div class="viral-couple-modal-content">
        <div class="viral-couple-modal-close">&times;</div>
        <div class="viral-couple-hearts">💕💖💕</div>
        <h2 class="viral-couple-title">${this.t('coupleMatch.perfect')}</h2>
        <div class="viral-couple-score">${score}%</div>
        <p class="viral-couple-text">${this.t('coupleMatch.congrats')}</p>
        <button class="viral-couple-share-btn">
          ${this.t('coupleMatch.shareDestiny')} ✨
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('viral-couple-modal-show');
    });

    // Event listeners
    modal.querySelector('.viral-couple-modal-close').addEventListener('click', () => {
      modal.classList.remove('viral-couple-modal-show');
      setTimeout(() => modal.remove(), 300);
    });

    modal.querySelector('.viral-couple-share-btn').addEventListener('click', () => {
      // Trigger share
      if (typeof openShareModal === 'function') {
        openShareModal();
      }
      modal.classList.remove('viral-couple-modal-show');
      setTimeout(() => modal.remove(), 300);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('viral-couple-modal-show');
        setTimeout(() => modal.remove(), 300);
      }
    });

    this.trackEvent('couple_alert_shown', { score });
  }

  // ==================== COMPARE WITH FRIEND MODAL ====================

  openCompareModal() {
    const modal = document.createElement('div');
    modal.className = 'viral-compare-modal';
    modal.innerHTML = `
      <div class="viral-compare-modal-content">
        <div class="viral-compare-modal-close">&times;</div>
        <h2 class="viral-compare-title">👯 ${this.t('compare.withFriend')}</h2>
        <form id="viral-compare-form" class="viral-compare-form">
          <div class="viral-compare-field">
            <label>${this.t('compare.friendName')}</label>
            <input type="text" name="friendName" required maxlength="20">
          </div>
          <div class="viral-compare-field">
            <label>${this.t('compare.friendBirthday')}</label>
            <input type="date" name="friendBirthday" required>
          </div>
          <div class="viral-compare-buttons">
            <button type="button" class="viral-compare-cancel">${this.t('compare.cancel')}</button>
            <button type="submit" class="viral-compare-submit">${this.t('compare.generate')}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      modal.classList.add('viral-compare-modal-show');
    });

    const closeModal = () => {
      modal.classList.remove('viral-compare-modal-show');
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.viral-compare-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.viral-compare-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#viral-compare-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.generateCompareImage(formData.get('friendName'), formData.get('friendBirthday'));
      closeModal();
    });

    this.trackEvent('compare_modal_open');
  }

  generateCompareImage(friendName, friendBirthday) {
    // Get current user's data from the page
    // This would integrate with share-image-generator.js
    console.log('Generate comparison with:', friendName, friendBirthday);

    // For now, show a toast
    if (typeof gamificationUI !== 'undefined') {
      gamificationUI.showToast('🎨', this.lang === 'ko' ? '비교 이미지 생성 중...' : 'Generating comparison...');
    }

    this.trackEvent('compare_image_generate');
  }

  // ==================== ANALYTICS ====================

  trackEvent(feature, params = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'viral_feature', {
        feature,
        ...params
      });
    }
  }

  // ==================== INITIALIZATION ====================

  init(options = {}) {
    this.lang = document.documentElement.lang || 'ko';

    // Initialize based on page type
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname === '/index.html';
    const isResultPage = window.location.pathname.includes('result');
    const isCompatibilityResult = window.location.pathname.includes('compatibility') && isResultPage;

    if (isHomePage) {
      this.initLiveActivityTicker();
      this.initUrgencyCounter();
      this.initHeroSoulsCounter();
    }

    if (isResultPage) {
      this.initFloatingFAB();
      this.showSocialProofToast(options.socialProofDelay || 15000);
      this.showComparisonStats();
    }

    if (isCompatibilityResult && options.compatibilityScore) {
      this.showCoupleMatchAlert(options.compatibilityScore);
    }
  }

  // Clean up intervals when needed
  destroy() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    if (this.urgencyInterval) clearInterval(this.urgencyInterval);
  }
}

// Global instance
const viralHooks = new ViralHooks();

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  viralHooks.init();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ViralHooks, viralHooks };
}
