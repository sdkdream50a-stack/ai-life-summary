/**
 * AI Age Calculator - Share Functions
 * Handles social sharing and URL generation
 */

// ============================================
// SHARE URL GENERATION
// ============================================

/**
 * Generate a shareable URL with encoded results
 */
function generateShareUrl(results) {
    const baseUrl = window.location.origin + '/age-calculator/';
    const params = new URLSearchParams({
        r: results.realAge,
        m: results.mentalAge,
        e: results.energyAge
    });
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse shared results from URL
 */
function parseShareUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('r') && params.has('m') && params.has('e')) {
        return {
            realAge: parseInt(params.get('r')),
            mentalAge: parseInt(params.get('m')),
            energyAge: parseInt(params.get('e')),
            isShared: true
        };
    }
    return null;
}

// ============================================
// SOCIAL SHARING FUNCTIONS
// ============================================

/**
 * Share to Twitter/X
 */
function shareToTwitter(results) {
    const text = generateShareText(results, 'twitter');
    const url = generateShareUrl(results);
    const hashtags = 'MyAIAge,AgeCalculator,MentalAge';

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to Facebook
 */
function shareToFacebook(results) {
    const url = generateShareUrl(results);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp(results) {
    const text = generateShareText(results, 'whatsapp');
    const url = generateShareUrl(results);
    const fullText = `${text}\n\n${url}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Share to LINE
 */
function shareToLine(results) {
    const text = generateShareText(results, 'line');
    const url = generateShareUrl(results);
    const fullText = `${text}\n${url}`;

    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
}

/**
 * Share to KakaoTalk (requires Kakao SDK)
 */
function shareToKakao(results) {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: 'My AI Age Results',
                description: `Real: ${results.realAge}, Mental: ${results.mentalAge}, Energy: ${results.energyAge}`,
                imageUrl: 'https://goodpicknow.com/assets/images/age-calculator-og.png',
                link: {
                    webUrl: generateShareUrl(results),
                    mobileWebUrl: generateShareUrl(results)
                }
            },
            buttons: [{
                title: 'Try AI Age Calculator',
                link: {
                    webUrl: window.location.origin + '/age-calculator/',
                    mobileWebUrl: window.location.origin + '/age-calculator/'
                }
            }]
        });
    } else {
        // Fallback to clipboard
        copyShareLink(results);
        alert('Link copied! Share it on KakaoTalk.');
    }
}

/**
 * Use Web Share API if available
 */
async function shareNative(results) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'My AI Age Results',
                text: generateShareText(results, 'native'),
                url: generateShareUrl(results)
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
async function copyShareLink(results) {
    const url = generateShareUrl(results);

    try {
        await navigator.clipboard.writeText(url);
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
            return { success: true, message: 'Link copied to clipboard!' };
        } catch (e) {
            document.body.removeChild(textArea);
            return { success: false, message: 'Failed to copy link' };
        }
    }
}

/**
 * Copy share text with results to clipboard
 */
async function copyShareText(results) {
    const text = generateShareText(results, 'clipboard');
    const url = generateShareUrl(results);
    const fullText = `${text}\n\nTry it: ${url}\n\n#MyAIAge #AgeCalculator`;

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
function generateShareText(results, platform = 'default') {
    const { realAge, mentalAge, energyAge } = results;
    const mentalGap = mentalAge - realAge;
    const energyGap = energyAge - realAge;

    // Determine the vibe
    let vibe = '';
    const avgGap = (mentalGap + energyGap) / 2;

    if (avgGap <= -7) {
        vibe = "I'm way younger than my age! ";
    } else if (avgGap <= -3) {
        vibe = "Feeling younger than ever! ";
    } else if (avgGap <= 3) {
        vibe = "Perfectly balanced! ";
    } else {
        vibe = "Wise soul here! ";
    }

    switch (platform) {
        case 'twitter':
            return `${vibe}My AI Age Results:\nReal: ${realAge}\nMental: ${mentalAge} (${mentalGap >= 0 ? '+' : ''}${mentalGap})\nEnergy: ${energyAge} (${energyGap >= 0 ? '+' : ''}${energyGap})\n\nDiscover YOUR age:`;

        case 'whatsapp':
        case 'line':
            return `${vibe}\n\nMy AI Age Calculator Results:\nReal Age: ${realAge} years\nMental Age: ${mentalAge} years (${getGapText(mentalGap)})\nEnergy Age: ${energyAge} years (${getGapText(energyGap)})\n\nTry it yourself!`;

        case 'clipboard':
            return `My AI Age Results:\nReal Age: ${realAge}\nMental Age: ${mentalAge} (${getGapText(mentalGap)})\nEnergy Age: ${energyAge} (${getGapText(energyGap)})`;

        case 'native':
            return `${vibe}Real: ${realAge}, Mental: ${mentalAge}, Energy: ${energyAge}. Discover YOUR age!`;

        default:
            return `My AI Age: Real ${realAge}, Mental ${mentalAge}, Energy ${energyAge}`;
    }
}

/**
 * Get human-readable gap text
 */
function getGapText(gap) {
    if (gap < 0) return `${Math.abs(gap)} years younger`;
    if (gap > 0) return `${gap} years older`;
    return 'same as real age';
}

// ============================================
// COMPARISON FUNCTIONS
// ============================================

/**
 * Generate comparison link for friends
 */
function generateComparisonUrl(myResults, friendResults = null) {
    const baseUrl = window.location.origin + '/age-calculator/compare.html';
    const params = new URLSearchParams({
        r1: myResults.realAge,
        m1: myResults.mentalAge,
        e1: myResults.energyAge
    });

    if (friendResults) {
        params.append('r2', friendResults.realAge);
        params.append('m2', friendResults.mentalAge);
        params.append('e2', friendResults.energyAge);
    }

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse comparison data from URL
 */
function parseComparisonUrl() {
    const params = new URLSearchParams(window.location.search);

    const person1 = {
        realAge: parseInt(params.get('r1')),
        mentalAge: parseInt(params.get('m1')),
        energyAge: parseInt(params.get('e1'))
    };

    const person2 = params.has('r2') ? {
        realAge: parseInt(params.get('r2')),
        mentalAge: parseInt(params.get('m2')),
        energyAge: parseInt(params.get('e2'))
    } : null;

    return { person1, person2 };
}

/**
 * Generate comparison text
 */
function generateComparisonText(myResults, friendResults) {
    const myAvg = (myResults.mentalAge + myResults.energyAge) / 2 - myResults.realAge;
    const friendAvg = (friendResults.mentalAge + friendResults.energyAge) / 2 - friendResults.realAge;

    if (myAvg < friendAvg - 3) {
        return "You're the younger spirit between the two! Your mindset and energy are more youthful.";
    } else if (myAvg > friendAvg + 3) {
        return "Your friend has the younger spirit! They seem more youthful in mindset and energy.";
    } else {
        return "You two are well-matched! Your mental and energy ages are quite similar.";
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
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
            options.push('line');
        }
    }

    if (isWebShareSupported()) {
        options.unshift('native');
    }

    return options;
}
