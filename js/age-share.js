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
function ageShareLang() {
    const l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return ['en', 'ko', 'ja', 'zh', 'es'].includes(l) ? l : 'en';
}

// A bucket, never the actual ages: the band is all the recipient needs to see
// a teaser, and it keeps anything age-identifying out of a link that travels
// through third parties.
function ageShareBand(results) {
    if (!results || typeof results.realAge !== 'number') return null;
    const mentalGap = results.mentalAge - results.realAge;
    const energyGap = results.energyAge - results.realAge;
    const avg = (mentalGap + energyGap) / 2;
    if (avg <= -10) return 'mind-much-younger';
    if (avg <= -3) return 'mind-younger';
    if (avg < 3) return 'mind-balanced';
    if (avg < 10) return 'mind-older';
    return 'mind-much-older';
}

function generateShareUrl(results) {
    // Keep the locale prefix. `/age-calculator/` 301s to `/en/age-calculator/`,
    // so a Korean sender's link used to land a Korean recipient on English.
    // The old `?r=&m=&e=` payload was dead on arrival — the landing never read it.
    const base = `${window.location.origin}/${ageShareLang()}/age-calculator/`;
    const band = ageShareBand(results);
    return band ? `${base}s/${band}/` : base;
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
                title: ageShareCopy().title,
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
    const fullText = `${text}\n\n${url}\n\n#MyAIAge #AgeCalculator`;

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

// ============================================
// SHARE TEXT COPY (per locale)
// ============================================
// Follows the page language, not localStorage — same rule as the result copy.

const AGE_SHARE_COPY = {
    en: {
        vibeYoungest: "I'm way younger than my age! ", vibeYoung: 'Feeling younger than ever! ',
        vibeBalanced: 'Perfectly balanced! ', vibeWise: 'Wise soul here! ',
        title: 'My AI Age Results', real: 'Real Age', mental: 'Mental Age', energy: 'Energy Age',
        years: '', cta: 'Discover YOUR age:', ctaTry: 'Try it yourself!',
        younger: n => `${n}y younger`, older: n => `${n}y older`, same: 'same as real age'
    },
    ko: {
        vibeYoungest: '실제 나이보다 훨씬 젊게 나왔어요! ', vibeYoung: '그 어느 때보다 젊어요! ',
        vibeBalanced: '완벽한 균형이에요! ', vibeWise: '지혜로운 영혼이네요! ',
        title: '나의 AI 나이 결과', real: '실제 나이', mental: '정신 나이', energy: '에너지 나이',
        years: '세', cta: '당신의 나이도 확인해보세요:', ctaTry: '당신도 해보세요!',
        younger: n => `${n}세 젊음`, older: n => `${n}세 성숙`, same: '실제 나이와 동일'
    },
    ja: {
        vibeYoungest: '実年齢よりずっと若い結果でした! ', vibeYoung: 'かつてないほど若い! ',
        vibeBalanced: '完璧なバランス! ', vibeWise: '賢い魂です! ',
        title: '私のAI年齢の結果', real: '実年齢', mental: '精神年齢', energy: 'エネルギー年齢',
        years: '歳', cta: 'あなたの年齢も調べてみて:', ctaTry: 'あなたも試してみて!',
        younger: n => `${n}歳若い`, older: n => `${n}歳上`, same: '実年齢と同じ'
    },
    zh: {
        vibeYoungest: '比实际年龄年轻得多! ', vibeYoung: '感觉前所未有的年轻! ',
        vibeBalanced: '完美平衡! ', vibeWise: '智慧的灵魂! ',
        title: '我的AI年龄结果', real: '实际年龄', mental: '心理年龄', energy: '活力年龄',
        years: '岁', cta: '快来测测你的年龄:', ctaTry: '你也来试试!',
        younger: n => `年轻${n}岁`, older: n => `年长${n}岁`, same: '与实际年龄相同'
    },
    es: {
        vibeYoungest: '¡Soy mucho más joven que mi edad! ', vibeYoung: '¡Más joven que nunca! ',
        vibeBalanced: '¡Perfectamente equilibrado! ', vibeWise: '¡Alma sabia por aquí! ',
        title: 'Mi resultado de edad IA', real: 'Edad real', mental: 'Edad mental', energy: 'Edad de energía',
        years: ' años', cta: 'Descubre TU edad:', ctaTry: '¡Pruébalo tú también!',
        younger: n => `${n} años menos`, older: n => `${n} años más`, same: 'igual que la edad real'
    }
};

function ageShareCopy() {
    return AGE_SHARE_COPY[ageShareLang()];
}

/**
 * Generate share text based on platform
 */
function generateShareText(results, platform = 'default') {
    const { realAge, mentalAge, energyAge } = results;
    const mentalGap = mentalAge - realAge;
    const energyGap = energyAge - realAge;

    // Determine the vibe
    const C = ageShareCopy();
    let vibe = '';
    const avgGap = (mentalGap + energyGap) / 2;

    if (avgGap <= -7) {
        vibe = C.vibeYoungest;
    } else if (avgGap <= -3) {
        vibe = C.vibeYoung;
    } else if (avgGap <= 3) {
        vibe = C.vibeBalanced;
    } else {
        vibe = C.vibeWise;
    }

    const gapL = g => g < 0 ? C.younger(Math.abs(g)) : g > 0 ? C.older(g) : C.same;

    switch (platform) {
        case 'twitter':
            return `${vibe}${C.title}:\n${C.real}: ${realAge}${C.years}\n${C.mental}: ${mentalAge}${C.years} (${gapL(mentalGap)})\n${C.energy}: ${energyAge}${C.years} (${gapL(energyGap)})\n\n${C.cta}`;

        case 'whatsapp':
        case 'line':
        case 'telegram':
            return `${vibe}\n\n${C.title}:\n${C.real}: ${realAge}${C.years}\n${C.mental}: ${mentalAge}${C.years} (${gapL(mentalGap)})\n${C.energy}: ${energyAge}${C.years} (${gapL(energyGap)})\n\n${C.ctaTry}`;

        case 'threads':
        case 'instagram':
            return `${vibe}\n\n🎂 ${C.real}: ${realAge}${C.years}\n🧠 ${C.mental}: ${mentalAge}${C.years} (${gapL(mentalGap)})\n⚡ ${C.energy}: ${energyAge}${C.years} (${gapL(energyGap)})\n\n${C.ctaTry}`;

        case 'pinterest':
            return `${C.title}: ${C.real} ${realAge}, ${C.mental} ${mentalAge}, ${C.energy} ${energyAge}. ${C.cta}`;

        case 'wechat':
        case 'weibo':
            return `${vibe}\n\nAI年龄计算器结果:\n实际年龄: ${realAge}岁\n心理年龄: ${mentalAge}岁 (${getGapTextZh(mentalGap)})\n能量年龄: ${energyAge}岁 (${getGapTextZh(energyGap)})\n\n快来测试你的AI年龄!`;

        case 'clipboard':
            return `${C.title}:\n${C.real}: ${realAge}${C.years}\n${C.mental}: ${mentalAge}${C.years} (${gapL(mentalGap)})\n${C.energy}: ${energyAge}${C.years} (${gapL(energyGap)})`;

        case 'native':
            return `${vibe}${C.real}: ${realAge}, ${C.mental}: ${mentalAge}, ${C.energy}: ${energyAge}. ${C.cta}`;

        default:
            return `${C.title}: ${C.real} ${realAge}, ${C.mental} ${mentalAge}, ${C.energy} ${energyAge}`;
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
