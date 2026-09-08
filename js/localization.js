/**
 * Localization System for SmartAITest.com
 * Stage 4: Global Localization - Smart Share & Cultural Metaphors
 */

// ===== Smart Share Button Manager =====
// Reorders share buttons based on user's locale for maximum viral impact

const SmartShareManager = {
    // Share button configurations by locale priority
    LOCALE_SHARE_PRIORITY: {
        // Japanese - Twitter/X is dominant
        ja: ['twitter', 'line', 'copy', 'facebook', 'instagram'],
        // Chinese Traditional (Taiwan) - Twitter/X popular
        'zh-TW': ['twitter', 'facebook', 'copy', 'line', 'instagram'],
        // Chinese Simplified - WeChat would be ideal but not available, use copy
        zh: ['copy', 'weibo', 'twitter', 'facebook', 'instagram'],
        // Korean - Link copy first, then KakaoTalk
        ko: ['copy', 'kakao', 'twitter', 'facebook', 'instagram'],
        // Spanish - WhatsApp dominant in Latin America & Spain
        es: ['whatsapp', 'twitter', 'facebook', 'copy', 'instagram'],
        // Portuguese - WhatsApp dominant in Brazil
        pt: ['whatsapp', 'twitter', 'facebook', 'copy', 'instagram'],
        // Default (English and others) - Link copy + Facebook
        en: ['copy', 'facebook', 'twitter', 'whatsapp', 'instagram']
    },

    // Twitter/X hashtags by language
    TWITTER_HASHTAGS: {
        ko: '#AI테스트 #성격테스트 #궁합테스트',
        ja: '#AI診断 #性格診断 #相性テスト',
        zh: '#AI测试 #性格测试 #配对测试',
        'zh-TW': '#AI測試 #性格測試 #配對測試',
        en: '#AITest #PersonalityTest #CompatibilityTest',
        es: '#TestIA #TestPersonalidad #Compatibilidad'
    },

    // Tweet templates by language
    TWITTER_TEMPLATES: {
        ko: (score, type) => `나의 궁합 점수는 ${score}%! ${type} 유형이래요 🔮\n\n`,
        ja: (score, type) => `私の相性スコアは${score}%！${type}タイプだって 🔮\n\n`,
        zh: (score, type) => `我的配对分数是${score}%！${type}类型 🔮\n\n`,
        'zh-TW': (score, type) => `我的配對分數是${score}%！${type}類型 🔮\n\n`,
        en: (score, type) => `My compatibility score is ${score}%! I'm a ${type} type 🔮\n\n`,
        es: (score, type) => `¡Mi puntuación de compatibilidad es ${score}%! Soy tipo ${type} 🔮\n\n`
    },

    // WhatsApp message templates
    WHATSAPP_TEMPLATES: {
        ko: (score) => `나 궁합 테스트 해봤는데 ${score}% 나왔어! 너도 해봐 👉`,
        ja: (score) => `相性テストやってみたら${score}%だった！あなたもやってみて 👉`,
        zh: (score) => `我做了配对测试，得了${score}%！你也试试 👉`,
        en: (score) => `I got ${score}% on this compatibility test! Try it 👉`,
        es: (score) => `¡Saqué ${score}% en este test de compatibilidad! Pruébalo 👉`
    },

    /**
     * Get detected locale from browser
     */
    getLocale() {
        // Check saved preference first
        const saved = localStorage.getItem('ai-life-summary-lang');
        if (saved) return saved;

        // Check browser languages
        const browserLang = navigator.language || navigator.userLanguage;

        // Handle specific cases
        if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-Hant')) {
            return 'zh-TW';
        }

        return browserLang.split('-')[0].toLowerCase();
    },

    /**
     * Get share button priority for current locale
     */
    getSharePriority(locale) {
        locale = locale || this.getLocale();

        // Check for exact match first (e.g., zh-TW)
        if (this.LOCALE_SHARE_PRIORITY[locale]) {
            return this.LOCALE_SHARE_PRIORITY[locale];
        }

        // Fall back to base language
        const baseLang = locale.split('-')[0];
        return this.LOCALE_SHARE_PRIORITY[baseLang] || this.LOCALE_SHARE_PRIORITY.en;
    },

    /**
     * Reorder share buttons in a container based on locale
     */
    reorderShareButtons(containerId, locale) {
        const container = document.getElementById(containerId);
        if (!container) return;

        locale = locale || this.getLocale();
        const priority = this.getSharePriority(locale);

        // Find all share buttons
        const buttons = container.querySelectorAll('[data-share-type]');
        if (buttons.length === 0) return;

        // Create priority map
        const priorityMap = {};
        priority.forEach((type, index) => {
            priorityMap[type] = index;
        });

        // Sort buttons by priority
        const sortedButtons = Array.from(buttons).sort((a, b) => {
            const typeA = a.dataset.shareType;
            const typeB = b.dataset.shareType;
            const priorityA = priorityMap[typeA] !== undefined ? priorityMap[typeA] : 999;
            const priorityB = priorityMap[typeB] !== undefined ? priorityMap[typeB] : 999;
            return priorityA - priorityB;
        });

        // Reinsert in sorted order
        sortedButtons.forEach(btn => container.appendChild(btn));

        // Highlight primary button
        if (sortedButtons[0]) {
            sortedButtons[0].classList.add('smart-share-primary');
        }
    },

    /**
     * Generate Twitter share URL with locale-specific content
     */
    generateTwitterShareUrl(options = {}) {
        const locale = options.locale || this.getLocale();
        const baseLang = locale.split('-')[0];
        const score = options.score || '??';
        const type = options.type || '';
        const url = options.url || window.location.href;

        // Get template and hashtags
        const template = this.TWITTER_TEMPLATES[locale] || this.TWITTER_TEMPLATES[baseLang] || this.TWITTER_TEMPLATES.en;
        const hashtags = this.TWITTER_HASHTAGS[locale] || this.TWITTER_HASHTAGS[baseLang] || this.TWITTER_HASHTAGS.en;

        const text = template(score, type) + hashtags;

        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    },

    /**
     * Generate WhatsApp share URL with locale-specific message
     */
    generateWhatsAppShareUrl(options = {}) {
        const locale = options.locale || this.getLocale();
        const baseLang = locale.split('-')[0];
        const score = options.score || '??';
        const url = options.url || window.location.href;

        const template = this.WHATSAPP_TEMPLATES[baseLang] || this.WHATSAPP_TEMPLATES.en;
        const text = template(score) + ' ' + url;

        return `https://wa.me/?text=${encodeURIComponent(text)}`;
    },

    /**
     * Create smart share buttons HTML
     */
    createSmartShareButtons(options = {}) {
        const locale = options.locale || this.getLocale();
        const score = options.score || '';
        const type = options.type || '';
        const url = options.url || window.location.href;

        const priority = this.getSharePriority(locale);

        const buttonConfigs = {
            twitter: {
                icon: '𝕏',
                label: { ko: '트위터', ja: 'ツイート', zh: '推特', en: 'Tweet', es: 'Tuitear' },
                class: 'bg-black text-white hover:bg-gray-800',
                onclick: () => window.open(this.generateTwitterShareUrl({ locale, score, type, url }), '_blank')
            },
            whatsapp: {
                icon: '💬',
                label: { ko: 'WhatsApp', ja: 'WhatsApp', zh: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp' },
                class: 'bg-green-500 text-white hover:bg-green-600',
                onclick: () => window.open(this.generateWhatsAppShareUrl({ locale, score, url }), '_blank')
            },
            kakao: {
                icon: '💛',
                label: { ko: '카카오톡', ja: 'カカオ', zh: 'KakaoTalk', en: 'KakaoTalk', es: 'KakaoTalk' },
                class: 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
                onclick: () => typeof shareToKakao === 'function' && shareToKakao()
            },
            line: {
                icon: '🟢',
                label: { ko: 'LINE', ja: 'LINE', zh: 'LINE', en: 'LINE', es: 'LINE' },
                class: 'bg-green-400 text-white hover:bg-green-500',
                onclick: () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank')
            },
            facebook: {
                icon: '📘',
                label: { ko: 'Facebook', ja: 'Facebook', zh: 'Facebook', en: 'Facebook', es: 'Facebook' },
                class: 'bg-blue-600 text-white hover:bg-blue-700',
                onclick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
            },
            copy: {
                icon: '🔗',
                label: { ko: '링크 복사', ja: 'リンクコピー', zh: '复制链接', en: 'Copy Link', es: 'Copiar' },
                class: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
                onclick: () => typeof copyResultLink === 'function' && copyResultLink()
            },
            instagram: {
                icon: '📷',
                label: { ko: 'Instagram', ja: 'Instagram', zh: 'Instagram', en: 'Instagram', es: 'Instagram' },
                class: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90',
                onclick: () => typeof shareToInstagram === 'function' && shareToInstagram()
            }
        };

        const baseLang = locale.split('-')[0];

        // Store options for later use in click handler
        this._currentOptions = { locale, score, type: options.type, url };

        return priority.map((type, index) => {
            const config = buttonConfigs[type];
            if (!config) return '';

            const label = config.label[baseLang] || config.label.en;
            // All buttons same size for consistent appearance
            const sizeClass = 'px-4 py-2.5 text-sm font-semibold';

            return `
                <button
                    data-share-type="${type}"
                    data-locale="${locale}"
                    data-score="${score || ''}"
                    data-result-type="${options.type || ''}"
                    data-url="${url}"
                    onclick="SmartShareManager.handleShareClick(this)"
                    class="${config.class} ${sizeClass} rounded-lg transition flex items-center justify-center space-x-2"
                >
                    <span>${config.icon}</span>
                    <span>${label}</span>
                </button>
            `;
        }).join('');
    },

    /**
     * Handle share button click from data attributes
     */
    handleShareClick(button) {
        const type = button.dataset.shareType;
        const options = {
            locale: button.dataset.locale,
            score: button.dataset.score,
            type: button.dataset.resultType,
            url: button.dataset.url || window.location.href
        };
        this.handleShare(type, options);
    },

    /**
     * Handle share button click
     */
    handleShare(type, options) {
        const url = options.url || window.location.href;

        switch(type) {
            case 'twitter':
                window.open(this.generateTwitterShareUrl(options), '_blank', 'width=600,height=400');
                break;
            case 'whatsapp':
                window.open(this.generateWhatsAppShareUrl(options), '_blank');
                break;
            case 'kakao':
                if (typeof shareToKakao === 'function') shareToKakao();
                break;
            case 'line':
                window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                break;
            case 'copy':
                if (typeof copyResultLink === 'function') copyResultLink();
                break;
            case 'instagram':
                if (typeof shareToInstagram === 'function') shareToInstagram();
                break;
        }

        // Track share event
        if (typeof gtag === 'function') {
            gtag('event', 'share', { method: type, content_type: 'result' });
        }
    },

    /**
     * Initialize smart share for a container
     */
    init(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.createSmartShareButtons(options);
    }
};


