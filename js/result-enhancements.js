/**
 * Stage 1 Enhancements for SmartAITest.com
 * - Loading animation with changing text
 * - Count-up animation for scores
 * - Sequential card reveal animations
 * - Rarity percentage calculation
 */

/**
 * Animate number counting up
 * @param {string} elementId - ID of the element to animate
 * @param {number} targetValue - Target number to count to
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const startValue = 0;

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }

    requestAnimationFrame(updateCount);
}

// ============================================
// LOADING ANIMATION
// ============================================

const loadingMessages = {
    en: [
        "Analyzing your responses...",
        "Interesting patterns emerging!",
        "Almost there..."
    ],
    ko: [
        "\uC751\uB2F5\uC744 \uBD84\uC11D\uD558\uACE0 \uC788\uC5B4\uC694...",
        "\uD765\uBBF8\uB85C\uC6B4 \uD328\uD134\uC774 \uBCF4\uC5EC\uC694!",
        "\uAC70\uC758 \uB2E4 \uB410\uC5B4\uC694..."
    ],
    ja: [
        "\u5FDC\u7B54\u3092\u5206\u6790\u4E2D...",
        "\u8208\u5473\u6DF1\u3044\u30D1\u30BF\u30FC\u30F3\u304C\uFF01",
        "\u3082\u3046\u3059\u3050..."
    ],
    zh: [
        "\u6B63\u5728\u5206\u6790\u60A8\u7684\u56DE\u7B54...",
        "\u53D1\u73B0\u4E86\u6709\u8DA3\u7684\u6A21\u5F0F\uFF01",
        "\u5FEB\u5B8C\u6210\u4E86..."
    ],
    es: [
        "Analizando tus respuestas...",
        "\u00A1Patrones interesantes emergiendo!",
        "Casi listo..."
    ]
};

/**
 * Show loading screen with animated text changes
 * @param {string} containerId - ID of the loading container
 * @param {string} lang - Language code
 * @param {Function} onComplete - Callback when loading is complete
 */
function showLoadingAnimation(containerId, lang = 'ko', onComplete = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = 'flex';
    const messages = loadingMessages[lang] || loadingMessages['en'];
    let currentIndex = 0;

    const textElement = container.querySelector('.loading-text');
    if (!textElement) return;

    // Update text every 1.5 seconds
    const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < messages.length) {
            textElement.style.opacity = '0';
            setTimeout(() => {
                textElement.textContent = messages[currentIndex];
                textElement.style.opacity = '1';
            }, 200);
        }
    }, 1500);

    // Complete after all messages shown
    const totalDuration = messages.length * 1500;
    setTimeout(() => {
        clearInterval(interval);
        container.style.display = 'none';
        if (onComplete) onComplete();
    }, totalDuration);
}

/**
 * Create loading overlay HTML
 * @returns {string} HTML string for loading overlay
 */
function createLoadingOverlay() {
    return `
        <div id="loading-overlay" class="loading-overlay" style="display: none;">
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <span class="loading-emoji">🔮</span>
                </div>
                <p class="loading-text">
                    <span class="lang-en">Analyzing your responses...</span>
                    <span class="lang-ko">\uC751\uB2F5\uC744 \uBD84\uC11D\uD558\uACE0 \uC788\uC5B4\uC694...</span>
                    <span class="lang-ja">\u5FDC\u7B54\u3092\u5206\u6790\u4E2D...</span>
                    <span class="lang-zh">\u6B63\u5728\u5206\u6790\u60A8\u7684\u56DE\u7B54...</span>
                    <span class="lang-es">Analizando tus respuestas...</span>
                </p>
            </div>
        </div>
    `;
}

// ============================================
// COUNT-UP ANIMATION FOR SCORES
// ============================================

/**
 * Animate score/percentage from 0 to target
 * @param {string} elementId - ID of the element
 * @param {number} targetValue - Target number
 * @param {string} suffix - Suffix like '%' or '\uC138'
 * @param {number} duration - Animation duration
 */
function animateScore(elementId, targetValue, suffix = '', duration = 1200) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();

    function updateScore(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out expo for dramatic effect
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(targetValue * easeOut);

        element.textContent = currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateScore);
        } else {
            element.textContent = targetValue + suffix;
        }
    }

    requestAnimationFrame(updateScore);
}

