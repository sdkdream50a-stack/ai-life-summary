#!/usr/bin/env node

/**
 * update-ad-placements.js
 *
 * Replaces placeholder ad slots with real AdSense units
 * and adds strategic ad placements for optimal revenue.
 *
 * Usage: node scripts/update-ad-placements.js
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'ko', 'ja', 'zh', 'es'];
const PUBLISHER_ID = 'ca-pub-6241798439911569';

// Ad unit templates
const AD_UNITS = {
    // Hero bottom - responsive in-article
    heroBottom: `
        <section class="py-6">
            <div class="max-w-4xl mx-auto px-4">
                <div id="ad-hero-bottom" class="ad-container ad-hero-bottom" data-ad-slot="hero-bottom" data-ad-status="pending">
                    <p class="ad-label">Sponsored</p>
                </div>
            </div>
        </section>`,

    // Leaderboard ad (replaces placeholder)
    leaderboard: `
        <section class="py-6">
            <div class="max-w-4xl mx-auto px-4">
                <div id="ad-leaderboard" class="ad-container ad-leaderboard" data-ad-slot="leaderboard" data-ad-status="pending">
                    <p class="ad-label">Advertisement</p>
                </div>
            </div>
        </section>`,

    // Pre-result high RPM ad
    preResult: `
        <div class="ad-pre-result-wrapper py-8">
            <div class="max-w-lg mx-auto px-4">
                <div id="ad-pre-result" class="ad-container ad-pre-result" data-ad-slot="pre-result" data-ad-status="pending">
                    <p class="ad-label">Sponsored</p>
                </div>
            </div>
        </div>`,

    // In-feed native ad
    inFeed: `
        <div id="ad-in-feed" class="ad-container ad-in-feed" data-ad-slot="in-feed" data-ad-status="pending">
            <p class="ad-label">Sponsored</p>
        </div>`,

    // Mid-quiz ad
    midQuiz: `
        <div id="ad-mid-quiz" class="ad-container ad-mid-quiz" data-ad-slot="mid-quiz" data-ad-status="pending">
            <p class="ad-label">Advertisement</p>
        </div>`,

    // Result page multiplex
    resultMultiplex: `
        <section class="py-8">
            <div class="max-w-4xl mx-auto px-4">
                <div id="ad-result-multiplex" class="ad-container" data-ad-slot="result-multiplex" data-ad-status="pending">
                    <p class="ad-label">You might also like</p>
                </div>
            </div>
        </section>`
};

// Sponsored content by page type
const SPONSORED_CONTENT = {
    compatibility: {
        en: {
            title: 'Recommended for You',
            items: [
                { icon: '💑', title: 'Relationship Quiz Book', desc: 'Deepen your connection with 365 questions', tag: 'Best Seller' },
                { icon: '💝', title: 'Date Night Ideas', desc: 'Creative activities for couples', tag: 'Trending' },
                { icon: '📱', title: 'Couples App', desc: 'Games and activities for two', tag: 'Free Download' }
            ]
        },
        ko: {
            title: '당신을 위한 추천',
            items: [
                { icon: '💑', title: '커플 질문 365', desc: '연인과 더 깊은 대화를 나눠보세요', tag: '베스트셀러' },
                { icon: '💝', title: '데이트 아이디어', desc: '커플을 위한 창의적인 활동', tag: '인기' },
                { icon: '📱', title: '커플 앱', desc: '둘을 위한 게임과 활동', tag: '무료 다운로드' }
            ]
        },
        ja: {
            title: 'あなたへのおすすめ',
            items: [
                { icon: '💑', title: 'カップル質問365', desc: 'パートナーともっと深い会話を', tag: 'ベストセラー' },
                { icon: '💝', title: 'デートアイデア', desc: 'カップルのためのクリエイティブな活動', tag: '人気' },
                { icon: '📱', title: 'カップルアプリ', desc: '二人のためのゲームと活動', tag: '無料' }
            ]
        },
        zh: {
            title: '为您推荐',
            items: [
                { icon: '💑', title: '情侣问答365', desc: '与伴侣进行更深入的对话', tag: '畅销书' },
                { icon: '💝', title: '约会创意', desc: '情侣创意活动', tag: '热门' },
                { icon: '📱', title: '情侣应用', desc: '两人的游戏和活动', tag: '免费下载' }
            ]
        },
        es: {
            title: 'Recomendado para ti',
            items: [
                { icon: '💑', title: 'Preguntas de Pareja 365', desc: 'Profundiza tu conexion', tag: 'Mas Vendido' },
                { icon: '💝', title: 'Ideas para Citas', desc: 'Actividades creativas para parejas', tag: 'Trending' },
                { icon: '📱', title: 'App de Parejas', desc: 'Juegos y actividades para dos', tag: 'Gratis' }
            ]
        }
    },
    'life-summary': {
        en: {
            title: 'Explore More',
            items: [
                { icon: '📚', title: 'Personality Psychology', desc: 'Understanding the science of self', tag: 'Educational' },
                { icon: '🧘', title: 'Self-Discovery Journal', desc: 'Daily prompts for growth', tag: 'Popular' },
                { icon: '🔮', title: 'Birth Chart Analysis', desc: 'Deeper astrological insights', tag: 'Premium' }
            ]
        },
        ko: {
            title: '더 알아보기',
            items: [
                { icon: '📚', title: '성격 심리학', desc: '자기 이해의 과학', tag: '교육' },
                { icon: '🧘', title: '자기 발견 일지', desc: '성장을 위한 매일의 질문', tag: '인기' },
                { icon: '🔮', title: '출생 차트 분석', desc: '더 깊은 점성술 인사이트', tag: '프리미엄' }
            ]
        },
        ja: {
            title: 'もっと探索',
            items: [
                { icon: '📚', title: '性格心理学', desc: '自己理解の科学', tag: '教育' },
                { icon: '🧘', title: '自己発見ジャーナル', desc: '成長のための毎日のプロンプト', tag: '人気' },
                { icon: '🔮', title: '出生チャート分析', desc: 'より深い占星術の洞察', tag: 'プレミアム' }
            ]
        },
        zh: {
            title: '探索更多',
            items: [
                { icon: '📚', title: '性格心理学', desc: '自我理解的科学', tag: '教育' },
                { icon: '🧘', title: '自我发现日记', desc: '每日成长提示', tag: '热门' },
                { icon: '🔮', title: '出生图分析', desc: '更深入的占星洞察', tag: '高级' }
            ]
        },
        es: {
            title: 'Explorar Mas',
            items: [
                { icon: '📚', title: 'Psicologia de Personalidad', desc: 'La ciencia del autoconocimiento', tag: 'Educativo' },
                { icon: '🧘', title: 'Diario de Autodescubrimiento', desc: 'Prompts diarios para crecer', tag: 'Popular' },
                { icon: '🔮', title: 'Carta Natal', desc: 'Insights astrologicos profundos', tag: 'Premium' }
            ]
        }
    },
    'age-calculator': {
        en: {
            title: 'Wellness Resources',
            items: [
                { icon: '🏃', title: 'Fitness Age Test', desc: 'Physical age assessment', tag: 'Health' },
                { icon: '🧠', title: 'Brain Training', desc: 'Keep your mind young', tag: 'Popular' },
                { icon: '💤', title: 'Sleep Tracker', desc: 'Optimize your rest', tag: 'Free' }
            ]
        },
        ko: {
            title: '웰니스 리소스',
            items: [
                { icon: '🏃', title: '체력 나이 테스트', desc: '신체 나이 평가', tag: '건강' },
                { icon: '🧠', title: '두뇌 훈련', desc: '마음을 젊게 유지하세요', tag: '인기' },
                { icon: '💤', title: '수면 트래커', desc: '휴식 최적화', tag: '무료' }
            ]
        },
        ja: {
            title: 'ウェルネスリソース',
            items: [
                { icon: '🏃', title: '体力年齢テスト', desc: '身体年齢の評価', tag: '健康' },
                { icon: '🧠', title: '脳トレーニング', desc: '心を若く保つ', tag: '人気' },
                { icon: '💤', title: '睡眠トラッカー', desc: '休息を最適化', tag: '無料' }
            ]
        },
        zh: {
            title: '健康资源',
            items: [
                { icon: '🏃', title: '体能年龄测试', desc: '身体年龄评估', tag: '健康' },
                { icon: '🧠', title: '脑力训练', desc: '保持头脑年轻', tag: '热门' },
                { icon: '💤', title: '睡眠追踪', desc: '优化休息', tag: '免费' }
            ]
        },
        es: {
            title: 'Recursos de Bienestar',
            items: [
                { icon: '🏃', title: 'Test de Edad Fisica', desc: 'Evaluacion de edad corporal', tag: 'Salud' },
                { icon: '🧠', title: 'Entrenamiento Cerebral', desc: 'Manten tu mente joven', tag: 'Popular' },
                { icon: '💤', title: 'Rastreador de Sueno', desc: 'Optimiza tu descanso', tag: 'Gratis' }
            ]
        }
    }
};

// Premium CTA translations
const PREMIUM_CTA = {
    en: { title: 'Go Premium', desc: 'Remove all ads for just $2.99/month', btn: 'Upgrade Now' },
    ko: { title: '프리미엄으로 업그레이드', desc: '월 $2.99로 모든 광고 제거', btn: '지금 업그레이드' },
    ja: { title: 'プレミアムへ', desc: '月額$2.99で全ての広告を非表示', btn: '今すぐアップグレード' },
    zh: { title: '升级高级版', desc: '每月仅$2.99移除所有广告', btn: '立即升级' },
    es: { title: 'Hazte Premium', desc: 'Elimina todos los anuncios por $2.99/mes', btn: 'Mejorar Ahora' }
};

/**
 * Generate sponsored content section HTML
 */
