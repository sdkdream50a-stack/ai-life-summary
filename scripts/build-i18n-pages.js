#!/usr/bin/env node

/**
 * build-i18n-pages.js
 *
 * Generates static HTML pages for each language subdirectory.
 * Extracts inline translations from template HTML files and creates
 * language-specific versions with proper hreflang tags and SEO metadata.
 *
 * Usage: node scripts/build-i18n-pages.js
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'ko', 'ja', 'zh', 'es'];
const DEFAULT_LANG = 'en';
const BASE_URL = 'https://smartaitest.com';

// Language-specific meta content
const META_CONTENT = {
    home: {
        en: {
            title: 'AI Test Lab - Free AI Personality Tests | Life Summary, Compatibility, Age',
            description: 'Discover yourself with AI-powered personality tests! Enter your birthday and get results in 1 minute. Life Summary, Compatibility Test, Mental Age Calculator. 1M+ tested!',
            ogTitle: 'What\'s Your AI Soul Type? - Free Test',
            ogDescription: 'Discover your true self in 1 minute. 1M+ found their soul type!'
        },
        ko: {
            title: 'AI 테스트 랩 - 무료 AI 심리테스트 | 인생요약, 궁합, 나이계산',
            description: 'AI가 분석하는 무료 심리테스트! 생년월일만 입력하면 1분만에 결과 확인. 인생요약, 궁합테스트, 정신나이 계산까지. 100만명이 선택한 인기 테스트!',
            ogTitle: '나의 AI 소울 타입은? - 무료 테스트',
            ogDescription: '1분 만에 알아보는 나의 진짜 모습. 100만 명이 발견한 소울 타입!'
        },
        ja: {
            title: 'AIテストラボ - 無料AI性格診断 | 人生要約、相性、年齢計算',
            description: 'AIが分析する無料性格診断！誕生日を入力するだけで1分で結果確認。人生要約、相性テスト、精神年齢計算まで。100万人が選んだ人気テスト！',
            ogTitle: 'あなたのAIソウルタイプは？ - 無料テスト',
            ogDescription: '1分で分かるあなたの本当の姿。100万人が発見したソウルタイプ！'
        },
        zh: {
            title: 'AI测试实验室 - 免费AI性格测试 | 人生总结、配对、年龄计算',
            description: 'AI分析的免费性格测试！只需输入生日，1分钟内得到结果。人生总结、配对测试、心理年龄计算。100万人选择的热门测试！',
            ogTitle: '你的AI灵魂类型是什么？ - 免费测试',
            ogDescription: '1分钟发现真正的自己。100万人已发现他们的灵魂类型！'
        },
        es: {
            title: 'AI Test Lab - Tests de Personalidad IA Gratis | Resumen de Vida, Compatibilidad, Edad',
            description: 'Descubre tu personalidad con tests impulsados por IA! Ingresa tu cumpleanos y obtene resultados en 1 minuto. Resumen de vida, test de compatibilidad, calculadora de edad mental. 1M+ probados!',
            ogTitle: 'Cual es tu tipo de alma IA? - Test Gratis',
            ogDescription: 'Descubre tu verdadero yo en 1 minuto. 1M+ encontraron su tipo de alma!'
        }
    },
    'life-summary': {
        en: {
            title: 'AI Life Summary - Your Life in One AI Sentence | Free Test',
            description: 'Get your personalized AI-generated life summary! Enter your birthday and discover your core traits, life phase, and lucky element. Free & instant results!',
            ogTitle: 'AI Life Summary - Your Life in One Sentence',
            ogDescription: 'What if AI could summarize your entire life in one sentence? Find out now!'
        },
        ko: {
            title: 'AI 인생요약 - 생년월일로 보는 내 인생 한 문장 | 무료 테스트',
            description: '생년월일만 입력하면 AI가 당신의 인생을 한 문장으로 요약! 핵심특성, 인생단계, 행운원소까지. 100% 무료, 1분만에 결과 확인!',
            ogTitle: 'AI 인생요약 - 내 인생을 한 문장으로?',
            ogDescription: '생년월일만 입력하면 AI가 당신의 인생을 한 문장으로 요약!'
        },
        ja: {
            title: 'AIライフサマリー - あなたの人生を一文で | 無料テスト',
            description: '誕生日を入力するだけでAIがあなたの人生を一文で要約！核心的特性、人生段階、ラッキーエレメントまで。100%無料、1分で結果確認！',
            ogTitle: 'AIライフサマリー - あなたの人生を一文で',
            ogDescription: 'AIがあなたの人生を一文で要約できたら？今すぐ確認！'
        },
        zh: {
            title: 'AI人生总结 - 一句话概括你的人生 | 免费测试',
            description: '只需输入生日，AI就能用一句话总结你的人生！核心特质、人生阶段、幸运元素。100%免费，1分钟出结果！',
            ogTitle: 'AI人生总结 - 一句话概括你的人生',
            ogDescription: '如果AI能用一句话总结你的整个人生呢？现在就来发现！'
        },
        es: {
            title: 'Resumen de Vida IA - Tu Vida en Una Oracion IA | Test Gratis',
            description: 'Obtene tu resumen de vida personalizado generado por IA! Ingresa tu cumpleanos y descubre tus rasgos principales, fase de vida y elemento de suerte. Gratis e instantaneo!',
            ogTitle: 'Resumen de Vida IA - Tu Vida en Una Oracion',
            ogDescription: 'Y si la IA pudiera resumir toda tu vida en una oracion? Descubrilo ahora!'
        }
    },
    compatibility: {
        en: {
            title: 'AI Compatibility Test - Couple Compatibility Calculator | AI Test Lab',
            description: 'Free AI Compatibility Test! Enter two birthdays to discover your love match score, animal couple type, romance movie genre, and lucky date. Instant results!',
            ogTitle: 'Is it Love or Just Delulu? - AI Compatibility Test',
            ogDescription: 'Stop guessing and check if they\'re your soulmate or a red flag. 500K+ couples tested!'
        },
        ko: {
            title: 'AI 궁합 테스트 - 커플 궁합 계산기 | AI Test Lab',
            description: '무료 AI 궁합 테스트! 생년월일로 커플 궁합 점수, 동물 커플 유형, 사랑 영화 장르, 럭키 데이트를 알아보세요. 즉시 결과 확인!',
            ogTitle: '그 사람 연락 안 오는 이유 (AI가 알려줌)',
            ogDescription: '짝사랑은 그만, 데이터가 말해주는 냉정한 궁합 팩트 체크. 50만+ 커플 테스트 완료!'
        },
        ja: {
            title: 'AI相性診断 - カップル相性計算機 | AI Test Lab',
            description: '無料AI相性診断！2人の誕生日を入力して、恋愛相性スコア、動物カップルタイプ、恋愛映画ジャンル、ラッキーデートを発見。即時結果！',
            ogTitle: '彼から連絡が来ない理由 (AIが教える)',
            ogDescription: '片思いはもう終わり、データが語る冷静な相性ファクトチェック。50万組以上がテスト済み！'
        },
        zh: {
            title: 'AI配对测试 - 情侣配对计算器 | AI Test Lab',
            description: '免费AI配对测试！输入两个生日，发现你们的爱情配对分数、动物情侣类型、爱情电影类型和幸运约会。即时结果！',
            ogTitle: '他不回消息的原因 (AI告诉你)',
            ogDescription: '别再单相思了，数据告诉你冷静的配对事实。50万+情侣已测试！'
        },
        es: {
            title: 'Test de Compatibilidad IA - Calculadora de Compatibilidad de Parejas | AI Test Lab',
            description: 'Test de Compatibilidad IA Gratis! Ingresa dos cumpleanos para descubrir tu puntuacion de amor, tipo de pareja animal, genero de pelicula romantica y fecha de suerte. Resultados instantaneos!',
            ogTitle: 'Es Amor o Solo Ilusion? - Test de Compatibilidad IA',
            ogDescription: 'Deja de adivinar y descubre si es tu alma gemela o una red flag. 500K+ parejas probadas!'
        }
    },
    'age-calculator': {
        en: {
            title: 'AI Age Calculator - Real Age vs Mental Age vs Energy Age | AI Test Lab',
            description: 'Discover your TRUE age with AI! Compare your real age, mental age, and energy age. Answer lifestyle questions and get your personalized age analysis. Free!',
            ogTitle: 'Are You a Boomer in a Gen-Z Body? - AI Age Calculator',
            ogDescription: 'Your ID says one thing. AI says another. Find out your REAL mental age!'
        },
        ko: {
            title: 'AI 나이 계산기 - 실제 나이 vs 정신 나이 vs 에너지 나이 | AI Test Lab',
            description: 'AI로 진짜 나이를 발견하세요! 실제 나이, 정신 나이, 에너지 나이를 비교. 라이프스타일 질문에 답하고 개인화된 나이 분석을 받으세요. 무료!',
            ogTitle: '꼰대력 테스트 - 당신은 MZ인 척하는 꼰대?',
            ogDescription: '주민등록증 나이가 다가 아니다. AI가 말해주는 진짜 정신 나이!'
        },
        ja: {
            title: 'AI年齢計算機 - 実年齢 vs 精神年齢 vs エネルギー年齢 | AI Test Lab',
            description: 'AIで本当の年齢を発見！実年齢、精神年齢、エネルギー年齢を比較。ライフスタイルの質問に答えて、パーソナライズされた年齢分析を受けよう。無料！',
            ogTitle: 'あなたはZ世代の体にいるブーマー？ - AI年齢計算機',
            ogDescription: 'IDには一つのことが書いてある。AIは別のことを言う。本当の精神年齢を発見！'
        },
        zh: {
            title: 'AI年龄计算器 - 实际年龄 vs 心理年龄 vs 能量年龄 | AI Test Lab',
            description: '用AI发现你的真实年龄！比较你的实际年龄、心理年龄和能量年龄。回答生活方式问题，获得个性化年龄分析。免费！',
            ogTitle: '你是披着Z世代皮的老人吗？ - AI年龄计算器',
            ogDescription: '身份证说一回事。AI说另一回事。发现你真正的心理年龄！'
        },
        es: {
            title: 'Calculadora de Edad IA - Edad Real vs Edad Mental vs Edad de Energia | AI Test Lab',
            description: 'Descubre tu edad REAL con IA! Compara tu edad real, edad mental y edad de energia. Responde preguntas de estilo de vida y obtene tu analisis de edad personalizado. Gratis!',
            ogTitle: 'Eres un Boomer en un Cuerpo Gen-Z? - Calculadora de Edad IA',
            ogDescription: 'Tu ID dice una cosa. La IA dice otra. Descubre tu edad mental REAL!'
        }
    }
};

// OG Locale mapping
const OG_LOCALES = {
    en: 'en_US',
    ko: 'ko_KR',
    ja: 'ja_JP',
    zh: 'zh_CN',
    es: 'es_ES'
};

// Pages to generate
const PAGES = [
    { template: 'index.html', slug: '', name: 'home' },
    { template: 'life-summary/index.html', slug: 'life-summary', name: 'life-summary' },
    { template: 'compatibility/index.html', slug: 'compatibility', name: 'compatibility' },
    { template: 'age-calculator/index.html', slug: 'age-calculator', name: 'age-calculator' }
];

// Result pages (need special handling)
const RESULT_PAGES = [
    { template: 'life-summary/result.html', slug: 'life-summary/result' },
    { template: 'compatibility/result.html', slug: 'compatibility/result' },
    { template: 'age-calculator/result.html', slug: 'age-calculator/result' }
];

/**
 * Generate hreflang tags for a page
 */
