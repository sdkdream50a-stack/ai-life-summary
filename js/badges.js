/**
 * Badge System
 * Defines all badges and handles badge acquisition logic
 */

const BADGES = {
  // === Starting Badges ===
  "first-test": {
    id: "first-test",
    name: { ko: "첫 발걸음", en: "First Step", ja: "最初の一歩", zh: "第一步", es: "Primer Paso" },
    description: {
      ko: "첫 번째 테스트 완료!",
      en: "Complete your first test!",
      ja: "最初のテストを完了！",
      zh: "完成第一个测试！",
      es: "Completa tu primer test!"
    },
    emoji: "🌟",
    icon: "star",
    condition: "complete_first_test",
    rarity: "common",
    xpReward: 50,
    category: "milestone"
  },

  // === Streak Badges ===
  "streak-3": {
    id: "streak-3",
    name: { ko: "3일 연속", en: "3-Day Streak", ja: "3日連続", zh: "连续3天", es: "Racha de 3 días" },
    description: {
      ko: "3일 연속 참여!",
      en: "Participate 3 days in a row!",
      ja: "3日連続参加！",
      zh: "连续参与3天！",
      es: "Participa 3 días seguidos!"
    },
    emoji: "🔥",
    icon: "flame",
    condition: "streak_3",
    rarity: "common",
    xpReward: 100,
    category: "streak"
  },
  "streak-7": {
    id: "streak-7",
    name: { ko: "일주일 연속", en: "Week Warrior", ja: "一週間戦士", zh: "一周勇士", es: "Guerrero Semanal" },
    description: {
      ko: "7일 연속 참여!",
      en: "Participate 7 days in a row!",
      ja: "7日連続参加！",
      zh: "连续参与7天！",
      es: "Participa 7 días seguidos!"
    },
    emoji: "🔥🔥",
    icon: "flame-double",
    condition: "streak_7",
    rarity: "uncommon",
    xpReward: 200,
    category: "streak"
  },
  "streak-14": {
    id: "streak-14",
    name: { ko: "2주 연속", en: "Fortnight Fighter", ja: "2週間ファイター", zh: "两周斗士", es: "Luchador Quincenal" },
    description: {
      ko: "14일 연속 참여!",
      en: "Participate 14 days in a row!",
      ja: "14日連続参加！",
      zh: "连续参与14天！",
      es: "Participa 14 días seguidos!"
    },
    emoji: "🔥🔥",
    icon: "flame-double",
    condition: "streak_14",
    rarity: "rare",
    xpReward: 300,
    category: "streak"
  },
  "streak-30": {
    id: "streak-30",
    name: { ko: "한 달 연속", en: "Monthly Master", ja: "月間マスター", zh: "月度大师", es: "Maestro Mensual" },
    description: {
      ko: "30일 연속 참여!",
      en: "Participate 30 days in a row!",
      ja: "30日連続参加！",
      zh: "连续参与30天！",
      es: "Participa 30 días seguidos!"
    },
    emoji: "🔥🔥🔥",
    icon: "flame-triple",
    condition: "streak_30",
    rarity: "epic",
    xpReward: 500,
    category: "streak"
  },

  // === Rare Type Badges ===
  "rare-type": {
    id: "rare-type",
    name: { ko: "희귀 소울", en: "Rare Soul", ja: "レアソウル", zh: "稀有灵魂", es: "Alma Rara" },
    description: {
      ko: "특별한 소울 타입 발견!",
      en: "Discover a special soul type!",
      ja: "特別なソウルタイプを発見！",
      zh: "发现特别的灵魂类型！",
      es: "¡Descubre un alma especial!"
    },
    emoji: "💎",
    icon: "diamond",
    condition: "get_rare_type",
    rarity: "rare",
    xpReward: 150,
    category: "achievement"
  },
  "legendary-type": {
    id: "legendary-type",
    name: { ko: "전설의 소울", en: "Legendary Soul", ja: "伝説のソウル", zh: "传奇灵魂", es: "Alma Legendaria" },
    description: {
      ko: "전설급 소울 타입 발견!",
      en: "Discover a legendary soul type!",
      ja: "伝説級のソウルタイプを発見！",
      zh: "发现传奇灵魂类型！",
      es: "¡Descubre un alma legendaria!"
    },
    emoji: "👑",
    icon: "crown",
    condition: "get_legendary_type",
    rarity: "legendary",
    xpReward: 300,
    category: "achievement"
  },

  // === Test Completion Badges ===
  "all-tests": {
    id: "all-tests",
    name: { ko: "완벽주의자", en: "Perfectionist", ja: "パーフェクショニスト", zh: "完美主义者", es: "Perfeccionista" },
    description: {
      ko: "모든 테스트 완료!",
      en: "Complete all tests!",
      ja: "すべてのテストを完了！",
      zh: "完成所有测试！",
      es: "Completa todos los tests!"
    },
    emoji: "🏆",
    icon: "trophy",
    condition: "complete_all_tests",
    rarity: "rare",
    xpReward: 250,
    category: "milestone"
  },
  "test-5": {
    id: "test-5",
    name: { ko: "테스트 러버", en: "Test Lover", ja: "テストラバー", zh: "测试爱好者", es: "Amante de Tests" },
    description: {
      ko: "테스트 5회 완료!",
      en: "Complete 5 tests!",
      ja: "テスト5回完了！",
      zh: "完成5次测试！",
      es: "Completa 5 tests!"
    },
    emoji: "📝",
    icon: "clipboard",
    condition: "test_count_5",
    rarity: "common",
    xpReward: 100,
    category: "milestone"
  },
  "test-20": {
    id: "test-20",
    name: { ko: "테스트 마니아", en: "Test Maniac", ja: "テストマニア", zh: "测试狂人", es: "Maniático de Tests" },
    description: {
      ko: "테스트 20회 완료!",
      en: "Complete 20 tests!",
      ja: "テスト20回完了！",
      zh: "完成20次测试！",
      es: "Completa 20 tests!"
    },
    emoji: "🎯",
    icon: "target",
    condition: "test_count_20",
    rarity: "uncommon",
    xpReward: 200,
    category: "milestone"
  },

  // === Share Badges ===
  "first-share": {
    id: "first-share",
    name: { ko: "나눔의 시작", en: "First Share", ja: "シェアの始まり", zh: "分享的开始", es: "Primera Compartida" },
    description: {
      ko: "첫 결과 공유!",
      en: "Share your first result!",
      ja: "最初の結果をシェア！",
      zh: "分享第一个结果！",
      es: "Comparte tu primer resultado!"
    },
    emoji: "📤",
    icon: "share",
    condition: "share_1",
    rarity: "common",
    xpReward: 30,
    category: "social"
  },
  "share-10": {
    id: "share-10",
    name: { ko: "소문내기 좋아", en: "Spreader", ja: "拡散者", zh: "传播者", es: "Difusor" },
    description: {
      ko: "결과 10회 공유!",
      en: "Share 10 results!",
      ja: "結果を10回シェア！",
      zh: "分享10次结果！",
      es: "Comparte 10 resultados!"
    },
    emoji: "📢",
    icon: "megaphone",
    condition: "share_10",
    rarity: "uncommon",
    xpReward: 100,
    category: "social"
  },
  "share-50": {
    id: "share-50",
    name: { ko: "공유왕", en: "Share King", ja: "シェア王", zh: "分享王", es: "Rey de Compartir" },
    description: {
      ko: "결과 50회 공유!",
      en: "Share 50 results!",
      ja: "結果を50回シェア！",
      zh: "分享50次结果！",
      es: "Comparte 50 resultados!"
    },
    emoji: "👑",
    icon: "crown",
    condition: "share_50",
    rarity: "rare",
    xpReward: 300,
    category: "social"
  },
  "share-100": {
    id: "share-100",
    name: { ko: "인플루언서", en: "Influencer", ja: "インフルエンサー", zh: "网红", es: "Influencer" },
    description: {
      ko: "결과 100회 공유!",
      en: "Share 100 results!",
      ja: "結果を100回シェア！",
      zh: "分享100次结果！",
      es: "Comparte 100 resultados!"
    },
    emoji: "⭐",
    icon: "star",
    condition: "share_100",
    rarity: "epic",
    xpReward: 500,
    category: "social"
  },

  // === Compatibility Test Badges ===
  "perfect-match": {
    id: "perfect-match",
    name: { ko: "운명의 짝", en: "Perfect Match", ja: "運命の相手", zh: "命中注定", es: "Pareja Perfecta" },
    description: {
      ko: "90% 이상 궁합 달성!",
      en: "Achieve 90%+ compatibility!",
      ja: "90%以上の相性達成！",
      zh: "达到90%以上的配对度！",
      es: "Logra 90%+ de compatibilidad!"
    },
    emoji: "💕",
    icon: "heart",
    condition: "compatibility_90",
    rarity: "rare",
    xpReward: 200,
    category: "achievement"
  },
  "compatibility-first": {
    id: "compatibility-first",
    name: { ko: "첫 궁합", en: "First Match", ja: "初めての相性", zh: "第一次配对", es: "Primer Match" },
    description: {
      ko: "첫 궁합 테스트 완료!",
      en: "Complete first compatibility test!",
      ja: "初めての相性テスト完了！",
      zh: "完成第一次配对测试！",
      es: "Completa tu primer test de compatibilidad!"
    },
    emoji: "💑",
    icon: "couple",
    condition: "first_compatibility",
    rarity: "common",
    xpReward: 50,
    category: "milestone"
  },

  // === Daily Test Badges ===
  "daily-first": {
    id: "daily-first",
    name: { ko: "일일 도전자", en: "Daily Challenger", ja: "デイリーチャレンジャー", zh: "每日挑战者", es: "Retador Diario" },
    description: {
      ko: "첫 일일 테스트 참여!",
      en: "Participate in your first daily test!",
      ja: "初めてのデイリーテストに参加！",
      zh: "参与第一次每日测试！",
      es: "Participa en tu primer test diario!"
    },
    emoji: "📅",
    icon: "calendar",
    condition: "complete_first_daily",
    rarity: "common",
    xpReward: 50,
    category: "daily"
  },
  "daily-top": {
    id: "daily-top",
    name: { ko: "오늘의 1등", en: "Today's #1", ja: "今日の1位", zh: "今日第一", es: "El #1 de Hoy" },
    description: {
      ko: "일일 테스트에서 다수파!",
      en: "Get the majority answer in daily test!",
      ja: "デイリーテストで多数派！",
      zh: "在每日测试中成为多数派！",
      es: "Obtén la respuesta mayoritaria!"
    },
    emoji: "🥇",
    icon: "medal",
    condition: "daily_majority",
    rarity: "uncommon",
    xpReward: 100,
    category: "daily"
  },
  "daily-rare": {
    id: "daily-rare",
    name: { ko: "희귀 답변", en: "Rare Answer", ja: "レア回答", zh: "稀有回答", es: "Respuesta Rara" },
    description: {
      ko: "일일 테스트에서 10% 미만 선택!",
      en: "Choose an answer picked by less than 10%!",
      ja: "10%未満の回答を選択！",
      zh: "选择少于10%的答案！",
      es: "Elige una respuesta de menos del 10%!"
    },
    emoji: "🦄",
    icon: "unicorn",
    condition: "daily_rare_answer",
    rarity: "rare",
    xpReward: 150,
    category: "daily"
  },

  // === Referral Badges ===
  "first-invite": {
    id: "first-invite",
    name: { ko: "첫 초대", en: "First Invite", ja: "初めての招待", zh: "第一次邀请", es: "Primera Invitación" },
    description: {
      ko: "첫 친구 초대 성공!",
      en: "Successfully invite your first friend!",
      ja: "最初の友達の招待成功！",
      zh: "成功邀请第一位朋友！",
      es: "Invita a tu primer amigo!"
    },
    emoji: "👋",
    icon: "wave",
    condition: "referral_1",
    rarity: "common",
    xpReward: 100,
    category: "social"
  },
  "invite-5": {
    id: "invite-5",
    name: { ko: "인기인", en: "Popular", ja: "人気者", zh: "人气王", es: "Popular" },
    description: {
      ko: "친구 5명 초대 성공!",
      en: "Successfully invite 5 friends!",
      ja: "友達5人の招待成功！",
      zh: "成功邀请5位朋友！",
      es: "Invita a 5 amigos!"
    },
    emoji: "🌟",
    icon: "star",
    condition: "referral_5",
    rarity: "uncommon",
    xpReward: 250,
    category: "social"
  },

  // === Level Badges ===
  "level-5": {
    id: "level-5",
    name: { ko: "성장중", en: "Growing", ja: "成長中", zh: "成长中", es: "Creciendo" },
    description: {
      ko: "레벨 5 달성!",
      en: "Reach level 5!",
      ja: "レベル5達成！",
      zh: "达到5级！",
      es: "Alcanza el nivel 5!"
    },
    emoji: "🌱",
    icon: "seedling",
    condition: "level_5",
    rarity: "common",
    xpReward: 100,
    category: "level"
  },
  "level-10": {
    id: "level-10",
    name: { ko: "소울 레전드", en: "Soul Legend", ja: "ソウルレジェンド", zh: "灵魂传奇", es: "Leyenda del Alma" },
    description: {
      ko: "최고 레벨 달성!",
      en: "Reach the highest level!",
      ja: "最高レベル達成！",
      zh: "达到最高等级！",
      es: "Alcanza el nivel máximo!"
    },
    emoji: "🏅",
    icon: "medal",
    condition: "level_10",
    rarity: "legendary",
    xpReward: 500,
    category: "level"
  },

  // === Special/Event Badges ===
  "valentine-2026": {
    id: "valentine-2026",
    name: { ko: "발렌타인 2026", en: "Valentine 2026", ja: "バレンタイン2026", zh: "情人节2026", es: "San Valentín 2026" },
    description: {
      ko: "2026년 발렌타인 이벤트 참여!",
      en: "Participate in Valentine 2026 event!",
      ja: "2026年バレンタインイベント参加！",
      zh: "参与2026年情人节活动！",
      es: "Participa en el evento de San Valentín 2026!"
    },
    emoji: "💝",
    icon: "gift-heart",
    condition: "event_valentine_2026",
    rarity: "limited",
    xpReward: 150,
    category: "event"
  },
  "early-adopter": {
    id: "early-adopter",
    name: { ko: "얼리어답터", en: "Early Adopter", ja: "アーリーアダプター", zh: "早期用户", es: "Adoptador Temprano" },
    description: {
      ko: "2026년 1월 가입!",
      en: "Joined in January 2026!",
      ja: "2026年1月に参加！",
      zh: "2026年1月加入！",
      es: "Te uniste en enero 2026!"
    },
    emoji: "🚀",
    icon: "rocket",
    condition: "joined_jan_2026",
    rarity: "limited",
    xpReward: 200,
    category: "event"
  }
};

