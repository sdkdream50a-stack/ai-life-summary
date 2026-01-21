/**
 * Events System
 * Event configuration, detection, and homepage banner management
 */

// Seasonal Events Configuration
const SEASONAL_EVENTS = {
  "newyear-2026": {
    id: "newyear-2026",
    name: {
      ko: "새해 특별 이벤트",
      en: "New Year Special",
      ja: "新年特別イベント",
      zh: "新年特别活动",
      es: "Especial de Año Nuevo"
    },
    description: {
      ko: "2026년 새해를 맞아 특별한 테스트와 함께하세요!",
      en: "Celebrate 2026 with special tests and rewards!",
      ja: "2026年新年を特別なテストで迎えましょう！",
      zh: "与2026新年特别测试一起庆祝！",
      es: "Celebra 2026 con tests especiales y recompensas!"
    },
    startDate: "2026-01-01",
    endDate: "2026-01-07",
    emoji: "",
    gradient: "from-amber-400 to-orange-500",
    theme: {
      primary: "#f59e0b",
      secondary: "#fb923c"
    },
    badges: [],
    xpBonus: 2,
    specialTest: "new-year-fortune"
  },

  "valentine-2026": {
    id: "valentine-2026",
    name: {
      ko: "발렌타인 특별 이벤트",
      en: "Valentine's Special",
      ja: "バレンタイン特別イベント",
      zh: "情人节特别活动",
      es: "Especial de San Valentín"
    },
    description: {
      ko: "사랑하는 사람과 궁합을 확인해보세요! 특별 뱃지 획득 기회",
      en: "Check your compatibility with your loved one! Earn special badges",
      ja: "大切な人との相性をチェック！特別バッジ獲得チャンス",
      zh: "与你爱的人查看配对度！获取特别徽章",
      es: "Verifica tu compatibilidad! Gana insignias especiales"
    },
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    emoji: "",
    gradient: "from-pink-400 to-rose-500",
    theme: {
      primary: "#ec4899",
      secondary: "#fda4af"
    },
    badges: ["valentine-2026"],
    xpBonus: 1.5,
    specialTest: "valentine-compatibility"
  },

  "whiteday-2026": {
    id: "whiteday-2026",
    name: {
      ko: "화이트데이 이벤트",
      en: "White Day Event",
      ja: "ホワイトデーイベント",
      zh: "白色情人节活动",
      es: "Evento del Día Blanco"
    },
    description: {
      ko: "달콤한 화이트데이를 특별 테스트와 함께!",
      en: "Celebrate White Day with special tests!",
      ja: "ホワイトデーを特別テストで祝おう！",
      zh: "用特别测试庆祝白色情人节！",
      es: "Celebra el Día Blanco con tests especiales!"
    },
    startDate: "2026-03-01",
    endDate: "2026-03-14",
    emoji: "",
    gradient: "from-white to-pink-200",
    theme: {
      primary: "#fce7f3",
      secondary: "#fbcfe8"
    },
    badges: [],
    xpBonus: 1.5
  },

  "family-month-2026": {
    id: "family-month-2026",
    name: {
      ko: "가정의 달 이벤트",
      en: "Family Month Event",
      ja: "家族の月イベント",
      zh: "家庭月活动",
      es: "Evento del Mes de la Familia"
    },
    description: {
      ko: "가족과 함께 소울 타입을 알아보세요!",
      en: "Discover your family's soul types!",
      ja: "家族と一緒にソウルタイプを見つけよう！",
      zh: "与家人一起发现灵魂类型！",
      es: "Descubre los tipos de alma de tu familia!"
    },
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    emoji: "",
    gradient: "from-green-400 to-emerald-500",
    theme: {
      primary: "#10b981",
      secondary: "#34d399"
    },
    badges: [],
    xpBonus: 1.3
  },

  "summer-2026": {
    id: "summer-2026",
    name: {
      ko: "여름 특별 이벤트",
      en: "Summer Special",
      ja: "夏の特別イベント",
      zh: "夏季特别活动",
      es: "Especial de Verano"
    },
    description: {
      ko: "시원한 여름, 새로운 테스트와 함께!",
      en: "Cool summer with new special tests!",
      ja: "涼しい夏、新しいテストと一緒に！",
      zh: "凉爽的夏天，新的测试！",
      es: "Verano fresco con nuevos tests especiales!"
    },
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    emoji: "",
    gradient: "from-cyan-400 to-blue-500",
    theme: {
      primary: "#06b6d4",
      secondary: "#3b82f6"
    },
    badges: [],
    xpBonus: 1.5
  },

  "chuseok-2026": {
    id: "chuseok-2026",
    name: {
      ko: "추석 특별 이벤트",
      en: "Chuseok Festival",
      ja: "秋夕イベント",
      zh: "中秋节活动",
      es: "Festival de Chuseok"
    },
    description: {
      ko: "풍요로운 한가위, 가족과 함께 즐기는 특별 테스트!",
      en: "Celebrate Chuseok with family and special tests!",
      ja: "中秋を家族と特別テストで祝おう！",
      zh: "与家人一起庆祝中秋！",
      es: "Celebra Chuseok con familia y tests especiales!"
    },
    startDate: "2026-09-15",
    endDate: "2026-09-22",
    emoji: "",
    gradient: "from-yellow-400 to-orange-400",
    theme: {
      primary: "#eab308",
      secondary: "#fb923c"
    },
    badges: [],
    xpBonus: 2
  },

  "halloween-2026": {
    id: "halloween-2026",
    name: {
      ko: "할로윈 이벤트",
      en: "Halloween Event",
      ja: "ハロウィンイベント",
      zh: "万圣节活动",
      es: "Evento de Halloween"
    },
    description: {
      ko: "으스스한 할로윈! 당신의 숨겨진 소울 타입은?",
      en: "Spooky Halloween! Discover your hidden soul type!",
      ja: "不気味なハロウィン！隠されたソウルタイプは？",
      zh: "恐怖万圣节！发现你隐藏的灵魂类型！",
      es: "Halloween espeluznante! Descubre tu tipo de alma oculto!"
    },
    startDate: "2026-10-15",
    endDate: "2026-10-31",
    emoji: "",
    gradient: "from-orange-500 to-purple-600",
    theme: {
      primary: "#f97316",
      secondary: "#7c3aed"
    },
    badges: [],
    xpBonus: 1.5
  },

  "pepero-2026": {
    id: "pepero-2026",
    name: {
      ko: "빼빼로데이 이벤트",
      en: "Pepero Day Event",
      ja: "ペペロデーイベント",
      zh: "巧克力棒日活动",
      es: "Evento del Día Pepero"
    },
    description: {
      ko: "달콤한 빼빼로데이! 친구와 함께 궁합 테스트!",
      en: "Sweet Pepero Day! Test compatibility with friends!",
      ja: "甘いペペロデー！友達と相性テスト！",
      zh: "甜蜜的巧克力棒日！与朋友测试配对度！",
      es: "Dulce Día Pepero! Prueba la compatibilidad con amigos!"
    },
    startDate: "2026-11-01",
    endDate: "2026-11-11",
    emoji: "",
    gradient: "from-amber-500 to-red-500",
    theme: {
      primary: "#f59e0b",
      secondary: "#ef4444"
    },
    badges: [],
    xpBonus: 1.5
  },

  "yearend-2026": {
    id: "yearend-2026",
    name: {
      ko: "2026 연말결산",
      en: "2026 Year-End Review",
      ja: "2026年末総括",
      zh: "2026年终总结",
      es: "Resumen de Fin de Año 2026"
    },
    description: {
      ko: "한 해를 마무리하며 나의 소울 여정을 돌아보세요!",
      en: "Look back at your soul journey as the year ends!",
      ja: "一年を締めくくり、ソウルの旅を振り返ろう！",
      zh: "在年末回顾你的灵魂之旅！",
      es: "Mira hacia atrás en tu viaje del alma al final del año!"
    },
    startDate: "2026-12-01",
    endDate: "2027-01-31",
    emoji: "",
    gradient: "from-indigo-500 to-purple-600",
    theme: {
      primary: "#6366f1",
      secondary: "#9333ea"
    },
    badges: [],
    xpBonus: 2,
    specialFeature: "wrapped"
  }
};