function generateHreflangTags(pagePath) {
    const tags = LANGUAGES.map(lang => {
        const url = pagePath ? `${BASE_URL}/${lang}/${pagePath}/` : `${BASE_URL}/${lang}/`;
        return `    <link rel="alternate" hreflang="${lang}" href="${url}">`;
    });

    // Add x-default pointing to English
    const xDefaultUrl = pagePath ? `${BASE_URL}/en/${pagePath}/` : `${BASE_URL}/en/`;
    tags.push(`    <link rel="alternate" hreflang="x-default" href="${xDefaultUrl}">`);

    return tags.join('\n');
}

/**
 * Remove inline language spans and keep only the target language
 * Uses a multi-pass approach to handle nested content properly
 */
function extractLanguageContent(html, targetLang) {
    let result = html;

    // Remove language CSS rules (we don't need them in single-language pages)
    result = result.replace(/\/\* Language switching.*?\*\/[\s\S]*?(?=\/\*|<\/style>)/g, '');

    const tagTypes = ['span', 'p', 'h1', 'h2', 'h3', 'li', 'div', 'a'];

    // First pass: Remove non-target language content
    // Process multiple times to handle all cases
    for (let pass = 0; pass < 3; pass++) {
        for (const lang of LANGUAGES) {
            if (lang !== targetLang) {
                for (const tag of tagTypes) {
                    // Match tag with lang-XX class, being careful with nested tags
                    // Use a function-based replacement to handle nested content
                    const openTagRegex = new RegExp(`<${tag}\\s+class="lang-${lang}"[^>]*>`, 'g');

                    let match;
                    while ((match = openTagRegex.exec(result)) !== null) {
                        const startIdx = match.index;
                        let depth = 1;
                        let endIdx = startIdx + match[0].length;

                        // Find the matching closing tag, accounting for nesting
                        while (depth > 0 && endIdx < result.length) {
                            const nextOpen = result.indexOf(`<${tag}`, endIdx);
                            const nextClose = result.indexOf(`</${tag}>`, endIdx);

                            if (nextClose === -1) break;

                            if (nextOpen !== -1 && nextOpen < nextClose) {
                                depth++;
                                endIdx = nextOpen + tag.length + 1;
                            } else {
                                depth--;
                                if (depth === 0) {
                                    endIdx = nextClose + tag.length + 3;
                                } else {
                                    endIdx = nextClose + tag.length + 3;
                                }
                            }
                        }

                        // Remove this element
                        result = result.substring(0, startIdx) + result.substring(endIdx);
                        openTagRegex.lastIndex = startIdx; // Reset to recheck from this position
                    }
                }
            }
        }
    }

    // Second pass: Unwrap target language content (keep content, remove wrapper tag)
    for (const tag of tagTypes) {
        // Simple regex for non-nested cases
        const regex = new RegExp(`<${tag}\\s+class="lang-${targetLang}"[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
        result = result.replace(regex, '$1');
    }

    // Clean up orphaned closing tags that might be left over
    result = result.replace(/<\/span>\s*<\/span>/g, '</span>');

    // Clean up empty whitespace and multiple newlines
    result = result.replace(/\n\s*\n\s*\n\s*\n/g, '\n\n');
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Remove lines that are just whitespace
    result = result.replace(/^\s+$/gm, '');

    return result;
}

/**
 * Update the html lang attribute
 */
function setHtmlLang(html, lang) {
    return html.replace(/<html\s+lang="[^"]*"/, `<html lang="${lang}"`);
}

/**
 * Update meta tags for SEO
 */
function updateMetaTags(html, pageName, lang, pageSlug) {
    const meta = META_CONTENT[pageName]?.[lang];
    if (!meta) return html;

    let result = html;

    // Update title
    result = result.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);

    // Update meta description
    result = result.replace(
        /<meta\s+name="description"\s+content="[^"]*">/,
        `<meta name="description" content="${meta.description}">`
    );

    // Update canonical URL
    const canonicalUrl = pageSlug ? `${BASE_URL}/${lang}/${pageSlug}/` : `${BASE_URL}/${lang}/`;
    result = result.replace(
        /<link\s+rel="canonical"\s+href="[^"]*">/,
        `<link rel="canonical" href="${canonicalUrl}">`
    );

    // Update OG URL
    result = result.replace(
        /<meta\s+property="og:url"\s+content="[^"]*">/,
        `<meta property="og:url" content="${canonicalUrl}">`
    );

    // Update OG title
    result = result.replace(
        /<meta\s+property="og:title"\s+content="[^"]*">/,
        `<meta property="og:title" content="${meta.ogTitle}">`
    );

    // Update OG description
    result = result.replace(
        /<meta\s+property="og:description"\s+content="[^"]*">/,
        `<meta property="og:description" content="${meta.ogDescription}">`
    );

    // Update OG locale
    result = result.replace(
        /<meta\s+property="og:locale"\s+content="[^"]*">/,
        `<meta property="og:locale" content="${OG_LOCALES[lang]}">`
    );

    // Update Twitter URL
    result = result.replace(
        /<meta\s+name="twitter:url"\s+content="[^"]*">/,
        `<meta name="twitter:url" content="${canonicalUrl}">`
    );

    // Update Twitter title
    result = result.replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*">/,
        `<meta name="twitter:title" content="${meta.ogTitle}">`
    );

    // Update Twitter description
    result = result.replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*">/,
        `<meta name="twitter:description" content="${meta.ogDescription}">`
    );

    return result;
}

/**
 * Insert hreflang tags into head
 */
function insertHreflangTags(html, pageSlug) {
    const hreflangTags = generateHreflangTags(pageSlug);

    // Find position after canonical tag or before </head>
    if (html.includes('<link rel="canonical"')) {
        return html.replace(
            /(<link\s+rel="canonical"[^>]*>)/,
            `$1\n\n    <!-- Hreflang Tags -->\n${hreflangTags}`
        );
    } else {
        return html.replace(
            '</head>',
            `    <!-- Hreflang Tags -->\n${hreflangTags}\n</head>`
        );
    }
}

/**
 * Fix asset paths for subdirectory structure
 */
function fixAssetPaths(html, depth) {
    const prefix = '../'.repeat(depth);

    // Fix relative paths
    let result = html;

    // CSS paths
    result = result.replace(/href="\.\.\/css\//g, `href="${prefix}css/`);
    result = result.replace(/href="\.\/css\//g, `href="${prefix}css/`);
    result = result.replace(/href="css\//g, `href="${prefix}css/`);

    // JS paths
    result = result.replace(/src="\.\.\/js\//g, `src="${prefix}js/`);
    result = result.replace(/src="\.\/js\//g, `src="${prefix}js/`);
    result = result.replace(/src="js\//g, `src="${prefix}js/`);

    // Favicon paths
    result = result.replace(/href="\.\.\/favicon/g, `href="${prefix}favicon`);
    result = result.replace(/href="\.\/favicon/g, `href="${prefix}favicon`);
    result = result.replace(/href="favicon/g, `href="${prefix}favicon`);

    // Apple touch icon
    result = result.replace(/href="\.\.\/apple-touch-icon/g, `href="${prefix}apple-touch-icon`);
    result = result.replace(/href="\.\/apple-touch-icon/g, `href="${prefix}apple-touch-icon`);

    // Manifest
    result = result.replace(/href="\.\.\/site\.webmanifest/g, `href="${prefix}site.webmanifest`);
    result = result.replace(/href="\.\/site\.webmanifest/g, `href="${prefix}site.webmanifest`);

    // Assets folder
    result = result.replace(/src="\.\.\/assets\//g, `src="${prefix}assets/`);
    result = result.replace(/src="\.\/assets\//g, `src="${prefix}assets/`);

    return result;
}

/**
 * Remove language detection script (not needed for static lang pages)
 */
function removeLanguageDetection(html) {
    // Remove the early language detection script block
    return html.replace(
        /<!-- Early Language Detection -->\s*<script>[\s\S]*?<\/script>/,
        '<!-- Language is set statically -->'
    );
}

/**
 * Update nav links to use language subdirectory paths
 */
function updateNavLinks(html, lang) {
    let result = html;

    // Update main nav links
    result = result.replace(/href="\/compatibility\/"/g, `href="/${lang}/compatibility/"`);
    result = result.replace(/href="\/life-summary\/"/g, `href="/${lang}/life-summary/"`);
    result = result.replace(/href="\/age-calculator\/"/g, `href="/${lang}/age-calculator/"`);
    result = result.replace(/href="\/profile\/"/g, `href="/${lang}/profile/"`);
    result = result.replace(/href="\/about\.html"/g, `href="/${lang}/about/"`);
    result = result.replace(/href="\/blog\.html"/g, `href="/blog.html"`); // Blog stays at root
    result = result.replace(/href="\/contact\.html"/g, `href="/${lang}/contact/"`);
    result = result.replace(/href="\/privacy-policy\.html"/g, `href="/${lang}/privacy-policy/"`);
    result = result.replace(/href="\/terms-of-service\.html"/g, `href="/${lang}/terms-of-service/"`);

    // Home link
    result = result.replace(/href="\/"/g, `href="/${lang}/"`);

    // Result page redirects
    result = result.replace(
        /window\.location\.href = '\/compatibility\/result\.html'/g,
        `window.location.href = '/${lang}/compatibility/result/'`
    );
    result = result.replace(
        /window\.location\.href = '\/life-summary\/result\.html'/g,
        `window.location.href = '/${lang}/life-summary/result/'`
    );
    result = result.replace(
        /window\.location\.href = '\/age-calculator\/result\.html'/g,
        `window.location.href = '/${lang}/age-calculator/result/'`
    );

    return result;
}

/**
 * Replace switchLang function to redirect to language subdirectories
 */
function updateSwitchLangFunction(html, pageSlug) {
    // Build the path pattern based on current page
    const pathSuffix = pageSlug ? `/${pageSlug}/` : '/';

    // Replace the switchLang function to navigate to language subdirectory
    const newSwitchLang = `function switchLang(lang, event) {
        if (event) event.stopPropagation();
        // Show loading feedback
        var btn = event && event.target;
        if (btn) btn.style.opacity = '0.5';
        document.body.style.cursor = 'wait';
        // Save preference
        localStorage.setItem('ai-life-summary-lang', lang);
        localStorage.setItem('preferredLanguage', lang);
        // Navigate immediately
        window.location.replace('/' + lang + '${pathSuffix}');
    }`;

    // Find and replace the entire switchLang function (from "function switchLang" to the next "function" or closing script)
    // Match the function and all its content including nested braces
    let result = html;

    // Match from "function switchLang(lang)" to "function toggleLangDropdown"
    result = result.replace(
        /function switchLang\(lang\)\s*\{[\s\S]*?\n\s*function toggleLangDropdown/,
        newSwitchLang + '\n\n    function toggleLangDropdown'
    );

    // CRITICAL: Remove DOMContentLoaded handler that calls switchLang
    // This would cause infinite redirect loop since switchLang now redirects
    result = result.replace(
        /\/\/ Initialize on load\s*\n\s*document\.addEventListener\('DOMContentLoaded',\s*function\(\)\s*\{[^}]*switchLang\(lang\);[^}]*\}\);/g,
        '// Language is set statically for this page'
    );

    // Update onclick handlers to pass event for stopPropagation
    result = result.replace(/onclick="switchLang\('(\w+)'\)"/g, 'onclick="switchLang(\'$1\', event)"');
    result = result.replace(/onclick="switchLang\('(\w+)'\);/g, 'onclick="switchLang(\'$1\', event);');

    // Remove body opacity:0 flash - pages are already in correct language
    result = result.replace(
        /body\s*\{\s*opacity:\s*0;[^}]*\}/g,
        'body { opacity: 1; }'
    );
    result = result.replace(
        /html\.lang-ready body\s*\{\s*opacity:\s*1;\s*\}/g,
        '/* lang-ready not needed - static language page */'
    );
    result = result.replace(
        /@keyframes showBody[^}]*\{[^}]*\}/g,
        '/* showBody animation not needed */'
    );

    return result;
}

/**
 * Update language indicator to show correct flag for current language
 */
function updateLanguageIndicator(html, lang) {
    const langFlags = {
        en: '🇺🇸 EN',
        ko: '🇰🇷 한국어',
        ja: '🇯🇵 日本語',
        zh: '🇨🇳 中文',
        es: '🇪🇸 Español'
    };

    // Replace the default language indicator
    let result = html.replace(
        /<span id="current-lang">[^<]*<\/span>/g,
        `<span id="current-lang">${langFlags[lang]}</span>`
    );

    // Also update any initialization script that sets the wrong language
    result = result.replace(
        /currentLangEl\.textContent\s*=\s*langFlags\[currentLang\][^;]*;/g,
        `currentLangEl.textContent = '${langFlags[lang]}';`
    );

    return result;
}

/**
 * Add Quiz schema for test pages
 */
function addQuizSchema(html, pageName, lang) {
    if (!['life-summary', 'compatibility', 'age-calculator'].includes(pageName)) {
        return html;
    }

    const schemas = {
        'life-summary': {
            en: {
                name: 'AI Life Summary Test',
                description: 'Discover your life in one AI-generated sentence based on your birthday'
            },
            ko: {
                name: 'AI 인생 요약 테스트',
                description: '생년월일 기반 AI가 생성한 한 문장으로 당신의 인생을 발견하세요'
            },
            ja: {
                name: 'AIライフサマリーテスト',
                description: '誕生日に基づいてAIが生成した一文であなたの人生を発見'
            },
            zh: {
                name: 'AI人生总结测试',
                description: '根据你的生日，AI生成的一句话来发现你的人生'
            },
            es: {
                name: 'Test de Resumen de Vida IA',
                description: 'Descubre tu vida en una oracion generada por IA basada en tu cumpleanos'
            }
        },
        compatibility: {
            en: {
                name: 'AI Compatibility Test',
                description: 'Discover your love compatibility with AI analysis based on two birthdays'
            },
            ko: {
                name: 'AI 궁합 테스트',
                description: '두 생년월일 기반 AI 분석으로 사랑 궁합을 발견하세요'
            },
            ja: {
                name: 'AI相性診断',
                description: '2つの誕生日に基づくAI分析で恋愛相性を発見'
            },
            zh: {
                name: 'AI配对测试',
                description: '根据两个生日的AI分析发现你们的爱情配对'
            },
            es: {
                name: 'Test de Compatibilidad IA',
                description: 'Descubre tu compatibilidad amorosa con analisis de IA basado en dos cumpleanos'
            }
        },
        'age-calculator': {
            en: {
                name: 'AI Age Calculator',
                description: 'Discover your real age, mental age, and energy age with AI analysis'
            },
            ko: {
                name: 'AI 나이 계산기',
                description: 'AI 분석으로 실제 나이, 정신 나이, 에너지 나이를 발견하세요'
            },
            ja: {
                name: 'AI年齢計算機',
                description: 'AI分析で実年齢、精神年齢、エネルギー年齢を発見'
            },
            zh: {
                name: 'AI年龄计算器',
                description: '通过AI分析发现你的实际年龄、心理年龄和能量年龄'
            },
            es: {
                name: 'Calculadora de Edad IA',
                description: 'Descubre tu edad real, edad mental y edad de energia con analisis de IA'
            }
        }
    };

    const schema = schemas[pageName]?.[lang];
    if (!schema) return html;

    const quizSchema = `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": "${schema.name}",
        "description": "${schema.description}",
        "educationalLevel": "all ages",
        "typicalAgeRange": "13-65",
        "inLanguage": "${lang}",
        "provider": {
            "@type": "Organization",
            "name": "AI Test Lab",
            "url": "${BASE_URL}"
        }
    }
    </script>`;

    // Insert before closing head tag
    return html.replace('</head>', `${quizSchema}\n</head>`);
}

/**
 * Add Content Security Policy meta tag
 */
function addCSPHeader(html) {
    // Check if CSP already exists
    if (html.includes('Content-Security-Policy')) {
        return html;
    }

    const csp = `
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval'
            https://www.googletagmanager.com
            https://www.google-analytics.com
            https://www.clarity.ms
            https://pagead2.googlesyndication.com
            https://adservice.google.com
            https://partner.googleadservices.com
            https://tpc.googlesyndication.com
            https://www.gstatic.com
            https://cdn.jsdelivr.net
            https://developers.kakao.com
            https://t1.kakaocdn.net;
        style-src 'self' 'unsafe-inline'
            https://fonts.googleapis.com;
        font-src 'self'
            https://fonts.gstatic.com;
        img-src 'self' data: blob:
            https:;
        connect-src 'self'
            https://www.google-analytics.com
            https://analytics.google.com
            https://www.clarity.ms
            https://pagead2.googlesyndication.com
            https://adservice.google.com;
        frame-src 'self'
            https://googleads.g.doubleclick.net
            https://tpc.googlesyndication.com
            https://www.google.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
    ">`.replace(/\s+/g, ' ').trim();

    return html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n    ${csp}`);
}

/**
 * Add mobile enhancement CSS and JS
 */
function addMobileEnhancements(html, depth) {
    const prefix = '../'.repeat(depth);

    // Add mobile CSS before closing </head>
    const mobileCSS = `    <link rel="stylesheet" href="${prefix}css/mobile-enhancements.css">\n`;

    // Add mobile JS before closing </body>
    const mobileJS = `    <script src="${prefix}js/mobile-enhancements.js" defer></script>\n`;

    // Insert CSS if not already present
    if (!html.includes('mobile-enhancements.css')) {
        html = html.replace('</head>', `${mobileCSS}</head>`);
    }

    // Insert JS if not already present
    if (!html.includes('mobile-enhancements.js')) {
        html = html.replace('</body>', `${mobileJS}</body>`);
    }

    return html;
}

/**
 * Fix mobile navbar positioning by adding inline styles
 * This ensures the navbar is positioned on the left on mobile devices
 */
function fixMobileNavbar(html) {
    // Add inline style to navbar for mobile positioning
    // Using a <style> tag with high specificity that will be injected into head
    const mobileNavbarCSS = `
    <style id="mobile-navbar-fix">
    @media screen and (max-width: 768px) {
        nav.kick-navbar,
        .kick-navbar,
        #floating-navbar {
            position: fixed !important;
            top: auto !important;
            bottom: 20px !important;
            left: 16px !important;
            right: auto !important;
            inset: auto auto 20px 16px !important;
            transform: none !important;
            -webkit-transform: none !important;
            margin: 0 !important;
        }
    }
    </style>
`;

    // Insert right before </head> to ensure it loads last
    html = html.replace('</head>', `${mobileNavbarCSS}</head>`);

    return html;
}

/**
 * Fix mobile menu by adding close button handler
 */
function fixMobileMenu(html) {
    // Find the mobile menu script and add close button handler
    const oldScript = `document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });`;

    const newScript = `document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.remove('hidden');
        });
        document.getElementById('mobile-menu-close').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        // Close menu when clicking outside
        document.getElementById('mobile-menu').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });`;

    html = html.replace(oldScript, newScript);

    return html;
}

/**
 * Remove auto-loading analytics/ads scripts (now handled by consent manager)
 */
function removeAutoLoadScripts(html) {
    // Remove Google Analytics script tags
    html = html.replace(
        /<script[^>]*src="[^"]*googletagmanager\.com[^"]*"[^>]*><\/script>/gi,
        '<!-- GA loaded via consent manager -->'
    );
    html = html.replace(
        /<script>\s*window\.dataLayer\s*=[\s\S]*?gtag\([^)]*\);\s*<\/script>/gi,
        ''
    );

    // Remove Microsoft Clarity script
    html = html.replace(
        /<script[^>]*>\s*\(function\(c,l,a,r,i,t,y\)[\s\S]*?clarity[\s\S]*?<\/script>/gi,
        '<!-- Clarity loaded via consent manager -->'
    );

    // Remove Google AdSense script
    html = html.replace(
        /<script[^>]*src="[^"]*pagead2\.googlesyndication\.com[^"]*"[^>]*><\/script>/gi,
        '<!-- AdSense loaded via consent manager -->'
    );

    // Remove comment markers for these scripts
    html = html.replace(/\s*<!--\s*Google Analytics\s*-->\s*/gi, '\n    ');
    html = html.replace(/\s*<!--\s*Microsoft Clarity\s*-->\s*/gi, '');
    html = html.replace(/\s*<!--\s*Google AdSense\s*-->\s*/gi, '');

    return html;
}

/**
 * Process a single page for a single language
 */
function processPage(templatePath, pageName, pageSlug, lang) {
    const rootDir = path.join(__dirname, '..');
    const templateFile = path.join(rootDir, templatePath);

    if (!fs.existsSync(templateFile)) {
        console.warn(`Template not found: ${templateFile}`);
        return null;
    }

    let html = fs.readFileSync(templateFile, 'utf-8');

    // Calculate depth for asset paths
    const depth = pageSlug ? pageSlug.split('/').length + 1 : 1;

    // Apply transformations in order
    html = setHtmlLang(html, lang);
    html = extractLanguageContent(html, lang);
    html = updateMetaTags(html, pageName, lang, pageSlug);
    html = insertHreflangTags(html, pageSlug);
    html = fixAssetPaths(html, depth);
    html = removeLanguageDetection(html);
    html = updateNavLinks(html, lang);
    html = updateSwitchLangFunction(html, pageSlug);
    html = updateLanguageIndicator(html, lang);
    html = addQuizSchema(html, pageName, lang);
    html = removeAutoLoadScripts(html);
    html = addCSPHeader(html);
    html = addMobileEnhancements(html, depth);
    html = fixMobileNavbar(html);
    html = fixMobileMenu(html);

    return html;
}

/**
 * Main build function
 */
function build() {
    const rootDir = path.join(__dirname, '..');
    let pagesGenerated = 0;

    console.log('Building i18n pages...\n');

    for (const lang of LANGUAGES) {
        console.log(`\nProcessing language: ${lang}`);

        // Create language directory
        const langDir = path.join(rootDir, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }

        for (const page of PAGES) {
            const html = processPage(page.template, page.name, page.slug, lang);
            if (!html) continue;

            // Determine output path
            let outputDir, outputFile;
            if (page.slug) {
                outputDir = path.join(langDir, page.slug);
                outputFile = path.join(outputDir, 'index.html');
            } else {
                outputDir = langDir;
                outputFile = path.join(langDir, 'index.html');
            }

            // Create directory if needed
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write file
            fs.writeFileSync(outputFile, html, 'utf-8');
            console.log(`  Created: ${path.relative(rootDir, outputFile)}`);
            pagesGenerated++;
        }

        // Process result pages
        for (const page of RESULT_PAGES) {
            const templateFile = path.join(rootDir, page.template);
            if (!fs.existsSync(templateFile)) {
                console.warn(`  Result template not found: ${page.template}`);
                continue;
            }

            let html = fs.readFileSync(templateFile, 'utf-8');
            const depth = page.slug.split('/').length + 1;

            html = setHtmlLang(html, lang);
            html = extractLanguageContent(html, lang);
            html = fixAssetPaths(html, depth);
            html = removeLanguageDetection(html);
            html = updateNavLinks(html, lang);
            html = updateSwitchLangFunction(html, page.slug);
            html = updateLanguageIndicator(html, lang);
            html = fixMobileNavbar(html);

            // Update canonical and OG URLs for result pages
            const resultUrl = `${BASE_URL}/${lang}/${page.slug}/`;
            html = html.replace(
                /<link\s+rel="canonical"\s+href="[^"]*">/,
                `<link rel="canonical" href="${resultUrl}">`
            );
            html = html.replace(
                /<meta\s+property="og:url"\s+content="[^"]*">/,
                `<meta property="og:url" content="${resultUrl}">`
            );

            const outputDir = path.join(langDir, page.slug);
            const outputFile = path.join(outputDir, 'index.html');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputFile, html, 'utf-8');
            console.log(`  Created: ${path.relative(rootDir, outputFile)}`);
            pagesGenerated++;
        }
    }

    console.log(`\n✓ Generated ${pagesGenerated} pages across ${LANGUAGES.length} languages`);
}

// Run if called directly
if (require.main === module) {
    build();
}

module.exports = { build, processPage, generateHreflangTags };