// Badge rarity colors and styles
const RARITY_CONFIG = {
  common: {
    color: "#9ca3af",
    bgColor: "rgba(156, 163, 175, 0.1)",
    borderColor: "rgba(156, 163, 175, 0.3)",
    label: { ko: "일반", en: "Common", ja: "一般", zh: "普通", es: "Común" }
  },
  uncommon: {
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    label: { ko: "고급", en: "Uncommon", ja: "レア", zh: "稀有", es: "Poco común" }
  },
  rare: {
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    label: { ko: "희귀", en: "Rare", ja: "激レア", zh: "珍贵", es: "Raro" }
  },
  epic: {
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "rgba(168, 85, 247, 0.3)",
    label: { ko: "영웅", en: "Epic", ja: "エピック", zh: "史诗", es: "Épico" }
  },
  legendary: {
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    label: { ko: "전설", en: "Legendary", ja: "伝説", zh: "传奇", es: "Legendario" }
  },
  limited: {
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.1)",
    borderColor: "rgba(236, 72, 153, 0.3)",
    label: { ko: "한정", en: "Limited", ja: "限定", zh: "限定", es: "Limitado" }
  }
};

class BadgeSystem {
  constructor() {
    this.badges = BADGES;
    this.rarityConfig = RARITY_CONFIG;
  }