function generateSponsoredContent(pageType, lang) {
    const content = SPONSORED_CONTENT[pageType]?.[lang];
    if (!content) return '';

    const itemsHtml = content.items.map(item => `
        <a href="#" class="sponsored-card" onclick="AdsManager.trackEvent('sponsored_click', {item: '${item.title}'})">
            <div class="sponsored-card-icon">${item.icon}</div>
            <div class="sponsored-card-content">
                <p class="sponsored-card-title">${item.title}</p>
                <p class="sponsored-card-desc">${item.desc}</p>
            </div>
        </a>
    `).join('');

    return `
        <section class="py-8">
            <div class="max-w-4xl mx-auto px-4">
                <div class="sponsored-section">
                    <div class="sponsored-header">
                        <h3 class="sponsored-title">${content.title}</h3>
                        <span class="sponsored-badge">Sponsored</span>
                    </div>
                    <div class="sponsored-grid">
                        ${itemsHtml}
                    </div>
                </div>
            </div>
        </section>`;
}

/**
 * Generate premium CTA HTML
 */
function generatePremiumCTA(lang) {
    const cta = PREMIUM_CTA[lang] || PREMIUM_CTA.en;
    return `
        <div class="max-w-4xl mx-auto px-4">
            <div class="premium-cta">
                <div class="premium-cta-icon">⭐</div>
                <div class="premium-cta-content">
                    <p class="premium-cta-title">${cta.title}</p>
                    <p class="premium-cta-desc">${cta.desc}</p>
                </div>
                <a href="#premium" class="premium-cta-btn" onclick="AdsManager.trackEvent('premium_cta_click')">${cta.btn}</a>
            </div>
        </div>`;
}

