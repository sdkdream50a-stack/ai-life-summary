/**
 * Level & XP System
 * Manages user levels, XP gain, and level progression
 */

// Level definitions
const LEVELS = [
  { level: 1, name: { ko: "소울 입문자", en: "Soul Newbie", ja: "ソウル入門者", zh: "灵魂新手", es: "Novato del Alma" }, minXp: 0, maxXp: 100 },
  { level: 2, name: { ko: "소울 탐색자", en: "Soul Seeker", ja: "ソウル探索者", zh: "灵魂探索者", es: "Buscador del Alma" }, minXp: 100, maxXp: 250 },
  { level: 3, name: { ko: "소울 발견자", en: "Soul Finder", ja: "ソウル発見者", zh: "灵魂发现者", es: "Descubridor del Alma" }, minXp: 250, maxXp: 500 },
  { level: 4, name: { ko: "소울 이해자", en: "Soul Understander", ja: "ソウル理解者", zh: "灵魂理解者", es: "Entendedor del Alma" }, minXp: 500, maxXp: 850 },
  { level: 5, name: { ko: "소울 탐험가", en: "Soul Explorer", ja: "ソウル探検家", zh: "灵魂探险家", es: "Explorador del Alma" }, minXp: 850, maxXp: 1300 },
  { level: 6, name: { ko: "소울 전문가", en: "Soul Expert", ja: "ソウルエキスパート", zh: "灵魂专家", es: "Experto del Alma" }, minXp: 1300, maxXp: 1850 },
  { level: 7, name: { ko: "소울 마스터", en: "Soul Master", ja: "ソウルマスター", zh: "灵魂大师", es: "Maestro del Alma" }, minXp: 1850, maxXp: 2500 },
  { level: 8, name: { ko: "소울 현자", en: "Soul Sage", ja: "ソウル賢者", zh: "灵魂贤者", es: "Sabio del Alma" }, minXp: 2500, maxXp: 3300 },
  { level: 9, name: { ko: "소울 그랜드마스터", en: "Soul Grandmaster", ja: "ソウルグランドマスター", zh: "灵魂宗师", es: "Gran Maestro del Alma" }, minXp: 3300, maxXp: 4300 },
  { level: 10, name: { ko: "소울 레전드", en: "Soul Legend", ja: "ソウルレジェンド", zh: "灵魂传奇", es: "Leyenda del Alma" }, minXp: 4300, maxXp: Infinity }
];

// XP rewards for various actions
const XP_REWARDS = {
  // Test completion
  test_complete: 50,
  daily_test_complete: 20,
  first_test_of_type: 100,
  compatibility_test: 60,
  life_summary_test: 50,
  age_calculator_test: 40,

  // Sharing
  share_result: 30,
  share_image_download: 10,
  friend_joined: 100,

  // Streak bonuses
  streak_bonus_3: 50,
  streak_bonus_7: 100,
  streak_bonus_14: 150,
  streak_bonus_30: 250,

  // Special
  profile_complete: 50,
  event_participation: 150,

  // Daily bonuses
  daily_login: 5,
  consecutive_day: 10
};

// Level unlock rewards
const LEVEL_REWARDS = {
  1: { type: 'none', description: { ko: '시작!', en: 'Start!' } },
  2: { type: 'feature', description: { ko: '프로필 커스터마이징 해금', en: 'Profile customization unlocked' } },
  3: { type: 'frame', description: { ko: '공유 프레임 "별빛" 해금', en: 'Share frame "Starlight" unlocked' }, frameId: 'starlight' },
  4: { type: 'feature', description: { ko: '상세 통계 보기 해금', en: 'Detailed stats unlocked' } },
  5: { type: 'badge', description: { ko: '뱃지 "성장중" 획득', en: 'Badge "Growing" earned' }, badgeId: 'level-5' },
  6: { type: 'frame', description: { ko: '공유 프레임 "오로라" 해금', en: 'Share frame "Aurora" unlocked' }, frameId: 'aurora' },
  7: { type: 'feature', description: { ko: '과거 기록 전체 보기 해금', en: 'Full history view unlocked' } },
  8: { type: 'frame', description: { ko: '공유 프레임 "골드" 해금', en: 'Share frame "Gold" unlocked' }, frameId: 'gold' },
  9: { type: 'title', description: { ko: '특별 칭호 "소울 그랜드마스터"', en: 'Special title "Soul Grandmaster"' } },
  10: { type: 'badge', description: { ko: '전설 뱃지 "소울 레전드" 획득', en: 'Legendary badge "Soul Legend" earned' }, badgeId: 'level-10' }
};