  /**
   * Get badge by ID
   */
  getBadge(badgeId) {
    return this.badges[badgeId] || null;
  }

  /**
   * Get all badges
   */
  getAllBadges() {
    return Object.values(this.badges);
  }

  /**
   * Get badges by category
   */
  getBadgesByCategory(category) {
    return Object.values(this.badges).filter(b => b.category === category);
  }

  /**
   * Get badges by rarity
   */
  getBadgesByRarity(rarity) {
    return Object.values(this.badges).filter(b => b.rarity === rarity);
  }

  /**
   * Get rarity config
   */
  getRarityConfig(rarity) {
    return this.rarityConfig[rarity] || this.rarityConfig.common;
  }

  /**
   * Check if user has badge
   */
  hasBadge(userBadges, badgeId) {
    return userBadges && userBadges.includes(badgeId);
  }

  /**
   * Get badge name in language
   */
  getBadgeName(badgeId, lang = 'ko') {
    const badge = this.getBadge(badgeId);
    if (!badge) return '';
    return badge.name[lang] || badge.name.en || badge.name.ko;
  }

  /**
   * Get badge description in language
   */
  getBadgeDescription(badgeId, lang = 'ko') {
    const badge = this.getBadge(badgeId);
    if (!badge) return '';
    return badge.description[lang] || badge.description.en || badge.description.ko;
  }