/**
 * Replace placeholder ad slots in HTML
 */
function replaceAdPlaceholders(html, pageType, lang) {
    let result = html;

    // Replace old placeholder format
    result = result.replace(
        /<section class="py-8">\s*<div class="max-w-4xl mx-auto px-4">\s*<div class="kick-glass rounded-xl p-6 text-center">\s*<p class="text-white\/50 text-sm mb-2">Advertisement<\/p>\s*<div class="h-20 flex items-center justify-center text-white\/30">\s*\[Ad Slot[^\]]*\]\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/g,
        AD_UNITS.leaderboard
    );

    // Also match simpler placeholder patterns
    result = result.replace(
        /\[Ad Slot[^\]]*\]/g,
        '<ins class="adsbygoogle" style="display:block" data-ad-format="auto" data-full-width-responsive="true"></ins>'
    );

    return result;
}

/**
 * Add ads CSS and JS to head
 */
function addAdAssets(html, depth) {
    const prefix = '../'.repeat(depth);

    // Add ads.css
    const cssLink = `<link rel="stylesheet" href="${prefix}css/ads.css">`;

    // Add ads-manager.js with defer
    const jsScript = `<script src="${prefix}js/ads-manager.js" defer></script>`;

    // Insert CSS before </head>
    result = html.replace('</head>', `    ${cssLink}\n</head>`);

    // Insert JS before </body>
    result = result.replace('</body>', `    ${jsScript}\n</body>`);

    return result;
}

