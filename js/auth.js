/**
 * Authentication System
 * Handles user authentication via Firebase (Google, Kakao, Apple)
 * Falls back to guest mode if Firebase not configured
 */

// Firebase configuration placeholder
// Replace with actual config when setting up Firebase
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Auth providers
const AUTH_PROVIDERS = {
  google: {
    id: 'google',
    name: { ko: 'Google', en: 'Google', ja: 'Google', zh: 'Google', es: 'Google' },
    icon: 'google',
    color: '#4285F4',
    enabled: true
  },
  kakao: {
    id: 'kakao',
    name: { ko: '카카오', en: 'Kakao', ja: 'カカオ', zh: 'Kakao', es: 'Kakao' },
    icon: 'kakao',
    color: '#FEE500',
    textColor: '#000000',
    enabled: false // Enable when Kakao SDK configured
  },
  apple: {
    id: 'apple',
    name: { ko: 'Apple', en: 'Apple', ja: 'Apple', zh: 'Apple', es: 'Apple' },
    icon: 'apple',
    color: '#000000',
    enabled: false // Enable when Apple Sign-In configured
  }
};

class AuthSystem {
  constructor() {
    this.isInitialized = false;
    this.isFirebaseAvailable = false;
    this.currentUser = null;
    this.listeners = [];
    this.providers = AUTH_PROVIDERS;
  }

