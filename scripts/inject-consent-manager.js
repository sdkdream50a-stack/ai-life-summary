#!/usr/bin/env node
/**
 * inject-consent-manager.js
 *
 * Surgical fix for GDPR/AdSense compliance: pages that directly load
 * GA/AdSense/Clarity without going through consent-manager.js are stripped
 * of the direct loaders and gated through /js/consent-manager.js.
 *
 * Idempotent — re-running is a no-op once a page has consent-manager.js.
 *
 * Strips:
 *  - <script ... src="...googletagmanager.com..."></script>
 *  - <script>...dataLayer...gtag('config', ...);</script>
 *  - <script>...clarity...</script>
 *  - <script ... src="...pagead2.googlesyndication.com..."></script>
 *
 * Injects (before </head>):
 *  - <script src="/js/consent-manager.js"></script>
 */
const fs = require('fs');
const path = require('path');

const TARGETS = [
  'archive.html',
  'generate.html',
  'disclaimer.html',
  'faq.html',
  'age-calculator/compare.html',
  'age-calculator/result.html',
  'compatibility/result.html',
  'life-summary/archive.html',
  'life-summary/result.html',
  'blog/barnum-effect-psychology.html',
  'blog/biological-vs-mental-age.html',
  'blog/blood-type-compatibility-science.html',
  'blog/compatible-couples-psychology.html',
  'blog/erikson-psychosocial-stages.html',
  'blog/personality-career-guide.html',
  'blog/personality-types-love-patterns.html',
  'blog/psychology-test-stress-relief.html',
  'blog/relationship-compatibility-factors.html',
  'blog/zodiac-vs-ai-compatibility.html',
];

const I18N_LANGS = ['en', 'es', 'ja', 'ko', 'zh'];
const I18N_PAGES = [
  'about/index.html',
  'age-calculator/result/index.html',
  'compatibility/result/index.html',
  'disclaimer/index.html',
  'life-summary/result/index.html',
  'personality-type/index.html',
  'personality-type/result/index.html',
];
for (const lang of I18N_LANGS) {
  for (const page of I18N_PAGES) {
    TARGETS.push(`${lang}/${page}`);
  }
}

const ROOT = path.resolve(__dirname, '..');
const CONSENT_TAG = '<script src="/js/consent-manager.js"></script>';

function strip(html) {
  return html
    .replace(/<script[^>]*src="[^"]*googletagmanager\.com[^"]*"[^>]*><\/script>\s*/gi,
             '<!-- GA loaded via consent-manager.js -->\n')
    .replace(/<script>\s*window\.dataLayer\s*=[\s\S]*?gtag\([^)]*\);\s*<\/script>\s*/gi, '')
    .replace(/<script[^>]*>\s*\(function\(c,l,a,r,i,t,y\)[\s\S]*?clarity[\s\S]*?<\/script>\s*/gi,
             '<!-- Clarity loaded via consent-manager.js -->\n')
    .replace(/<script[^>]*src="[^"]*pagead2\.googlesyndication\.com[^"]*"[^>]*><\/script>\s*/gi,
             '<!-- AdSense loaded via consent-manager.js -->\n')
    .replace(/\s*<!--\s*Google Analytics\s*-->\s*/gi, '\n    ')
    .replace(/\s*<!--\s*Microsoft Clarity\s*-->\s*/gi, '')
    .replace(/\s*<!--\s*Google AdSense\s*-->\s*/gi, '');
}

function inject(html) {
  if (/<script[^>]*src="[^"]*consent-manager\.js"/i.test(html)) return html;
  if (!/<\/head>/i.test(html)) {
    throw new Error('No </head> found');
  }
  return html.replace(/<\/head>/i, `    ${CONSENT_TAG}\n</head>`);
}

let processed = 0;
let skipped = 0;
let failed = 0;
const summary = [];

for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    summary.push(`MISS  ${rel}`);
    failed++;
    continue;
  }
  try {
    const before = fs.readFileSync(file, 'utf8');
    const hadConsentScript = /<script[^>]*src="[^"]*consent-manager\.js"/i.test(before);
    const beforeNoCsp = before.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, '');
    const hadDirect = /<script[^>]*src="[^"]*(?:pagead2\.googlesyndication\.com|googletagmanager\.com)|clarity\.ms\/tag/i.test(beforeNoCsp);
    if (hadConsentScript && !hadDirect) {
      summary.push(`SKIP  ${rel} (already gated)`);
      skipped++;
      continue;
    }
    const stripped = strip(before);
    const final = inject(stripped);
    fs.writeFileSync(file, final);
    const stillHasDirect = /pagead2\.googlesyndication\.com|googletagmanager\.com|clarity\.ms/i.test(
      final.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, '')
    );
    if (stillHasDirect) {
      summary.push(`WARN  ${rel} (residual direct loader after strip)`);
    } else {
      summary.push(`OK    ${rel}`);
    }
    processed++;
  } catch (e) {
    summary.push(`FAIL  ${rel} — ${e.message}`);
    failed++;
  }
}

console.log(summary.join('\n'));
console.log(`\nDone. processed=${processed} skipped=${skipped} failed=${failed} total=${TARGETS.length}`);