/**
 * Add strategic ad placements based on page type
 */
function addStrategicAds(html, pageType, lang) {
    let result = html;

    // Add hero-bottom ad after hero section
    result = result.replace(
        /(<!-- Hero Section -->[\s\S]*?<\/section>)/,
        `$1\n${AD_UNITS.heroBottom}`
    );

    // Add sponsored content before footer
    const sponsoredContent = generateSponsoredContent(pageType, lang);
    if (sponsoredContent) {
        result = result.replace(
            '<!-- Footer -->',
            `${sponsoredContent}\n    <!-- Footer -->`
        );
    }

    return result;
}

/**
 * Process a single HTML file
 */
function processFile(filePath, pageType, lang) {
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf-8');

    // Calculate depth for asset paths
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const depth = relativePath.split(path.sep).length - 1;
    const prefix = '../'.repeat(depth);

    // Replace placeholders
    html = replaceAdPlaceholders(html, pageType, lang);

    // Add strategic ads
    html = addStrategicAds(html, pageType, lang);

    // Add CSS link
    if (!html.includes('ads.css')) {
        html = html.replace('</head>', `    <link rel="stylesheet" href="${prefix}css/ads.css">\n</head>`);
    }

    // Add consent manager first (must load before analytics/ads)
    if (!html.includes('consent-manager.js')) {
        html = html.replace('</body>', `    <script src="${prefix}js/consent-manager.js"></script>\n</body>`);
    }

    // Add analytics events
    if (!html.includes('analytics-events.js')) {
        html = html.replace('</body>', `    <script src="${prefix}js/analytics-events.js" defer></script>\n</body>`);
    }

    // Add exit intent (only on non-result pages)
    if (!html.includes('exit-intent.js') && pageType !== 'result') {
        html = html.replace('</body>', `    <script src="${prefix}js/exit-intent.js" defer></script>\n</body>`);
    }

    // Add ads-manager.js (with defer, loads after consent)
    if (!html.includes('ads-manager.js')) {
        html = html.replace('</body>', `    <script src="${prefix}js/ads-manager.js" defer></script>\n</body>`);
    }

    // Write back
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`  Updated: ${relativePath}`);
}

/**
 * Main function
 */
function updateAdPlacements() {
    const rootDir = path.join(__dirname, '..');

    console.log('Updating ad placements...\n');

    // Process each language directory
    for (const lang of LANGUAGES) {
        console.log(`Processing ${lang}...`);

        // Main pages
        const pages = [
            { path: `${lang}/index.html`, type: 'home' },
            { path: `${lang}/life-summary/index.html`, type: 'life-summary' },
            { path: `${lang}/compatibility/index.html`, type: 'compatibility' },
            { path: `${lang}/age-calculator/index.html`, type: 'age-calculator' },
            { path: `${lang}/life-summary/result/index.html`, type: 'result' },
            { path: `${lang}/compatibility/result/index.html`, type: 'result' },
            { path: `${lang}/age-calculator/result/index.html`, type: 'result' }
        ];

        for (const page of pages) {
            const filePath = path.join(rootDir, page.path);
            processFile(filePath, page.type, lang);
        }
    }

    console.log('\n✓ Ad placements updated');
}

// Run if called directly
if (require.main === module) {
    updateAdPlacements();
}

module.exports = { updateAdPlacements, generateSponsoredContent, generatePremiumCTA };
