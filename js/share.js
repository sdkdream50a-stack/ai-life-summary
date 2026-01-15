/**
 * AI Life Summary - Social Sharing Functionality
 * Handles sharing to various social media platforms and clipboard
 */

const SITE_URL = 'https://ailifesummary.com';
const HASHTAGS = 'AILifeSummary,PersonalityTest';

/**
 * Initialize share buttons with event listeners
 * @param {string} sentence - The life summary sentence to share
 */
function initShareButtons(sentence) {
    const shareText = `My AI Life Summary: "${sentence}" - Discover yours at`;

    // Twitter/X Share
    const twitterBtn = document.getElementById('share-twitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => shareToTwitter(shareText));
    }

    // Facebook Share
    const facebookBtn = document.getElementById('share-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => shareToFacebook());
    }

    // WhatsApp Share
    const whatsappBtn = document.getElementById('share-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => shareToWhatsApp(shareText));
    }

    // Copy Link
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => copyToClipboard(sentence));
    }

    // Download Image
    const downloadBtn = document.getElementById('download-image');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (typeof generateShareImage === 'function') {
                generateShareImage(sentence);
            }
        });
    }

    // Native Share API (for mobile devices)
    if (navigator.share) {
        setupNativeShare(sentence);
    }
}

/**
 * Share to Twitter/X
 * @param {string} text - Text to share
 */
function shareToTwitter(text) {
    const encodedText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(SITE_URL)}&hashtags=${HASHTAGS}`;
    openShareWindow(url, 'twitter');
    trackShare('twitter');
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;
    openShareWindow(url, 'facebook');
    trackShare('facebook');
}

/**
 * Share to WhatsApp
 * @param {string} text - Text to share
 */
function shareToWhatsApp(text) {
    const encodedText = encodeURIComponent(text + ' ' + SITE_URL);
    const url = `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    trackShare('whatsapp');
}

/**
 * Share to LinkedIn
 * @param {string} text - Text to share
 */
function shareToLinkedIn(text) {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    openShareWindow(url, 'linkedin');
    trackShare('linkedin');
}

/**
 * Share to Pinterest
 * @param {string} description - Description for the pin
 * @param {string} imageUrl - URL of the image to pin
 */
function shareToPinterest(description, imageUrl) {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(SITE_URL)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
    openShareWindow(url, 'pinterest');
    trackShare('pinterest');
}

/**
 * Share via Telegram
 * @param {string} text - Text to share
 */
function shareToTelegram(text) {
    const encodedText = encodeURIComponent(text + ' ' + SITE_URL);
    const url = `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodedText}`;
    window.open(url, '_blank');
    trackShare('telegram');
}

/**
 * Copy text and link to clipboard
 * @param {string} sentence - The sentence to copy
 */
async function copyToClipboard(sentence) {
    const textToCopy = `My AI Life Summary: "${sentence}" - Discover yours at ${SITE_URL}`;

    try {
        await navigator.clipboard.writeText(textToCopy);
        showCopySuccess();
        trackShare('clipboard');
    } catch (err) {
        // Fallback for older browsers
        fallbackCopyToClipboard(textToCopy);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
        trackShare('clipboard');
    } catch (err) {
        console.error('Failed to copy:', err);
        showCopyError();
    }

    document.body.removeChild(textArea);
}

/**
 * Show success message after copying
 */
function showCopySuccess() {
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Copied!</span>
        `;
        copyBtn.classList.remove('bg-gray-600');
        copyBtn.classList.add('bg-green-600');

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('bg-green-600');
            copyBtn.classList.add('bg-gray-600');
        }, 2000);
    }
}

/**
 * Show error message if copy fails
 */
function showCopyError() {
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span>Failed</span>
        `;
        copyBtn.classList.remove('bg-gray-600');
        copyBtn.classList.add('bg-red-600');

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('bg-red-600');
            copyBtn.classList.add('bg-gray-600');
        }, 2000);
    }
}

/**
 * Open share window with proper dimensions
 * @param {string} url - URL to open
 * @param {string} platform - Platform name for tracking
 */
function openShareWindow(url, platform) {
    const width = 600;
    const height = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
        url,
        `share-${platform}`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
}

/**
 * Setup native share API for mobile devices
 * @param {string} sentence - The sentence to share
 */
function setupNativeShare(sentence) {
    // Add native share button if Web Share API is available
    const shareContainer = document.querySelector('.share-buttons');
    if (shareContainer && navigator.share) {
        const nativeShareBtn = document.createElement('button');
        nativeShareBtn.className = 'flex items-center space-x-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-opacity-90 transition';
        nativeShareBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span>Share</span>
        `;

        nativeShareBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: 'My AI Life Summary',
                    text: `My AI Life Summary: "${sentence}"`,
                    url: SITE_URL
                });
                trackShare('native');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        });

        shareContainer.prepend(nativeShareBtn);
    }
}

/**
 * Track share action for analytics
 * @param {string} platform - Platform name
 */
function trackShare(platform) {
    // Google Analytics tracking (if available)
    if (typeof gtag === 'function') {
        gtag('event', 'share', {
            method: platform,
            content_type: 'life_summary'
        });
    }

    // Custom analytics (if implemented)
    console.log(`Shared via ${platform}`);

    // Store share count locally
    const shareCount = parseInt(localStorage.getItem('ai-life-summary-shares') || '0');
    localStorage.setItem('ai-life-summary-shares', (shareCount + 1).toString());
}

/**
 * Get share statistics
 * @returns {object} - Share statistics
 */
function getShareStats() {
    return {
        totalShares: parseInt(localStorage.getItem('ai-life-summary-shares') || '0'),
        resultsGenerated: JSON.parse(localStorage.getItem('ai-life-summary-history') || '[]').length
    };
}

/**
 * Generate shareable URL with encoded parameters
 * @param {string} birthdate - Birthdate to encode
 * @returns {string} - Shareable URL
 */
function generateShareableUrl(birthdate) {
    // Simple encoding for sharing (not for security)
    const encoded = btoa(birthdate);
    return `${SITE_URL}/generate?d=${encoded}`;
}

/**
 * Parse shareable URL parameters
 * @returns {string|null} - Decoded birthdate or null
 */
function parseShareableUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedDate = urlParams.get('d');

    if (encodedDate) {
        try {
            return atob(encodedDate);
        } catch (e) {
            return null;
        }
    }

    return null;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initShareButtons,
        shareToTwitter,
        shareToFacebook,
        shareToWhatsApp,
        copyToClipboard,
        getShareStats
    };
}
