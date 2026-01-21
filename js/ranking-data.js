/**
 * Ranking Data Management
 * Sample leaderboard data generation and management
 */

// Sample names for ranking (same as community)
const RANKING_NAMES = [
  '별빛여행자', '달빛소울', '햇살가득', '바람돌이', '구름위산책',
  '꿈꾸는나무', '숲속요정', '하늘정원', '무지개빛', '반짝별',
  '고양이사랑', '강아지맘', '행복나무', '따뜻한봄', '시원한바람',
  '별똥별', '은하수여행', '달콤한꿈', '푸른하늘', '노을빛',
  '초록이끼', '보라빛향기', '분홍구름', '하얀눈꽃', '빨간장미',
  '파도소리', '새벽이슬', '저녁노을', '아침햇살', '한밤의달',
  '소울탐험가', '테스트러버', '궁합매니아', '일일챌린저', '스트릭마스터',
  '호기심왕', '분석가', '감성파', '이성파', '직관형',
  '민트초코', '딸기우유', '바닐라빈', '카라멜맛', '레몬에이드',
  '봄바람', '여름태양', '가을단풍', '겨울눈꽃', '사계절',
  '새벽별', '한낮태양', '석양빛', '달빛아래', '별빛속',
  '산책러버', '요가마니아', '독서광', '음악가', '예술혼',
  '카페인생', '맛집탐험', '여행러', '캠핑족', '홈트매니아'
];

// Type distribution data (weekly)
const generateTypeDistribution = () => {
  const types = [
    'flame-fox', 'diamond-lion', 'ocean-bear', 'crystal-butterfly',
    'storm-eagle', 'moonlit-wolf', 'golden-phoenix', 'jade-turtle',
    'silver-swan', 'cosmic-owl', 'rainbow-dolphin', 'shadow-panther'
  ];

  // Generate random percentages that sum to 100
  let remaining = 100;
  const distribution = [];

  types.forEach((type, index) => {
    let percentage;
    if (index === types.length - 1) {
      percentage = remaining;
    } else {
      // Random between 5% and 15%
      percentage = Math.floor(Math.random() * 10) + 5;
      percentage = Math.min(percentage, remaining - (types.length - index - 1) * 5);
    }
    remaining -= percentage;
    distribution.push({
      type,
      percentage,
      count: Math.floor(percentage * 100) + Math.floor(Math.random() * 500)
    });
  });

  // Sort by percentage descending
  distribution.sort((a, b) => b.percentage - a.percentage);

  return distribution;
};

// Generate compatibility pairs
const generateCompatibilityPairs = (count = 10) => {
  const types = [
    'flame-fox', 'diamond-lion', 'ocean-bear', 'crystal-butterfly',
    'storm-eagle', 'moonlit-wolf', 'golden-phoenix', 'jade-turtle',
    'silver-swan', 'cosmic-owl', 'rainbow-dolphin', 'shadow-panther'
  ];

  const pairs = [];
  const usedPairs = new Set();

  while (pairs.length < count) {
    const type1 = types[Math.floor(Math.random() * types.length)];
    let type2 = types[Math.floor(Math.random() * types.length)];

    // Make sure we get different types
    while (type2 === type1) {
      type2 = types[Math.floor(Math.random() * types.length)];
    }

    // Create sorted pair key to avoid duplicates
    const pairKey = [type1, type2].sort().join('-');
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    pairs.push({
      type1,
      type2,
      score: Math.floor(Math.random() * 20) + 80, // 80-99%
      testCount: Math.floor(Math.random() * 1000) + 100
    });
  }

  // Sort by score descending
  pairs.sort((a, b) => b.score - a.score);

  return pairs;
};

// Generate level leaderboard
const generateLevelLeaderboard = (count = 100) => {
  const types = [
    'flame-fox', 'diamond-lion', 'ocean-bear', 'crystal-butterfly',
    'storm-eagle', 'moonlit-wolf', 'golden-phoenix', 'jade-turtle',
    'silver-swan', 'cosmic-owl', 'rainbow-dolphin', 'shadow-panther'
  ];

  const users = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    // Higher ranks have higher levels
    const maxLevel = Math.max(1, 10 - Math.floor(i / 15));
    const level = Math.floor(Math.random() * maxLevel) + (10 - maxLevel);

    users.push({
      id: `user_${i}`,
      name: RANKING_NAMES[i % RANKING_NAMES.length],
      type,
      level: Math.min(10, level),
      totalXp: (level * 500) + Math.floor(Math.random() * 500)
    });
  }

  // Sort by totalXp descending
  users.sort((a, b) => b.totalXp - a.totalXp);

  return users;
};