class LevelXPSystem {
  constructor() {
    this.levels = LEVELS;
    this.xpRewards = XP_REWARDS;
    this.levelRewards = LEVEL_REWARDS;
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXp) {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (totalXp >= this.levels[i].minXp) {
        return this.levels[i].level;
      }
    }
    return 1;
  }

  /**
   * Get level data
   */
  getLevelData(level) {
    return this.levels.find(l => l.level === level) || this.levels[0];
  }

  /**
   * Get level name in specified language
   */
  getLevelName(level, lang = 'ko') {
    const levelData = this.getLevelData(level);
    return levelData.name[lang] || levelData.name.en || levelData.name.ko;
  }

  /**
   * Calculate XP within current level
   */
  calculateCurrentLevelXp(totalXp) {
    const level = this.calculateLevel(totalXp);
    const levelData = this.getLevelData(level);
    return totalXp - levelData.minXp;
  }

  /**
   * Calculate XP needed for current level
   */
  getXpForCurrentLevel(level) {
    const levelData = this.getLevelData(level);
    const nextLevelData = this.getLevelData(level + 1);

    if (level >= 10) {
      return { current: 0, max: 0, percentage: 100 };
    }

    return {
      current: 0,
      max: nextLevelData.minXp - levelData.minXp,
      percentage: 0
    };
  }

  /**
   * Get XP progress for display
   */
  getXpProgress(totalXp) {
    const level = this.calculateLevel(totalXp);
    const levelData = this.getLevelData(level);
    const nextLevelData = this.getLevelData(level + 1);

    if (level >= 10) {
      return {
        level: 10,
        currentXp: totalXp - levelData.minXp,
        maxXp: 0,
        percentage: 100,
        isMaxLevel: true
      };
    }

    const currentLevelXp = totalXp - levelData.minXp;
    const xpNeeded = nextLevelData.minXp - levelData.minXp;
    const percentage = Math.min(100, Math.round((currentLevelXp / xpNeeded) * 100));

    return {
      level,
      currentXp: currentLevelXp,
      maxXp: xpNeeded,
      percentage,
      isMaxLevel: false,
      xpToNextLevel: xpNeeded - currentLevelXp
    };
  }

  /**
   * Get XP reward amount
   */
  getXpReward(action) {
    return this.xpRewards[action] || 0;
  }

  /**
   * Get level reward
   */
  getLevelReward(level) {
    return this.levelRewards[level] || null;
  }

  /**
   * Add XP and check for level up
   */
  addXp(currentTotalXp, amount, action = null) {
    const oldLevel = this.calculateLevel(currentTotalXp);
    const newTotalXp = currentTotalXp + amount;
    const newLevel = this.calculateLevel(newTotalXp);

    const result = {
      oldXp: currentTotalXp,
      newXp: newTotalXp,
      xpGained: amount,
      action,
      oldLevel,
      newLevel,
      leveledUp: newLevel > oldLevel,
      levelsGained: newLevel - oldLevel,
      rewards: []
    };

    // Collect rewards for any levels gained
    if (result.leveledUp) {
      for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
        const reward = this.getLevelReward(lvl);
        if (reward) {
          result.rewards.push({ level: lvl, ...reward });
        }
      }
    }

    return result;
  }

  /**
   * Calculate total XP from actions
   */
  calculateTotalXpFromActions(actions) {
    return actions.reduce((total, action) => {
      return total + (this.xpRewards[action] || 0);
    }, 0);
  }

  /**
   * Get XP breakdown by category
   */
  getXpBreakdown(userData) {
    const breakdown = {
      tests: 0,
      sharing: 0,
      streaks: 0,
      badges: 0,
      other: 0
    };

    // Calculate from test count
    const testCount = userData.gamification?.testCount || 0;
    breakdown.tests = testCount * this.xpRewards.test_complete;

    // Calculate from share count
    const shareCount = userData.gamification?.shareCount || 0;
    breakdown.sharing = shareCount * this.xpRewards.share_result;

    // Streak bonuses (approximate)
    const longestStreak = userData.gamification?.longestStreak || 0;
    if (longestStreak >= 3) breakdown.streaks += this.xpRewards.streak_bonus_3;
    if (longestStreak >= 7) breakdown.streaks += this.xpRewards.streak_bonus_7;
    if (longestStreak >= 14) breakdown.streaks += this.xpRewards.streak_bonus_14;
    if (longestStreak >= 30) breakdown.streaks += this.xpRewards.streak_bonus_30;

    // Badge XP
    if (typeof badgeSystem !== 'undefined') {
      const badges = userData.gamification?.badges || [];
      breakdown.badges = badgeSystem.calculateBadgeXp(badges);
    }

    return breakdown;
  }

  /**
   * Format XP for display
   */
  formatXp(xp, lang = 'ko') {
    if (xp >= 10000) {
      return lang === 'ko' ? `${(xp / 10000).toFixed(1)}만` : `${(xp / 1000).toFixed(1)}K`;
    }
    if (xp >= 1000) {
      return lang === 'ko' ? `${(xp / 1000).toFixed(1)}천` : `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toLocaleString();
  }

  /**
   * Get motivational message based on progress
   */
  getMotivationalMessage(progress, lang = 'ko') {
    const messages = {
      ko: {
        almostThere: '조금만 더!',
        halfWay: '절반 달성!',
        justStarted: '화이팅!',
        maxLevel: '최고 레벨 달성!'
      },
      en: {
        almostThere: 'Almost there!',
        halfWay: 'Halfway there!',
        justStarted: 'Keep going!',
        maxLevel: 'Max level reached!'
      }
    };

    const msg = messages[lang] || messages.en;

    if (progress.isMaxLevel) return msg.maxLevel;
    if (progress.percentage >= 80) return msg.almostThere;
    if (progress.percentage >= 50) return msg.halfWay;
    return msg.justStarted;
  }
}

// Global instance
const levelXPSystem = new LevelXPSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LevelXPSystem, levelXPSystem, LEVELS, XP_REWARDS, LEVEL_REWARDS };
}
