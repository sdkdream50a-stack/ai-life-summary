/**
 * Daily Test Logic
 * Handles question selection, participation tracking, and countdown
 */

class DailyTest {
  constructor() {
    this.storageKey = 'dailyTest';
    this.timezone = 'Asia/Seoul'; // KST
    this.resetHour = 0; // Reset at midnight KST
  }

  /**
   * Get current date in KST format (YYYY-MM-DD)
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
   * Get day index based on date for question rotation
   */
  getDayIndex(dateStr) {
    const startDate = new Date('2026-01-21'); // First day of questions
    const targetDate = new Date(dateStr);
    const diffTime = Math.abs(targetDate - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % DAILY_QUESTIONS.length;
  }

  /**
   * Get today's question
   */
  getTodayQuestion() {
    const today = this.getTodayKST();
    const dayIndex = this.getDayIndex(today);
    return DAILY_QUESTIONS[dayIndex];
  }

  /**
   * Get yesterday's question
   */
  getYesterdayQuestion() {
    const yesterday = this.getYesterdayKST();
    const dayIndex = this.getDayIndex(yesterday);
    return DAILY_QUESTIONS[dayIndex];
  }

  /**
   * Check if user has participated today
   */
  hasParticipatedToday() {
    const data = this.getData();
    const today = this.getTodayKST();
    return data.lastParticipation === today;
  }

  /**
   * Get user's today answer
   */
  getTodayAnswer() {
    const data = this.getData();
    const today = this.getTodayKST();
    if (data.lastParticipation === today) {
      return data.lastAnswer;
    }
    return null;
  }

  /**
   * Submit answer
   */
  submitAnswer(optionId) {
    const today = this.getTodayKST();
    const question = this.getTodayQuestion();
    const option = question.options.find(o => o.id === optionId);
    const resultType = question.resultTypes[optionId];

    const data = this.getData();

    // Update participation history
    if (!data.history) data.history = [];
    data.history.push({
      date: today,
      questionId: question.id,
      answerId: optionId,
      resultType: resultType.type
    });

    // Keep only last 30 days
    if (data.history.length > 30) {
      data.history = data.history.slice(-30);
    }

    // Update last participation
    data.lastParticipation = today;
    data.lastAnswer = optionId;
    data.totalParticipations = (data.totalParticipations || 0) + 1;

    // Update streak
    const yesterday = this.getYesterdayKST();
    if (data.lastParticipation === yesterday || data.streak === 0) {
      data.streak = (data.streak || 0) + 1;
    } else {
      data.streak = 1;
    }

    // Update max streak
    if (data.streak > (data.maxStreak || 0)) {
      data.maxStreak = data.streak;
    }

    this.saveData(data);

    return {
      option,
      resultType,
      streak: data.streak
    };
  }

  /**
   * Get time remaining until next question (in KST)
   */
  getTimeUntilNextQuestion() {
    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));

    // Next midnight KST
    const nextMidnight = new Date(kstNow);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    const diff = nextMidnight - kstNow;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, totalMs: diff };
  }

  /**
   * Get user's participation data
   */
  getData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {
        history: [],
        streak: 0,
        maxStreak: 0,
        totalParticipations: 0,
        lastParticipation: null,
        lastAnswer: null
      };
    } catch (e) {
      return {
        history: [],
        streak: 0,
        maxStreak: 0,
        totalParticipations: 0,
        lastParticipation: null,
        lastAnswer: null
      };
    }
  }

  /**
   * Save user's participation data
   */
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save daily test data:', e);
    }
  }

  /**
   * Get user stats
   */
  getUserStats() {
    const data = this.getData();
    return {
      streak: data.streak || 0,
      maxStreak: data.maxStreak || 0,
      totalParticipations: data.totalParticipations || 0,
      history: data.history || []
    };
  }

  /**
   * Get yesterday's results (for archive)
   */
  getYesterdayResults() {
    const data = this.getData();
    const yesterday = this.getYesterdayKST();

    const yesterdayEntry = data.history?.find(h => h.date === yesterday);
    if (!yesterdayEntry) return null;

    const question = this.getYesterdayQuestion();
    const option = question.options.find(o => o.id === yesterdayEntry.answerId);
    const resultType = question.resultTypes[yesterdayEntry.answerId];

    return {
      question,
      selectedOption: option,
      resultType
    };
  }

  /**
   * Get trait analysis based on history
   */
  getTraitAnalysis() {
    const data = this.getData();
    const history = data.history || [];

    if (history.length < 3) {
      return null; // Need at least 3 days for analysis
    }

    // Count trait occurrences
    const traitCounts = {};
    history.forEach(entry => {
      const question = DAILY_QUESTIONS.find(q => q.id === entry.questionId);
      if (question && entry.answerId) {
        const resultType = question.resultTypes[entry.answerId];
        if (resultType) {
          const trait = resultType.trait;
          traitCounts[trait] = (traitCounts[trait] || 0) + 1;
        }
      }
    });

    // Sort by count
    const sortedTraits = Object.entries(traitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      topTraits: sortedTraits.map(([trait, count]) => ({
        trait,
        count,
        percentage: Math.round((count / history.length) * 100)
      })),
      totalDays: history.length
    };
  }
}

// Global instance
const dailyTest = new DailyTest();

// Countdown timer class
class CountdownTimer {
  constructor(onUpdate, onComplete) {
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.intervalId = null;
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  update() {
    const remaining = dailyTest.getTimeUntilNextQuestion();

    if (remaining.totalMs <= 0) {
      this.stop();
      if (this.onComplete) this.onComplete();
      return;
    }

    if (this.onUpdate) {
      this.onUpdate(remaining);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyTest, CountdownTimer, dailyTest };
}