// ===== Cultural Metaphor Manager =====
// Generates culture-specific personality descriptions

const CulturalMetaphorManager = {
    // MBTI-style descriptions for East Asian audiences (KO, JA, ZH)
    MBTI_METAPHORS: {
        high_intuition: {
            ko: 'INFP형의 직감력을 가진 당신',
            ja: 'INFPタイプの直感力を持つあなた',
            zh: '具有INFP型直觉力的你'
        },
        high_logic: {
            ko: 'INTJ형의 분석력이 빛나는 타입',
            ja: 'INTJタイプの分析力が光るタイプ',
            zh: 'INTJ型分析力突出的类型'
        },
        high_empathy: {
            ko: 'ENFJ형처럼 공감 능력이 뛰어난',
            ja: 'ENFJのように共感力に優れた',
            zh: '像ENFJ一样具有出色共情能力的'
        },
        high_creativity: {
            ko: 'ENFP형의 창의력을 지닌',
            ja: 'ENFPの創造力を持つ',
            zh: '拥有ENFP型创造力的'
        },
        high_passion: {
            ko: 'ESTP형의 열정으로 가득 찬',
            ja: 'ESTPの情熱に満ちた',
            zh: '充满ESTP型热情的'
        },
        high_sociability: {
            ko: 'ESFJ형처럼 사교적인',
            ja: 'ESFJのように社交的な',
            zh: '像ESFJ一样善于社交的'
        }
    },

    // Blood type descriptions for East Asian audiences
    BLOOD_TYPE_METAPHORS: {
        analytical: {
            ko: 'A형의 꼼꼼함과',
            ja: 'A型の几帳面さと',
            zh: 'A型的细致与'
        },
        creative: {
            ko: 'B형의 자유로움을 가진',
            ja: 'B型の自由さを持つ',
            zh: '拥有B型自由精神的'
        },
        balanced: {
            ko: 'O형의 균형 잡힌 성격',
            ja: 'O型のバランスの取れた性格',
            zh: 'O型平衡的性格'
        },
        unique: {
            ko: 'AB형처럼 독특한 매력의',
            ja: 'AB型のようなユニークな魅力の',
            zh: '像AB型一样独特魅力的'
        }
    },

    // Big Five personality descriptions for Western audiences (EN, ES)
    BIG_FIVE_METAPHORS: {
        high_intuition: {
            en: 'High in Openness - you embrace new experiences and ideas',
            es: 'Alto en Apertura - abrazas nuevas experiencias e ideas'
        },
        high_logic: {
            en: 'Strong Conscientiousness - organized and goal-oriented',
            es: 'Alta Responsabilidad - organizado y orientado a metas'
        },
        high_empathy: {
            en: 'High Agreeableness - compassionate and cooperative',
            es: 'Alta Amabilidad - compasivo y cooperativo'
        },
        high_creativity: {
            en: 'Peak Openness to Experience - imaginative and curious',
            es: 'Máxima Apertura a la Experiencia - imaginativo y curioso'
        },
        high_passion: {
            en: 'Positive Emotionality - enthusiastic and energetic',
            es: 'Emotividad Positiva - entusiasta y energético'
        },
        high_sociability: {
            en: 'High Extraversion - outgoing and socially confident',
            es: 'Alta Extraversión - sociable y seguro socialmente'
        }
    },

    // Compatibility-specific cultural metaphors
    COMPATIBILITY_METAPHORS: {
        // East Asian - destiny/fate themed
        eastAsian: {
            excellent: {
                ko: '천생연분! 전생에 인연이었던 두 사람 💫',
                ja: '運命の相手！前世からの縁 💫',
                zh: '天作之合！前世注定的缘分 💫'
            },
            good: {
                ko: '음양의 조화! 서로를 완성시키는 궁합',
                ja: '陰陽のハーモニー！互いを完成させる相性',
                zh: '阴阳调和！相互成就的配对'
            },
            moderate: {
                ko: '노력하면 빛나는 인연',
                ja: '努力すれば輝く縁',
                zh: '努力就会闪耀的缘分'
            }
        },
        // Western - scientific/personality themed
        western: {
            excellent: {
                en: 'Exceptional Match! Your Big Five profiles complement perfectly 🧬',
                es: '¡Pareja Excepcional! Sus perfiles de los Cinco Grandes se complementan perfectamente 🧬'
            },
            good: {
                en: 'Strong Compatibility - balanced attachment styles',
                es: 'Alta Compatibilidad - estilos de apego equilibrados'
            },
            moderate: {
                en: 'Growth-oriented match - potential through mutual development',
                es: 'Pareja orientada al crecimiento - potencial a través del desarrollo mutuo'
            }
        }
    },

    /**
     * Determine if locale is East Asian
     */
    isEastAsian(locale) {
        const eastAsianLocales = ['ko', 'ja', 'zh', 'zh-TW', 'zh-CN'];
        const baseLang = locale.split('-')[0];
        return eastAsianLocales.includes(locale) || eastAsianLocales.includes(baseLang);
    },

    /**
     * Get trait-based metaphor
     */
    getTraitMetaphor(trait, locale) {
        locale = locale || SmartShareManager.getLocale();
        const baseLang = locale.split('-')[0];

        if (this.isEastAsian(locale)) {
            return this.MBTI_METAPHORS[trait]?.[baseLang] || this.MBTI_METAPHORS[trait]?.ko || '';
        } else {
            return this.BIG_FIVE_METAPHORS[trait]?.[baseLang] || this.BIG_FIVE_METAPHORS[trait]?.en || '';
        }
    },

    /**
     * Get blood type style description (East Asian only)
     */
    getBloodTypeMetaphor(type, locale) {
        if (!this.isEastAsian(locale)) return '';

        const baseLang = locale.split('-')[0];
        return this.BLOOD_TYPE_METAPHORS[type]?.[baseLang] || this.BLOOD_TYPE_METAPHORS[type]?.ko || '';
    },

    /**
     * Get compatibility metaphor based on score
     */
    getCompatibilityMetaphor(score, locale) {
        locale = locale || SmartShareManager.getLocale();
        const baseLang = locale.split('-')[0];

        let level;
        if (score >= 85) level = 'excellent';
        else if (score >= 70) level = 'good';
        else level = 'moderate';

        if (this.isEastAsian(locale)) {
            return this.COMPATIBILITY_METAPHORS.eastAsian[level]?.[baseLang] ||
                   this.COMPATIBILITY_METAPHORS.eastAsian[level]?.ko || '';
        } else {
            return this.COMPATIBILITY_METAPHORS.western[level]?.[baseLang] ||
                   this.COMPATIBILITY_METAPHORS.western[level]?.en || '';
        }
    },

    /**
     * Generate full cultural description based on traits
     */
    generateCulturalDescription(traits, locale) {
        locale = locale || SmartShareManager.getLocale();
        const baseLang = locale.split('-')[0];

        // Find dominant trait
        let dominantTrait = 'high_intuition';
        let maxScore = 0;

        const traitMap = {
            intuition: 'high_intuition',
            logic: 'high_logic',
            empathy: 'high_empathy',
            creativity: 'high_creativity',
            passion: 'high_passion',
            sociability: 'high_sociability'
        };

        for (const [key, value] of Object.entries(traits)) {
            if (value > maxScore) {
                maxScore = value;
                dominantTrait = traitMap[key] || 'high_intuition';
            }
        }

        const traitMetaphor = this.getTraitMetaphor(dominantTrait, locale);

        // Add blood type flavor for East Asian
        if (this.isEastAsian(locale)) {
            const bloodTypes = ['analytical', 'creative', 'balanced', 'unique'];
            const randomBloodType = bloodTypes[Math.floor(traits.intuition || 0) % 4];
            const bloodMetaphor = this.getBloodTypeMetaphor(randomBloodType, locale);

            const templates = {
                ko: `${bloodMetaphor} ${traitMetaphor}`,
                ja: `${bloodMetaphor} ${traitMetaphor}`,
                zh: `${bloodMetaphor} ${traitMetaphor}`
            };

            return templates[baseLang] || templates.ko;
        } else {
            // Western style - more scientific
            const templates = {
                en: `Your personality profile shows: ${traitMetaphor}`,
                es: `Tu perfil de personalidad muestra: ${traitMetaphor}`
            };

            return templates[baseLang] || templates.en;
        }
    },

    /**
     * Get locale-specific result enhancement
     */
    getResultEnhancement(results, locale) {
        locale = locale || SmartShareManager.getLocale();
        const baseLang = locale.split('-')[0];

        const enhancements = {
            // East Asian - add mystical/fate elements
            ko: {
                prefix: '🔮 운명의 분석 결과',
                suffix: '별자리와 사주의 조화가 느껴지는 결과입니다.'
            },
            ja: {
                prefix: '🔮 運命の分析結果',
                suffix: '星座と四柱推命の調和を感じる結果です。'
            },
            zh: {
                prefix: '🔮 命运分析结果',
                suffix: '星座与八字的和谐体现在这个结果中。'
            },
            // Western - scientific framing
            en: {
                prefix: '📊 Personality Analysis Results',
                suffix: 'Based on validated psychological frameworks and AI pattern recognition.'
            },
            es: {
                prefix: '📊 Resultados del Análisis de Personalidad',
                suffix: 'Basado en marcos psicológicos validados y reconocimiento de patrones de IA.'
            }
        };

        return enhancements[baseLang] || enhancements.en;
    }
};


// ===== Export for global use =====
if (typeof window !== 'undefined') {
    window.SmartShareManager = SmartShareManager;
    window.CulturalMetaphorManager = CulturalMetaphorManager;
}
