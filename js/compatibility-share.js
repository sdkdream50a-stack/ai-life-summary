/**
 * AI Compatibility Test - Share Functions
 * Handles social sharing and URL generation
 */

// ============================================
// SHARE URL GENERATION
// ============================================

/**
 * Generate a shareable URL with encoded results
 * Format: ?a=YYYYMMDD&b=YYYYMMDD&na=NameA&nb=NameB
 */
function generateShareUrl() {
    const results = window.compatibilityResults;
    if (!results) return window.location.origin + '/compatibility/';

    const baseUrl = window.location.origin + '/compatibility/result.html';

    // Format birthdays as YYYYMMDD
    const birthdayA = results.personA.birthday.replace(/-/g, '');
    const birthdayB = results.personB.birthday.replace(/-/g, '');

    const params = new URLSearchParams({
        a: birthdayA,
        b: birthdayB
    });

    // Add names if they exist and are not default
    if (results.personA.name && results.personA.name !== 'Person A') {
        params.append('na', encodeURIComponent(results.personA.name));
    }
    if (results.personB.name && results.personB.name !== 'Person B') {
        params.append('nb', encodeURIComponent(results.personB.name));
    }

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse shared results from URL
 */
function parseShareUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('a') && params.has('b')) {
        const birthdayA = params.get('a');
        const birthdayB = params.get('b');

        if (birthdayA.length === 8 && birthdayB.length === 8) {
            return {
                personA: {
                    name: decodeURIComponent(params.get('na') || ''),
                    year: parseInt(birthdayA.substring(0, 4)),
                    month: parseInt(birthdayA.substring(4, 6)),
                    day: parseInt(birthdayA.substring(6, 8))
                },
                personB: {
                    name: decodeURIComponent(params.get('nb') || ''),
                    year: parseInt(birthdayB.substring(0, 4)),
                    month: parseInt(birthdayB.substring(4, 6)),
                    day: parseInt(birthdayB.substring(6, 8))
                },
                isShared: true
            };
        }
    }
    return null;
}

// ============================================
// SOCIAL SHARING FUNCTIONS
// ============================================

/**
 * Share to Twitter/X
 */
function shareToTwitter() {
    const results = window.compatibilityResults;
    if (!results) return;

    const text = generateShareText('twitter');
    const url = generateShareUrl();
    const hashtags = 'AICompatibility,LoveTest,SoulmateTest';

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
    const url = generateShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp() {
    const text = generateShareText('whatsapp');
    const url = generateShareUrl();
    const fullText = `${text}\n\n${url}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Share to LINE
 */
function shareToLine() {
    const text = generateShareText('line');
    const url = generateShareUrl();

    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
}

/**
 * Share to KakaoTalk
 */
function shareToKakao() {
    const results = window.compatibilityResults;
    if (!results) return;

    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: 'Our AI Compatibility Results!',
                description: `${results.personA.name} & ${results.personB.name}: ${results.overallScore}% ${results.relationshipType.emoji}`,
                imageUrl: 'https://smartaitest.com/assets/images/compatibility-og.png',
                link: {
                    webUrl: generateShareUrl(),
                    mobileWebUrl: generateShareUrl()
                }
            },
            buttons: [{
                title: 'Try AI Compatibility Test',
                link: {
                    webUrl: window.location.origin + '/compatibility/',
                    mobileWebUrl: window.location.origin + '/compatibility/'
                }
            }]
        });
    } else {
        // Fallback to clipboard
        copyResultLink();
        alert('Link copied! Share it on KakaoTalk.');
    }
}

/**
 * Use Web Share API if available
 */
async function shareNative() {
    const results = window.compatibilityResults;
    if (!results) return false;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Our AI Compatibility Results!',
                text: generateShareText('native'),
                url: generateShareUrl()
            });
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
            return false;
        }
    }
    return false;
}

// ============================================
// CLIPBOARD FUNCTIONS
// ============================================

/**
 * Copy share link to clipboard
 */
async function copyResultLink() {
    const url = generateShareUrl();

    try {
        await navigator.clipboard.writeText(url);
        showCopyFeedback();
        return { success: true, message: 'Link copied to clipboard!' };
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyFeedback();
            return { success: true, message: 'Link copied to clipboard!' };
        } catch (e) {
            document.body.removeChild(textArea);
            return { success: false, message: 'Failed to copy link' };
        }
    }
}

/**
 * Show copy feedback
 */
function showCopyFeedback() {
    const feedback = document.getElementById('copy-feedback');
    if (feedback) {
        feedback.classList.remove('hidden');
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 2000);
    }
}

/**
 * Copy share text with results to clipboard
 */
async function copyShareText() {
    const text = generateShareText('clipboard');
    const url = generateShareUrl();
    const fullText = `${text}\n\nTry it: ${url}\n\n#AICompatibility #LoveTest`;

    try {
        await navigator.clipboard.writeText(fullText);
        return { success: true, message: 'Text copied to clipboard!' };
    } catch (err) {
        return { success: false, message: 'Failed to copy text' };
    }
}

// ============================================
// SHARE TEXT GENERATION
// ============================================

/**
 * Generate share text based on platform
 */
function generateShareText(platform = 'default') {
    const results = window.compatibilityResults;
    if (!results) return 'Check out the AI Compatibility Test!';

    const { personA, personB, overallScore, relationshipType } = results;

    // Determine the vibe
    let vibe = '';
    if (overallScore >= 90) {
        vibe = "We're soulmates! ";
    } else if (overallScore >= 80) {
        vibe = "Destined to be together! ";
    } else if (overallScore >= 70) {
        vibe = "Great match! ";
    } else if (overallScore >= 60) {
        vibe = "Good potential! ";
    } else {
        vibe = "An interesting pair! ";
    }

    const nameA = personA.name || 'Person A';
    const nameB = personB.name || 'Person B';

    switch (platform) {
        case 'twitter':
            return `${vibe}${relationshipType.emoji}\n\n${nameA} & ${nameB}\nCompatibility: ${overallScore}%\n\nDiscover YOUR compatibility:`;

        case 'whatsapp':
        case 'line':
            return `${vibe}${relationshipType.emoji}\n\nAI Compatibility Test Results:\n${nameA} & ${nameB}\nScore: ${overallScore}%\nType: ${relationshipType.labels.en}\n\nTry it yourself!`;

        case 'clipboard':
            return `AI Compatibility Results:\n${nameA} & ${nameB}\nScore: ${overallScore}%\nType: ${relationshipType.labels.en} ${relationshipType.emoji}`;

        case 'native':
            return `${vibe}${nameA} & ${nameB}: ${overallScore}% compatible! ${relationshipType.emoji}`;

        default:
            return `${nameA} & ${nameB}: ${overallScore}% compatible!`;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if Web Share API is supported
 */
function isWebShareSupported() {
    return navigator.share !== undefined;
}

/**
 * Check if running on mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get available share options based on platform
 */
function getAvailableShareOptions() {
    const options = ['copy', 'twitter', 'facebook'];

    if (isMobile()) {
        options.push('whatsapp');
        options.push('line');
        options.push('kakao');
    }

    if (isWebShareSupported()) {
        options.unshift('native');
    }

    return options;
}
