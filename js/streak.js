/**
 * Streak System
 * Manages user participation streaks and milestones
 */

// Streak milestones
const STREAK_MILESTONES = [
  { days: 3, badge: 'streak-3', xpBonus: 50, emoji: '🔥' },
  { days: 7, badge: 'streak-7', xpBonus: 100, emoji: '🔥🔥' },
  { days: 14, badge: 'streak-14', xpBonus: 150, emoji: '🔥🔥' },
  { days: 30, badge: 'streak-30', xpBonus: 250, emoji: '🔥🔥🔥' },
  { days: 60, badge: null, xpBonus: 400, emoji: '🔥🔥🔥🔥' },
  { days: 100, badge: null, xpBonus: 600, emoji: '🔥🔥🔥🔥🔥' }
];

class StreakSystem {
  constructor() {
    this.milestones = STREAK_MILESTONES;
    this.timezone = 'Asia/Seoul';
  }

  /**
   * Get today's date in KST (YYYY-MM-DD)
   */
  getTodayKST() {
    const now = new Date();
    const kstTime = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));
    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0');
    const day = String(kstTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get yesterday's date in KST
   */
  getYesterdayKST() {
    const now = new Date();
    const kstTime = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));
    kstTime.setDate(kstTime.getDate() - 1);
    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0');
    const day = String(kstTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calculate days between two dates
   */
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Update streak based on participation
   */
  updateStreak(streakData) {
    streakData = streakData || {}; // some result pages call without stored data
    const today = this.getTodayKST();
    const yesterday = this.getYesterdayKST();
    const lastDate = streakData.lastParticipationDate;

    const result = {
      previousStreak: streakData.currentStreak || 0,
      currentStreak: streakData.currentStreak || 0,
      longestStreak: streakData.longestStreak || 0,
      streakBroken: false,
      streakMaintained: false,
      streakStarted: false,
      newRecord: false,
      milestoneReached: null,
      xpBonus: 0
    };

    if (!lastDate) {
      // First ever participation
      result.currentStreak = 1;
      result.streakStarted = true;
    } else if (lastDate === today) {
      // Already participated today - no change
      return result;
    } else if (lastDate === yesterday) {
      // Participated yesterday - streak continues
      result.currentStreak = (streakData.currentStreak || 0) + 1;
      result.streakMaintained = true;
    } else {
      // Streak broken - reset
      result.currentStreak = 1;
      result.streakBroken = true;
      result.streakStarted = true;
    }

    // Check for new longest streak
    if (result.currentStreak > result.longestStreak) {
      result.longestStreak = result.currentStreak;
      result.newRecord = true;
    }

    // Check for milestone
    const milestone = this.checkMilestone(result.previousStreak, result.currentStreak);
    if (milestone) {
      result.milestoneReached = milestone;
      result.xpBonus = milestone.xpBonus;
    }

    return result;
  }

  /**
   * Check if a milestone was reached
   */
  checkMilestone(previousStreak, currentStreak) {
    for (const milestone of this.milestones) {
      if (previousStreak < milestone.days && currentStreak >= milestone.days) {
        return milestone;
      }
    }
    return null;
  }

  /**
   * Get next milestone
   */
  getNextMilestone(currentStreak) {
    for (const milestone of this.milestones) {
      if (currentStreak < milestone.days) {
        return {
          ...milestone,
          daysRemaining: milestone.days - currentStreak
        };
      }
    }
    return null;
  }

  /**
   * Get streak status message
   */
  getStreakStatus(streakData, lang = 'ko') {
    streakData = streakData || {}; // some result pages call without stored data
    const currentStreak = streakData.currentStreak || 0;
    const today = this.getTodayKST();
    const yesterday = this.getYesterdayKST();
    const lastDate = streakData.lastParticipationDate;

    const messages = {
      ko: {
        active: `🔥 ${currentStreak}일 연속 참여 중!`,
        atRisk: `⚠️ 오늘 참여하면 ${currentStreak + 1}일!`,
        broken: '😢 스트릭이 끊겼어요. 오늘부터 다시!',
        none: '첫 참여를 시작해보세요!',
        completedToday: `✅ 오늘 완료! ${currentStreak}일 연속`
      },
      en: {
        active: `🔥 ${currentStreak} day streak!`,
        atRisk: `⚠️ Participate today for ${currentStreak + 1} days!`,
        broken: '😢 Streak broken. Start again today!',
        none: 'Start your first streak!',
        completedToday: `✅ Done today! ${currentStreak} day streak`
      }
    };

    const msg = messages[lang] || messages.en;

    if (!lastDate) {
      return { status: 'none', message: msg.none };
    }

    if (lastDate === today) {
      return { status: 'completed', message: msg.completedToday };
    }

    if (lastDate === yesterday) {
      return { status: 'at_risk', message: msg.atRisk };
    }

    return { status: 'broken', message: msg.broken };
  }

  /**
   * Get week display data
   */
  getWeekDisplay(streakData) {
    streakData = streakData || {}; // some result pages call without stored data
    const today = new Date();
    const kstToday = new Date(today.toLocaleString('en-US', { timeZone: this.timezone }));
    const dayOfWeek = kstToday.getDay(); // 0 = Sunday

    const weekDays = [];
    const participationDates = streakData.history?.map(h => h.date) || [];
    const lastParticipation = streakData.lastParticipationDate;

    // Generate week starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(kstToday);
      const mondayOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
      date.setDate(date.getDate() + mondayOffset + i);

      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      weekDays.push({
        date: dateStr,
        dayName: ['일', '월', '화', '수', '목', '금', '토'][(date.getDay() + 6) % 7], // Mon first
        dayNameEn: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(date.getDay() + 6) % 7],
        participated: participationDates.includes(dateStr),
        isToday: dateStr === this.getTodayKST(),
        isFuture: date > kstToday
      });
    }

    return weekDays;
  }

  /**
   * Get streak emoji based on count
   */
  getStreakEmoji(streak) {
    if (streak >= 100) return '🔥🔥🔥🔥🔥';
    if (streak >= 60) return '🔥🔥🔥🔥';
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 1) return '🔥';
    return '○';
  }

  /**
   * Get streak color class
   */
  getStreakColorClass(streak) {
    if (streak >= 30) return 'streak-legendary';
    if (streak >= 14) return 'streak-epic';
    if (streak >= 7) return 'streak-rare';
    if (streak >= 3) return 'streak-common';
    return 'streak-none';
  }

  /**
   * Calculate streak freeze (future feature placeholder)
   */
  canUseStreakFreeze(streakData) {
    // Placeholder for streak freeze feature
    return {
      available: false,
      freezesRemaining: 0,
      message: { ko: '스트릭 보호 기능은 곧 출시됩니다!', en: 'Streak freeze coming soon!' }
    };
  }

  /**
   * Get streak history summary
   */
  getStreakHistory(streakData) {
    const history = streakData.streakHistory || [];
    return history.map(streak => ({
      start: streak.start,
      end: streak.end,
      length: streak.length,
      isCurrent: !streak.end || streak.end === this.getTodayKST()
    })).sort((a, b) => b.length - a.length);
  }

  /**
   * Archive current streak
   */
  archiveCurrentStreak(streakData) {
    if (!streakData.currentStreak || streakData.currentStreak < 1) return streakData;

    const history = streakData.streakHistory || [];
    const today = this.getTodayKST();

    // Calculate start date
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - streakData.currentStreak + 1);
    const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

    history.push({
      start: startDateStr,
      end: streakData.lastParticipationDate || today,
      length: streakData.currentStreak
    });

    return {
      ...streakData,
      streakHistory: history
    };
  }
}

// Global instance
const streakSystem = new StreakSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StreakSystem, streakSystem, STREAK_MILESTONES };
}
