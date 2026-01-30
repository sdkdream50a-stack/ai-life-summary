/**
 * Mobile Enhancements JavaScript
 * Touch interactions, gestures, and mobile-specific behaviors
 * SmartAITest.com 2026
 */

(function() {
    'use strict';

    // Detect mobile/touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Add device class to body
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    if (isIOS) {
        document.body.classList.add('ios-device');
    }
    if (isAndroid) {
        document.body.classList.add('android-device');
    }

    /**
     * 1. Touch Ripple Effect
     * Adds Material Design-like ripple on touch
     */
    function initRippleEffect() {
        if (!isTouchDevice) return;

        const rippleElements = document.querySelectorAll('.kick-btn, .card-interactive, .touch-ripple');

        rippleElements.forEach(el => {
            el.addEventListener('touchstart', function(e) {
                const rect = this.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                    width: 100px;
                    height: 100px;
                    margin-left: -50px;
                    margin-top: -50px;
                `;

                this.style.position = this.style.position || 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });
        });

        // Add ripple animation if not exists
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 2. Swipe to Dismiss (Bottom Sheets, Modals)
     */
    function initSwipeToDismiss() {
        const swipeables = document.querySelectorAll('.swipe-to-dismiss, .bottom-sheet');

        swipeables.forEach(el => {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            el.addEventListener('touchstart', function(e) {
                // Only handle if touching the handle area or top of sheet
                const handle = el.querySelector('.bottom-sheet-handle');
                if (handle && !handle.contains(e.target) && e.touches[0].clientY > el.getBoundingClientRect().top + 60) {
                    return;
                }
                startY = e.touches[0].clientY;
                isDragging = true;
                el.classList.add('swiping');
            }, { passive: true });

            el.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                const diff = currentY - startY;

                if (diff > 0) { // Only allow downward swipe
                    el.style.transform = `translateY(${diff}px)`;

                    // Close overlay opacity based on drag distance
                    const overlay = document.querySelector('.bottom-sheet-overlay');
                    if (overlay) {
                        overlay.style.opacity = Math.max(0, 1 - diff / 300);
                    }
                }
            }, { passive: true });

            el.addEventListener('touchend', function(e) {
                if (!isDragging) return;
                isDragging = false;
                el.classList.remove('swiping');

                const diff = currentY - startY;

                if (diff > 100) { // Threshold to dismiss
                    closeBottomSheet(el);
                } else {
                    // Snap back
                    el.style.transform = '';
                    const overlay = document.querySelector('.bottom-sheet-overlay');
                    if (overlay) {
                        overlay.style.opacity = '';
                    }
                }
            }, { passive: true });
        });
    }

    /**
     * 3. Bottom Sheet Management
     */
    function openBottomSheet(sheetId) {
        const sheet = document.getElementById(sheetId);
        if (!sheet) return;

        // Create overlay if not exists
        let overlay = document.querySelector('.bottom-sheet-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'bottom-sheet-overlay';
            overlay.onclick = () => closeBottomSheet(sheet);
            document.body.appendChild(overlay);
        }

        // Prevent body scroll
        document.body.classList.add('modal-open');
        document.body.style.top = `-${window.scrollY}px`;

        // Show elements
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            sheet.classList.add('active');
        });
    }

    function closeBottomSheet(sheet) {
        if (typeof sheet === 'string') {
            sheet = document.getElementById(sheet);
        }
        if (!sheet) return;

        const overlay = document.querySelector('.bottom-sheet-overlay');

        sheet.classList.remove('active');
        sheet.style.transform = '';

        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.opacity = '';
        }

        // Restore body scroll
        const scrollY = document.body.style.top;
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Expose globally
    window.openBottomSheet = openBottomSheet;
    window.closeBottomSheet = closeBottomSheet;

    /**
     * 4. Fast Click (reduce 300ms delay on iOS)
     */
    function initFastClick() {
        if (!isTouchDevice) return;

        // Modern browsers handle this, but add touch-action for older ones
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            if (!el.style.touchAction) {
                el.style.touchAction = 'manipulation';
            }
        });
    }

    /**
     * 5. Viewport Height Fix (iOS Safari 100vh issue)
     */
    function initViewportFix() {
        function setViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
    }

    /**
     * 6. Scroll Direction Detection
     * For showing/hiding nav on scroll
     */
    function initScrollDirectionDetection() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const currentScrollY = window.scrollY;
                    const direction = currentScrollY > lastScrollY ? 'down' : 'up';

                    document.body.setAttribute('data-scroll-direction', direction);

                    // Show/hide floating elements based on scroll
                    const floatingNav = document.querySelector('.kick-navbar');
                    if (floatingNav) {
                        if (direction === 'down' && currentScrollY > 200) {
                            floatingNav.style.transform = 'translateX(-50%) translateY(calc(100% + 40px))';
                        } else {
                            floatingNav.style.transform = 'translateX(-50%)';
                        }
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 7. Image Lazy Loading with Blur-up Effect
     */
    function initLazyImages() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loading');

                        const actualImg = new Image();
                        actualImg.onload = () => {
                            img.src = img.dataset.src;
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                            img.removeAttribute('data-src');
                        };
                        actualImg.src = img.dataset.src;

                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => {
                img.classList.add('lazy-image');
                observer.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    /**
     * 8. Haptic Feedback (if supported)
     */
    function triggerHaptic(type = 'light') {
        if ('vibrate' in navigator) {
            switch(type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate(30);
                    break;
                case 'success':
                    navigator.vibrate([10, 50, 20]);
                    break;
                case 'error':
                    navigator.vibrate([30, 50, 30, 50, 30]);
                    break;
            }
        }
    }

    window.triggerHaptic = triggerHaptic;

    /**
     * 9. Form Input Focus Handling
     * Scroll input into view when keyboard appears
     */
    function initFormFocusHandling() {
        if (!isTouchDevice) return;

        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('focus', function() {
                // Wait for keyboard to appear
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    // If input is below middle of visible area, scroll it up
                    if (rect.bottom > viewportHeight * 0.5) {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 300);
            });
        });
    }

    /**
     * 10. Orientation Change Handler
     */
    function initOrientationHandler() {
        window.addEventListener('orientationchange', function() {
            // Add class during orientation change
            document.body.classList.add('orientation-changing');

            setTimeout(() => {
                document.body.classList.remove('orientation-changing');
            }, 500);
        });
    }

    /**
     * 11. Network Status Detection
     */
    function initNetworkDetection() {
        function updateOnlineStatus() {
            if (navigator.onLine) {
                document.body.classList.remove('offline');
                document.body.classList.add('online');
            } else {
                document.body.classList.add('offline');
                document.body.classList.remove('online');

                // Show offline indicator
                showToast('You are offline. Some features may not work.', 'warning');
            }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    /**
     * 12. Simple Toast Notifications
     */
    function showToast(message, type = 'info', duration = 3000) {
        const existing = document.querySelector('.mobile-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `mobile-toast mobile-toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: calc(100px + env(safe-area-inset-bottom, 0px));
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#8B5CF6'};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
            max-width: calc(100% - 40px);
            text-align: center;
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    window.showToast = showToast;

    /**
     * 13. Pull to Refresh Prevention
     * Prevents accidental pull-to-refresh on mobile browsers
     */
    function initPullToRefreshPrevention() {
        // Only prevent when at top of page and in PWA/fullscreen
        if (!isIOS && !isAndroid) return;

        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            // If at top and pulling down
            if (scrollTop === 0 && touchY > touchStartY) {
                // Allow if in a scrollable container
                let target = e.target;
                while (target && target !== document.body) {
                    if (target.scrollTop > 0) return;
                    target = target.parentElement;
                }

                // Only prevent on body scroll at very top
                if (touchY - touchStartY > 10) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }

    /**
     * 14. Share Sheet (Native-feel sharing on mobile)
     */
    async function showShareSheet(data = {}) {
        const { title, text, url } = data;

        // Try native share first (Web Share API)
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                triggerHaptic('success');
                return true;
            } catch (err) {
                if (err.name === 'AbortError') return false;
                // Fall through to custom share sheet
            }
        }

        // Custom share sheet for desktop or unsupported browsers
        const shareSheet = document.createElement('div');
        shareSheet.className = 'bottom-sheet';
        shareSheet.id = 'share-sheet';
        shareSheet.innerHTML = `
            <div class="bottom-sheet-handle"></div>
            <h3 style="color: white; margin-bottom: 20px; text-align: center;">Share</h3>
            <div class="share-sheet">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text || title)}&url=${encodeURIComponent(url)}" target="_blank" class="share-sheet-item">
                    <div class="icon" style="background: #1DA1F2;">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <span>X</span>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-sheet-item">
                    <div class="icon" style="background: #1877F2;">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span>Facebook</span>
                </a>
                <button onclick="navigator.clipboard.writeText('${url}'); showToast('Link copied!'); closeBottomSheet('share-sheet');" class="share-sheet-item">
                    <div class="icon" style="background: #6B7280;">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </div>
                    <span>Copy Link</span>
                </button>
                <button onclick="closeBottomSheet('share-sheet');" class="share-sheet-item">
                    <div class="icon" style="background: #EF4444;">
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </div>
                    <span>Cancel</span>
                </button>
            </div>
        `;

        document.body.appendChild(shareSheet);

        // Initialize swipe to dismiss for new sheet
        initSwipeToDismiss();

        openBottomSheet('share-sheet');

        return true;
    }

    window.showShareSheet = showShareSheet;

    /**
     * Initialize all mobile enhancements
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        initViewportFix();
        initFastClick();
        initRippleEffect();
        initSwipeToDismiss();
        initScrollDirectionDetection();
        initLazyImages();
        initFormFocusHandling();
        initOrientationHandler();
        initNetworkDetection();

        // Only prevent pull-to-refresh in standalone mode (PWA)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            initPullToRefreshPrevention();
        }

        console.log('[Mobile] Enhancements initialized');
    }

    init();

})();
