/**
 * Viral Link System
 * SmartAITest.com - Stage 3 Network Effect
 *
 * Features:
 * - Encode/decode birth date for URL parameters
 * - Generate shareable comparison links
 * - Pre-fill friend's data on landing
 * - Track referral conversions
 */

// Simple encoding/decoding for URL safety (not security, just obfuscation)
const ViralLinkManager = {
  /**
   * Encode birth date for URL (YYYYMMDD format -> base64-like)
   */
  encodeBirthDate(year, month, day) {
    const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    // Simple obfuscation: reverse + offset each digit
    const obfuscated = dateStr.split('').map((char, i) => {
      const num = parseInt(char);
      return String((num + 3 + i) % 10);
    }).reverse().join('');

    // Add a checksum digit
    const checksum = dateStr.split('').reduce((sum, char) => sum + parseInt(char), 0) % 10;
    return obfuscated + checksum;
  },

  /**
   * Decode birth date from URL parameter
   */
  decodeBirthDate(encoded) {
    if (!encoded || encoded.length !== 9) return null;

    try {
      // Remove checksum
      const obfuscated = encoded.slice(0, 8);

      // Reverse the obfuscation
      const dateStr = obfuscated.split('').reverse().map((char, i) => {
        const num = parseInt(char);
        return String((num - 3 - i + 20) % 10);
      }).join('');

      // Parse date components
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6));
      const day = parseInt(dateStr.substring(6, 8));

      // Validate
      if (year < 1900 || year > 2100) return null;
      if (month < 1 || month > 12) return null;
      if (day < 1 || day > 31) return null;

      return { year, month, day };
    } catch (e) {
      return null;
    }
  },

  /**
   * Encode name for URL (simple base64)
   */
  encodeName(name) {
    if (!name) return '';
    try {
      return btoa(encodeURIComponent(name));
    } catch (e) {
      return '';
    }
  },

  /**
   * Decode name from URL
   */
  decodeName(encoded) {
    if (!encoded) return '';
    try {
      return decodeURIComponent(atob(encoded));
    } catch (e) {
      return '';
    }
  },

  /**
   * Generate a viral comparison link
   */
  generateComparisonLink(userData, options = {}) {
    const {
      name = '',
      year,
      month,
      day,
      soulType = null
    } = userData;

    const baseUrl = options.baseUrl || 'https://smartaitest.com/compatibility/';
    const params = new URLSearchParams();

    // Add encoded birth date
    if (year && month && day) {
      params.set('ref_dob', this.encodeBirthDate(year, month, day));
    }

    // Add encoded name
    if (name) {
      params.set('ref_name', this.encodeName(name));
    }

    // Add soul type if available
    if (soulType) {
      params.set('ref_type', soulType);
    }

    // Add referral source
    params.set('ref_src', 'share');

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  /**
   * Parse URL for referral data
   */
  parseReferralFromURL() {
    const params = new URLSearchParams(window.location.search);

    const refDob = params.get('ref_dob');
    const refName = params.get('ref_name');
    const refType = params.get('ref_type');
    const refSrc = params.get('ref_src');

    if (!refDob) return null;

    const birthDate = this.decodeBirthDate(refDob);
    if (!birthDate) return null;

    return {
      name: this.decodeName(refName) || '',
      year: birthDate.year,
      month: birthDate.month,
      day: birthDate.day,
      soulType: refType || null,
      source: refSrc || 'unknown'
    };
  },

  /**
   * Check if current page has referral data
   */
  hasReferral() {
    const params = new URLSearchParams(window.location.search);
    return params.has('ref_dob');
  },

  /**
   * Track referral conversion (when friend completes the test)
   */
  trackConversion(originalData, newData) {
    // Could be sent to analytics
    if (typeof gtag === 'function') {
      gtag('event', 'viral_comparison', {
        'event_category': 'engagement',
        'event_label': 'comparison_completed',
        'value': 1
      });
    }

    // Store in localStorage for stats
    const conversions = JSON.parse(localStorage.getItem('viral_conversions') || '[]');
    conversions.push({
      timestamp: Date.now(),
      source: originalData.source || 'share'
    });
    localStorage.setItem('viral_conversions', JSON.stringify(conversions.slice(-100))); // Keep last 100
  }
};

