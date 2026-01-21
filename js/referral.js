/**
 * Referral System
 * Handles friend invitation and tracking
 */

// Referral rewards
const REFERRAL_REWARDS = {
  referrer: {
    xp: 100,
    message: { ko: '친구 초대 보너스!', en: 'Friend referral bonus!' }
  },
  referred: {
    xp: 50,
    message: { ko: '초대 가입 보너스!', en: 'Welcome bonus!' }
  }
};

class ReferralSystem {
  constructor() {
    this.storageKey = 'smartaitest_referral';
    this.paramName = 'ref';
  }

  /**
   * Initialize referral system
   * Call on page load to check for referral code
   */
  initialize() {
    this.checkReferralParam();
  }

  /**
   * Check URL for referral parameter
   */
  checkReferralParam() {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get(this.paramName);

    if (refCode && this.isValidCode(refCode)) {
      this.storeReferralCode(refCode);
    }
  }

  /**
   * Validate referral code format
   */
  isValidCode(code) {
    // Code format: 6 alphanumeric characters (no confusing chars like 0/O, 1/I)
    return /^[A-HJ-NP-Z2-9]{6}$/.test(code);
  }

  /**
   * Store referral code temporarily
   */
  storeReferralCode(code) {
    try {
      const data = {
        code,
        timestamp: Date.now(),
        applied: false
      };
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to store referral code:', e);
    }
  }

  /**
   * Get stored referral code
   */
  getStoredReferralCode() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Expire after 24 hours
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(this.storageKey);
        return null;
      }

      return data.applied ? null : data.code;
    } catch (e) {
      return null;
    }
  }

  /**
   * Apply referral code when user completes first test
   */
  applyReferral() {
    const code = this.getStoredReferralCode();
    if (!code) return null;

    if (typeof userDataManager !== 'undefined') {
      const userData = userDataManager.getUserData();

      // Don't apply if user already has a referrer
      if (userData.gamification?.referredBy) {
        return null;
      }

      // Don't apply own code
      if (userData.gamification?.referralCode === code) {
        return null;
      }

      // Apply referral
      userDataManager.setReferredBy(code);

      // Give bonus XP to referred user
      userDataManager.addXp(REFERRAL_REWARDS.referred.xp, 'referral_bonus');

      // Mark as applied
      try {
        const data = JSON.parse(sessionStorage.getItem(this.storageKey));
        data.applied = true;
        sessionStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (e) {
        // Ignore
      }

      return {
        code,
        xpReward: REFERRAL_REWARDS.referred.xp
      };
    }

    return null;
  }

  /**
   * Get user's referral link
   */
  getReferralLink() {
    if (typeof userDataManager === 'undefined') {
      return null;
    }

    const userData = userDataManager.getUserData();
    const code = userData.gamification?.referralCode;

    if (!code) return null;

    const baseUrl = 'https://smartaitest.com';
    return `${baseUrl}/?${this.paramName}=${code}`;
  }

  /**
   * Get user's referral code
   */
  getReferralCode() {
    if (typeof userDataManager === 'undefined') {
      return null;
    }

    const userData = userDataManager.getUserData();
    return userData.gamification?.referralCode || null;
  }

  /**
   * Get referral stats
   */
  getReferralStats() {
    if (typeof userDataManager === 'undefined') {
      return { count: 0, xpEarned: 0 };
    }

    const userData = userDataManager.getUserData();
    const count = userData.gamification?.referralCount || 0;
    const xpEarned = count * REFERRAL_REWARDS.referrer.xp;

    return { count, xpEarned };
  }

  /**
   * Record successful referral (for referrer)
   * Called when a referred user completes their first test
   */
  recordReferralSuccess(referrerCode) {
    // This would typically be server-side
    // For now, we track locally if user is the referrer

    if (typeof userDataManager === 'undefined') {
      return false;
    }

    const userData = userDataManager.getUserData();
    if (userData.gamification?.referralCode === referrerCode) {
      userDataManager.incrementReferralCount();
      userDataManager.addXp(REFERRAL_REWARDS.referrer.xp, 'referral_success');

      // Show toast
      if (typeof gamificationUI !== 'undefined') {
        gamificationUI.showXpToast(REFERRAL_REWARDS.referrer.xp, 'friend_joined');
      }

      // Check for badges
      if (typeof badgeSystem !== 'undefined') {
        const newBadges = badgeSystem.checkBadgeConditions(userDataManager.getUserData());
        if (newBadges.length > 0) {
          userDataManager.addBadges(newBadges);
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Copy referral link to clipboard
   */
  async copyReferralLink() {
    const link = this.getReferralLink();
    if (!link) return false;

    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (e) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = link;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (err) {
        document.body.removeChild(textarea);
        return false;
      }
    }
  }

  /**
   * Share referral link via Web Share API
   */
  async shareReferralLink(lang = 'ko') {
    const link = this.getReferralLink();
    if (!link) return false;

    const messages = {
      ko: {
        title: 'AI Test Lab - 친구 초대',
        text: '재미있는 AI 테스트를 해봐요! 이 링크로 가입하면 보너스 XP를 받을 수 있어요 🎁'
      },
      en: {
        title: 'AI Test Lab - Invite Friends',
        text: 'Try these fun AI tests! Join with this link for bonus XP 🎁'
      }
    };

    const msg = messages[lang] || messages.en;

    if (navigator.share) {
      try {
        await navigator.share({
          title: msg.title,
          text: msg.text,
          url: link
        });
        return true;
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('Share failed:', e);
        }
        return false;
      }
    }

    // Fallback to copy
    return this.copyReferralLink();
  }

  /**
   * Share via specific platform
   */
  shareViaPlatform(platform, lang = 'ko') {
    const link = encodeURIComponent(this.getReferralLink() || '');
    const messages = {
      ko: '재미있는 AI 테스트를 해봐요! 🎁',
      en: 'Try these fun AI tests! 🎁'
    };
    const text = encodeURIComponent(messages[lang] || messages.en);

    const urls = {
      kakao: null, // Kakao requires SDK
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      line: `https://line.me/R/msg/text/?${text}%20${link}`,
      whatsapp: `https://wa.me/?text=${text}%20${link}`
    };

    const url = urls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    }

    return false;
  }

  /**
   * Get invite UI messages
   */
  getInviteMessages(lang = 'ko') {
    const messages = {
      ko: {
        title: '친구 초대하기',
        subtitle: '친구가 가입하면 100 XP!',
        linkLabel: '내 초대 링크:',
        copyBtn: '복사',
        copied: '복사됨!',
        shareBtn: '공유하기',
        inviteCount: '초대 현황',
        invited: '명 가입',
        xpEarned: 'XP 획득'
      },
      en: {
        title: 'Invite Friends',
        subtitle: 'Get 100 XP when friends join!',
        linkLabel: 'My invite link:',
        copyBtn: 'Copy',
        copied: 'Copied!',
        shareBtn: 'Share',
        inviteCount: 'Invite Status',
        invited: 'joined',
        xpEarned: 'XP earned'
      }
    };

    return messages[lang] || messages.en;
  }
}

// Global instance
const referralSystem = new ReferralSystem();

// Initialize on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    referralSystem.initialize();
  });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReferralSystem, referralSystem, REFERRAL_REWARDS };
}