/**
 * Animate progress bar width
 * @param {string} elementId - ID of the progress bar element
 * @param {number} targetPercent - Target percentage (0-100)
 * @param {number} duration - Animation duration
 */
function animateProgressBar(elementId, targetPercent, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.style.width = '0%';

    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease-out`;
        element.style.width = targetPercent + '%';
    }, 100);
}

// ============================================
// SEQUENTIAL CARD REVEAL
// ============================================

/**
 * Reveal cards one by one with fadeIn + slideUp
 * @param {string} containerSelector - CSS selector for container
 * @param {number} staggerDelay - Delay between each card in ms
 */
function revealCardsSequentially(containerSelector = '.result-card', staggerDelay = 150) {
    const cards = document.querySelectorAll(containerSelector);

    cards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        // Animate with stagger
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * staggerDelay);
    });
}

/**
 * Add reveal animation class to elements when they come into view
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// RARITY PERCENTAGE
// ============================================

/**
 * Calculate rarity percentage based on result type
 * Different tests have different type distributions
 * @param {string} resultType - The result type identifier
 * @param {string} testType - 'life-summary', 'compatibility', or 'age-calculator'
 * @returns {number} - Rarity percentage (5-30)
 */
function calculateRarity(resultType, testType = 'general') {
    // Use hash to generate consistent rarity for same result type
    let hash = 0;
    const str = resultType + testType;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    // Map to 5-30% range with weighted distribution
    // Lower percentages are rarer
    const normalized = Math.abs(hash % 100);

    if (normalized < 10) return 5;  // 10% chance of being top 5%
    if (normalized < 25) return 8;  // 15% chance of being top 8%
    if (normalized < 45) return 12; // 20% chance of being top 12%
    if (normalized < 65) return 18; // 20% chance of being top 18%
    if (normalized < 85) return 23; // 20% chance of being top 23%
    return 30; // 15% chance of being top 30%
}

/**
 * Get rarity label based on percentage
 * @param {number} rarityPercent - Rarity percentage
 * @param {string} lang - Language code
 * @returns {string} - Formatted rarity label
 */
function getRarityLabel(rarityPercent, lang = 'ko') {
    const labels = {
        en: `Top ${rarityPercent}% Type`,
        ko: `\uC0C1\uC704 ${rarityPercent}% \uD0C0\uC785`,
        ja: `\u4E0A\u4F4D ${rarityPercent}% \u30BF\u30A4\u30D7`,
        zh: `\u524D ${rarityPercent}% \u7C7B\u578B`,
        es: `Top ${rarityPercent}% Tipo`
    };

    return labels[lang] || labels['en'];
}

// ============================================
// CSS STYLES (injected dynamically)
// ============================================

function injectEnhancementStyles() {
    if (document.getElementById('enhancement-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'enhancement-styles';
    styles.textContent = `
        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }

        .loading-content {
            text-align: center;
            color: white;
        }

        .loading-spinner {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto 1.5rem;
        }

        .spinner-ring {
            position: absolute;
            inset: 0;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top-color: #ec4899;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .loading-emoji {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .loading-text {
            font-size: 1.25rem;
            font-weight: 500;
            transition: opacity 0.2s ease;
        }

        /* Card Reveal Animation */
        .reveal-card {
            opacity: 0;
            transform: translateY(30px);
        }

        .reveal-card.revealed {
            animation: revealUp 0.6s ease-out forwards;
        }

        @keyframes revealUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Rarity Badge */
        .rarity-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
        }

        .rarity-badge::before {
            content: '\u2B50';
        }

        /* Score count-up effect */
        .score-animate {
            display: inline-block;
            animation: scoreReveal 0.6s ease-out;
        }

        @keyframes scoreReveal {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Sequential delay classes */
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
    `;

    document.head.appendChild(styles);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all result page enhancements
 * @param {Object} options - Configuration options
 */
function initResultEnhancements(options = {}) {
    const {
        animateScores = true,
        sequentialReveal = true
    } = options;

    // Inject styles
    injectEnhancementStyles();

    // Initialize scroll reveal
    if (sequentialReveal) {
        initScrollReveal();
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.ResultEnhancements = {
        initResultEnhancements,
        animateCounter,
        animateScore,
        animateProgressBar,
        revealCardsSequentially,
        showLoadingAnimation,
        createLoadingOverlay,
        calculateRarity,
        getRarityLabel
    };
}
