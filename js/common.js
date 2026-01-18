/**
 * AI Life Summary - Common Functions
 * Shared functionality across all pages
 *
 * Performance optimizations applied:
 * - DOM element caching
 * - Map-based lookups for O(1) access
 * - Early returns
 */

// ===== Performance: Language Data Maps for O(1) Lookup =====
const langFlags = new Map([
    ['en', '🇺🇸'],
    ['ko', '🇰🇷'],
    ['ja', '🇯🇵'],
    ['zh', '🇨🇳'],
    ['es', '🇪🇸']
]);

const langNames = new Map([
    ['en', 'English'],
    ['ko', '한국어'],
    ['ja', '日本語'],
    ['zh', '中文'],
    ['es', 'Español']
]);

// ===== Performance: DOM Element Cache =====
const commonDomCache = new Map();

function getCommonElement(id) {
    if (!commonDomCache.has(id)) {
        commonDomCache.set(id, document.getElementById(id));
    }
    return commonDomCache.get(id);
}

// Common header HTML with language selector
function getHeaderHTML(activePage = '') {
    return `
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <nav class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="flex items-center space-x-2">
                    <span class="text-2xl">&#10024;</span>
                    <span class="font-heading font-bold text-xl gradient-text">AI Life Summary</span>
                </a>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/about.html" class="text-gray-600 hover:text-primary transition ${activePage === 'about' ? 'text-primary font-medium' : ''}" data-i18n="nav.about">About</a>
                    <a href="/archive.html" class="text-gray-600 hover:text-primary transition ${activePage === 'archive' ? 'text-primary font-medium' : ''}" data-i18n="nav.archive">Archive</a>
                    <a href="/contact.html" class="text-gray-600 hover:text-primary transition ${activePage === 'contact' ? 'text-primary font-medium' : ''}" data-i18n="nav.contact">Contact</a>
                    <div id="language-selector" class="relative">
                        <button type="button" class="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-primary transition rounded-lg hover:bg-gray-100">
                            <span id="current-lang-flag">🇺🇸</span>
                            <span id="current-lang-name">English</span>
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        <div id="language-dropdown" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            <button type="button" onclick="setLanguage('en')" class="lang-option w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                                <span>🇺🇸</span><span>English</span>
                            </button>
                            <button type="button" onclick="setLanguage('ko')" class="lang-option w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                                <span>🇰🇷</span><span>한국어</span>
                            </button>
                            <button type="button" onclick="setLanguage('ja')" class="lang-option w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                                <span>🇯🇵</span><span>日本語</span>
                            </button>
                            <button type="button" onclick="setLanguage('zh')" class="lang-option w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                                <span>🇨🇳</span><span>中文</span>
                            </button>
                            <button type="button" onclick="setLanguage('es')" class="lang-option w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                                <span>🇪🇸</span><span>Español</span>
                            </button>
                        </div>
                    </div>
                </div>
                <button id="mobile-menu-btn" class="md:hidden p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col space-y-3">
                    <a href="/about.html" class="text-gray-600 hover:text-primary transition" data-i18n="nav.about">About</a>
                    <a href="/archive.html" class="text-gray-600 hover:text-primary transition" data-i18n="nav.archive">Archive</a>
                    <a href="/contact.html" class="text-gray-600 hover:text-primary transition" data-i18n="nav.contact">Contact</a>
                    <!-- Mobile Language Selector -->
                    <div class="pt-3 border-t mt-3">
                        <p class="text-xs text-gray-500 mb-2">Language</p>
                        <div class="flex flex-wrap gap-2">
                            <button onclick="setLanguage('en')" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">🇺🇸 EN</button>
                            <button onclick="setLanguage('ko')" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">🇰🇷 KO</button>
                            <button onclick="setLanguage('ja')" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">🇯🇵 JA</button>
                            <button onclick="setLanguage('zh')" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">🇨🇳 ZH</button>
                            <button onclick="setLanguage('es')" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">🇪🇸 ES</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>`;
}

// Common footer HTML
function getFooterHTML() {
    return `
    <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-6xl mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="text-2xl">&#10024;</span>
                        <span class="font-heading font-bold text-xl text-white">AI Life Summary</span>
                    </div>
                    <p class="text-gray-400 text-sm" data-i18n="footer.description">
                        Discover who you are with AI-powered life summaries. A fun and insightful way to understand yourself better.
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4" data-i18n="footer.quick_links">Quick Links</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/" class="hover:text-white transition" data-i18n="footer.home">Home</a></li>
                        <li><a href="/about.html" class="hover:text-white transition" data-i18n="nav.about">About</a></li>
                        <li><a href="/archive.html" class="hover:text-white transition" data-i18n="nav.archive">Archive</a></li>
                        <li><a href="/contact.html" class="hover:text-white transition" data-i18n="nav.contact">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4" data-i18n="footer.legal">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/privacy-policy.html" class="hover:text-white transition" data-i18n="form.privacy_link">Privacy Policy</a></li>
                        <li><a href="/terms-of-service.html" class="hover:text-white transition" data-i18n="form.terms_link">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4" data-i18n="footer.connect">Connect</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="hover:text-white transition" aria-label="Twitter">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="#" class="hover:text-white transition" aria-label="Instagram">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="#" class="hover:text-white transition" aria-label="Facebook">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                <p>&copy; 2025 <span data-i18n="footer.copyright">AI Life Summary. All rights reserved.</span></p>
                <p class="mt-2" data-i18n="footer.entertainment">This service is for entertainment purposes only and should not be considered as professional advice.</p>
            </div>
        </div>
    </footer>`;
}

// Initialize common elements
function initCommonElements() {
    // Clear cache on init (DOM might have changed)
    commonDomCache.clear();

    // Mobile menu toggle - Use cached DOM queries
    const mobileMenuBtn = getCommonElement('mobile-menu-btn');
    const mobileMenu = getCommonElement('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Language selector dropdown - Use cached DOM queries
    const langSelector = getCommonElement('language-selector');
    const langDropdown = getCommonElement('language-dropdown');
    if (langSelector && langDropdown) {
        const selectorBtn = langSelector.querySelector('button');
        if (selectorBtn) {
            selectorBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langDropdown.classList.toggle('hidden');
            });
        }
        document.addEventListener('click', function() {
            langDropdown.classList.add('hidden');
        });
    }

    // Update language selector display
    updateLangDisplay();
}

// Update language selector display - Use Map for O(1) lookup
function updateLangDisplay() {
    const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';

    // Use cached DOM queries
    const flagEl = getCommonElement('current-lang-flag');
    const nameEl = getCommonElement('current-lang-name');

    // Use Map for O(1) lookup instead of object property access
    if (flagEl) flagEl.textContent = langFlags.get(lang) || langFlags.get('en');
    if (nameEl) nameEl.textContent = langNames.get(lang) || langNames.get('en');
}

// Override setLanguage to also update display
const originalSetLanguage = typeof setLanguage === 'function' ? setLanguage : null;
if (typeof window !== 'undefined') {
    window.setLanguageWithUpdate = function(lang) {
        if (typeof setLanguage === 'function') {
            setLanguage(lang);
        }
        updateLangDisplay();
        // Re-apply translations
        if (typeof applyTranslations === 'function') {
            applyTranslations(lang);
        }
    };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonElements);
} else {
    initCommonElements();
}
