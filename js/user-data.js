/**
 * User Data Management
 * Handles user data storage, retrieval, and sync (localStorage + optional Firebase)
 */

// Default user data structure
const DEFAULT_USER_DATA = {
  odbc: null,
  displayName: null,
  email: null,
  photoURL: null,
  createdAt: null,
  lastLoginAt: null,
  isGuest: true,

  // Test history
  testHistory: [],

  // Daily test history
  dailyHistory: [],

  // Gamification data
  gamification: {
    level: 1,
    xp: 0,
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastParticipationDate: null,
    badges: [],
    shareCount: 0,
    testCount: 0,
    referralCount: 0,
    referralCode: null,
    referredBy: null,
    streakHistory: []
  },

  // Preferences
  preferences: {
    language: 'ko',
    notifications: false,
    theme: 'auto'
  }
};

class UserDataManager {
  constructor() {
    this.storageKey = 'smartaitest_user';
    this.isFirebaseEnabled = false;
    this.firebaseUser = null;
    this.listeners = [];
  }

  /**
   * Initialize user data system
   */
  async initialize() {
    // Check for existing local data
    const localData = this.getLocalData();

    if (!localData) {
      // Create new guest user
      const newUser = this.createGuestUser();
      this.saveLocalData(newUser);
      return newUser;
    }

    return localData;
  }

  /**
   * Create a new guest user
   */
  createGuestUser() {
    const now = new Date().toISOString();
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

    return {
      ...DEFAULT_USER_DATA,
      odbc: guestId,
      createdAt: now,
      lastLoginAt: now,
      isGuest: true,
      gamification: {
        ...DEFAULT_USER_DATA.gamification,
        referralCode: this.generateReferralCode()
      }
    };
  }

