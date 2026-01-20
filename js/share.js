/**
 * AI Life Summary - Social Sharing Functionality
 * Handles sharing to various social media platforms and clipboard
 *
 * Performance optimizations applied:
 * - DOM query caching
 * - localStorage caching
 * - Early returns
 */

const SITE_URL = 'https://smartaitest.com/life-summary/';
const HASHTAGS = 'AILifeSummary,PersonalityTest';

// ===== Performance: DOM Query Cache =====
// Cache DOM elements to avoid repeated querySelector calls
const domCache = new Map();

function getCachedElement(id) {
    if (!domCache.has(id)) {
        domCache.set(id, document.getElementById(id));
    }
    return domCache.get(id);
}

function clearDomCache() {
    domCache.clear();
}

// ===== Performance: localStorage Cache =====
// Cache localStorage reads to reduce I/O
const storageCache = new Map();

function getCachedStorage(key) {
    if (!storageCache.has(key)) {
        storageCache.set(key, localStorage.getItem(key));
    }
    return storageCache.get(key);
}

function setCachedStorage(key, value) {
    localStorage.setItem(key, value);
    storageCache.set(key, value);
}

/**
 * Initialize share buttons with event listeners
 * @param {string} sentence - The life summary sentence to share
 * @param {string} lang - Language code (en, ko, ja, zh, es)
 */
function initShareButtons(sentence, lang = 'en') {
    // Clear DOM cache when re-initializing (page might have changed)
    clearDomCache();

    const shareText = `My AI Life Summary: "${sentence}" - Discover yours at`;

    // Twitter/X Share - Use cached DOM query
    const twitterBtn = getCachedElement('share-twitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => shareToTwitter(shareText));
    }

    // Facebook Share - Use cached DOM query
    const facebookBtn = getCachedElement('share-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => shareToFacebook());
    }

    // WhatsApp Share - Use cached DOM query
    const whatsappBtn = getCachedElement('share-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => shareToWhatsApp(shareText));
    }

    // Copy Link - Use cached DOM query
    const copyBtn = getCachedElement('copy-link');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => copyToClipboard(sentence));
    }

    // Download Image - Use cached DOM query
    const downloadBtn = getCachedElement('download-image');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (typeof generateShareImage === 'function') {
                // Format sentence with line breaks for image if function exists
                const formattedSentence = typeof formatSentenceWithLineBreaks === 'function'
                    ? formatSentenceWithLineBreaks(sentence, lang)
                    : sentence;
                generateShareImage(formattedSentence, 'story', lang);
            }
        });
    }

    // Instagram Share
    const instagramBtn = getCachedElement('share-instagram');
    if (instagramBtn) {
        instagramBtn.addEventListener('click', () => shareToInstagram(shareText));
    }

    // Threads Share
    const threadsBtn = getCachedElement('share-threads');
    if (threadsBtn) {
        threadsBtn.addEventListener('click', () => shareToThreads(shareText));
    }

    // Telegram Share
    const telegramBtn = getCachedElement('share-telegram');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', () => shareToTelegram(shareText));
    }

    // LINE Share
    const lineBtn = getCachedElement('share-line');
    if (lineBtn) {
        lineBtn.addEventListener('click', () => shareToLine(shareText));
    }

    // KakaoTalk Share
    const kakaoBtn = getCachedElement('share-kakao');
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => shareToKakao(shareText));
    }

    // Reddit Share
    const redditBtn = getCachedElement('share-reddit');
    if (redditBtn) {
        redditBtn.addEventListener('click', () => shareToReddit(shareText));
    }

    // Pinterest Share
    const pinterestBtn = getCachedElement('share-pinterest');
    if (pinterestBtn) {
        pinterestBtn.addEventListener('click', () => shareToPinterest(shareText));
    }

    // LinkedIn Share
    const linkedinBtn = getCachedElement('share-linkedin');
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', () => shareToLinkedIn(shareText));
    }

    // WeChat Share
    const wechatBtn = getCachedElement('share-wechat');
    if (wechatBtn) {
        wechatBtn.addEventListener('click', () => shareToWeChat(shareText));
    }

    // Weibo Share
    const weiboBtn = getCachedElement('share-weibo');
    if (weiboBtn) {
        weiboBtn.addEventListener('click', () => shareToWeibo(shareText));
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
 */
function shareToPinterest(description) {
    const imageUrl = encodeURIComponent('https://smartaitest.com/assets/images/og-image.png');
    const url = encodeURIComponent(SITE_URL);
    const desc = encodeURIComponent(description);
    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${desc}`;
    window.open(pinterestUrl, '_blank', 'width=750,height=600');
    trackShare('pinterest');
}

/**
 * Share via Telegram
 * @param {string} text - Text to share
 */
function shareToTelegram(text) {
    const encodedText = encodeURIComponent(text + ' ' + SITE_URL);
    const url = `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodedText}`;
    window.location.href = url;
    trackShare('telegram');
}

/**
 * Share to Instagram (copies text for manual sharing)
 * @param {string} text - Text to share
 */
function shareToInstagram(text) {
    const fullText = `${text}\n\n🔗 ${SITE_URL}\n\n#AILifeSummary #PersonalityTest #BirthdayTest`;
    navigator.clipboard.writeText(fullText).then(() => {
        const lang = document.documentElement.lang || 'en';
        const messages = {
            en: '📋 Caption copied!\n\nOpen Instagram and paste to share your story or post.',
            ko: '📋 복사되었습니다!\n\nInstagram을 열고 붙여넣기하여 스토리나 게시물을 공유하세요.',
            ja: '📋 コピーしました!\n\nInstagramを開いて貼り付けてストーリーや投稿を共有してください。',
            zh: '📋 已复制!\n\n打开Instagram粘贴以分享您的故事或帖子。',
            es: '📋 ¡Copiado!\n\nAbre Instagram y pega para compartir tu historia o publicación.'
        };
        alert(messages[lang] || messages.en);
    }).catch(() => {
        const lang = document.documentElement.lang || 'en';
        const messages = {
            en: 'Open Instagram to share your results!',
            ko: 'Instagram을 열어 결과를 공유하세요!',
            ja: 'Instagramを開いて結果を共有してください!',
            zh: '打开Instagram分享您的结果!',
            es: '¡Abre Instagram para compartir tus resultados!'
        };
        alert(messages[lang] || messages.en);
    });
    trackShare('instagram');
}