  /**
   * Initialize auth system
   */
  async initialize() {
    // Check if Firebase is available and configured
    if (typeof firebase !== 'undefined' && FIREBASE_CONFIG.apiKey) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.isFirebaseAvailable = true;
        this.setupAuthStateListener();
      } catch (e) {
        console.warn('Firebase initialization failed:', e);
        this.isFirebaseAvailable = false;
      }
    } else {
      console.log('Firebase not available - using guest mode only');
      this.isFirebaseAvailable = false;
    }

    this.isInitialized = true;
    return this.isFirebaseAvailable;
  }

  /**
   * Setup Firebase auth state listener
   */
  setupAuthStateListener() {
    if (!this.isFirebaseAvailable) return;

    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      this.notifyListeners(user);

      if (user) {
        // User signed in - link with local data
        if (typeof userDataManager !== 'undefined') {
          userDataManager.linkWithAuth(user);
        }
      }
    });
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    if (!this.isFirebaseAvailable) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await firebase.auth().signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with Kakao (placeholder)
   */
  async signInWithKakao() {
    // Kakao SDK integration placeholder
    return {
      success: false,
      error: 'Kakao login not configured'
    };
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple() {
    if (!this.isFirebaseAvailable) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const provider = new firebase.auth.OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const result = await firebase.auth().signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this.isFirebaseAvailable) {
      return { success: true };
    }

    try {
      await firebase.auth().signOut();
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Continue as guest
   */
  continueAsGuest() {
    if (typeof userDataManager !== 'undefined') {
      const guestUser = userDataManager.createGuestUser();
      userDataManager.saveLocalData(guestUser);
      return { success: true, isGuest: true };
    }
    return { success: true, isGuest: true };
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    if (this.isFirebaseAvailable && this.currentUser) {
      return true;
    }

    if (typeof userDataManager !== 'undefined') {
      const userData = userDataManager.getUserData();
      return userData && !userData.isGuest;
    }

    return false;
  }

  /**
   * Check if user is guest
   */
  isGuest() {
    if (typeof userDataManager !== 'undefined') {
      const userData = userDataManager.getUserData();
      return !userData || userData.isGuest !== false;
    }
    return true;
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    if (this.isFirebaseAvailable && this.currentUser) {
      return {
        uid: this.currentUser.uid,
        displayName: this.currentUser.displayName,
        email: this.currentUser.email,
        photoURL: this.currentUser.photoURL,
        isGuest: false,
        provider: this.currentUser.providerData[0]?.providerId
      };
    }

    if (typeof userDataManager !== 'undefined') {
      const userData = userDataManager.getUserData();
      return {
        uid: userData.odbc,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        isGuest: userData.isGuest !== false
      };
    }

    return null;
  }

  /**
   * Get available auth providers
   */
  getAvailableProviders() {
    return Object.values(this.providers).filter(p => p.enabled);
  }

  /**
   * Add auth state listener
   */
  addAuthListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove auth state listener
   */
  removeAuthListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify listeners of auth state change
   */
  notifyListeners(user) {
    this.listeners.forEach(callback => {
      try {
        callback(user);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  /**
   * Delete account (with confirmation)
   */
  async deleteAccount() {
    if (!this.isFirebaseAvailable || !this.currentUser) {
      // Just clear local data for guest users
      if (typeof userDataManager !== 'undefined') {
        userDataManager.clearUserData();
      }
      return { success: true };
    }

    try {
      // Delete Firestore data first (if implemented)
      // await firebase.firestore().collection('users').doc(this.currentUser.uid).delete();

      // Delete auth account
      await this.currentUser.delete();

      // Clear local data
      if (typeof userDataManager !== 'undefined') {
        userDataManager.clearUserData();
      }

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if Firebase is configured
   */
  isFirebaseConfigured() {
    return this.isFirebaseAvailable && !!FIREBASE_CONFIG.apiKey;
  }

  /**
   * Get login prompt messages
   */
  getLoginPromptMessages(lang = 'ko') {
    const messages = {
      ko: {
        title: '로그인 / 회원가입',
        subtitle: '기록을 저장하고 뱃지를 모아보세요!',
        googleBtn: 'Google로 계속하기',
        kakaoBtn: '카카오로 계속하기',
        appleBtn: 'Apple로 계속하기',
        guestBtn: '로그인 없이 계속하기',
        benefits: [
          '모든 기기에서 기록 동기화',
          '뱃지와 레벨 영구 저장',
          '친구 초대 보너스'
        ]
      },
      en: {
        title: 'Sign In / Sign Up',
        subtitle: 'Save your progress and collect badges!',
        googleBtn: 'Continue with Google',
        kakaoBtn: 'Continue with Kakao',
        appleBtn: 'Continue with Apple',
        guestBtn: 'Continue without signing in',
        benefits: [
          'Sync across all devices',
          'Permanent badge & level storage',
          'Friend referral bonuses'
        ]
      },
      ja: {
        title: 'ログイン / 新規登録',
        subtitle: '記録を保存してバッジを集めよう！',
        googleBtn: 'Googleで続ける',
        kakaoBtn: 'カカオで続ける',
        appleBtn: 'Appleで続ける',
        guestBtn: 'ログインせずに続ける',
        benefits: [
          'すべてのデバイスで同期',
          'バッジとレベルを永久保存',
          '友達招待ボーナス'
        ]
      },
      zh: {
        title: '登录 / 注册',
        subtitle: '保存记录并收集徽章！',
        googleBtn: '使用Google继续',
        kakaoBtn: '使用Kakao继续',
        appleBtn: '使用Apple继续',
        guestBtn: '不登录继续',
        benefits: [
          '所有设备同步',
          '永久保存徽章和等级',
          '好友邀请奖励'
        ]
      },
      es: {
        title: 'Iniciar sesión / Registrarse',
        subtitle: '¡Guarda tu progreso y colecciona insignias!',
        googleBtn: 'Continuar con Google',
        kakaoBtn: 'Continuar con Kakao',
        appleBtn: 'Continuar con Apple',
        guestBtn: 'Continuar sin iniciar sesión',
        benefits: [
          'Sincroniza en todos los dispositivos',
          'Almacenamiento permanente de insignias',
          'Bonos por invitar amigos'
        ]
      }
    };

    return messages[lang] || messages.en;
  }

  /**
   * Get login prompt trigger conditions
   */
  shouldShowLoginPrompt(userData) {
    if (!userData || !userData.isGuest) return false;

    const conditions = {
      // After first test
      firstTest: userData.gamification?.testCount === 1,
      // After 3 days
      threeDays: userData.gamification?.currentStreak >= 3 && !localStorage.getItem('loginPrompt3Days'),
      // After earning a badge
      newBadge: false // Set externally when badge earned
    };

    return conditions.firstTest || conditions.threeDays;
  }

  /**
   * Mark login prompt as shown
   */
  markLoginPromptShown(reason) {
    localStorage.setItem(`loginPrompt${reason}`, new Date().toISOString());
  }
}

// Global instance
const authSystem = new AuthSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthSystem, authSystem, AUTH_PROVIDERS, FIREBASE_CONFIG };
}