  /**
   * Check badge conditions and return newly earned badges
   */
  checkBadgeConditions(userData) {
    const newBadges = [];
    const userBadges = userData.gamification?.badges || [];

    // First test
    if (userData.gamification?.testCount >= 1 && !this.hasBadge(userBadges, "first-test")) {
      newBadges.push("first-test");
    }

    // Test count badges
    if (userData.gamification?.testCount >= 5 && !this.hasBadge(userBadges, "test-5")) {
      newBadges.push("test-5");
    }
    if (userData.gamification?.testCount >= 20 && !this.hasBadge(userBadges, "test-20")) {
      newBadges.push("test-20");
    }

    // Streak badges
    const streak = userData.gamification?.currentStreak || 0;
    if (streak >= 3 && !this.hasBadge(userBadges, "streak-3")) {
      newBadges.push("streak-3");
    }
    if (streak >= 7 && !this.hasBadge(userBadges, "streak-7")) {
      newBadges.push("streak-7");
    }
    if (streak >= 14 && !this.hasBadge(userBadges, "streak-14")) {
      newBadges.push("streak-14");
    }
    if (streak >= 30 && !this.hasBadge(userBadges, "streak-30")) {
      newBadges.push("streak-30");
    }

    // Share badges
    const shareCount = userData.gamification?.shareCount || 0;
    if (shareCount >= 1 && !this.hasBadge(userBadges, "first-share")) {
      newBadges.push("first-share");
    }
    if (shareCount >= 10 && !this.hasBadge(userBadges, "share-10")) {
      newBadges.push("share-10");
    }
    if (shareCount >= 50 && !this.hasBadge(userBadges, "share-50")) {
      newBadges.push("share-50");
    }
    if (shareCount >= 100 && !this.hasBadge(userBadges, "share-100")) {
      newBadges.push("share-100");
    }

    // Referral badges
    const referralCount = userData.gamification?.referralCount || 0;
    if (referralCount >= 1 && !this.hasBadge(userBadges, "first-invite")) {
      newBadges.push("first-invite");
    }
    if (referralCount >= 5 && !this.hasBadge(userBadges, "invite-5")) {
      newBadges.push("invite-5");
    }

    // Level badges
    const level = userData.gamification?.level || 1;
    if (level >= 5 && !this.hasBadge(userBadges, "level-5")) {
      newBadges.push("level-5");
    }
    if (level >= 10 && !this.hasBadge(userBadges, "level-10")) {
      newBadges.push("level-10");
    }

    // Daily test first
    if (userData.dailyHistory?.length >= 1 && !this.hasBadge(userBadges, "daily-first")) {
      newBadges.push("daily-first");
    }

    // Compatibility first
    const hasCompatibility = userData.testHistory?.some(t => t.testType === "compatibility");
    if (hasCompatibility && !this.hasBadge(userBadges, "compatibility-first")) {
      newBadges.push("compatibility-first");
    }

    // All tests completed
    const testTypes = new Set(userData.testHistory?.map(t => t.testType) || []);
    if (testTypes.has("life-summary") && testTypes.has("compatibility") && testTypes.has("age-calculator") && !this.hasBadge(userBadges, "all-tests")) {
      newBadges.push("all-tests");
    }

    // Early adopter (January 2026)
    const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
    if (createdAt && createdAt.getFullYear() === 2026 && createdAt.getMonth() === 0 && !this.hasBadge(userBadges, "early-adopter")) {
      newBadges.push("early-adopter");
    }

    return newBadges;
  }

