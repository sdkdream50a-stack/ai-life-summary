/**
 * AI Test Lab - Advanced Ad Management System
 *
 * Features:
 * - Lazy loading with Intersection Observer
 * - A/B testing infrastructure
 * - GDPR/CCPA consent handling
 * - Empty slot collapse
 * - Performance optimization
 * - Revenue tracking
 *
 * Publisher ID: ca-pub-6241798439911569
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        publisherId: 'ca-pub-6241798439911569',
        lazyLoadMargin: 200, // pixels before viewport to start loading
        renderMargin: 100,
        deferLoadDelay: 3000, // ms delay before loading ads if no interaction
        minContentHeight: 600, // minimum content height before showing sidebar ads
        debug: false
    };

    // Ad slot definitions with dimensions for CLS prevention
    const AD_SLOTS = {
        // In-article responsive (after hero)
        'hero-bottom': {
            format: 'fluid',
            layoutKey: '-fb+5w+4e-db+86',
            style: 'display:block; text-align:center;',
            minHeight: 100,
            responsive: true
        },
        // Native in-feed (between cards)
        'in-feed': {
            format: 'fluid',
            layoutKey: '-gw-3+1f-69+7o',
            style: 'display:block;',
            minHeight: 120,
            responsive: true
        },
        // Mid-quiz banner
        'mid-quiz': {
            format: 'auto',
            style: 'display:block;',
            minHeight: 100,
            fullWidth: true
        },
        // Pre-result rectangle (high RPM)
        'pre-result': {
            format: 'rectangle',
            style: 'display:inline-block;',
            width: 336,
            height: 280,
            fallbackWidth: 300,
            fallbackHeight: 250
        },
        // Leaderboard (728x90 or responsive)
        'leaderboard': {
            format: 'horizontal',
            style: 'display:block;',
            minHeight: 90,
            responsive: true
        },
        // Mobile anchor
        'anchor-bottom': {
            format: 'autorelaxed',
            style: 'display:block;',
            minHeight: 50,
            anchor: true
        },
        // Desktop sidebar sticky
        'sidebar-sticky': {
            format: 'vertical',
            style: 'display:block;',
            width: 300,
            height: 600,
            sticky: true
        },
        // Result page multiplex
        'result-multiplex': {
            format: 'autorelaxed',
            style: 'display:block;',
            minHeight: 250
        }
    };

    // A/B Test configurations
    const AB_TESTS = {
        'ad-density': {
            variants: ['low', 'medium', 'high'],
            weights: [0.33, 0.34, 0.33]
        },
        'anchor-mobile': {
            variants: ['enabled', 'disabled'],
            weights: [0.5, 0.5]
        },
        'quiz-ad-position': {
            variants: ['after-q3', 'after-q5', 'none'],
            weights: [0.4, 0.4, 0.2]
        }
    };

    // State
    const state = {
        initialized: false,
        consentGiven: false,
        adsLoaded: new Set(),
        abTestVariants: {},
        observer: null,
        userInteracted: false,
        pageType: 'unknown',
        deviceType: 'desktop'
    };

    /**
     * Initialize the ad system
     */
    function init() {
        if (state.initialized) return;
        state.initialized = true;

        // Detect device type
        state.deviceType = window.innerWidth < 768 ? 'mobile' :
                          window.innerWidth < 1024 ? 'tablet' : 'desktop';

        // Detect page type
        detectPageType();

        // Initialize A/B tests
        initABTests();

        // Check consent
        checkConsent();

        // Setup lazy loading observer
        setupLazyLoading();

        // Listen for user interaction
        setupInteractionListeners();

        // Initialize ads after delay or interaction
        scheduleAdLoad();

        log('Ads Manager initialized', {
            deviceType: state.deviceType,
            pageType: state.pageType,
            abTests: state.abTestVariants
        });
    }

    /**
     * Detect the current page type
     */
    function detectPageType() {
        const path = window.location.pathname;
        if (path.includes('/result')) {
            state.pageType = 'result';
        } else if (path.includes('/life-summary')) {
            state.pageType = 'life-summary';
        } else if (path.includes('/compatibility')) {
            state.pageType = 'compatibility';
        } else if (path.includes('/age-calculator')) {
            state.pageType = 'age-calculator';
        } else if (path === '/' || path.match(/^\/[a-z]{2}\/$/)) {
            state.pageType = 'home';
        } else if (path.includes('/blog')) {
            state.pageType = 'blog';
        } else {
            state.pageType = 'other';
        }
    }

    /**
     * Initialize A/B test variants
     */
    function initABTests() {
        const stored = localStorage.getItem('ai-test-ab-variants');
        if (stored) {
            try {
                state.abTestVariants = JSON.parse(stored);
            } catch (e) {
                state.abTestVariants = {};
            }
        }

        // Assign variants for any missing tests
        for (const [testName, config] of Object.entries(AB_TESTS)) {
            if (!state.abTestVariants[testName]) {
                state.abTestVariants[testName] = selectVariant(config.variants, config.weights);
            }
        }

        localStorage.setItem('ai-test-ab-variants', JSON.stringify(state.abTestVariants));

        // Track variant assignment
        trackEvent('ab_test_assignment', state.abTestVariants);
    }

    /**
     * Select a variant based on weights
     */
    function selectVariant(variants, weights) {
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < variants.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                return variants[i];
            }
        }
        return variants[variants.length - 1];
    }

    /**
     * Get current A/B test variant
     */
    function getVariant(testName) {
        return state.abTestVariants[testName];
    }

    /**
     * Check and handle consent
     */
    function checkConsent() {
        // Check for existing consent
        const consent = localStorage.getItem('ai-test-ad-consent');
        if (consent === 'granted') {
            state.consentGiven = true;
            return;
        }

        // Check if in EU/EEA (simplified check)
        const isEU = Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith('Europe') ||
                     navigator.language.match(/^(de|fr|it|es|nl|pl|pt|sv|da|fi|el|cs|hu|ro|bg|sk|sl|hr|lt|lv|et|mt|ga|cy)/i);

        if (isEU && consent !== 'granted') {
            showConsentBanner();
        } else {
            // Non-EU or already consented
            state.consentGiven = true;
        }
    }

    /**
     * Show GDPR consent banner
     */
    function showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.className = 'consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-text">
                    <p class="consent-title">We value your privacy</p>
                    <p class="consent-desc">We use cookies and similar technologies to personalize ads and analyze traffic. By clicking "Accept", you consent to our use of cookies.</p>
                </div>
                <div class="consent-actions">
                    <button class="consent-btn consent-btn-secondary" onclick="window.AdsManager.rejectConsent()">
                        Reject
                    </button>
                    <button class="consent-btn consent-btn-primary" onclick="window.AdsManager.acceptConsent()">
                        Accept
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(15, 12, 41, 0.98);
                backdrop-filter: blur(10px);
                padding: 16px;
                z-index: 99999;
                border-top: 1px solid rgba(255,255,255,0.1);
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }
            .consent-text {
                flex: 1;
                min-width: 280px;
            }
            .consent-title {
                color: white;
                font-weight: 600;
                margin: 0 0 4px 0;
                font-size: 14px;
            }
            .consent-desc {
                color: rgba(255,255,255,0.7);
                margin: 0;
                font-size: 13px;
                line-height: 1.4;
            }
            .consent-actions {
                display: flex;
                gap: 8px;
            }
            .consent-btn {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }
            .consent-btn-primary {
                background: linear-gradient(135deg, #6366f1, #ec4899);
                color: white;
            }
            .consent-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            .consent-btn-secondary {
                background: rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.8);
            }
            .consent-btn-secondary:hover {
                background: rgba(255,255,255,0.15);
            }
            @media (max-width: 640px) {
                .consent-content {
                    flex-direction: column;
                    text-align: center;
                }
                .consent-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Accept consent
     */
    function acceptConsent() {
        localStorage.setItem('ai-test-ad-consent', 'granted');
        state.consentGiven = true;
        document.getElementById('consent-banner')?.remove();
        loadPendingAds();
        trackEvent('consent_accepted');
    }

    /**
     * Reject consent
     */
    function rejectConsent() {
        localStorage.setItem('ai-test-ad-consent', 'rejected');
        document.getElementById('consent-banner')?.remove();
        // Show limited, non-personalized ads
        if (typeof googletag !== 'undefined') {
            googletag.cmd.push(function() {
                googletag.pubads().setRequestNonPersonalizedAds(1);
            });
        }
        state.consentGiven = true; // Allow non-personalized ads
        loadPendingAds();
        trackEvent('consent_rejected');
    }

    /**
     * Setup lazy loading with Intersection Observer
     */
    function setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            return;
        }

        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    if (!state.adsLoaded.has(container.id) && state.consentGiven) {
                        loadAdUnit(container);
                    }
                }
            });
        }, {
            rootMargin: `${CONFIG.lazyLoadMargin}px 0px`,
            threshold: 0
        });

        // Observe all ad containers
        document.querySelectorAll('[data-ad-slot]').forEach(container => {
            state.observer.observe(container);
        });
    }

    /**
     * Setup user interaction listeners
     */
    function setupInteractionListeners() {
        const interactionEvents = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'];

        const onInteraction = () => {
            if (!state.userInteracted) {
                state.userInteracted = true;
                interactionEvents.forEach(event => {
                    document.removeEventListener(event, onInteraction);
                });
                loadPendingAds();
            }
        };

        interactionEvents.forEach(event => {
            document.addEventListener(event, onInteraction, { once: true, passive: true });
        });
    }

    /**
     * Schedule ad loading
     */
    function scheduleAdLoad() {
        // Load ads after delay if no interaction
        setTimeout(() => {
            if (!state.userInteracted && state.consentGiven) {
                loadPendingAds();
            }
        }, CONFIG.deferLoadDelay);
    }

    /**
     * Load all pending ads
     */
    function loadPendingAds() {
        document.querySelectorAll('[data-ad-slot]').forEach(container => {
            if (!state.adsLoaded.has(container.id)) {
                // Check if in viewport or close to it
                const rect = container.getBoundingClientRect();
                const inViewport = rect.top < window.innerHeight + CONFIG.lazyLoadMargin;

                if (inViewport) {
                    loadAdUnit(container);
                }
            }
        });
    }

    /**
     * Load a single ad unit
     */
    function loadAdUnit(container) {
        const slotType = container.dataset.adSlot;
        const slotConfig = AD_SLOTS[slotType];

        if (!slotConfig || state.adsLoaded.has(container.id)) {
            return;
        }

        state.adsLoaded.add(container.id);
        container.dataset.adStatus = 'loading';

        // Check A/B test for anchor ads
        if (slotType === 'anchor-bottom' && getVariant('anchor-mobile') === 'disabled') {
            container.style.display = 'none';
            return;
        }

        // Check quiz ad position A/B test
        if (slotType === 'mid-quiz') {
            const variant = getVariant('quiz-ad-position');
            if (variant === 'none') {
                container.style.display = 'none';
                return;
            }
        }

        // Create the ad element
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = slotConfig.style;
        ins.dataset.adClient = CONFIG.publisherId;

        // Set format-specific attributes
        if (slotConfig.format === 'fluid') {
            ins.dataset.adFormat = 'fluid';
            if (slotConfig.layoutKey) {
                ins.dataset.adLayoutKey = slotConfig.layoutKey;
            }
        } else if (slotConfig.format === 'auto' || slotConfig.format === 'autorelaxed') {
            ins.dataset.adFormat = slotConfig.format;
            ins.dataset.fullWidthResponsive = 'true';
        } else if (slotConfig.width && slotConfig.height) {
            // Fixed size with fallback
            const width = window.innerWidth < 350 ? slotConfig.fallbackWidth || slotConfig.width : slotConfig.width;
            const height = window.innerWidth < 350 ? slotConfig.fallbackHeight || slotConfig.height : slotConfig.height;
            ins.style.width = width + 'px';
            ins.style.height = height + 'px';
        } else {
            ins.dataset.adFormat = 'auto';
            ins.dataset.fullWidthResponsive = 'true';
        }

        // Clear container and add ad
        container.innerHTML = '';
        container.appendChild(ins);

        // Push to adsbygoogle
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});

            // Monitor for empty slots
            setTimeout(() => {
                checkAdFilled(container, ins);
            }, 2000);

        } catch (e) {
            log('Error loading ad', e);
            container.dataset.adStatus = 'error';
            handleEmptySlot(container);
        }

        trackEvent('ad_loaded', { slotType, containerId: container.id });
    }

    /**
     * Check if ad was filled
     */
    function checkAdFilled(container, ins) {
        const isFilled = ins.dataset.adStatus === 'filled' ||
                        ins.clientHeight > 10 ||
                        ins.querySelector('iframe');

        if (!isFilled) {
            container.dataset.adStatus = 'unfilled';
            handleEmptySlot(container);
        } else {
            container.dataset.adStatus = 'filled';
        }
    }

    /**
     * Handle empty/unfilled ad slot
     */
    function handleEmptySlot(container) {
        const slotType = container.dataset.adSlot;

        // Collapse empty slots to prevent layout issues
        container.style.minHeight = '0';
        container.style.height = '0';
        container.style.overflow = 'hidden';
        container.style.margin = '0';
        container.style.padding = '0';

        log('Empty ad slot collapsed', { slotType, containerId: container.id });
    }

    /**
     * Create ad container HTML
     */
    function createAdContainer(slotType, options = {}) {
        const slotConfig = AD_SLOTS[slotType];
        if (!slotConfig) {
            console.warn('Unknown ad slot type:', slotType);
            return '';
        }

        const id = options.id || `ad-${slotType}-${Date.now()}`;
        const className = options.className || '';
        const minHeight = slotConfig.minHeight || 100;

        let containerClass = 'ad-container';
        if (slotConfig.sticky) containerClass += ' ad-sticky';
        if (slotConfig.anchor) containerClass += ' ad-anchor';
        if (className) containerClass += ' ' + className;

        return `
            <div id="${id}"
                 class="${containerClass}"
                 data-ad-slot="${slotType}"
                 data-ad-status="pending"
                 style="min-height: ${minHeight}px; text-align: center;">
                <p class="ad-label">Sponsored</p>
            </div>
        `;
    }

    /**
     * Insert ad at specific position
     */
    function insertAdAt(selector, slotType, position = 'afterend', options = {}) {
        const element = document.querySelector(selector);
        if (!element) {
            log('Element not found for ad insertion:', selector);
            return null;
        }

        const html = createAdContainer(slotType, options);
        element.insertAdjacentHTML(position, html);

        const container = document.getElementById(options.id || element.nextElementSibling?.id);
        if (container && state.observer) {
            state.observer.observe(container);
        }

        return container;
    }

    /**
     * Track analytics event
     */
    function trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, {
                event_category: 'ads',
                ...params
            });
        }

        log('Event tracked:', eventName, params);
    }

    /**
     * Debug logging
     */
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[AdsManager]', ...args);
        }
    }

    /**
     * Get ad density variant
     */
    function getAdDensity() {
        return getVariant('ad-density');
    }

    /**
     * Should show specific ad based on A/B tests
     */
    function shouldShowAd(slotType) {
        // Check page-specific policies
        if (state.pageType === 'error') return false;

        // Check density variant
        const density = getAdDensity();
        if (density === 'low') {
            // Only show essential ads
            return ['hero-bottom', 'pre-result'].includes(slotType);
        }

        return true;
    }

    /**
     * Initialize anchor ad for mobile
     */
    function initAnchorAd() {
        if (state.deviceType !== 'mobile') return;
        if (getVariant('anchor-mobile') === 'disabled') return;

        const anchor = document.createElement('div');
        anchor.id = 'ad-anchor-container';
        anchor.className = 'ad-anchor-container';
        anchor.innerHTML = `
            <div id="ad-anchor"
                 class="ad-container"
                 data-ad-slot="anchor-bottom"
                 data-ad-status="pending">
            </div>
        `;
        document.body.appendChild(anchor);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .ad-anchor-container {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 9998;
                background: rgba(0,0,0,0.9);
                padding: 4px;
            }
            .ad-anchor-container .ad-container {
                min-height: 50px;
            }
        `;
        document.head.appendChild(style);

        if (state.observer) {
            state.observer.observe(document.getElementById('ad-anchor'));
        }
    }

    // Add global ad container styles
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ad-container {
                margin: 16px auto;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .ad-container[data-ad-status="unfilled"],
            .ad-container[data-ad-status="error"] {
                display: none !important;
            }
            .ad-label {
                font-size: 11px;
                color: rgba(255,255,255,0.4);
                margin: 0 0 4px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .ad-sticky {
                position: sticky;
                top: 80px;
            }
            .adsbygoogle {
                display: block;
            }
            /* Ensure no CLS */
            .ad-container ins.adsbygoogle {
                min-height: inherit;
            }
        `;
        document.head.appendChild(style);
    }

    // Public API
    window.AdsManager = {
        init,
        acceptConsent,
        rejectConsent,
        loadAdUnit,
        insertAdAt,
        createAdContainer,
        getVariant,
        shouldShowAd,
        initAnchorAd,
        getAdDensity,
        trackEvent,
        // Expose state for debugging
        getState: () => ({ ...state })
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addGlobalStyles();
            init();
        });
    } else {
        addGlobalStyles();
        init();
    }

})();