/**
 * Share to Threads (Meta) - copies text and opens Threads
 * @param {string} text - Text to share
 */
function shareToThreads(text) {
    const fullText = `${text}\n\n${SITE_URL}`;
    navigator.clipboard.writeText(fullText).then(() => {
        const lang = document.documentElement.lang || 'en';
        const messages = {
            en: '📋 Text copied!\n\nOpening Threads - paste to share.',
            ko: '📋 복사되었습니다!\n\nThreads가 열립니다 - 붙여넣기하여 공유하세요.',
            ja: '📋 コピーしました!\n\nThreadsが開きます - 貼り付けて共有してください。',
            zh: '📋 已复制!\n\n正在打开Threads - 粘贴以分享。',
            es: '📋 ¡Copiado!\n\nAbriendo Threads - pega para compartir.'
        };
        alert(messages[lang] || messages.en);
        window.open('https://www.threads.net', '_blank');
    }).catch(() => {
        window.open('https://www.threads.net', '_blank');
    });
    trackShare('threads');
}

/**
 * Share to LINE
 * @param {string} text - Text to share
 */
function shareToLine(text) {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    trackShare('line');
}

/**
 * Share to KakaoTalk
 * @param {string} text - Text to share
 */
function shareToKakao(text) {
    const fullText = `${text}\n\n${SITE_URL}`;
    navigator.clipboard.writeText(fullText).then(() => {
        const lang = document.documentElement.lang || 'en';
        const messages = {
            en: '📋 Copied!\n\nOpen KakaoTalk and paste to share.',
            ko: '📋 복사되었습니다!\n\n카카오톡을 열고 붙여넣기하여 공유하세요.',
            ja: '📋 コピーしました!\n\nカカオトークを開いて貼り付けて共有してください。',
            zh: '📋 已复制!\n\n打开KakaoTalk粘贴以分享。',
            es: '📋 ¡Copiado!\n\nAbre KakaoTalk y pega para compartir.'
        };
        alert(messages[lang] || messages.en);
    }).catch(() => {
        alert('카카오톡을 열어 공유하세요!');
    });
    trackShare('kakao');
}

/**
 * Share to Reddit
 * @param {string} text - Text to share
 */
function shareToReddit(text) {
    const url = `https://www.reddit.com/submit?url=${encodeURIComponent(SITE_URL)}&title=${encodeURIComponent(text)}`;
    window.location.href = url;
    trackShare('reddit');
}

/**
 * Share to WeChat (Chinese)
 * @param {string} text - Text to share
 */
function shareToWeChat(text) {
    const fullText = `${text}\n\n${SITE_URL}`;
    navigator.clipboard.writeText(fullText).then(() => {
        alert('📋 已复制!\n\n打开微信粘贴分享');
    }).catch(() => {
        alert('打开微信分享结果!');
    });
    trackShare('wechat');
}

/**
 * Share to Weibo (Chinese)
 * @param {string} text - Text to share
 */
function shareToWeibo(text) {
    const url = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(SITE_URL)}&title=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=600');
    trackShare('weibo');
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
    const copyBtn = getCachedElement('copy-link');
    if (!copyBtn) return; // Early return if element not found

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

/**
 * Show error message if copy fails
 */
function showCopyError() {
    const copyBtn = getCachedElement('copy-link');
    if (!copyBtn) return; // Early return if element not found

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

    // Store share count locally - Use cached localStorage
    const shareCount = parseInt(getCachedStorage('ai-life-summary-shares') || '0');
    setCachedStorage('ai-life-summary-shares', (shareCount + 1).toString());
}

/**
 * Get share statistics
 * @returns {object} - Share statistics
 */
function getShareStats() {
    // Use cached localStorage reads
    const shares = getCachedStorage('ai-life-summary-shares');
    const history = getCachedStorage('ai-life-summary-history');

    return {
        totalShares: parseInt(shares || '0'),
        resultsGenerated: JSON.parse(history || '[]').length
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
