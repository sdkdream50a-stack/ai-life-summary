/**
 * Daily Stats Management
 * Handles simulated real-time statistics for daily tests
 */

class DailyStats {
  constructor() {
    this.storageKey = 'dailyStats';
    this.baseParticipants = 1000; // Base daily participants
    this.peakHours = [9, 12, 18, 21]; // Peak participation hours
  }

  /**
   * Get simulated total participants for today
   * Based on time of day and randomness
   */
  getTodayParticipants() {
    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const hour = kstNow.getHours();
    const minute = kstNow.getMinutes();

    // Base calculation
    let participants = this.baseParticipants;

    // Add based on time passed (more as day goes on)
    const minutesPassed = hour * 60 + minute;
    participants += Math.floor(minutesPassed * 2.5); // ~3600 by end of day

    // Peak hour bonus
    if (this.peakHours.includes(hour)) {
      participants += Math.floor(Math.random() * 500) + 200;
    }

    // Random fluctuation
    participants += Math.floor(Math.random() * 100) - 50;

    // Day of week factor (weekends have more)
    const dayOfWeek = kstNow.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      participants = Math.floor(participants * 1.3);
    }

    return Math.max(participants, this.baseParticipants);
  }

  /**
   * Get simulated option distribution
   * Returns percentages for each option
   */
  getOptionDistribution(question, userAnswer = null) {
    const options = question.options;
    const distribution = {};

    // Generate base random distribution
    let remaining = 100;
    const optionIds = options.map(o => o.id);

    optionIds.forEach((id, index) => {
      if (index === optionIds.length - 1) {
        distribution[id] = remaining;
      } else {
        // Random but not too skewed
        const base = Math.floor(100 / optionIds.length);
        const variance = Math.floor(Math.random() * 15) - 7;
        let value = base + variance;
        value = Math.max(5, Math.min(value, remaining - (optionIds.length - index - 1) * 5));
        distribution[id] = value;
        remaining -= value;
      }
    });

    // If user answered, slightly boost their answer
    if (userAnswer && distribution[userAnswer]) {
      const boost = Math.floor(Math.random() * 3) + 1;
      const sourceKey = optionIds.find(id => id !== userAnswer && distribution[id] > 10);
      if (sourceKey) {
        distribution[userAnswer] += boost;
        distribution[sourceKey] -= boost;
      }
    }

    return distribution;
  }

  /**
   * Get count for each option based on distribution
   */
  getOptionCounts(question, totalParticipants, userAnswer = null) {
    const distribution = this.getOptionDistribution(question, userAnswer);
    const counts = {};

    question.options.forEach(option => {
      counts[option.id] = Math.floor((distribution[option.id] / 100) * totalParticipants);
    });

    return {
      total: totalParticipants,
      distribution,
      counts
    };
  }

  /**
   * Simulate live update (small increment)
   */
  simulateLiveUpdate(currentStats) {
    const newStats = { ...currentStats };
    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const hour = kstNow.getHours();

    // Add 1-5 new participants
    let newParticipants = Math.floor(Math.random() * 5) + 1;

    // More during peak hours
    if (this.peakHours.includes(hour)) {
      newParticipants += Math.floor(Math.random() * 3);
    }

    newStats.total += newParticipants;

    // Distribute new participants randomly
    const optionIds = Object.keys(newStats.counts);
    for (let i = 0; i < newParticipants; i++) {
      const randomOption = optionIds[Math.floor(Math.random() * optionIds.length)];
      newStats.counts[randomOption]++;
    }

    // Recalculate distribution
    optionIds.forEach(id => {
      newStats.distribution[id] = Math.round((newStats.counts[id] / newStats.total) * 100);
    });

    return newStats;
  }

  /**
   * Get trending trait for today
   */
  getTrendingTrait(question, stats) {
    let maxCount = 0;
    let trendingOption = null;

    Object.entries(stats.counts).forEach(([optionId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        trendingOption = optionId;
      }
    });

    if (trendingOption && question.resultTypes[trendingOption]) {
      return {
        optionId: trendingOption,
        ...question.resultTypes[trendingOption],
        percentage: stats.distribution[trendingOption]
      };
    }

    return null;
  }

  /**
   * Get user's ranking
   * Returns what percentage of users chose the same answer
   */
  getUserRanking(optionId, stats) {
    const percentage = stats.distribution[optionId] || 0;
    let message = '';

    if (percentage >= 40) {
      message = { ko: '다수파', en: 'Majority' };
    } else if (percentage >= 25) {
      message = { ko: '일반적', en: 'Common' };
    } else if (percentage >= 15) {
      message = { ko: '소수파', en: 'Minority' };
    } else {
      message = { ko: '희귀', en: 'Rare' };
    }

    return {
      percentage,
      count: stats.counts[optionId],
      total: stats.total,
      category: message
    };
  }

  /**
   * Format number with locale
   */
  formatNumber(num, lang = 'ko') {
    if (lang === 'ko') {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + '천';
      }
    }
    return num.toLocaleString();
  }

  /**
   * Get yesterday's final stats (simulated)
   */
  getYesterdayStats(question) {
    // Yesterday would have full day of participants
    const totalParticipants = this.baseParticipants + Math.floor(Math.random() * 1000) + 3000;
    return this.getOptionCounts(question, totalParticipants);
  }

  /**
   * Get stats message
   */
  getStatsMessage(stats, lang = 'ko') {
    const messages = {
      ko: {
        participants: '명 참여 중',
        updated: '실시간 업데이트'
      },
      en: {
        participants: 'participants',
        updated: 'Live update'
      },
      ja: {
        participants: '人が参加中',
        updated: 'リアルタイム更新'
      },
      zh: {
        participants: '人参与中',
        updated: '实时更新'
      },
      es: {
        participants: 'participantes',
        updated: 'Actualización en vivo'
      }
    };

    const msg = messages[lang] || messages.en;
    return {
      total: `${this.formatNumber(stats.total, lang)}${msg.participants}`,
      update: msg.updated
    };
  }
}

// Global instance
const dailyStats = new DailyStats();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyStats, dailyStats };
}
