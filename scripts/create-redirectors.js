#!/usr/bin/env node

/**
 * create-redirectors.js
 *
 * Creates language detector/redirector pages for root paths.
 * These pages detect the user's preferred language and redirect
 * to the appropriate language subdirectory.
 *
 * Usage: node scripts/create-redirectors.js
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'ko', 'ja', 'zh', 'es'];
const BASE_URL = 'https://smartaitest.com';

// Pages that need redirectors
const REDIRECTOR_PAGES = [
    { path: 'index.html', target: '' },
    { path: 'life-summary/index.html', target: 'life-summary/' },
    { path: 'compatibility/index.html', target: 'compatibility/' },
    { path: 'age-calculator/index.html', target: 'age-calculator/' }
];

/**
 * Generate the redirector HTML
 */
function generateRedirectorHTML(targetPath, originalTitle) {
    const canonicalUrl = targetPath ? `${BASE_URL}/${targetPath}` : BASE_URL;
    const hreflangTags = LANGUAGES.map(lang => {
        const url = targetPath ? `${BASE_URL}/${lang}/${targetPath}` : `${BASE_URL}/${lang}/`;
        return `    <link rel="alternate" hreflang="${lang}" href="${url}">`;
    }).join('\n');

    const xDefaultUrl = targetPath ? `${BASE_URL}/en/${targetPath}` : `${BASE_URL}/en/`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${originalTitle}</title>

    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Hreflang Tags for SEO -->
${hreflangTags}
    <link rel="alternate" hreflang="x-default" href="${xDefaultUrl}">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="${targetPath ? '../'.repeat(targetPath.split('/').filter(Boolean).length) : './'}favicon.svg">

    <!-- Open Graph for crawlers -->
    <meta property="og:url" content="${canonicalUrl}">

    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .loader {
            text-align: center;
            color: white;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.2);
            border-top-color: #8B5CF6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .loader p {
            opacity: 0.8;
            font-size: 14px;
        }
        noscript {
            display: block;
            text-align: center;
            padding: 20px;
        }
        noscript a {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 8px;
        }
        noscript a:hover {
            background: #4f46e5;
        }
    </style>

    <script>
    (function() {
        var supportedLangs = ['en', 'ko', 'ja', 'zh', 'es'];
        var targetPath = '${targetPath}';

        // Priority 1: Check localStorage for saved preference
        var saved = localStorage.getItem('ai-life-summary-lang');
        if (saved && supportedLangs.indexOf(saved) !== -1) {
            redirect(saved);
            return;
        }

        // Priority 2: Check URL parameters (?lang=ko or ?hl=ko)
        var params = new URLSearchParams(window.location.search);
        var urlLang = params.get('lang') || params.get('hl');
        if (urlLang) {
            var code = urlLang.split('-')[0].toLowerCase();
            if (supportedLangs.indexOf(code) !== -1) {
                localStorage.setItem('ai-life-summary-lang', code);
                redirect(code);
                return;
            }
        }

        // Priority 3: Detect from browser language
        var browserLangs = navigator.languages || [navigator.language];
        var detectedLang = 'en'; // default

        // First check for exact match with Korean (target market)
        var langCodes = browserLangs.map(function(l) {
            return l.split('-')[0].toLowerCase();
        });

        if (langCodes.indexOf('ko') !== -1) {
            detectedLang = 'ko';
        } else {
            // Then check for other supported languages
            for (var i = 0; i < langCodes.length; i++) {
                if (supportedLangs.indexOf(langCodes[i]) !== -1) {
                    detectedLang = langCodes[i];
                    break;
                }
            }
        }

        localStorage.setItem('ai-life-summary-lang', detectedLang);
        redirect(detectedLang);

        function redirect(lang) {
            var url = '/' + lang + '/' + targetPath;
            // Use replace to not create back button loop
            window.location.replace(url);
        }
    })();
    </script>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <p>Redirecting to your language...</p>
    </div>

    <noscript>
        <h2 style="color: white;">Select Your Language / 언어를 선택하세요</h2>
        <p style="color: rgba(255,255,255,0.7);">JavaScript is required for automatic detection</p>
        <div>
            <a href="/en/${targetPath}">🇺🇸 English</a>
            <a href="/ko/${targetPath}">🇰🇷 한국어</a>
            <a href="/ja/${targetPath}">🇯🇵 日本語</a>
            <a href="/zh/${targetPath}">🇨🇳 中文</a>
            <a href="/es/${targetPath}">🇪🇸 Español</a>
        </div>
    </noscript>
</body>
</html>
`;
}

// Page titles for SEO
const PAGE_TITLES = {
    '': 'AI Test Lab - AI Personality Tests | 인생요약, 궁합, 나이계산',
    'life-summary/': 'AI Life Summary | AI 인생요약 - Your Life in One Sentence',
    'compatibility/': 'AI Compatibility Test | AI 궁합 테스트 - Love Calculator',
    'age-calculator/': 'AI Age Calculator | AI 나이계산기 - Mental Age Test'
};

/**
 * Main function to create redirector pages
 */
function createRedirectors() {
    const rootDir = path.join(__dirname, '..');

    console.log('Creating language redirector pages...\n');

    for (const page of REDIRECTOR_PAGES) {
        const title = PAGE_TITLES[page.target] || 'AI Test Lab';
        const html = generateRedirectorHTML(page.target, title);

        const outputPath = path.join(rootDir, page.path);

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, html, 'utf-8');
        console.log(`  Created: ${page.path}`);
    }

    console.log('\n✓ Created language redirectors for all root pages');
}

// Run if called directly
if (require.main === module) {
    createRedirectors();
}

module.exports = { createRedirectors, generateRedirectorHTML };
