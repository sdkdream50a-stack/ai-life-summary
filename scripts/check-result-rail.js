#!/usr/bin/env node
/**
 * Release 1 (2026-09-17 product rebase) regression guard.
 *
 *   1. RAIL MOUNT      every result surface mounts js/result-rail.js with its own slug
 *   2. FATE RELEVANCE  the bridge renders only for HIGH/MEDIUM tests and only in
 *                      locales FateAIverse serves (ko/ja/en); utm_source=smartaitest kept
 *   3. AFFILIATE OFF   no affiliate provider is enabled and no placement exists until a
 *                      program is approved; the fake netflix "affiliate" block stays dead
 *   4. NO DUPLICATES   legacy page_view/test_started/share_clicked/test_completed bindings
 *                      stay retired (canonical funnel is the only automatic binding)
 *   5. CONSENT PATH    inline gtagSafe helpers route through AnalyticsEvents.track
 *   6. TRUST           no fabricated participation counts on any page
 *   7. LOCALE LINKS    locale pages never link to root test paths that 301 to /en/
 *   8. JA/ZH WRAP      the rail does not apply word-break:keep-all outside Korean
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const failures = [];
const fail = m => failures.push(m);
const LANGS = ['ko', 'en', 'ja', 'zh', 'es'];

// ------------------------------------------------------------------ 1
const SURFACES = [];
for (const l of LANGS) {
  for (const s of ['compatibility', 'age-calculator', 'life-summary', 'personality-type']) SURFACES.push([`${l}/${s}/result/index.html`, s]);
  for (const s of ['love-type', 'work-style', 'communication-style', 'vibe-check', 'kpop-match']) SURFACES.push([`${l}/${s}/index.html`, s]);
}
for (const [file, slug] of SURFACES) {
  const raw = read(file);
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  const ids = html.match(/\bid=["']sat-result-rail["']/g) || [];
  if (ids.length !== 1) fail(`${file}: expected exactly 1 active element with id=sat-result-rail, got ${ids.length}`);
  if (/<(template|noscript)\b[^>]*>(?:(?!<\/\1>)[\s\S])*sat-result-rail/i.test(html)) fail(`${file}: rail mount/script inside <template>/<noscript>`);
  const mounts = html.match(/<div id="sat-result-rail" data-test="([^"]+)"><\/div>/g) || [];
  if (mounts.length !== 1) fail(`${file}: expected exactly 1 rail mount, got ${mounts.length}`);
  else if (!mounts[0].includes(`data-test="${slug}"`)) fail(`${file}: rail mounted for the wrong test (${mounts[0]})`);
  if (!/<script src="\/js\/result-rail\.js\?v=[0-9a-f]{8}" defer><\/script>/.test(html)) fail(`${file}: result-rail.js script tag missing or unversioned`);
}

// ------------------------------------------------------------------ 2/3/8
const src = read('js/result-rail.js');
const sandbox = { window: { location: { pathname: '/ko/x/', href: 'https://smartaitest.com/ko/x/' } }, document: { readyState: 'loading', addEventListener() {} }, URL };
vm.runInNewContext(src, sandbox);
const cfg = sandbox.window.SatResultRail._config;
const ALLOWED_BRIDGE = new Set(['compatibility', 'marriage-compatibility', 'love-type', 'life-summary', 'friend-compatibility', 'personality-type']);
for (const [slug, f] of Object.entries(cfg.FATE)) {
  const shows = f.level === 'HIGH' || f.level === 'MEDIUM';
  if (shows && !ALLOWED_BRIDGE.has(slug)) fail(`FATE relevance: ${slug} must not render a FateAIverse bridge (level ${f.level})`);
}
for (const s of ['kpop-match', 'vibe-check', 'age-calculator', 'work-style', 'communication-style']) {
  const f = cfg.FATE[s];
  if (!f || f.level === 'HIGH' || f.level === 'MEDIUM') fail(`FATE relevance: ${s} must stay LOW/NONE`);
}
const assert = require('assert');
try {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(cfg.FATE)), {
    compatibility: { level: 'HIGH', kind: 'pair' }, 'marriage-compatibility': { level: 'HIGH', kind: 'pair' },
    'love-type': { level: 'HIGH', kind: 'self' }, 'life-summary': { level: 'HIGH', kind: 'self' },
    'friend-compatibility': { level: 'MEDIUM', kind: 'pair' }, 'personality-type': { level: 'MEDIUM', kind: 'self' },
    'communication-style': { level: 'LOW' }, 'work-style': { level: 'LOW' }, 'age-calculator': { level: 'LOW' },
    'vibe-check': { level: 'LOW' }, 'kpop-match': { level: 'NONE' } });
} catch (e) { fail('FATE relevance contract changed (exact map expected — update this guard deliberately with a pre-registered experiment)'); }
try {
  const kept = new URL(cfg.withOrigin('https://fateaiverse.com/profiles/new?utm_source=partner', 'love-type', 'ko', 'result'));
  assert.deepStrictEqual(kept.searchParams.getAll('utm_source'), ['partner']);
  for (const [lang, prefix] of [['ko', '/ko'], ['ja', '/ja'], ['en', '']]) {
    for (const [kind, p2, t] of [['self', '/profiles/new', 'love-type'], ['pair', '/compatibility', 'compatibility']]) {
      const u = new URL(cfg.fateHref(t, lang, kind));
      assert.strictEqual(u.hostname, 'fateaiverse.com');
      assert.strictEqual(u.pathname, prefix + p2);
      assert.deepStrictEqual(u.searchParams.getAll('utm_source'), ['smartaitest']);
      const ALLOWED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'origin_test', 'origin_surface', 'origin_locale'];
      for (const k of u.searchParams.keys()) assert.ok(ALLOWED.includes(k), 'non-allowlisted param ' + k);
      for (const k of ALLOWED) assert.strictEqual(u.searchParams.getAll(k).length, 1);
    }
  }
} catch (e) { fail('FATE URL matrix/attribution: ' + e.message.split('\n')[0]); }
const bases = Object.keys(cfg.FATE_BASE).sort().join(',');
if (bases !== 'en,ja,ko') fail(`FATE locales: expected en,ja,ko, got ${bases}`);
const href = cfg.fateHref('love-type', 'ko', 'self');
if (!/[?&]utm_source=smartaitest(&|$)/.test(href)) fail(`FATE attribution: utm_source=smartaitest missing in ${href}`);
for (const k of ['origin_test=love-type', 'origin_surface=result', 'origin_locale=ko']) if (!href.includes(k)) fail(`FATE attribution: ${k} missing`);
for (const [name, p] of Object.entries(cfg.AFFILIATE.providers)) if (p.enabled !== false) fail(`AFFILIATE: provider ${name} is enabled`);
if (Object.keys(cfg.AFFILIATE.placements).length) fail('AFFILIATE: placements exist before any program is approved');
if (/\{[^}]*word-break:keep-all/.test(src.replace(/html\[lang=ko\][^{]*\{word-break:keep-all\}/g, ''))) fail('result-rail.js: word-break:keep-all applied outside html[lang=ko]');
for (const s of ['compatibility', 'age-calculator', 'life-summary']) {
  if (cfg.CARD_FIELDS[s]) fail(`SHARE CARD: ${s} results carry names/birthdates/ages — must not use the shared brand card`);
}
const mon = read('js/monetization.js');
if (!/insertAffiliateSection\(containerId, html\) \{\s*(\/\/[^\n]*\n\s*)*return;/.test(mon)) fail('monetization.js: insertAffiliateSection must stay disabled');

// ------------------------------------------------------------------ 4
const ae = read('js/analytics-events.js');
{
  const start = ae.indexOf('{', ae.indexOf('  bindEvents() {'));
  let depth = 0, end = start;
  for (let i = start; i < ae.length; i++) { if (ae[i] === '{') depth++; else if (ae[i] === '}' && --depth === 0) { end = i; break; } }
  const body = ae.slice(start + 1, end).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').trim();
  if (body) fail(`analytics-events.js: bindEvents must stay empty (legacy duplicates retired) — found: ${body.slice(0, 80)}`);
}

// ------------------------------------------------------------------ 5/6/7
const SKIP = new Set(['node_modules', '.git', 'docs', 'drafts', '.wrangler']);
const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name)); }
    else if (e.name.endsWith('.html')) htmlFiles.push(path.join(dir, e.name));
  }
})('.');
const FAKE = [/50,000 parejas/, /5万組以上/, /5万对情侣/, /50,000\+? couples/i, /수만 명이/, /수백만 명/];
const ROOT_TEST = /href="\/(vibe-check|kpop-match|age-calculator|life-summary|compatibility|personality-type|love-type|work-style|communication-style)\/"/;
for (const f of htmlFiles) {
  const html = read(f);
  if (/function gtagSafe\([^)]*\)\s*\{[^}]*gtag\('event'/.test(html)) fail(`${f}: gtagSafe sends straight to gtag (bypasses consent queue)`);
  const inline = (html.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi) || []).join('\n') + (html.match(/\son\w+="[^"]*"/g) || []).join('\n');
  // Direct inline sends bypass the consent queue. Only the dead legacy referral_landing path (viral-link ref_dob, never generated) is tolerated.
  const direct = [...inline.matchAll(/(?:window\s*\.\s*|window\s*\[\s*['"])?gtag(?:['"]\s*\])?\s*\(\s*['"]event['"]\s*,\s*['"]([\w-]+)/g)].map(m => m[1]).filter(n => n !== 'referral_landing');
  if (direct.length) fail(`${f}: inline gtag('event', ${direct[0]}) bypasses AnalyticsEvents.track consent queue`);
  for (const re of FAKE) if (re.test(html)) fail(`${f}: fabricated participation claim ${re}`);
  if (/^(ko|en|ja|zh|es)\//.test(f.replace(/^\.\//, '')) && ROOT_TEST.test(html)) fail(`${f}: links a root test path (301s to /en/): ${html.match(ROOT_TEST)[0]}`);
}

if (failures.length) {
  console.error(`result rail guard FAILED (${failures.length}):`);
  failures.slice(0, 40).forEach(m => console.error('  - ' + m));
  process.exit(1);
}
console.log(`result rail guard passed: ${SURFACES.length} result surfaces mounted, FATE relevance ${Object.keys(cfg.FATE).length} tests (bridge locales ko/ja/en), affiliate providers ${Object.keys(cfg.AFFILIATE.providers).length} disabled, legacy duplicate bindings 0, consent-bypassing gtagSafe 0, fabricated counts 0, root test links 0 across ${htmlFiles.length} pages`);
