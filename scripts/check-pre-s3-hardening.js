#!/usr/bin/env node

/**
 * PRE-S3 hardening guard.
 *
 * Four contracts, each written against a defect that shipped to production and
 * was measured in the browser before it was fixed. Every check fails loudly if
 * the fix is reverted; `--selftest` mutates each contract in memory and asserts
 * the check goes red, so the guard cannot rot into a no-op.
 *
 *   1. CJK word-break   `word-break: keep-all` must not reach Japanese. Japanese
 *                       has no inter-word spaces, so keep-all makes a sentence one
 *                       unbreakable run: min-content becomes the sentence width and
 *                       every grid track sized from it blows past its container.
 *                       Measured on /ja/personality-type/: 49/36/32 elements past
 *                       their container at 375/390/430, the 16-type cards visibly
 *                       cut off. Two sources had to be closed — the lang-scoped
 *                       rule in each page's <style>, and the class-scoped rule in
 *                       css/global-kick.css that no lang selector ever reached.
 *
 *   2. Visible H1 truth The AI/IA capability modifier must not appear in a visible
 *                       H1 on a test surface. S2 corrected title/og/twitter and
 *                       left the H1s, so 26 of 27 surfaces still claimed the test
 *                       itself is AI-driven. The brand "AI Test Lab" is allowed.
 *
 *   3. FAQ parity       The visible FAQ is the canonical source; the FAQPage
 *                       JSON-LD must carry the same questions, in the same order,
 *                       with the same wording. Drifted since before S2: 6 visible
 *                       vs 5 structured, plus wording drift in ja/zh/es.
 *
 *   4. Target size      The graduated likert must keep round circles and give each
 *                       control a 44x44 hit area on narrow viewports. `.cpl
 *                       .pt-likert-btn{min-height:44px}` (S2-2c) had stretched the
 *                       circles into ellipses, and the hit areas were 24-38px wide.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES = ['ko', 'en', 'ja', 'zh', 'es'];
const FAMILIES = ['personality-type', 'compatibility', 'age-calculator', 'life-summary', 'vibe-check'];

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));

const failures = [];
const fail = (contract, detail) => failures.push(`${contract}: ${detail}`);

const decode = s => s
  .replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(Number(d)))
  .replace(/\s+/g, ' ').trim();

/** every deployable html file, generated pages and hand-authored alike */
const SKIP = new Set(['node_modules', '.git', '.omc', '.claude', '.wrangler', 'docs', 'drafts']);
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, acc);
    else if (entry.name.endsWith('.html')) acc.push(path.relative(ROOT, abs));
  }
  return acc;
}

// ---------------------------------------------------------------- contract 1
// A page grants keep-all to Japanese if a rule whose selector names lang="ja"
// declares it. The class-scoped rule in global-kick.css reaches ja pages through
// <body class="kick-mesh-bg">, so the ja override there is part of the contract.
const jaKeepAll = html => /html\[lang="ja"\][^{]*\{[^}]*word-break:\s*keep-all/s.test(html);

function checkWordBreak(overrides = {}) {
  const out = [];
  const pages = (overrides.pages || walk(ROOT))
    .filter(rel => /^ja\//.test(rel) || /^scripts\/templates\//.test(rel));
  for (const rel of pages) {
    const html = overrides.files && overrides.files[rel] !== undefined ? overrides.files[rel] : read(rel);
    if (jaKeepAll(html)) out.push(`${rel} still grants word-break:keep-all to lang="ja"`);
  }
  const gk = overrides.files && overrides.files['css/global-kick.css'] !== undefined
    ? overrides.files['css/global-kick.css'] : read('css/global-kick.css');
  if (!/html\[lang="ja"\]\s+\.kick-mesh-bg[\s\S]{0,160}word-break:\s*normal/.test(gk)) {
    out.push('css/global-kick.css lost the ja override for the class-scoped .kick-mesh-bg keep-all rule');
  }
  return out;
}

// ---------------------------------------------------------------- contract 2
const BRAND = /AI\s*Test\s*Lab|AI\s*테스트\s*랩|AI测试实验室/gi;
function h1ClaimsAI(html, lang) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return false;
  const text = decode(m[1]).replace(BRAND, ' ');
  if (/\bAI\b/i.test(text)) return true;
  if (lang === 'es' && /\bIA\b/.test(text)) return true;
  return false;
}

function checkH1Truth(overrides = {}) {
  const out = [];
  const targets = [];
  for (const lang of LOCALES) for (const fam of FAMILIES) targets.push(`${lang}/${fam}/index.html`);
  targets.push('friend-compatibility/index.html', 'marriage-compatibility/index.html');
  for (const rel of targets) {
    if (!exists(rel)) { out.push(`${rel} is missing`); continue; }
    const html = overrides.files && overrides.files[rel] !== undefined ? overrides.files[rel] : read(rel);
    const lang = (html.match(/<html[^>]*lang="([a-zA-Z-]+)"/) || [])[1] || '';
    if (h1ClaimsAI(html, lang)) {
      out.push(`${rel} visible H1 still claims the test is AI-driven: "${decode((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '')}"`);
    }
  }
  return out;
}

// ---------------------------------------------------------------- contract 3
function faqOf(html) {
  const section = html.match(/<section[^>]*id="faq"[\s\S]*?<\/section>/i);
  const visible = section
    ? [...section[0].matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/gi)].map(m => {
        const span = m[1].match(/<span[^>]*>([\s\S]*?)<\/span>/i);
        return decode(span ? span[1] : m[1]);
      })
    : [];
  let structured = null;
  let parseError = false;
  for (const block of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let parsed;
    try { parsed = JSON.parse(block[1]); } catch (e) { parseError = true; continue; }
    const nodes = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
    for (const node of nodes) {
      if (node && node['@type'] === 'FAQPage') structured = node.mainEntity.map(q => decode(String(q.name)));
    }
  }
  return { visible, structured, parseError };
}