  /**
   * Check for rare type badge
   */
  checkRareTypeBadge(soulType, userBadges) {
    const newBadges = [];
    const rarity = soulType?.rarity || 100;

    if (rarity <= 10 && !this.hasBadge(userBadges, "rare-type")) {
      newBadges.push("rare-type");
    }
    if (rarity <= 3 && !this.hasBadge(userBadges, "legendary-type")) {
      newBadges.push("legendary-type");
    }

    return newBadges;
  }

  /**
   * Check for compatibility badge
   */
  checkCompatibilityBadge(compatibilityScore, userBadges) {
    if (compatibilityScore >= 90 && !this.hasBadge(userBadges, "perfect-match")) {
      return ["perfect-match"];
    }
    return [];
  }

  /**
   * Check daily test badges
   */
  checkDailyBadges(answerPercentage, userBadges) {
    const newBadges = [];

    if (answerPercentage >= 40 && !this.hasBadge(userBadges, "daily-top")) {
      newBadges.push("daily-top");
    }
    if (answerPercentage < 10 && !this.hasBadge(userBadges, "daily-rare")) {
      newBadges.push("daily-rare");
    }

    return newBadges;
  }

  /**
   * Calculate total XP from badges
   */
  calculateBadgeXp(badgeIds) {
    return badgeIds.reduce((total, badgeId) => {
      const badge = this.getBadge(badgeId);
      return total + (badge?.xpReward || 0);
    }, 0);
  }

  /**
   * Get user's badge progress
   */
  getBadgeProgress(userData) {
    const userBadges = userData.gamification?.badges || [];
    const allBadges = this.getAllBadges();

    return {
      earned: userBadges.length,
      total: allBadges.length,
      percentage: Math.round((userBadges.length / allBadges.length) * 100)
    };
  }
}

// Global instance
const badgeSystem = new BadgeSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BadgeSystem, badgeSystem, BADGES, RARITY_CONFIG };
}