  /**
   * Generate unique referral code
   */
  generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Get local data from localStorage
   */
  getLocalData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to get local user data:', e);
      return null;
    }
  }

  /**
   * Save data to localStorage
   */
  saveLocalData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.notifyListeners(data);
      return true;
    } catch (e) {
      console.error('Failed to save local user data:', e);
      return false;
    }
  }

  /**
   * Get current user data
   */
  getUserData() {
    return this.getLocalData() || this.createGuestUser();
  }

  /**
   * Update user data
   */
  updateUserData(updates) {
    const currentData = this.getUserData();
    const newData = this.deepMerge(currentData, updates);
    newData.lastLoginAt = new Date().toISOString();
    this.saveLocalData(newData);
    return newData;
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Add test to history
   * @param {string|object} testTypeOrEntry - Either a test type string or a full entry object
   * @param {object} result - Result data (optional if first param is an object)
   */
  addTestHistory(testTypeOrEntry, result) {
    const userData = this.getUserData();
    const now = new Date().toISOString();

    let testEntry;

    // Support both old signature (testType, result) and new signature (entryObject)
    if (typeof testTypeOrEntry === 'object') {
      testEntry = {
        date: now.split('T')[0],
        timestamp: testTypeOrEntry.timestamp || now,
        ...testTypeOrEntry
      };
    } else {
      testEntry = {
        testType: testTypeOrEntry,
        date: now.split('T')[0],
        timestamp: now,
        result
      };
    }

    userData.testHistory = userData.testHistory || [];
    userData.testHistory.push(testEntry);

    // Keep only last 100 tests
    if (userData.testHistory.length > 100) {
      userData.testHistory = userData.testHistory.slice(-100);
    }

    // Update test count
    userData.gamification = userData.gamification || {};
    userData.gamification.testCount = (userData.gamification.testCount || 0) + 1;

    this.saveLocalData(userData);

    return testEntry;
  }

  /**
   * Add daily test to history
   */
  addDailyHistory(questionId, answerId, resultType) {
    const userData = this.getUserData();
    const today = new Date().toISOString().split('T')[0];

    const dailyEntry = {
      date: today,
      questionId,
      answerId,
      resultType
    };

    userData.dailyHistory = userData.dailyHistory || [];

    // Check if already participated today
    const existingToday = userData.dailyHistory.find(d => d.date === today);
    if (existingToday) {
      return null; // Already participated
    }

    userData.dailyHistory.push(dailyEntry);

    // Keep only last 30 days
    if (userData.dailyHistory.length > 30) {
      userData.dailyHistory = userData.dailyHistory.slice(-30);
    }

    this.saveLocalData(userData);

    return dailyEntry;
  }

  /**
   * Update streak data
   */
  updateStreak(newStreakData) {
    const userData = this.getUserData();

    userData.gamification = userData.gamification || {};
    userData.gamification.currentStreak = newStreakData.currentStreak;
    userData.gamification.longestStreak = Math.max(
      userData.gamification.longestStreak || 0,
      newStreakData.longestStreak || newStreakData.currentStreak
    );
    userData.gamification.lastParticipationDate = newStreakData.lastParticipationDate || new Date().toISOString().split('T')[0];

    if (newStreakData.streakHistory) {
      userData.gamification.streakHistory = newStreakData.streakHistory;
    }

    this.saveLocalData(userData);

    return userData.gamification;
  }

  /**
   * Add XP
   */
  addXp(amount, reason = null) {
    const userData = this.getUserData();

    userData.gamification = userData.gamification || {};
    const oldTotalXp = userData.gamification.totalXp || 0;
    const newTotalXp = oldTotalXp + amount;

    userData.gamification.totalXp = newTotalXp;

    // Calculate new level if levelXPSystem is available
    if (typeof levelXPSystem !== 'undefined') {
      const oldLevel = userData.gamification.level || 1;
      const newLevel = levelXPSystem.calculateLevel(newTotalXp);
      userData.gamification.level = newLevel;

      const progress = levelXPSystem.getXpProgress(newTotalXp);
      userData.gamification.xp = progress.currentXp;

      this.saveLocalData(userData);

      return {
        oldXp: oldTotalXp,
        newXp: newTotalXp,
        xpGained: amount,
        reason,
        oldLevel,
        newLevel,
        leveledUp: newLevel > oldLevel
      };
    }

    this.saveLocalData(userData);

    return {
      oldXp: oldTotalXp,
      newXp: newTotalXp,
      xpGained: amount,
      reason
    };
  }

  /**
   * Add badge
   */
  addBadge(badgeId) {
    const userData = this.getUserData();

    userData.gamification = userData.gamification || {};
    userData.gamification.badges = userData.gamification.badges || [];

    if (!userData.gamification.badges.includes(badgeId)) {
      userData.gamification.badges.push(badgeId);
      this.saveLocalData(userData);
      return true;
    }

    return false;
  }

  /**
   * Add multiple badges
   */
  addBadges(badgeIds) {
    const userData = this.getUserData();
    userData.gamification = userData.gamification || {};
    userData.gamification.badges = userData.gamification.badges || [];

    const newBadges = [];
    for (const badgeId of badgeIds) {
      if (!userData.gamification.badges.includes(badgeId)) {
        userData.gamification.badges.push(badgeId);
        newBadges.push(badgeId);
      }
    }

    if (newBadges.length > 0) {
      this.saveLocalData(userData);
    }

    return newBadges;
  }

  /**
   * Increment share count
   */
  incrementShareCount() {
    const userData = this.getUserData();
    userData.gamification = userData.gamification || {};
    userData.gamification.shareCount = (userData.gamification.shareCount || 0) + 1;
    this.saveLocalData(userData);
    return userData.gamification.shareCount;
  }

  /**
   * Mark a result as already awarded XP
   * Prevents double-awarding for the same test result
   */
  markResultAwarded(resultKey) {
    const userData = this.getUserData();
    userData.gamification = userData.gamification || {};
    userData.gamification.awardedResults = userData.gamification.awardedResults || [];

    if (!userData.gamification.awardedResults.includes(resultKey)) {
      userData.gamification.awardedResults.push(resultKey);

      // Keep only last 500 entries to prevent unbounded growth
      if (userData.gamification.awardedResults.length > 500) {
        userData.gamification.awardedResults = userData.gamification.awardedResults.slice(-500);
      }

      this.saveLocalData(userData);
      return true;
    }
    return false;
  }

  /**
   * Check if a result was already awarded
   */
  isResultAwarded(resultKey) {
    const userData = this.getUserData();
    return userData.gamification?.awardedResults?.includes(resultKey) || false;
  }

  /**
   * Increment referral count
   */
  incrementReferralCount() {
    const userData = this.getUserData();
    userData.gamification = userData.gamification || {};
    userData.gamification.referralCount = (userData.gamification.referralCount || 0) + 1;
    this.saveLocalData(userData);
    return userData.gamification.referralCount;
  }

  /**
   * Set referred by code
   */
  setReferredBy(referralCode) {
    const userData = this.getUserData();
    if (!userData.gamification.referredBy) {
      userData.gamification.referredBy = referralCode;
      this.saveLocalData(userData);
      return true;
    }
    return false;
  }

  /**
   * Update display name
   */
  updateDisplayName(displayName) {
    const userData = this.getUserData();
    userData.displayName = displayName;
    this.saveLocalData(userData);
    return userData;
  }

  /**
   * Update preferences
   */
  updatePreferences(preferences) {
    const userData = this.getUserData();
    userData.preferences = { ...userData.preferences, ...preferences };
    this.saveLocalData(userData);
    return userData.preferences;
  }

  /**
   * Link guest account with auth provider (Firebase)
   */
  linkWithAuth(authUser) {
    const userData = this.getUserData();

    // Preserve guest data but update auth info
    userData.odbc = authUser.uid;
    userData.displayName = authUser.displayName || userData.displayName;
    userData.email = authUser.email;
    userData.photoURL = authUser.photoURL;
    userData.isGuest = false;
    userData.linkedAt = new Date().toISOString();

    this.saveLocalData(userData);
    this.firebaseUser = authUser;

    return userData;
  }

  /**
   * Sync with Firebase (if enabled)
   */
  async syncWithFirebase() {
    if (!this.isFirebaseEnabled || !this.firebaseUser) {
      return false;
    }

    // Placeholder for Firebase sync
    // In a real implementation, this would sync data to Firestore
    console.log('Firebase sync not implemented - using localStorage only');
    return false;
  }

  /**
   * Export user data
   */
  exportUserData() {
    const userData = this.getUserData();
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `smartaitest-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all user data
   */
  clearUserData() {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners(null);
  }

  /**
   * Add listener for data changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify listeners of data change
   */
  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error('Error in user data listener:', e);
      }
    });
  }

  /**
   * Get user stats summary
   */
  getStatsSummary() {
    const userData = this.getUserData();
    const gamification = userData.gamification || {};

    return {
      level: gamification.level || 1,
      totalXp: gamification.totalXp || 0,
      currentStreak: gamification.currentStreak || 0,
      longestStreak: gamification.longestStreak || 0,
      testCount: gamification.testCount || 0,
      shareCount: gamification.shareCount || 0,
      badgeCount: gamification.badges?.length || 0,
      totalBadges: typeof BADGES !== 'undefined' ? Object.keys(BADGES).length : 0,
      referralCount: gamification.referralCount || 0,
      isGuest: userData.isGuest !== false
    };
  }

  /**
   * Get most common soul type
   */
  getMostCommonType() {
    const userData = this.getUserData();
    const testHistory = userData.testHistory || [];

    const typeCounts = {};
    testHistory.forEach(test => {
      if (test.result?.soulType) {
        typeCounts[test.result.soulType] = (typeCounts[test.result.soulType] || 0) + 1;
      }
    });

    let maxType = null;
    let maxCount = 0;
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    });

    return maxType ? { type: maxType, count: maxCount } : null;
  }
}

// Global instance
const userDataManager = new UserDataManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserDataManager, userDataManager, DEFAULT_USER_DATA };
}