function checkFaqParity(overrides = {}) {
  const out = [];
  for (const lang of LOCALES) {
    const rel = `${lang}/index.html`;
    const html = overrides.files && overrides.files[rel] !== undefined ? overrides.files[rel] : read(rel);
    const { visible, structured, parseError } = faqOf(html);
    if (parseError) { out.push(`${rel} has an unparseable ld+json block`); continue; }
    if (!visible.length) { out.push(`${rel} has no visible FAQ`); continue; }
    if (!structured) { out.push(`${rel} has no FAQPage node`); continue; }
    if (visible.length !== structured.length) {
      out.push(`${rel} FAQ count drift: ${visible.length} visible vs ${structured.length} in JSON-LD`);
      continue;
    }
    visible.forEach((q, i) => {
      if (q !== structured[i]) out.push(`${rel} FAQ #${i + 1} wording drift: visible "${q}" vs JSON-LD "${structured[i]}"`);
    });
  }
  return out;
}

// ---------------------------------------------------------------- contract 4
// The circle diameters and the narrow-viewport 44x44 hit area live in two places:
// the compatibility landings (inline, generated from the template) and
// js/personality-type.js, which injects the same control for the other flagship.
const TARGET_SOURCES = [
  'js/personality-type.js',
  'scripts/templates/compatibility.html',
  ...LOCALES.map(l => `${l}/compatibility/index.html`),
];

function checkTargetSize(overrides = {}) {
  const out = [];
  for (const rel of TARGET_SOURCES) {
    const src = overrides.files && overrides.files[rel] !== undefined ? overrides.files[rel] : read(rel);
    // circles stay round: min-height pinned to the diameter so `.cpl .pt-likert-btn
    // { min-height:44px }` cannot stretch them into ellipses
    for (const [cls, px] of [['s0', 38], ['s1', 30], ['s2', 24]]) {
      const re = new RegExp(`\\.pt-likert-btn\\.${cls}[^{}]*\\{[^}]*min-height:\\s*${px}px`);
      if (!re.test(src)) out.push(`${rel}: .${cls} lost its min-height:${px}px pin — the circle can be stretched into an ellipse`);
    }
    // narrow viewports: ends wrap to their own line and the input carries 44x44
    if (!/@media\s*\(max-width:\s*767px\)/.test(src)) {
      out.push(`${rel}: the <=767px likert block is gone — end labels no longer wrap and the 44x44 targets do not fit`);
      continue;
    }
    if (!/\.pt-likert\{[^}]*flex-wrap:\s*wrap/.test(src)) out.push(`${rel}: the narrow-viewport likert no longer wraps`);
    if (!/column-gap:\s*17px/.test(src)) out.push(`${rel}: the 17px column gap is gone — 44px targets would overlap their neighbours`);
    if (!/\.pt-likert-btn input\{[^}]*width:\s*44px;\s*height:\s*44px/.test(src)) {
      out.push(`${rel}: the likert input no longer carries a 44x44 hit area`);
    }
  }
  // the fix only reaches returning visitors if the URL changes with the bytes
  const stamp = overrides.files && overrides.files['scripts/stamp-asset-version.js'] !== undefined
    ? overrides.files['scripts/stamp-asset-version.js'] : read('scripts/stamp-asset-version.js');
  if (!/^\s*'personality-type',\s*$/m.test(stamp)) {
    out.push("scripts/stamp-asset-version.js: 'personality-type' left MANAGED — a changed likert would sit behind a 7-day cached URL");
  }
  return out;
}

