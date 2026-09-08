#!/usr/bin/env node
/**
 * S2 Home regression guard.
 *
 * Locks the S2-1 Home contract: one hierarchy, no unbacked promise, no
 * FateAIverse doorway, no cross-locale copy leak.
 *
 * Deliberately does NOT re-check what check-s1-guards.js already owns:
 *   - template <-> generated parity (checkTemplateParity)
 *   - analytics instrumentation coverage (checkFunnelCoverage)
 *   - referral UTM shape, locale authority, share channels, trust copy, FAQ schema
 * That guard is asserted to still be wired instead (check 11).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'ko', 'ja', 'zh', 'es'];

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const home = lang => `${lang}/index.html`;

const failures = [];
const fail = (lang, check, detail) => failures.push(`[${lang}] ${check}: ${detail}`);

/** Visible-ish text: drop script/style/comments so CSS and dead JS never trip a copy check. */
function textOf(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

/** Per-locale Home copy that must be present, and the AI claims that must not. */
const EXPECT = {
  en: { h1: 'Your current self,', flagship: ['Personality Type Test', 'Compatibility Test'], intent: 'What do you want to know?' },
  ko: { h1: '지금의 나,', flagship: ['성격 유형 검사', '궁합 테스트'], intent: '무엇이 궁금해?' },
  ja: { h1: '今の自分、', flagship: ['性格タイプ診断', '相性診断'], intent: '何を知りたい？' },
  zh: { h1: '现在的你，', flagship: ['性格类型测试', '配对测试'], intent: '你想知道什么？' },
  es: { h1: 'Tu yo de ahora,', flagship: ['Tipo de Personalidad', 'Test de Compatibilidad'], intent: '¿Qué quieres saber?' }
};

/** Brand names are allowed; these assert the product *does* AI work, and are not. */
const BRAND = [/AI Test Lab/g, /AIテストラボ/g, /AI 테스트 랩/g, /AI测试实验室/g, /AI Life Summary/g, /@AITestLab/g];
const AI_CLAIMS = [
  'AI診断', 'AI分析', 'AIが分析', 'AIが見抜', 'AI性格分析',
  'AI 분석', 'AI가 분석', 'AI 진단',
  'AI analysis', 'AI-powered', 'analyzed by AI', 'AI personality analysis',
  'AI分析', 'AI驱动', 'AI智能分析',
  'analizado por IA', 'IA analiza', 'impulsado por IA'
];

/** Real-time / viral-hub promises with no data source behind them. */
const HUB_MARKERS = ['viral-card', 'viral-hub.css', 'バイラルハブ', 'Test Hub', '테스트 허브', '病毒中心', 'Centro Viral'];
const REALTIME = ['リアルタイムで確認', '실시간으로 확인', 'Check in real-time', '实时查看', 'en tiempo real'];

/** Unbacked popularity badges. */
const BADGES = ['>HOT<', '>LEAD<', '>NEW<'];

for (const lang of LANGS) {
  const rel = home(lang);

  // 1. the 5 locale Homes exist
  if (!fs.existsSync(path.join(ROOT, rel))) {
    fail(lang, '1 home exists', `${rel} missing`);
    continue;
  }
  const html = read(rel);
  const text = textOf(html);
  const exp = EXPECT[lang];

  // 2. no AI capability claim in the Hero (brand names stripped first)
  const headAndHero = text.slice(0, text.indexOf('id="intent"') === -1 ? text.length : text.indexOf('id="intent"'));
  let scrubbed = headAndHero;
  BRAND.forEach(b => { scrubbed = scrubbed.replace(b, ' '); });
  const claim = AI_CLAIMS.find(c => scrubbed.includes(c));
  if (claim) fail(lang, '2 hero AI claim', `"${claim}" present outside the brand name`);

  // 3. no AI-capability hashtag
  const hashtag = /tags\/AI[^"]*"[^>]*>\s*#AI/.exec(html);
  if (hashtag) fail(lang, '3 AI hashtag', 'an #AI… hashtag link is still on the Home');

  // 4. no viral hub / real-time promise
  const hub = HUB_MARKERS.find(m => (m === 'Test Hub' ? text : html).includes(m));
  if (hub) fail(lang, '4 viral hub', `"${hub}" still referenced`);
  const rt = REALTIME.find(m => text.includes(m));
  if (rt) fail(lang, '4 real-time promise', `"${rt}" still on the Home`);

  // 5/6. both flagships present, as flagship cards, in order
  const flagHrefs = [...html.matchAll(/<a[^>]*class="s2-flag-card"[^>]*>/g)]
    .map(m => (/href="([^"]+)"/.exec(m[0]) || [])[1]);
  const wantFlags = [`/${lang}/personality-type/`, `/${lang}/compatibility/`];
  if (flagHrefs.length !== 2 || flagHrefs[0] !== wantFlags[0] || flagHrefs[1] !== wantFlags[1]) {
    fail(lang, '5/6 flagship tier', `expected ${wantFlags.join(' then ')}, got ${JSON.stringify(flagHrefs)}`);
  }
  exp.flagship.forEach(t => {
    if (!text.includes(t)) fail(lang, '5/6 flagship copy', `"${t}" missing`);
  });

  // 7. kpop-match is secondary, never a flagship card
  const more = /<section[^>]*id="more-tests"[\s\S]*?<\/section>/.exec(html);
  if (!more) {
    fail(lang, '7 kpop tier', '#more-tests section missing');
  } else {
    if (!more[0].includes(`/${lang}/kpop-match/`)) fail(lang, '7 kpop tier', 'kpop-match not in the secondary tier');
    if (flagHrefs.some(h => h && h.includes('kpop-match'))) fail(lang, '7 kpop tier', 'kpop-match promoted to a flagship card');
  }

  // 8. no FateAIverse link on the Home (value first, cross-sell after the result)
  const fa = (html.match(/fateaiverse/gi) || []).length;
  if (fa !== 0) fail(lang, '8 fateaiverse', `${fa} reference(s) on the Home`);

  // 9. no unbacked popularity badge
  const badge = BADGES.find(b => html.includes(b));
  if (badge) fail(lang, '9 unbacked badge', `${badge} still rendered`);

  // 10. no other locale's Home copy leaked in
  if (!text.includes(exp.h1)) fail(lang, '10 locale copy', `own hero copy "${exp.h1}" missing`);
  if (!text.includes(exp.intent)) fail(lang, '10 locale copy', `own intent heading missing`);
  for (const other of LANGS) {
    if (other === lang) continue;
    const foreign = EXPECT[other];
    if (text.includes(foreign.h1)) fail(lang, '10 locale leak', `carries ${other} hero copy "${foreign.h1}"`);
    if (text.includes(foreign.intent)) fail(lang, '10 locale leak', `carries ${other} intent heading`);
  }

  // structural: every intent chip must point at an id that exists (no dead CTA)
  const chips = [...html.matchAll(/<a href="(#[^"]+)" class="s2-chip"/g)].map(m => m[1]);
  if (chips.length !== 3) fail(lang, 'intent chips', `expected 3, got ${chips.length}`);
  chips.forEach(href => {
    if (!html.includes(`id="${href.slice(1)}"`)) fail(lang, 'intent chip target', `${href} resolves to nothing`);
  });
  const heroCta = /<a href="(#[^"]+)" class="s2-hero-cta">/.exec(html);
  if (!heroCta) {
    fail(lang, 'hero CTA', 'hero CTA missing');
  } else if (!html.includes(`id="${heroCta[1].slice(1)}"`)) {
    fail(lang, 'hero CTA target', `${heroCta[1]} resolves to nothing`);
  }

  // title / og:title / twitter:title carry no AI capability claim (brand is fine)
  for (const [label, re] of [['title', /<title>([^<]*)<\/title>/],
                             ['og:title', /<meta property="og:title" content="([^"]*)"/],
                             ['twitter:title', /<meta name="twitter:title" content="([^"]*)"/]]) {
    const m = re.exec(html);
    if (!m) continue;
    let t = m[1];
    BRAND.forEach(b => { t = t.replace(b, ' '); });
    const c = AI_CLAIMS.find(x => t.includes(x));
    if (c) fail(lang, `2 ${label} AI claim`, `"${c}" outside the brand name`);
  }
}