/**
 * Comparison Landing UI Manager
 */
const ComparisonLandingManager = {
  referralData: null,
  lang: 'ko',

  /**
   * Initialize the comparison landing experience
   */
  initialize(lang = 'ko') {
    this.lang = lang;
    this.referralData = ViralLinkManager.parseReferralFromURL();

    if (this.referralData) {
      this.showReferralUI();
      return true;
    }
    return false;
  },

  /**
   * Get translations
   */
  t(key) {
    const texts = {
      ko: {
        friendInfo: '친구의 정보가 이미 입력되었어요!',
        friendBirthday: '친구의 생일',
        yourTurn: '이제 당신의 생일만 입력하면 궁합을 바로 확인할 수 있어요!',
        enterYourInfo: '당신의 정보를 입력하세요',
        checkCompatibility: '궁합 확인하기 💕',
        comparing: '와(과)의 궁합 확인',
        yourName: '당신의 이름',
        yourBirthday: '당신의 생일',
        skipName: '이름 건너뛰기',
        resultTitle: '두 분의 궁합 결과',
        shareResult: '이 결과를 친구에게 보내 반응 보기',
        shareResultDesc: '친구도 나와의 궁합을 확인하게 해보세요!',
        createMyLink: '나만의 궁합 링크 만들기',
        copied: '링크가 복사되었어요!'
      },
      en: {
        friendInfo: "Your friend's info is already entered!",
        friendBirthday: "Friend's Birthday",
        yourTurn: 'Just enter your birthday to see your compatibility instantly!',
        enterYourInfo: 'Enter your information',
        checkCompatibility: 'Check Compatibility 💕',
        comparing: 'Checking compatibility with',
        yourName: 'Your Name',
        yourBirthday: 'Your Birthday',
        skipName: 'Skip name',
        resultTitle: 'Your Compatibility Result',
        shareResult: 'Send this result to a friend',
        shareResultDesc: 'Let your friend check their compatibility with you!',
        createMyLink: 'Create my compatibility link',
        copied: 'Link copied!'
      },
      ja: {
        friendInfo: '友達の情報がすでに入力されています！',
        friendBirthday: '友達の誕生日',
        yourTurn: 'あなたの誕生日を入力するだけで相性がすぐに分かります！',
        enterYourInfo: 'あなたの情報を入力',
        checkCompatibility: '相性を確認 💕',
        comparing: 'との相性確認',
        yourName: 'あなたの名前',
        yourBirthday: 'あなたの誕生日',
        skipName: '名前をスキップ',
        resultTitle: 'お二人の相性結果',
        shareResult: 'この結果を友達に送って反応を見る',
        shareResultDesc: '友達にもあなたとの相性を確認してもらいましょう！',
        createMyLink: '自分の相性リンクを作成',
        copied: 'リンクがコピーされました！'
      },
      zh: {
        friendInfo: '朋友的信息已经输入了！',
        friendBirthday: '朋友的生日',
        yourTurn: '只需输入你的生日就能立即查看匹配度！',
        enterYourInfo: '输入你的信息',
        checkCompatibility: '查看匹配度 💕',
        comparing: '与的匹配度确认',
        yourName: '你的名字',
        yourBirthday: '你的生日',
        skipName: '跳过名字',
        resultTitle: '两位的匹配结果',
        shareResult: '把这个结果发给朋友看反应',
        shareResultDesc: '让朋友也确认与你的匹配度！',
        createMyLink: '创建我的匹配链接',
        copied: '链接已复制！'
      },
      es: {
        friendInfo: '¡La información de tu amigo ya está ingresada!',
        friendBirthday: 'Cumpleaños del amigo',
        yourTurn: '¡Solo ingresa tu cumpleaños para ver tu compatibilidad al instante!',
        enterYourInfo: 'Ingresa tu información',
        checkCompatibility: 'Ver Compatibilidad 💕',
        comparing: 'Verificando compatibilidad con',
        yourName: 'Tu nombre',
        yourBirthday: 'Tu cumpleaños',
        skipName: 'Saltar nombre',
        resultTitle: 'Resultado de compatibilidad',
        shareResult: 'Envía este resultado a un amigo',
        shareResultDesc: '¡Deja que tu amigo verifique su compatibilidad contigo!',
        createMyLink: 'Crear mi enlace de compatibilidad',
        copied: '¡Enlace copiado!'
      }
    };

    return texts[this.lang]?.[key] || texts.en[key] || key;
  },

  /**
   * Show the referral UI (friend's info pre-filled)
   */
  showReferralUI() {
    const ref = this.referralData;
    if (!ref) return;

    // Pre-fill Person A's data
    const yearA = document.getElementById('year-a');
    const monthA = document.getElementById('month-a');
    const dayA = document.getElementById('day-a');
    const nameA = document.getElementById('name-a');

    if (yearA) yearA.value = ref.year;
    if (monthA) monthA.value = ref.month;
    if (dayA) dayA.value = ref.day;
    if (nameA && ref.name) nameA.value = ref.name;

    // Disable Person A inputs
    [yearA, monthA, dayA, nameA].forEach(el => {
      if (el) {
        el.readOnly = true;
        el.classList.add('bg-gray-100', 'cursor-not-allowed', 'text-gray-600');
      }
    });

    // Add referral banner above the form
    this.addReferralBanner();

    // Focus on Person B's first input
    setTimeout(() => {
      const nameB = document.getElementById('name-b');
      if (nameB) nameB.focus();
    }, 500);
  },

  /**
   * Add referral banner to show friend's info is pre-filled
   */
  addReferralBanner() {
    const ref = this.referralData;
    if (!ref) return;

    const formContainer = document.querySelector('#compatibility-form');
    if (!formContainer) return;

    // Sanitize user input to prevent XSS
    const sanitize = (str) => {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    // Create banner with sanitized content
    const banner = document.createElement('div');
    banner.id = 'referral-banner';
    banner.className = 'mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-300/30';

    // Build DOM safely without innerHTML for user data
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex items-center gap-3 mb-2';
    const emoji = document.createElement('span');
    emoji.className = 'text-2xl';
    emoji.textContent = '🎉';
    const headerText = document.createElement('p');
    headerText.className = 'text-white font-semibold';
    headerText.textContent = this.t('friendInfo');
    headerDiv.appendChild(emoji);
    headerDiv.appendChild(headerText);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'flex items-center gap-2 text-white/80 text-sm';
    const userIcon = document.createElement('span');
    userIcon.textContent = '👤';
    const infoText = document.createElement('span');
    // Safely display user-provided name
    const safeName = sanitize(ref.name) || this.t('friendBirthday');
    infoText.textContent = `${safeName}: ${ref.year}.${ref.month}.${ref.day}`;
    infoDiv.appendChild(userIcon);
    infoDiv.appendChild(infoText);

    const turnText = document.createElement('p');
    turnText.className = 'mt-3 text-white/90 text-sm';
    turnText.textContent = this.t('yourTurn');

    banner.appendChild(headerDiv);
    banner.appendChild(infoDiv);
    banner.appendChild(turnText);

    // Insert at the beginning of the form
    formContainer.insertBefore(banner, formContainer.firstChild);

    // Update submit button text (safe - no user data)
    const submitBtn = formContainer.querySelector('button[type="submit"]');
    if (submitBtn) {
      const btnTextSpan = submitBtn.querySelector('span') || submitBtn;
      btnTextSpan.textContent = '💕 ' + this.t('checkCompatibility');
    }

    // Add visual highlight to Person B section
    const personBContainer = document.querySelector('[data-person="b"]') ||
                             document.getElementById('name-b')?.closest('.bg-white\\/10, .rounded-xl');
    if (personBContainer) {
      personBContainer.classList.add('ring-2', 'ring-pink-400/50', 'ring-offset-2', 'ring-offset-transparent');
    }
  },

  /**
   * Handle form submission with referral data
   */
  onFormSubmit(formData) {
    if (this.referralData) {
      ViralLinkManager.trackConversion(this.referralData, formData);
    }
  }
};

/**
 * Viral CTA Button Manager
 * Adds prominent share buttons after results
 */
const ViralCTAManager = {
  lang: 'ko',

  /**
   * Initialize
   */
  initialize(lang = 'ko') {
    this.lang = lang;
  },

  /**
   * Get translations
   */
  t(key) {
    const texts = {
      ko: {
        shareTitle: '🔥 이 결과를 친구에게 보내 반응 보기',
        shareDesc: '친구도 나와의 궁합을 확인하게 해보세요!',
        createLink: '내 궁합 링크 만들기',
        copyLink: '링크 복사',
        copied: '복사됨!',
        shareKakao: '카카오톡 공유',
        shareTwitter: '트위터 공유',
        shareMessage: '우리 궁합이 이렇게 나왔어! 너도 나랑 궁합 확인해볼래? 👉'
      },
      en: {
        shareTitle: '🔥 Send this result to a friend',
        shareDesc: 'Let your friend check their compatibility with you!',
        createLink: 'Create my compatibility link',
        copyLink: 'Copy link',
        copied: 'Copied!',
        shareKakao: 'Share on KakaoTalk',
        shareTwitter: 'Share on Twitter',
        shareMessage: 'Check out our compatibility! Want to see yours with me? 👉'
      },
      ja: {
        shareTitle: '🔥 この結果を友達に送って反応を見る',
        shareDesc: '友達にもあなたとの相性を確認してもらいましょう！',
        createLink: '自分の相性リンクを作成',
        copyLink: 'リンクをコピー',
        copied: 'コピーしました！',
        shareKakao: 'カカオトークで共有',
        shareTwitter: 'Twitterで共有',
        shareMessage: '私たちの相性がこうなったよ！あなたも私との相性を確認してみる？👉'
      },
      zh: {
        shareTitle: '🔥 把这个结果发给朋友看反应',
        shareDesc: '让朋友也确认与你的匹配度！',
        createLink: '创建我的匹配链接',
        copyLink: '复制链接',
        copied: '已复制！',
        shareKakao: '通过KakaoTalk分享',
        shareTwitter: '通过Twitter分享',
        shareMessage: '我们的匹配度是这样！你也想确认和我的匹配度吗？👉'
      },
      es: {
        shareTitle: '🔥 Envía este resultado a un amigo',
        shareDesc: '¡Deja que tu amigo verifique su compatibilidad contigo!',
        createLink: 'Crear mi enlace de compatibilidad',
        copyLink: 'Copiar enlace',
        copied: '¡Copiado!',
        shareKakao: 'Compartir en KakaoTalk',
        shareTwitter: 'Compartir en Twitter',
        shareMessage: '¡Mira nuestra compatibilidad! ¿Quieres ver la tuya conmigo? 👉'
      }
    };

    return texts[this.lang]?.[key] || texts.en[key] || key;
  },

  /**
   * Create viral CTA section for result page
   */
  /**
   * Escape HTML special characters to prevent XSS
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  createViralCTA(userData, containerId = 'viral-cta-container') {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const link = ViralLinkManager.generateComparisonLink(userData);
    // Escape the link to prevent XSS via attribute injection
    const safeLink = this.escapeHtml(link);

    // Use textContent for user-facing text, escaped values for attributes
    container.innerHTML = `
      <div class="viral-cta-section mt-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/40">
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-white mb-2"></h3>
          <p class="text-white/80 text-sm"></p>
        </div>

        <div class="flex flex-col gap-3">
          <!-- Copy Link Button -->
          <div class="relative">
            <input type="text" value="" readonly
                   class="w-full px-4 py-3 pr-24 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none"
                   id="viral-link-input">
            <button id="copy-viral-link"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-gray-800 rounded-md text-sm font-medium hover:bg-gray-100 transition">
            </button>
          </div>

          <!-- Share Buttons Row -->
          <div class="flex gap-2 justify-center mt-2">
            <button id="share-viral-kakao"
                    class="flex-1 max-w-[150px] py-3 px-4 bg-yellow-400 text-gray-900 rounded-lg font-medium text-sm hover:bg-yellow-300 transition flex items-center justify-center gap-2">
              <span>💬</span>
              <span>KakaoTalk</span>
            </button>
            <button id="share-viral-twitter"
                    class="flex-1 max-w-[150px] py-3 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <span>𝕏</span>
              <span>Twitter</span>
            </button>
            <button id="share-viral-native"
                    class="flex-1 max-w-[150px] py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition flex items-center justify-center gap-2">
              <span>📤</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        <!-- Animated Arrow -->
        <div class="mt-4 text-center animate-bounce">
          <span class="text-2xl">👆</span>
        </div>
      </div>
    `;

    // Set text content safely after DOM creation (prevents XSS)
    container.querySelector('h3').textContent = this.t('shareTitle');
    container.querySelector('p').textContent = this.t('shareDesc');
    container.querySelector('#viral-link-input').value = link;
    container.querySelector('#copy-viral-link').textContent = this.t('copyLink');

    // Attach event listeners
    this.attachEventListeners(link);

    return container;
  },

  /**
   * Attach event listeners to CTA buttons
   */
  attachEventListeners(link) {
    // Copy link button
    const copyBtn = document.getElementById('copy-viral-link');
    const linkInput = document.getElementById('viral-link-input');

    if (copyBtn && linkInput) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(link);
          copyBtn.textContent = this.t('copied');
          copyBtn.classList.add('bg-green-400', 'text-white');

          setTimeout(() => {
            copyBtn.textContent = this.t('copyLink');
            copyBtn.classList.remove('bg-green-400', 'text-white');
          }, 2000);
        } catch (err) {
          linkInput.select();
          document.execCommand('copy');
        }
      });
    }

    // Twitter share
    const twitterBtn = document.getElementById('share-viral-twitter');
    if (twitterBtn) {
      twitterBtn.addEventListener('click', () => {
        const text = encodeURIComponent(this.t('shareMessage'));
        const url = encodeURIComponent(link);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=450');
      });
    }

    // Native share
    const nativeBtn = document.getElementById('share-viral-native');
    if (nativeBtn) {
      nativeBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'AI 궁합 테스트',
              text: this.t('shareMessage'),
              url: link
            });
          } catch (err) {
            // User cancelled or error
          }
        } else {
          // Fallback to copy
          copyBtn?.click();
        }
      });
    }

    // KakaoTalk share (if Kakao SDK is available)
    const kakaoBtn = document.getElementById('share-viral-kakao');
    if (kakaoBtn) {
      kakaoBtn.addEventListener('click', () => {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: 'AI 궁합 테스트',
              description: this.t('shareMessage'),
              imageUrl: 'https://smartaitest.com/assets/images/compatibility-og.png',
              link: {
                mobileWebUrl: link,
                webUrl: link
              }
            },
            buttons: [
              {
                title: '궁합 확인하기',
                link: {
                  mobileWebUrl: link,
                  webUrl: link
                }
              }
            ]
          });
        } else {
          // Fallback: open kakao share URL
          window.open(`https://story.kakao.com/share?url=${encodeURIComponent(link)}`, '_blank');
        }
      });
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ViralLinkManager,
    ComparisonLandingManager,
    ViralCTAManager
  };
}