// ---------------------------------------------------------------------- run
const CONTRACTS = [
  ['CJK word-break', checkWordBreak],
  ['Visible H1 truth', checkH1Truth],
  ['FAQ parity', checkFaqParity],
  ['Target size', checkTargetSize],
];

if (process.argv.includes('--selftest')) {
  // Each mutation reverts exactly one contract to its pre-fix shape and must go red.
  const MUTATIONS = [
    ['CJK word-break / page rule', 'CJK word-break', {
      'ja/personality-type/index.html': read('ja/personality-type/index.html')
        .replace('html[lang="ko"] body,html[lang="zh"] body{', 'html[lang="ko"] body,html[lang="ja"] body,html[lang="zh"] body{'),
    }],
    ['CJK word-break / global-kick override', 'CJK word-break', {
      'css/global-kick.css': read('css/global-kick.css').replace(/html\[lang="ja"\]\s+\.kick-mesh-bg[\s\S]*?\}/, ''),
    }],
    ['Visible H1 truth', 'Visible H1 truth', {
      'ja/personality-type/index.html': read('ja/personality-type/index.html')
        .replace(/<h1([^>]*)>\s*性格タイプ診断\s*<\/h1>/, '<h1$1>AI性格タイプ診断</h1>'),
    }],
    ['FAQ parity / count', 'FAQ parity', {
      // drop the last structured question, leaving the visible list one longer
      'ja/index.html': (() => {
        const html = read('ja/index.html');
        return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (full, open, json, close) => {
          let parsed;
          try { parsed = JSON.parse(json); } catch (e) { return full; }
          const nodes = parsed['@graph'] || [];
          const faq = nodes.find(n => n && n['@type'] === 'FAQPage');
          if (!faq) return full;
          faq.mainEntity = faq.mainEntity.slice(0, -1);
          return `${open}${JSON.stringify(parsed)}${close}`;
        });
      })(),
    }],
    ['FAQ parity / wording', 'FAQ parity', {
      'ja/index.html': (() => {
        const html = read('ja/index.html');
        return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (full, open, json, close) => {
          let parsed;
          try { parsed = JSON.parse(json); } catch (e) { return full; }
          const nodes = parsed['@graph'] || [];
          const faq = nodes.find(n => n && n['@type'] === 'FAQPage');
          if (!faq) return full;
          faq.mainEntity[2].name = '相性テストはどうやって行いますか？'; // the pre-fix drift
          return `${open}${JSON.stringify(parsed)}${close}`;
        });
      })(),
    }],
    ['Target size / ellipse pin', 'Target size', {
      'js/personality-type.js': read('js/personality-type.js').replace('width:38px;height:38px;min-height:38px;', 'width:38px;height:38px;'),
    }],
    ['Target size / narrow block', 'Target size', {
      'js/personality-type.js': read('js/personality-type.js').replace('@media (max-width:767px){', '@media (max-width:1px){'),
    }],
    ['Target size / 44x44 input', 'Target size', {
      'js/personality-type.js': read('js/personality-type.js').replace('width:44px;height:44px;', 'width:24px;height:24px;'),
    }],
    ['Target size / cache stamping', 'Target size', {
      'scripts/stamp-asset-version.js': read('scripts/stamp-asset-version.js').replace(/^\s*'personality-type',\s*$\n/m, ''),
    }],
  ];
  let detected = 0;
  for (const [label, contract, files] of MUTATIONS) {
    const check = CONTRACTS.find(c => c[0] === contract)[1];
    const found = check({ files });
    const red = found.length > 0;
    if (red) detected++;
    console.log(`${red ? 'RED  ' : 'GREEN'}  ${label}${red ? '' : '   <-- mutation NOT detected'}`);
  }
  console.log(`\nmutation detection: ${detected}/${MUTATIONS.length}`);
  process.exit(detected === MUTATIONS.length ? 0 : 1);
}

for (const [name, check] of CONTRACTS) {
  for (const detail of check()) fail(name, detail);
}

if (failures.length) {
  console.error('PRE-S3 hardening guard FAILED:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  'PRE-S3 hardening guard passed: 0 Japanese surfaces on word-break:keep-all (page rules + global-kick override), ' +
  `0 AI capability claims in the visible H1 across ${LOCALES.length * FAMILIES.length + 2} test surfaces, ` +
  `FAQ visible/JSON-LD parity on ${LOCALES.length} homes (order and wording), ` +
  `graduated likert round on ${TARGET_SOURCES.length} sources with 44x44 targets below 767px and content-addressed delivery.`
);