// Generate streak leaderboard
const generateStreakLeaderboard = (count = 100) => {
  const types = [
    'flame-fox', 'diamond-lion', 'ocean-bear', 'crystal-butterfly',
    'storm-eagle', 'moonlit-wolf', 'golden-phoenix', 'jade-turtle',
    'silver-swan', 'cosmic-owl', 'rainbow-dolphin', 'shadow-panther'
  ];

  const users = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    // Higher ranks have longer streaks
    const maxStreak = Math.max(1, 100 - i);
    const streak = Math.floor(Math.random() * maxStreak) + Math.max(1, 100 - i - 20);

    users.push({
      id: `user_${i}`,
      name: RANKING_NAMES[i % RANKING_NAMES.length],
      type,
      currentStreak: Math.max(1, streak),
      longestStreak: Math.max(1, streak + Math.floor(Math.random() * 10))
    });
  }

  // Sort by currentStreak descending
  users.sort((a, b) => b.currentStreak - a.currentStreak);

  return users;
};

// Ranking Data Manager
class RankingDataManager {
  constructor() {
    this.storageKey = 'smartaitest_ranking_cache';
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialize ranking data
   */
  initialize() {
    const cached = this.getCachedData();

    if (!cached || this.isCacheExpired(cached)) {
      const data = this.generateAllData();
      this.cacheData(data);
      return data;
    }

    return cached.data;
  }

  /**
   * Generate all ranking data
   */
  generateAllData() {
    return {
      typeDistribution: generateTypeDistribution(),
      compatibilityPairs: generateCompatibilityPairs(10),
      levelLeaderboard: generateLevelLeaderboard(100),
      streakLeaderboard: generateStreakLeaderboard(100),
      generatedAt: Date.now()
    };
  }

  /**
   * Get cached data
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('Failed to get ranking cache:', e);
      return null;
    }
  }

  /**
   * Cache data
   */
  cacheData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        data,
        cachedAt: Date.now()
      }));
    } catch (e) {
      console.error('Failed to cache ranking data:', e);
    }
  }

  /**
   * Check if cache is expired
   */
  isCacheExpired(cached) {
    return Date.now() - cached.cachedAt > this.cacheExpiry;
  }

  /**
   * Get type distribution
   */
  getTypeDistribution() {
    const data = this.initialize();
    return data.typeDistribution;
  }

  /**
   * Get compatibility pairs
   */
  getCompatibilityPairs() {
    const data = this.initialize();
    return data.compatibilityPairs;
  }

  /**
   * Get level leaderboard
   */
  getLevelLeaderboard(limit = 100) {
    const data = this.initialize();
    return data.levelLeaderboard.slice(0, limit);
  }

  /**
   * Get streak leaderboard
   */
  getStreakLeaderboard(limit = 100) {
    const data = this.initialize();
    return data.streakLeaderboard.slice(0, limit);
  }

  /**
   * Calculate user's rank in level leaderboard
   */
  getUserLevelRank(userTotalXp) {
    const leaderboard = this.getLevelLeaderboard(100);
    let rank = 1;

    for (const user of leaderboard) {
      if (userTotalXp >= user.totalXp) {
        break;
      }
      rank++;
    }

    // If user would be beyond top 100, estimate position
    if (rank > 100) {
      // Estimate based on XP
      rank = Math.floor((100 - userTotalXp / 50) + 100);
      rank = Math.max(101, rank);
    }

    return {
      rank,
      percentile: this.calculatePercentile(rank, 10000) // Assume 10000 total users
    };
  }

  /**
   * Calculate user's rank in streak leaderboard
   */
  getUserStreakRank(currentStreak) {
    const leaderboard = this.getStreakLeaderboard(100);
    let rank = 1;

    for (const user of leaderboard) {
      if (currentStreak >= user.currentStreak) {
        break;
      }
      rank++;
    }

    // If user would be beyond top 100, estimate position
    if (rank > 100) {
      rank = Math.floor((100 - currentStreak * 2) + 100);
      rank = Math.max(101, rank);
    }

    return {
      rank,
      percentile: this.calculatePercentile(rank, 10000)
    };
  }

  /**
   * Calculate percentile
   */
  calculatePercentile(rank, totalUsers) {
    const percentile = Math.round((1 - rank / totalUsers) * 100);
    return Math.max(1, Math.min(99, percentile));
  }

  /**
   * Insert user into leaderboard at appropriate position
   */
  insertUserIntoLeaderboard(leaderboard, userData, valueKey) {
    const userValue = userData[valueKey];
    let insertIndex = leaderboard.length;

    for (let i = 0; i < leaderboard.length; i++) {
      if (userValue >= leaderboard[i][valueKey]) {
        insertIndex = i;
        break;
      }
    }

    // Create user entry
    const userEntry = {
      id: 'current_user',
      name: userData.displayName || (userData.lang === 'ko' ? '나' : 'You'),
      type: userData.soulType || 'flame-fox',
      [valueKey]: userValue,
      isCurrentUser: true
    };

    // Insert user
    const result = [...leaderboard];
    result.splice(insertIndex, 0, userEntry);

    return {
      leaderboard: result,
      userRank: insertIndex + 1
    };
  }

  /**
   * Refresh data
   */
  refreshData() {
    localStorage.removeItem(this.storageKey);
    return this.initialize();
  }
}

// Global instance
const rankingData = new RankingDataManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RankingDataManager,
    rankingData,
    generateTypeDistribution,
    generateCompatibilityPairs,
    generateLevelLeaderboard,
    generateStreakLeaderboard
  };
}