// Events Manager
class EventsSystem {
  constructor() {
    this.events = SEASONAL_EVENTS;
    this.dismissedBannerKey = 'smartaitest_dismissed_event_banner';
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getToday() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Check if a date is within an event period
   */
  isWithinEventPeriod(event, date = null) {
    const checkDate = date || this.getToday();
    return checkDate >= event.startDate && checkDate <= event.endDate;
  }

  /**
   * Get currently active events
   */
  getActiveEvents() {
    const today = this.getToday();
    return Object.values(this.events).filter(event =>
      this.isWithinEventPeriod(event, today)
    );
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(limit = 5) {
    const today = this.getToday();
    return Object.values(this.events)
      .filter(event => event.startDate > today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit);
  }

  /**
   * Get past events
   */
  getPastEvents(limit = 5) {
    const today = this.getToday();
    return Object.values(this.events)
      .filter(event => event.endDate < today)
      .sort((a, b) => b.endDate.localeCompare(a.endDate))
      .slice(0, limit);
  }

  /**
   * Get all events sorted by date
   */
  getAllEventsSorted() {
    const today = this.getToday();

    return Object.values(this.events)
      .map(event => ({
        ...event,
        status: this.isWithinEventPeriod(event, today) ? 'active' :
                event.startDate > today ? 'upcoming' : 'ended'
      }))
      .sort((a, b) => {
        // Active first, then upcoming, then past
        const statusOrder = { active: 0, upcoming: 1, ended: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.startDate.localeCompare(b.startDate);
      });
  }

  /**
   * Get primary active event for homepage banner
   */
  getPrimaryEvent() {
    const activeEvents = this.getActiveEvents();
    if (activeEvents.length === 0) return null;

    // Return the one with the closest end date
    return activeEvents.sort((a, b) =>
      a.endDate.localeCompare(b.endDate)
    )[0];
  }

  /**
   * Check if homepage banner should be shown
   */
  shouldShowHomepageBanner() {
    const event = this.getPrimaryEvent();
    if (!event) return false;

    const dismissed = this.getDismissedBanners();
    return !dismissed.includes(event.id);
  }

  /**
   * Dismiss homepage banner
   */
  dismissHomepageBanner(eventId) {
    const dismissed = this.getDismissedBanners();
    if (!dismissed.includes(eventId)) {
      dismissed.push(eventId);
      localStorage.setItem(this.dismissedBannerKey, JSON.stringify(dismissed));
    }
  }

  /**
   * Get dismissed banners
   */
  getDismissedBanners() {
    try {
      const stored = localStorage.getItem(this.dismissedBannerKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear old dismissed banners
   */
  clearOldDismissedBanners() {
    const dismissed = this.getDismissedBanners();
    const activeIds = this.getActiveEvents().map(e => e.id);
    const upcomingIds = this.getUpcomingEvents().map(e => e.id);

    const validIds = dismissed.filter(id =>
      activeIds.includes(id) || upcomingIds.includes(id)
    );

    localStorage.setItem(this.dismissedBannerKey, JSON.stringify(validIds));
  }

  /**
   * Get event by ID
   */
  getEvent(eventId) {
    return this.events[eventId] || null;
  }

  /**
   * Get XP bonus multiplier for current events
   */
  getCurrentXpBonus() {
    const activeEvents = this.getActiveEvents();
    if (activeEvents.length === 0) return 1;

    // Return the highest bonus
    return Math.max(...activeEvents.map(e => e.xpBonus || 1));
  }

  /**
   * Get available event badges
   */
  getAvailableEventBadges() {
    const activeEvents = this.getActiveEvents();
    const badges = [];

    activeEvents.forEach(event => {
      if (event.badges && event.badges.length > 0) {
        badges.push(...event.badges);
      }
    });

    return badges;
  }

  /**
   * Calculate days remaining for an event
   */
  getDaysRemaining(event) {
    const today = new Date(this.getToday());
    const endDate = new Date(event.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Calculate days until event starts
   */
  getDaysUntilStart(event) {
    const today = new Date(this.getToday());
    const startDate = new Date(event.startDate);
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Format date range
   */
  formatDateRange(event, lang = 'ko') {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const options = { month: 'short', day: 'numeric' };

    if (lang === 'ko') {
      const start = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
      const end = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
      return `${start} ~ ${end}`;
    }

    const start = startDate.toLocaleDateString(lang, options);
    const end = endDate.toLocaleDateString(lang, options);
    return `${start} - ${end}`;
  }

  /**
   * Render homepage banner HTML
   */
  renderHomepageBanner(lang = 'ko') {
    const event = this.getPrimaryEvent();
    if (!event || !this.shouldShowHomepageBanner()) return '';

    const name = event.name[lang] || event.name.en;
    const daysRemaining = this.getDaysRemaining(event);
    const subtitle = lang === 'ko'
      ? `${daysRemaining}일 남음`
      : `${daysRemaining} days left`;

    return `
      <div class="homepage-event-banner"
           style="--event-primary: ${event.theme.primary}; --event-secondary: ${event.theme.secondary};"
           data-event-id="${event.id}"
           onclick="window.location.href='events/'">
        <button class="dismiss-btn" onclick="event.stopPropagation(); eventsSystem.dismissHomepageBanner('${event.id}'); this.parentElement.remove();">
          &times;
        </button>
        <span class="homepage-event-emoji">${event.emoji}</span>
        <div class="homepage-event-info">
          <div class="homepage-event-title">${name}</div>
          <div class="homepage-event-subtitle">${subtitle}</div>
        </div>
        <span class="homepage-event-arrow"></span>
      </div>
    `;
  }

  /**
   * Get events for a specific month (for calendar view)
   */
  getEventsForMonth(year, month) {
    const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const monthEnd = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`;

    return Object.values(this.events).filter(event =>
      (event.startDate >= monthStart && event.startDate < monthEnd) ||
      (event.endDate >= monthStart && event.endDate < monthEnd) ||
      (event.startDate < monthStart && event.endDate >= monthEnd)
    );
  }

  /**
   * Check if a specific date has an event
   */
  hasEventOnDate(date) {
    return Object.values(this.events).some(event =>
      date >= event.startDate && date <= event.endDate
    );
  }
}

// Global instance
const eventsSystem = new EventsSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EventsSystem, eventsSystem, SEASONAL_EVENTS };
}
