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
 * Share to KakaoTalk - copies link for sharing
 */
function shareToKakao(results) {
    const url = generateShareUrl(results);
    const text = `🧠 AI 나이 계산기 결과!\n실제: ${results.realAge}세, 정신: ${results.mentalAge}세, 에너지: ${results.energyAge}세\n\n`;
    const fullText = text + url;

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
}

/**
 * Share to Telegram
 */
function shareToTelegram(results) {
    const text = generateShareText(results, 'telegram');
    const url = generateShareUrl(results);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.location.href = telegramUrl;
}

/**
 * Share to Reddit
 */
function shareToReddit(results) {
    const title = `AI Age: Real ${results.realAge}, Mental ${results.mentalAge}, Energy ${results.energyAge}`;
    const url = generateShareUrl(results);
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.location.href = redditUrl;
}

/**
 * Share to Pinterest
 */
function shareToPinterest(results) {
    const url = generateShareUrl(results);
    const description = generateShareText(results, 'pinterest');
    const fullText = `${description}\n\n${url}`;

    navigator.clipboard.writeText(fullText).then(() => {
        const lang = document.documentElement.lang || 'en';
        const messages = {
            en: '📋 Copied!\n\nOpening Pinterest - paste to create a pin.',
            ko: '📋 복사되었습니다!\n\nPinterest가 열립니다 - 붙여넣기하여 핀을 만드세요.',
            ja: '📋 コピーしました!\n\nPinterestが開きます - 貼り付けてピンを作成してください。',
            zh: '📋 已复制!\n\n正在打开Pinterest - 粘贴以创建Pin。',
            es: '📋 ¡Copiado!\n\nAbriendo Pinterest - pega para crear un pin.'
        };
        alert(messages[lang] || messages.en);
        window.location.href = 'https://www.pinterest.com/pin-builder/';
    }).catch(() => {
        window.location.href = 'https://www.pinterest.com/pin-builder/';
    });
}

/**
 * Share to LinkedIn
 */
function shareToLinkedIn(results) {
    const url = generateShareUrl(results);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
}

/**
 * Share to Threads (Meta) - copies text and opens Threads
 */
function shareToThreads(results) {
    const text = generateShareText(results, 'threads');
    const url = generateShareUrl(results);
    const fullText = `${text}\n\n${url}`;

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
}

/**
 * Share to Instagram (copies text for manual sharing)
 */
function shareToInstagram(results) {
    const text = generateShareText(results, 'instagram');
    const url = generateShareUrl(results);
    const fullText = `${text}\n\n🔗 ${url}\n\n#MyAIAge #AgeCalculator #MentalAge #EnergyAge`;

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
}

/**
 * Share to WeChat (Chinese)
 */
function shareToWeChat(results) {
    const text = generateShareText(results, 'wechat');
    const url = generateShareUrl(results);
    const fullText = `${text}\n\n${url}`;

    navigator.clipboard.writeText(fullText).then(() => {
        alert('📋 已复制!\n\n打开微信粘贴分享');
    }).catch(() => {
        alert('打开微信分享结果!');
    });
}

/**
 * Share to Weibo (Chinese)
 */
function shareToWeibo(results) {
    const text = generateShareText(results, 'weibo');
    const url = generateShareUrl(results);
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=600');
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
        case 'telegram':
            return `${vibe}\n\nMy AI Age Calculator Results:\nReal Age: ${realAge} years\nMental Age: ${mentalAge} years (${getGapText(mentalGap)})\nEnergy Age: ${energyAge} years (${getGapText(energyGap)})\n\nTry it yourself!`;

        case 'threads':
        case 'instagram':
            return `${vibe}\n\n🎂 Real Age: ${realAge}\n🧠 Mental Age: ${mentalAge} (${getGapText(mentalGap)})\n⚡ Energy Age: ${energyAge} (${getGapText(energyGap)})\n\nTry the AI Age Calculator!`;

        case 'pinterest':
            return `AI Age Calculator: Real ${realAge}, Mental ${mentalAge}, Energy ${energyAge}. Discover your mental and energy age!`;

        case 'wechat':
        case 'weibo':
            return `${vibe}\n\nAI年龄计算器结果:\n实际年龄: ${realAge}岁\n心理年龄: ${mentalAge}岁 (${getGapTextZh(mentalGap)})\n能量年龄: ${energyAge}岁 (${getGapTextZh(energyGap)})\n\n快来测试你的AI年龄!`;

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

/**
 * Get gap text in Chinese
 */
function getGapTextZh(gap) {
    if (gap < 0) return `年轻${Math.abs(gap)}岁`;
    if (gap > 0) return `年长${gap}岁`;
    return '与实际年龄相同';
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
