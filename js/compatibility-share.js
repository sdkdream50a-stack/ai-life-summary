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
 * Share to KakaoTalk - copies link for sharing
 */
function shareToKakao() {
    const results = window.compatibilityResults;
    const url = generateShareUrl();
    const text = results
        ? `💕 AI 궁합 테스트 결과!\n${results.personA.name || 'A'} & ${results.personB.name || 'B'}: ${results.overallScore}% ${results.relationshipType.emoji}\n\n`
        : 'AI 궁합 테스트 결과!\n\n';
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
function shareToTelegram() {
    const text = generateShareText('telegram');
    const url = generateShareUrl();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    // Use location.href for more reliable opening
    window.location.href = telegramUrl;
}

/**
 * Share to Reddit
 */
function shareToReddit() {
    const results = window.compatibilityResults;
    const title = results ? `AI Compatibility Score: ${results.overallScore}%` : 'AI Compatibility Test Results';
    const url = generateShareUrl();
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    // Use location.href for more reliable opening
    window.location.href = redditUrl;
}

/**
 * Share to Pinterest
 */
function shareToPinterest() {
    const url = generateShareUrl();
    const description = generateShareText('pinterest');
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
function shareToLinkedIn() {
    const url = generateShareUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
}

/**
 * Share to Threads (Meta) - copies text and opens Threads
 */
function shareToThreads() {
    const text = generateShareText('threads');
    const url = generateShareUrl();
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
function shareToInstagram() {
    const text = generateShareText('instagram');
    const url = generateShareUrl();
    const fullText = `${text}\n\n🔗 ${url}\n\n#AICompatibility #LoveTest #CoupleTest #SoulmateTest`;

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
function shareToWeChat() {
    const text = generateShareText('wechat');
    const url = generateShareUrl();
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
function shareToWeibo() {
    const text = generateShareText('weibo');
    const url = generateShareUrl();
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=600');
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
        case 'telegram':
            return `${vibe}${relationshipType.emoji}\n\nAI Compatibility Test Results:\n${nameA} & ${nameB}\nScore: ${overallScore}%\nType: ${relationshipType.labels.en}\n\nTry it yourself!`;

        case 'threads':
        case 'instagram':
            return `${vibe}${relationshipType.emoji}\n\n${nameA} & ${nameB}\n💕 Compatibility: ${overallScore}%\n✨ Type: ${relationshipType.labels.en}\n\nTry the AI Compatibility Test!`;

        case 'pinterest':
            return `AI Compatibility Test: ${nameA} & ${nameB} are ${overallScore}% compatible! ${relationshipType.emoji} Find your perfect match!`;

        case 'wechat':
        case 'weibo':
            return `${vibe}${relationshipType.emoji}\n\nAI配对测试结果:\n${nameA} & ${nameB}\n配对度: ${overallScore}%\n类型: ${relationshipType.labels.zh || relationshipType.labels.en}\n\n快来测试你们的配对度!`;

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