// --- S2-2 -----------------------------------------------------------------
// Every page that opted into Clean Pop Lab, and the assets the Home must not reload.
const CPL_PAGES = [];
for (const l of LANGS) CPL_PAGES.push(home(l), `${l}/personality-type/index.html`, `${l}/compatibility/index.html`);
const DEAD_HOME_ASSETS = [
  'js/badges.js', 'js/level-xp.js', 'js/streak.js', 'js/user-data.js',
  'js/auth.js', 'js/gamification-ui.js', 'js/referral.js',
  'css/gamification.css', 'css/popups.css', 'css/viral-hub.css', 'canvas-confetti'
];

for (const lang of LANGS) {
  const html = read(home(lang));

  // S2-2B: the dead gamification payload must not come back to the Home
  const back = DEAD_HOME_ASSETS.filter(a => html.includes(a));
  if (back.length) fail(lang, 'S2-2B dead assets', `${back.join(', ')} re-referenced on the Home`);

  // S2-2A: the JA Home needs word-break:normal — `keep-all` clips Japanese grids
  if (lang === 'ja') {
    if (!/html\[lang="ja"\][^{]*\{[^}]*word-break:\s*normal/.test(html)) {
      fail(lang, 'S2-2A word-break', 'the JA-scoped `word-break: normal` rule is gone; keep-all clips the JA Home');
    }
  } else if (/html\[lang="(?!ja)[a-z]{2}"\][^{]*\{[^}]*word-break:\s*normal/.test(html)) {
    fail(lang, 'S2-2A word-break', 'word-break:normal leaked outside ja');
  }
}

// S2-2C: the Home and both flagship landings share one visual family
for (const rel of CPL_PAGES) {
  if (!fs.existsSync(path.join(ROOT, rel))) { fail(rel, 'S2-2C page', 'missing'); continue; }
  const html = read(rel);
  if (!/<html[^>]*\bclass="[^"]*\bcpl\b/.test(html)) fail(rel, 'S2-2C opt-in', 'the `cpl` class is not on <html>');
  if (!html.includes('/css/clean-pop-lab.css')) fail(rel, 'S2-2C opt-in', 'clean-pop-lab.css is not linked');
}
if (!fs.existsSync(path.join(ROOT, 'css/clean-pop-lab.css'))) {
  fail('repo', 'S2-2C stylesheet', 'css/clean-pop-lab.css is missing');
}
if (fs.existsSync(path.join(ROOT, 'css/viral-hub.css'))) {
  fail('repo', 'S2-2B dead asset', 'css/viral-hub.css is back');
}

// S2-2: the FateAIverse referral surface must be untouched by Home work
{
  const walk = dir => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(e => {
    if (e.name === 'node_modules' || e.name.startsWith('.')) return [];
    const rel = path.posix.join(dir, e.name);
    return e.isDirectory() ? walk(rel) : (e.name.endsWith('.html') ? [rel] : []);
  });
  const files = walk('.').filter(f => !f.startsWith('scripts/'));
  let hits = 0, withRef = 0;
  for (const f of files) {
    const n = (read(f).match(/fateaiverse/gi) || []).length;
    if (n) { withRef++; hits += n; }
  }
  if (withRef !== 16 || hits !== 32) {
    fail('repo', 'S2-2 referral', `deployed FateAIverse surface changed: ${withRef} files / ${hits} hits (expected 16 files / 32 occurrences)`);
  }
}

// --- S2-3 -----------------------------------------------------------------
// The compatibility engine can only produce [50,95]; "0-100%" is a range it
// cannot reach, and the ko FAQ used to credit an AI for a rule-based score.
const FAQ_LIES = ['0-100%', '0–100%', '0〜100%', 'AI 궁합', 'AI相性テスト'];
// Landing titles keep the brand but must not claim the AI does the work.
const LANDING_TESTS = ['personality-type', 'compatibility', 'age-calculator', 'life-summary', 'vibe-check'];
const TITLE_CLAIMS = {
  ja: ['AI性格', 'AI相性', 'AI年齢', 'AIライフ', 'AIバイブ', 'AI診断', 'AI分析'],
  ko: ['AI 성격', 'AI 궁합', 'AI 나이', 'AI 인생', 'AI 바이브', 'AI 분석'],
  en: ['AI Personality', 'AI Compatibility', 'AI Age', 'AI Life Summary', 'AI Vibe', 'AI analysis'],
  zh: ['AI性格', 'AI配对', 'AI年龄', 'AI人生', 'AI vibe', 'AI分析'],
  es: ['Personalidad IA', 'Compatibilidad IA', 'Edad IA', 'Vida IA', 'AI Vibe']
};
const META_FIELDS = [
  /<title>([^<]*)</, /<meta property="og:title" content="([^"]*)"/,
  /<meta name="twitter:title" content="([^"]*)"/, /<meta name="description" content="([^"]*)"/,
  /<meta property="og:description" content="([^"]*)"/, /<meta name="twitter:description" content="([^"]*)"/
];

for (const lang of LANGS) {
  const html = read(home(lang));
  const text = textOf(html);

  const lie = FAQ_LIES.find(x => text.includes(x));
  if (lie) fail(lang, 'S2-3 FAQ truth', `"${lie}" is back on the Home`);
  // the ko FAQPage Question name lived in JSON-LD too — check the raw source
  const jsonLie = FAQ_LIES.find(x => html.includes(x));
  if (jsonLie) fail(lang, 'S2-3 FAQ truth', `"${jsonLie}" present in the Home source (visible or JSON-LD)`);

  // Trust must be the 4-card rebuild, not the old "Why" grid, and it must resolve
  if (!/<section[^>]*id="trust"/.test(html)) fail(lang, 'S2-3 trust', 'the Trust section is missing');
  const trustCards = (html.match(/class="s2-trust-card"/g) || []).length;
  if (trustCards !== 4) fail(lang, 'S2-3 trust', `expected 4 trust cards, got ${trustCards}`);
  const engineLink = /<a class="s2-trust-link" href="(#[^"]+)"/.exec(html);
  if (!engineLink) fail(lang, 'S2-3 trust', 'the engine-explanation link is missing');
  else if (!html.includes(`id="${engineLink[1].slice(1)}"`)) fail(lang, 'S2-3 trust', `${engineLink[1]} resolves to nothing`);

  // Result Preview: two honest example cards, image lazy, no invented numbers
  if ((html.match(/class="s2-rp-card"/g) || []).length !== 2) fail(lang, 'S2-3 result preview', 'expected 2 preview cards');
  const img = /<img[^>]*class="s2-rp-img"[^>]*>/.exec(html) || /<img src="\/assets\/images\/pt\/[^"]+"[^>]*>/.exec(html);
  if (!img) fail(lang, 'S2-3 result preview', 'the example image is missing');
  else {
    if (!/loading="lazy"/.test(img[0])) fail(lang, 'S2-3 result preview', 'the example image is not lazy-loaded');
    if (!/alt="[^"]{4,}"/.test(img[0])) fail(lang, 'S2-3 result preview', 'the example image has no alt text');
  }
  if ((html.match(/class="s2-rp-badge"/g) || []).length !== 2) fail(lang, 'S2-3 result preview', 'both cards must carry the example badge');

  // Final CTA closes the page, after the FAQ
  const faqAt = html.indexOf('id="faq"'), ctaAt = html.indexOf('<!-- CTA Section -->');
  if (faqAt === -1 || ctaAt === -1 || ctaAt < faqAt) fail(lang, 'S2-3 IA', 'the Final CTA no longer follows the FAQ');
}

