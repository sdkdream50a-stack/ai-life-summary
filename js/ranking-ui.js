/**
 * Ranking UI
 * Handles tab switching, rendering, and animations for ranking page
 */

class RankingUI {
  constructor() {
    this.currentTab = 'types';
    this.lang = 'ko';
    this.userData = null;
  }

  /**
   * Initialize the UI
   */
  initialize(lang = 'ko') {
    this.lang = lang;

    // Get user data
    if (typeof userDataManager !== 'undefined') {
      this.userData = userDataManager.getUserData();
    }

    // Initialize ranking data with language
    rankingData.initialize(lang);

    // Render initial tab
    this.renderCurrentTab();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document.querySelectorAll('.ranking-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
  }

  /**
   * Switch tab
   */
  switchTab(tabId) {
    if (this.currentTab === tabId) return;

    this.currentTab = tabId;

    // Update tab UI
    document.querySelectorAll('.ranking-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update panel visibility
    document.querySelectorAll('.ranking-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tabId);
    });

    // Render content
    this.renderCurrentTab();
  }

  /**
   * Render current tab content
   */
  renderCurrentTab() {
    switch (this.currentTab) {
      case 'types':
        this.renderTypeDistribution();
        break;
      case 'compatibility':
        this.renderCompatibilityPairs();
        break;
      case 'level':
        this.renderLevelLeaderboard();
        break;
      case 'streak':
        this.renderStreakLeaderboard();
        break;
    }
  }

  /**
   * Render type distribution
   */
  renderTypeDistribution() {
    const container = document.getElementById('type-distribution-content');
    if (!container) return;

    const distribution = rankingData.getTypeDistribution();

    let html = `
      <div class="distribution-title">
        <span></span>
        <span>${this.t('weeklyTypes')}</span>
      </div>
    `;

    distribution.forEach((item, index) => {
      const soulType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(item.type)
        : null;

      const typeName = soulType
        ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
        : item.type;
      const emoji = soulType?.emoji || '';
      const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';
      const color = soulType?.color || '#64748b';

      const isUserType = this.userData?.testHistory?.some(t =>
        t.result?.soulType === item.type
      );

      html += `
        <div class="distribution-bar-container ${isUserType ? 'highlighted' : ''}" style="animation-delay: ${index * 50}ms">
          <div class="distribution-bar-header">
            <div class="distribution-type">
              <span class="distribution-type-emoji">${emoji}</span>
              <span>${typeName}</span>
              ${isUserType ? `<span style="font-size: 0.625rem; color: #a5b4fc;">(${this.t('yourType')})</span>` : ''}
            </div>
            <span class="distribution-percentage">${item.percentage}%</span>
          </div>
          <div class="distribution-bar">
            <div class="distribution-bar-fill bg-gradient-to-r ${gradient}" style="width: ${item.percentage}%"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Animate bars
    setTimeout(() => {
      container.querySelectorAll('.distribution-bar-fill').forEach(bar => {
        bar.style.width = bar.style.width; // Trigger animation
      });
    }, 100);
  }

  /**
   * Render compatibility pairs
   */
  renderCompatibilityPairs() {
    const container = document.getElementById('compatibility-content');
    if (!container) return;

    const pairs = rankingData.getCompatibilityPairs();

    let html = '';

    pairs.forEach((pair, index) => {
      const type1 = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(pair.type1)
        : null;
      const type2 = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(pair.type2)
        : null;

      const name1 = type1
        ? (this.lang === 'ko' ? type1.nameKo : type1.nameEn)
        : pair.type1;
      const name2 = type2
        ? (this.lang === 'ko' ? type2.nameKo : type2.nameEn)
        : pair.type2;

      const emoji1 = type1?.emoji || '';
      const emoji2 = type2?.emoji || '';

      html += `
        <div class="compatibility-card" style="animation-delay: ${index * 50}ms">
          <div class="compatibility-rank">
            <span class="compatibility-rank-number">#${index + 1}</span>
            <span class="compatibility-rank-label">${this.t('bestMatch')}</span>
          </div>

          <div class="compatibility-pair">
            <div class="compatibility-type">
              <span class="compatibility-emoji">${emoji1}</span>
              <span class="compatibility-name">${name1}</span>
            </div>
            <span class="compatibility-heart"></span>
            <div class="compatibility-type">
              <span class="compatibility-emoji">${emoji2}</span>
              <span class="compatibility-name">${name2}</span>
            </div>
          </div>

          <div class="compatibility-score">
            <span class="compatibility-score-value">${pair.score}%</span>
            <div class="compatibility-score-label">${this.formatCount(pair.testCount)} ${this.t('tests')}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render level leaderboard
   */
  renderLevelLeaderboard() {
    const container = document.getElementById('level-content');
    if (!container) return;

    let leaderboard = rankingData.getLevelLeaderboard(100);
    let userRank = null;

    // Insert current user if we have data
    if (this.userData?.gamification) {
      const result = rankingData.insertUserIntoLeaderboard(
        leaderboard,
        {
          displayName: this.userData.displayName || (this.lang === 'ko' ? '나' : 'You'),
          soulType: this.getMostCommonType(),
          totalXp: this.userData.gamification.totalXp || 0,
          level: this.userData.gamification.level || 1,
          lang: this.lang
        },
        'totalXp'
      );

      leaderboard = result.leaderboard;
      userRank = result.userRank;
    }

    // Render user rank banner
    let html = this.renderUserRankBanner(userRank, leaderboard.length);

    // Render leaderboard
    html += `
      <div class="leaderboard">
        <div class="leaderboard-header">
          <span>${this.t('rank')}</span>
          <span>${this.t('user')}</span>
          <span>${this.t('level')}</span>
        </div>
    `;

    // Show top 50 or around user
    const displayUsers = this.getDisplayRange(leaderboard, userRank, 50);

    displayUsers.forEach((user, displayIndex) => {
      const actualRank = user.rank || displayIndex + 1;
      const soulType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(user.type)
        : null;

      const typeName = soulType
        ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
        : user.type;
      const emoji = soulType?.emoji?.split('')[0] || '';
      const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';

      const rankClass = actualRank === 1 ? 'gold' :
                       actualRank === 2 ? 'silver' :
                       actualRank === 3 ? 'bronze' : '';

      html += `
        <div class="leaderboard-item ${user.isCurrentUser ? 'highlighted' : ''}">
          <span class="leaderboard-rank ${rankClass}">
            ${actualRank <= 3 ? this.getMedalEmoji(actualRank) : actualRank}
          </span>
          <div class="leaderboard-user">
            <div class="leaderboard-avatar bg-gradient-to-br ${gradient}">${emoji}</div>
            <div class="leaderboard-user-info">
              <span class="leaderboard-name">
                ${user.isCurrentUser ? (this.lang === 'ko' ? '나' : 'You') : this.escapeHtml(user.name)}
              </span>
              <span class="leaderboard-type">${typeName}</span>
            </div>
          </div>
          <span class="leaderboard-value">Lv.${user.level || Math.floor(user.totalXp / 500) + 1}</span>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * Render streak leaderboard
   */
  renderStreakLeaderboard() {
    const container = document.getElementById('streak-content');
    if (!container) return;

    let leaderboard = rankingData.getStreakLeaderboard(100);
    let userRank = null;

    // Insert current user if we have data
    if (this.userData?.gamification) {
      const result = rankingData.insertUserIntoLeaderboard(
        leaderboard,
        {
          displayName: this.userData.displayName || (this.lang === 'ko' ? '나' : 'You'),
          soulType: this.getMostCommonType(),
          currentStreak: this.userData.gamification.currentStreak || 0,
          lang: this.lang
        },
        'currentStreak'
      );

      leaderboard = result.leaderboard;
      userRank = result.userRank;
    }

    // Render user rank banner
    let html = this.renderUserRankBanner(userRank, leaderboard.length);

    // Render leaderboard
    html += `
      <div class="leaderboard">
        <div class="leaderboard-header">
          <span>${this.t('rank')}</span>
          <span>${this.t('user')}</span>
          <span>${this.t('streak')}</span>
        </div>
    `;

    // Show top 50 or around user
    const displayUsers = this.getDisplayRange(leaderboard, userRank, 50);

    displayUsers.forEach((user, displayIndex) => {
      const actualRank = user.rank || displayIndex + 1;
      const soulType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(user.type)
        : null;

      const typeName = soulType
        ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
        : user.type;
      const emoji = soulType?.emoji?.split('')[0] || '';
      const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';

      const rankClass = actualRank === 1 ? 'gold' :
                       actualRank === 2 ? 'silver' :
                       actualRank === 3 ? 'bronze' : '';

      const streakEmoji = this.getStreakEmoji(user.currentStreak);

      html += `
        <div class="leaderboard-item ${user.isCurrentUser ? 'highlighted' : ''}">
          <span class="leaderboard-rank ${rankClass}">
            ${actualRank <= 3 ? this.getMedalEmoji(actualRank) : actualRank}
          </span>
          <div class="leaderboard-user">
            <div class="leaderboard-avatar bg-gradient-to-br ${gradient}">${emoji}</div>
            <div class="leaderboard-user-info">
              <span class="leaderboard-name">
                ${user.isCurrentUser ? (this.lang === 'ko' ? '나' : 'You') : this.escapeHtml(user.name)}
              </span>
              <span class="leaderboard-type">${typeName}</span>
            </div>
          </div>
          <span class="leaderboard-value">${streakEmoji} ${user.currentStreak}${this.lang === 'ko' ? '일' : 'd'}</span>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * Render user rank banner
   */
  renderUserRankBanner(userRank, totalUsers) {
    if (!userRank || !this.userData) return '';

    const percentile = rankingData.calculatePercentile(userRank, totalUsers * 100);
    const soulType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(this.getMostCommonType())
      : null;
    const emoji = soulType?.emoji?.split('')[0] || '';
    const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';

    return `
      <div class="user-rank-banner">
        <div class="user-rank-info">
          <div class="user-rank-avatar bg-gradient-to-br ${gradient}">${emoji}</div>
          <div class="user-rank-details">
            <span class="user-rank-label">${this.t('myRank')}</span>
            <span class="user-rank-position">#${userRank}</span>
          </div>
        </div>
        <span class="user-rank-percentile">${this.t('top')} ${percentile}%!</span>
      </div>
    `;
  }

  /**
   * Get display range for leaderboard
   */
  getDisplayRange(leaderboard, userRank, maxDisplay) {
    // Add rank property
    const ranked = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    if (!userRank || userRank <= maxDisplay) {
      return ranked.slice(0, maxDisplay);
    }

    // Show top entries and entries around user
    const topCount = Math.floor(maxDisplay * 0.6);
    const aroundCount = maxDisplay - topCount;
    const aroundStart = Math.max(userRank - Math.floor(aroundCount / 2), topCount);
    const aroundEnd = aroundStart + aroundCount;

    const top = ranked.slice(0, topCount);
    const around = ranked.slice(aroundStart, aroundEnd);

    // Add separator indicator
    if (aroundStart > topCount) {
      top.push({
        isSeparator: true,
        name: '...',
        rank: '...'
      });
    }

    return [...top, ...around.filter(u => !top.includes(u))];
  }

  /**
   * Get most common type from user data
   */
  getMostCommonType() {
    if (typeof userDataManager === 'undefined') return 'flame-fox';
    const mostCommon = userDataManager.getMostCommonType();
    return mostCommon?.type || 'flame-fox';
  }

  /**
   * Get medal emoji
   */
  getMedalEmoji(rank) {
    switch (rank) {
      case 1: return '';
      case 2: return '';
      case 3: return '';
      default: return rank;
    }
  }

  /**
   * Get streak emoji
   */
  getStreakEmoji(streak) {
    if (streak >= 100) return '';
    if (streak >= 30) return '';
    if (streak >= 7) return '';
    return '';
  }

  /**
   * Format count
   */
  formatCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toLocaleString();
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get translation
   */
  t(key) {
    const translations = {
      ko: {
        weeklyTypes: '이번 주 인기 타입',
        yourType: '당신의 타입',
        bestMatch: '베스트 궁합',
        tests: '회 테스트',
        rank: '순위',
        user: '사용자',
        level: '레벨',
        streak: '스트릭',
        myRank: '내 순위',
        top: '상위'
      },
      en: {
        weeklyTypes: 'Popular Types This Week',
        yourType: 'Your type',
        bestMatch: 'Best Match',
        tests: 'tests',
        rank: 'Rank',
        user: 'User',
        level: 'Level',
        streak: 'Streak',
        myRank: 'My Rank',
        top: 'Top'
      },
      ja: {
        weeklyTypes: '今週の人気タイプ',
        yourType: 'あなたのタイプ',
        bestMatch: 'ベスト相性',
        tests: '回テスト',
        rank: '順位',
        user: 'ユーザー',
        level: 'レベル',
        streak: 'ストリーク',
        myRank: '私の順位',
        top: '上位'
      },
      zh: {
        weeklyTypes: '本周热门类型',
        yourType: '你的类型',
        bestMatch: '最佳配对',
        tests: '次测试',
        rank: '排名',
        user: '用户',
        level: '等级',
        streak: '连续',
        myRank: '我的排名',
        top: '前'
      },
      es: {
        weeklyTypes: 'Tipos Populares Esta Semana',
        yourType: 'Tu tipo',
        bestMatch: 'Mejor Pareja',
        tests: 'pruebas',
        rank: 'Rango',
        user: 'Usuario',
        level: 'Nivel',
        streak: 'Racha',
        myRank: 'Mi Ranking',
        top: 'Top'
      }
    };

    return translations[this.lang]?.[key] || translations.en[key] || key;
  }
}

// Global instance
const rankingUI = new RankingUI();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RankingUI, rankingUI };
}
