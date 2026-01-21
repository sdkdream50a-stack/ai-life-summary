/**
 * Wrapped Data Manager
 * Calculates user stats for year-end wrapped
 */

class WrappedDataManager {
  constructor() {
    this.userData = null;
    this.stats = null;
    this.lang = 'ko';
  }

  /**
   * Initialize with user data
   */
  initialize(lang = 'ko') {
    this.lang = lang;

    // Get user data
    if (typeof userDataManager !== 'undefined') {
      this.userData = userDataManager.getUserData();
    }

    // Calculate stats
    this.stats = this.calculateStats();

    return this.stats;
  }

  /**
   * Check if wrapped is available (Dec 1 - Jan 31)
   */
  isAvailable() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();

    // December (11) or January (0)
    return month === 11 || month === 0;
  }

  /**
   * Get current year for wrapped
   */
  getWrappedYear() {
    const now = new Date();
    // If January, show previous year's wrapped
    if (now.getMonth() === 0) {
      return now.getFullYear() - 1;
    }
    return now.getFullYear();
  }

  /**
   * Calculate all stats for wrapped
   */
  calculateStats() {
    if (!this.userData) {
      return this.getDefaultStats();
    }

    const year = this.getWrappedYear();
    const testHistory = this.userData.testHistory || [];
    const gamification = this.userData.gamification || {};
    const badges = this.userData.badges || [];

    // Filter tests from the wrapped year
    const yearTests = testHistory.filter(test => {
      if (!test.timestamp) return false;
      const testDate = new Date(test.timestamp);
      return testDate.getFullYear() === year;
    });

    // Calculate stats
    const totalTests = yearTests.length;
    const mostCommonType = this.getMostCommonType(yearTests);
    const bestStreak = gamification.bestStreak || gamification.currentStreak || 0;
    const bestCompatibility = this.getBestCompatibility(yearTests);
    const levelProgress = this.getLevelProgress(gamification);
    const earnedBadges = this.getEarnedBadges(badges, year);
    const totalXp = gamification.totalXp || 0;

    return {
      year,
      totalTests,
      mostCommonType,
      bestStreak,
      bestCompatibility,
      levelProgress,
      earnedBadges,
      totalXp,
      hasData: totalTests > 0
    };
  }

  /**
   * Get default stats for users without data
   */
  getDefaultStats() {
    return {
      year: this.getWrappedYear(),
      totalTests: 0,
      mostCommonType: null,
      bestStreak: 0,
      bestCompatibility: null,
      levelProgress: { start: 1, end: 1 },
      earnedBadges: [],
      totalXp: 0,
      hasData: false
    };
  }

  /**
   * Get most common soul type from tests
   */
  getMostCommonType(tests) {
    if (!tests || tests.length === 0) return null;

    const typeCounts = {};
    tests.forEach(test => {
      const type = test.result?.soulType;
      if (type) {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });

    if (Object.keys(typeCounts).length === 0) return null;

    const sortedTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1]);

    const topType = sortedTypes[0];
    const soulType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(topType[0])
      : null;

    return {
      id: topType[0],
      count: topType[1],
      percentage: Math.round((topType[1] / tests.length) * 100),
      name: soulType ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn) : topType[0],
      emoji: soulType?.emoji || '',
      traits: soulType?.traits || [],
      gradient: soulType?.gradient || 'from-gray-400 to-gray-600'
    };
  }

  /**
   * Get best compatibility result
   */
  getBestCompatibility(tests) {
    let bestScore = 0;
    let bestResult = null;

    tests.forEach(test => {
      if (test.type === 'compatibility' && test.result?.compatibilityScore) {
        if (test.result.compatibilityScore > bestScore) {
          bestScore = test.result.compatibilityScore;
          bestResult = test;
        }
      }
    });

    if (!bestResult) return null;

    const userType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(bestResult.result.userType || bestResult.result.soulType)
      : null;
    const partnerType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(bestResult.result.partnerType)
      : null;

    return {
      score: bestScore,
      user: {
        id: bestResult.result.userType || bestResult.result.soulType,
        name: userType ? (this.lang === 'ko' ? userType.nameKo : userType.nameEn) : '',
        emoji: userType?.emoji || ''
      },
      partner: {
        id: bestResult.result.partnerType,
        name: partnerType ? (this.lang === 'ko' ? partnerType.nameKo : partnerType.nameEn) : '',
        emoji: partnerType?.emoji || ''
      }
    };
  }

  /**
   * Get level progress for the year
   */
  getLevelProgress(gamification) {
    // For simplicity, we'll show current level
    // In a real app, you'd track level changes over time
    const currentLevel = gamification.level || 1;
    const startLevel = Math.max(1, currentLevel - Math.floor(Math.random() * 3) - 1);

    return {
      start: startLevel,
      end: currentLevel,
      currentXp: gamification.currentXp || 0,
      totalXp: gamification.totalXp || 0
    };
  }

  /**
   * Get badges earned this year
   */
  getEarnedBadges(badges, year) {
    if (!badges || badges.length === 0) return [];

    // Filter badges earned this year
    const yearBadges = badges.filter(badge => {
      if (!badge.earnedAt) return false;
      const earnedDate = new Date(badge.earnedAt);
      return earnedDate.getFullYear() === year;
    });

    // Get badge details
    return yearBadges.slice(0, 8).map(badge => {
      const badgeInfo = typeof BADGES !== 'undefined' ? BADGES[badge.id] : null;
      return {
        id: badge.id,
        name: badgeInfo ? (this.lang === 'ko' ? badgeInfo.name : badgeInfo.nameEn) : badge.id,
        emoji: badgeInfo?.emoji || '',
        earnedAt: badge.earnedAt
      };
    });
  }

  /**
   * Generate sample data for demo
   */
  generateSampleData() {
    const soulTypes = typeof SOUL_TYPES !== 'undefined' ? SOUL_TYPES : [];
    const randomType = soulTypes[Math.floor(Math.random() * soulTypes.length)];
    const partnerType = soulTypes[Math.floor(Math.random() * soulTypes.length)];

    return {
      year: this.getWrappedYear(),
      totalTests: Math.floor(Math.random() * 50) + 10,
      mostCommonType: randomType ? {
        id: randomType.id,
        count: Math.floor(Math.random() * 15) + 5,
        percentage: Math.floor(Math.random() * 40) + 30,
        name: this.lang === 'ko' ? randomType.nameKo : randomType.nameEn,
        emoji: randomType.emoji,
        traits: randomType.traits,
        gradient: randomType.gradient
      } : null,
      bestStreak: Math.floor(Math.random() * 30) + 7,
      bestCompatibility: randomType && partnerType ? {
        score: Math.floor(Math.random() * 20) + 80,
        user: {
          id: randomType.id,
          name: this.lang === 'ko' ? randomType.nameKo : randomType.nameEn,
          emoji: randomType.emoji
        },
        partner: {
          id: partnerType.id,
          name: this.lang === 'ko' ? partnerType.nameKo : partnerType.nameEn,
          emoji: partnerType.emoji
        }
      } : null,
      levelProgress: {
        start: Math.floor(Math.random() * 3) + 1,
        end: Math.floor(Math.random() * 5) + 4,
        currentXp: Math.floor(Math.random() * 500),
        totalXp: Math.floor(Math.random() * 5000) + 1000
      },
      earnedBadges: this.getSampleBadges(),
      totalXp: Math.floor(Math.random() * 5000) + 1000,
      hasData: true
    };
  }

  /**
   * Get sample badges for demo
   */
  getSampleBadges() {
    if (typeof BADGES === 'undefined') return [];

    const badgeIds = Object.keys(BADGES).slice(0, 8);
    return badgeIds.map(id => ({
      id,
      name: this.lang === 'ko' ? BADGES[id].name : BADGES[id].nameEn,
      emoji: BADGES[id].emoji
    }));
  }

  /**
   * Get stats (with sample fallback)
   */
  getStats() {
    if (this.stats && this.stats.hasData) {
      return this.stats;
    }

    // Return sample data for demo
    return this.generateSampleData();
  }
}

// Global instance
const wrappedDataManager = new WrappedDataManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WrappedDataManager, wrappedDataManager };
}