// Articles are JA-only: the other locales have no equivalent indexable set
{
  const jaArts = (read(home('ja')).match(/class="s2-art-card"/g) || []).length;
  if (jaArts !== 3) fail('ja', 'S2-3 articles', `expected 3 article cards, got ${jaArts}`);
  const ALLOWED = ['relationship-compatibility-factors', 'couple-compatibility-science', 'blood-type-compatibility-science'];
  const linked = [...read(home('ja')).matchAll(/class="s2-art-card" href="\/blog\/ja\/([^"]+)"/g)].map(m => m[1]);
  for (const slug of linked) {
    if (!ALLOWED.includes(slug)) fail('ja', 'S2-3 articles', `${slug} is not on the vetted list`);
    const p = `blog/ja/${slug}.html`;
    if (!fs.existsSync(path.join(ROOT, p))) { fail('ja', 'S2-3 articles', `${p} does not exist`); continue; }
    const a = read(p);
    if (/<meta name="robots"[^>]*noindex/.test(a)) fail('ja', 'S2-3 articles', `${slug} is noindex`);
    const t = (/<title>([^<]*)</.exec(a) || [])[1] || '';
    const claim = TITLE_CLAIMS.ja.find(c => t.replace('AI Test Lab', ' ').includes(c));
    if (claim) fail('ja', 'S2-3 articles', `${slug} title claims "${claim}"`);
  }
  for (const l of ['ko', 'en', 'zh', 'es']) {
    if (read(home(l)).includes('class="s2-art-card"')) fail(l, 'S2-3 articles', 'articles are JA-only; this locale has no vetted set');
  }
}

