/**
 * AI Life Summary - Internationalization (i18n) Core Loader
 * Dynamically loads language files for improved performance
 */

const i18n = {
    translations: {},
    currentLang: 'en',
    loadingPromise: null,

    languageNames: {
        en: "English",
        ko: "한국어",
        ja: "日本語",
        zh: "中文",
        es: "Español"
    },

    languageFlags: {
        en: "🇺🇸",
        ko: "🇰🇷",
        ja: "🇯🇵",
        zh: "🇨🇳",
        es: "🇪🇸"
    },

    /**
     * Detect user's preferred language
     */
    detectLanguage() {
        // 1. Check localStorage first
        const saved = localStorage.getItem('ai-life-summary-lang');
        if (saved && this.languageNames[saved]) {
            return saved;
        }

        // 2. Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang') || urlParams.get('hl');
        if (urlLang) {
            const langCode = urlLang.split('-')[0].toLowerCase();
            if (this.languageNames[langCode]) {
                localStorage.setItem('ai-life-summary-lang', langCode);
                return langCode;
            }
        }

        // 3. Check HTML lang attribute
        const htmlLang = document.documentElement.lang;
        if (htmlLang && this.languageNames[htmlLang]) {
            return htmlLang;
        }

        // 4. Check browser language
        const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
        if (this.languageNames[browserLang]) {
            return browserLang;
        }

        return 'en';
    },

    /**
     * Load a language file
     */
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            // Determine base path (handle subdirectories)
            const scripts = document.getElementsByTagName('script');
            let basePath = '';
            for (const script of scripts) {
                if (script.src.includes('i18n/core.js')) {
                    basePath = script.src.replace('i18n/core.js', 'i18n/');
                    break;
                }
            }

            if (!basePath) {
                // Fallback: determine path based on current URL
                const depth = window.location.pathname.split('/').filter(p => p).length;
                basePath = depth > 0 ? '../'.repeat(depth - 1) + 'js/i18n/' : './js/i18n/';
            }

            const response = await fetch(`${basePath}${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }

            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error(`Failed to load language ${lang}:`, error);
            // Fallback to English if available
            if (lang !== 'en' && this.translations['en']) {
                return this.translations['en'];
            }
            return {};
        }
    },

    /**
     * Get translation for a key
     */
    t(key, lang = null) {
        const useLang = lang || this.currentLang;
        const trans = this.translations[useLang] || this.translations['en'] || {};
        return trans[key] || key;
    },

    /**
     * Set current language
     */
    async setLanguage(lang) {
        if (!this.languageNames[lang]) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        await this.loadLanguage(lang);
        this.currentLang = lang;
        localStorage.setItem('ai-life-summary-lang', lang);
        document.documentElement.lang = lang;

        this.applyTranslations();
        this.updateLanguageSelector();

        document.documentElement.classList.add('lang-ready');
    },

    /**
     * Apply translations to DOM elements
     */
    applyTranslations() {
        const trans = this.translations[this.currentLang] || {};

        // Elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.textContent = trans[key];
            }
        });

        // Elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (trans[key]) {
                el.placeholder = trans[key];
            }
        });

        // Elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (trans[key]) {
                el.title = trans[key];
            }
        });

        // Elements with data-i18n-html
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (trans[key]) {
                el.innerHTML = trans[key];
            }
        });

        // Elements with data-i18n-aria-label
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (trans[key]) {
                el.setAttribute('aria-label', trans[key]);
            }
        });
    },

    /**
     * Update language selector UI
     */
    updateLanguageSelector() {
        const currentLangEl = document.getElementById('current-lang');
        if (currentLangEl) {
            currentLangEl.textContent = this.languageNames[this.currentLang];
        }

        const currentFlagEl = document.getElementById('current-flag');
        if (currentFlagEl) {
            currentFlagEl.textContent = this.languageFlags[this.currentLang];
        }

        // Update active state in dropdown
        document.querySelectorAll('[data-lang]').forEach(el => {
            const lang = el.getAttribute('data-lang');
            el.classList.toggle('bg-indigo-50', lang === this.currentLang);
            el.classList.toggle('text-primary', lang === this.currentLang);
        });
    },

    /**
     * Initialize the i18n system
     */
    async init() {
        const lang = this.detectLanguage();
        await this.loadLanguage(lang);
        this.currentLang = lang;
        document.documentElement.lang = lang;

        this.applyTranslations();
        this.updateLanguageSelector();

        // Mark as ready for CSS to show body
        document.documentElement.classList.add('lang-ready');

        // Setup language selector event listeners
        this.initLanguageSelector();
    },

    /**
     * Initialize language selector dropdown
     */
    initLanguageSelector() {
        const langSelector = document.getElementById('lang-selector');
        if (!langSelector) return;

        const toggle = langSelector.querySelector('button');
        const dropdown = document.getElementById('lang-dropdown');

        if (toggle && dropdown) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', () => {
                dropdown.classList.add('hidden');
            });
        }

        // Language button clicks
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            });
        });
    }
};

// Global translation function
function t(key, lang) {
    return i18n.t(key, lang);
}

// Global setLanguage function
function setLanguage(lang) {
    return i18n.setLanguage(lang);
}

// Global getCurrentLanguage function
function getCurrentLanguage() {
    return i18n.currentLang;
}

// Expose to window for compatibility with existing code
window.t = t;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.translations = i18n.translations;
window.languageNames = i18n.languageNames;
window.languageFlags = i18n.languageFlags;
window.applyTranslations = () => i18n.applyTranslations();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