// Landing meta: brand stays, capability claim goes
for (const t of LANDING_TESTS) {
  for (const lang of LANGS) {
    const rel = `${lang}/${t}/index.html`;
    if (!fs.existsSync(path.join(ROOT, rel))) { fail(rel, 'S2-3 landing', 'missing'); continue; }
    const html = read(rel);
    let meta = META_FIELDS.map(re => (re.exec(html) || [])[1] || '').join(' | ');
    BRAND.forEach(b => { meta = meta.replace(b, ' '); });
    const claim = TITLE_CLAIMS[lang].find(c => meta.includes(c));
    if (claim) fail(rel, 'S2-3 landing title', `"${claim}" still claims the AI does the work`);
  }
}

// --- Visual text integrity ------------------------------------------------
// A broad `.hp-dark a:not(...)` rule once repainted the Final CTA's label with the
// link colour on top of its own indigo background: the label measured 1.00:1 and
// only the emoji stayed visible, on all five Home locales. The rule is now scoped
// to prose, and controls that paint a brand background pin their own foreground.
{
  const cpl = read('css/clean-pop-lab.css').replace(/\/\*[\s\S]*?\*\//g, ' ');  // rules only, not the notes about them
  if (/\.hp-dark\s+a\s*:not\(/.test(cpl)) {
    fail('repo', 'visual text', 'the broad `.hp-dark a:not(...)` colour rule is back — it repaints button labels');
  }
  // the pinning rule must name the control itself, not only its descendants
  const pinRules = [...cpl.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(m => /color:\s*#fff\s*!important/i.test(m[2]))
    .map(m => m[1].split(',').map(x => x.trim()));
  for (const need of ['a.gradient-bg', 'a.s2-hero-cta', '.s2-flag-cta', '.pt-btn-primary']) {
    const pinned = pinRules.some(sels => sels.some(sel => sel.endsWith(need)));
    if (!pinned) fail('repo', 'visual text', `${need} has no pinned white foreground of its own in clean-pop-lab.css`);
  }
  if (!/-webkit-text-fill-color:\s*#fff\s*!important/.test(cpl)) {
    fail('repo', 'visual text', 'brand buttons do not pin -webkit-text-fill-color, so gradient-text rules can blank them');
  }
}
for (const lang of LANGS) {
  const html = read(home(lang));
  const cta = /<a href="\/[a-z]+\/personality-type\/" class="([^"]*gradient-bg[^"]*)"[^>]*>([\s\S]{0,120}?)<\/a>/.exec(html);
  if (!cta) fail(lang, 'visual text', 'the primary Final CTA is missing');
  else {
    const label = cta[2].replace(/<[^>]+>/g, '').replace(/&#\d+;/g, '').trim();
    if (label.length < 2) fail(lang, 'visual text', 'the primary Final CTA has no visible label');
  }
}

// 11. template -> generated parity stays owned by the S1 guard; assert it is still wired
const pkg = JSON.parse(read('package.json'));
if (!/check-s1-guards\.js/.test(pkg.scripts['check:s1-guards'] || '')) {
  fail('repo', '11 build parity', 'check:s1-guards no longer runs check-s1-guards.js');
}
if (!/check:s1-guards/.test(pkg.scripts.verify || '')) {
  fail('repo', '11 build parity', 'npm run verify no longer runs check:s1-guards');
}
if (!fs.existsSync(path.join(ROOT, 'scripts/check-s1-guards.js'))) {
  fail('repo', '11 build parity', 'scripts/check-s1-guards.js missing');
}

if (failures.length) {
  console.error('S2 Home guard FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log(
  `S2 Home guard passed: ${LANGS.length} locale homes, 2 flagship cards each in order, ` +
  `kpop-match secondary, 3 resolving intent chips + a resolving hero CTA, ` +
  `0 AI capability claims (body + title/og/twitter), 0 viral-hub/real-time promises, 0 unbacked badges, ` +
  `0 FateAIverse links, 0 cross-locale copy leaks; ${CPL_PAGES.length} Clean Pop Lab pages, ` +
  `0 dead gamification refs, JA word-break scoped, FateAIverse surface 16/32 unchanged ` +
  `Trust 4 cards + resolving engine link, 2 example previews with a lazy alt image, ` +
  `3 vetted JA articles, Final CTA after the FAQ, 25 landing titles free of AI capability claims ` +
  `primary CTA labels pinned against their own background ` +
  `(template parity delegated to check:s1-guards).`
);
