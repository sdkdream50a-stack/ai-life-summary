#!/usr/bin/env node
/**
 * Build shared-entry pages: /{lang}/{product}/s/{token}/
 *
 * A shared link used to hand the recipient nothing. `/ko/compatibility/result/`
 * reads the *recipient's* storage, finds none, and client-redirects to the blank
 * quiz, so the sender's result never survived the hop. These pages give the
 * recipient the sender's result label plus a way into their own test.
 *
 * Shape follows the shipped /{lang}/personality-type/t/{code}/ pages, which
 * already solve this for one product: noindex+follow, self-canonical, full
 * hreflang, teaser + CTA, no sitemap entry.
 *
 * The token is a low-cardinality result *label* only — soul type, animal couple,
 * age band. No birthdate, no raw answers, no name, no score. Nothing here needs
 * a server or a database, and nothing expires because nothing personal is stored.
 *
 * Usage: node scripts/build-shared-entry.js [--check]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ko', 'ja', 'zh', 'es'];
const ORIGIN = 'https://smartaitest.com';
const CHECK = process.argv.includes('--check');

// ── Pull the result tables out of the shipped runtime files ──────────────
// Brace-matched extraction, so we evaluate one literal and never execute the
// rest of a file that expects a DOM.
function extractLiteral(file, name) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const decl = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`);
  const m = decl.exec(src);
  if (!m) throw new Error(`${name} not found in ${file}`);
  const start = m.index + m[0].length;
  const open = src[start];
  const close = open === '[' ? ']' : '}';
  let depth = 0, i = start, inStr = null, esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) { i++; break; } }
  }
  // eslint-disable-next-line no-eval
  return eval(`(${src.slice(start, i)})`);
}

const SOUL_TYPES = extractLiteral('js/soul-types.js', 'SOUL_TYPES');
const ANIMAL_COUPLES = extractLiteral('js/compatibility.js', 'ANIMAL_COUPLES');
const ANIMALS = extractLiteral('js/compatibility.js', 'ANIMALS');
const ANIMAL_EMOJI = Object.fromEntries(ANIMALS.map(a => [a.id, a.emoji]));

// ── Per-locale chrome ────────────────────────────────────────────────────
const UI = {
  en: { cta: 'Take this test myself →', all: 'See all results',
        note: 'A free test for fun and self-reflection. It does not replace professional assessment.',
        brand: 'AI Test Lab', home: 'Home',
        kicker: { 'life-summary': 'Soul type', compatibility: 'Animal couple type', 'age-calculator': 'AI age' } },
  ko: { cta: '나도 이 테스트 해보기 →', all: '결과 전체 보기',
        note: '재미와 자기 이해를 위한 무료 테스트입니다. 전문 심리 검사를 대체하지 않습니다.',
        brand: 'AI Test Lab', home: '홈',
        kicker: { 'life-summary': '소울 타입', compatibility: '동물 커플 유형', 'age-calculator': 'AI 나이' } },
  ja: { cta: '私もこのテストをやってみる →', all: '結果をすべて見る',
        note: '楽しみと自己理解のための無料テストです。専門的な心理検査に代わるものではありません。',
        brand: 'AI Test Lab', home: 'ホーム',
        kicker: { 'life-summary': 'ソウルタイプ', compatibility: '動物カップルタイプ', 'age-calculator': 'AI年齢' } },
  zh: { cta: '我也来测一测 →', all: '查看所有结果',
        note: '这是一个供娱乐和自我了解的免费测试，不能替代专业心理评估。',
        brand: 'AI Test Lab', home: '首页',
        kicker: { 'life-summary': '灵魂类型', compatibility: '动物情侣类型', 'age-calculator': 'AI年龄' } },
  es: { cta: 'Hacer este test yo también →', all: 'Ver todos los resultados',
        note: 'Un test gratuito para divertirse y reflexionar. No sustituye una evaluación profesional.',
        brand: 'AI Test Lab', home: 'Inicio',
        kicker: { 'life-summary': 'Tipo de alma', compatibility: 'Tipo de pareja animal', 'age-calculator': 'Edad IA' } }
};

const PRODUCT_NAME = {
  'life-summary':    { en: 'AI Life Summary', ko: 'AI 인생 요약', ja: 'AI人生要約', zh: 'AI人生总结', es: 'Resumen de vida IA' },
  'compatibility':   { en: 'Compatibility Test', ko: '궁합 테스트', ja: '相性診断', zh: '契合度测试', es: 'Test de compatibilidad' },
  'age-calculator':  { en: 'AI Age Calculator', ko: 'AI 나이 계산기', ja: 'AI年齢計算機', zh: 'AI年龄计算器', es: 'Calculadora de edad IA' }
};

// A shared card names the sender's result without naming the sender.
const LEAD = {
  'life-summary':   { en: 'A friend got this soul type', ko: '친구의 소울 타입이에요',
                      ja: '友達のソウルタイプです', zh: '这是朋友的灵魂类型', es: 'Un amigo obtuvo este tipo de alma' },
  'compatibility':  { en: 'A couple got this animal type', ko: '이 커플의 동물 유형이에요',
                      ja: 'このカップルの動物タイプです', zh: '这对情侣的动物类型', es: 'Una pareja obtuvo este tipo animal' },
  'age-calculator': { en: 'A friend got this AI age result', ko: '친구의 AI 나이 결과예요',
                      ja: '友達のAI年齢の結果です', zh: '这是朋友的AI年龄结果', es: 'Un amigo obtuvo este resultado' }
};

// ── age-calculator bands: a bucket, never the actual ages ────────────────
const AGE_BANDS = [
  { token: 'mind-much-younger', emoji: '🌱',
    title: { en: 'Much younger at heart', ko: '마음이 훨씬 젊은 편', ja: '心がずっと若いタイプ', zh: '心态年轻得多', es: 'Mucho más joven de corazón' },
    desc:  { en: 'Their mental and energy age came out far below their calendar age.',
             ko: '정신 나이와 에너지 나이가 실제 나이보다 훨씬 젊게 나왔어요.',
             ja: '精神年齢とエネルギー年齢が実年齢よりずっと若い結果でした。',
             zh: '心理年龄和活力年龄都远低于实际年龄。',
             es: 'Su edad mental y de energía resultó muy por debajo de su edad real.' } },
  { token: 'mind-younger', emoji: '✨',
    title: { en: 'Younger than the calendar', ko: '실제 나이보다 젊은 편', ja: '実年齢より若いタイプ', zh: '比实际年龄年轻', es: 'Más joven que el calendario' },
    desc:  { en: 'Their mind and energy read a little younger than their real age.',
             ko: '정신과 에너지가 실제 나이보다 조금 더 젊게 나왔어요.',
             ja: '精神とエネルギーが実年齢より少し若い結果でした。',
             zh: '心理与活力比实际年龄略年轻。',
             es: 'Su mente y energía resultaron algo más jóvenes que su edad real.' } },
  { token: 'mind-balanced', emoji: '⚖️',
    title: { en: 'Perfectly balanced', ko: '완벽한 균형', ja: '完璧なバランス', zh: '完美平衡', es: 'Perfectamente equilibrado' },
    desc:  { en: 'Their mental, energy and calendar ages landed close together.',
             ko: '정신·에너지·실제 나이가 서로 가깝게 나왔어요.',
             ja: '精神・エネルギー・実年齢が近い結果でした。',
             zh: '心理、活力与实际年龄非常接近。',
             es: 'Sus edades mental, de energía y real quedaron muy cerca.' } },
  { token: 'mind-older', emoji: '📚',
    title: { en: 'An old soul', ko: '차분한 어른의 마음', ja: '落ち着いた大人の心', zh: '沉稳的心境', es: 'Un alma madura' },
    desc:  { en: 'Their mind reads a little older and steadier than their real age.',
             ko: '정신 나이가 실제 나이보다 조금 더 성숙하게 나왔어요.',
             ja: '精神年齢が実年齢より少し成熟した結果でした。',
             zh: '心理年龄比实际年龄更成熟一些。',
             es: 'Su mente resulta algo más madura y estable que su edad real.' } },
  { token: 'mind-much-older', emoji: '🦉',
    title: { en: 'Wise soul energy', ko: '지혜로운 영혼', ja: '賢い魂のエネルギー', zh: '智慧的灵魂', es: 'Energía de alma sabia' },
    desc:  { en: 'Their mental age came out well above their calendar age.',
             ko: '정신 나이가 실제 나이보다 훨씬 높게 나왔어요.',
             ja: '精神年齢が実年齢よりかなり高い結果でした。',
             zh: '心理年龄明显高于实际年龄。',
             es: 'Su edad mental resultó bastante por encima de su edad real.' } }
];

// ── Token tables ─────────────────────────────────────────────────────────
function pick(bag, lang, fallback) {
  if (!bag) return fallback || '';
  return bag[lang] || bag.en || fallback || '';
}

function tokensFor(product, lang) {
  if (product === 'life-summary') {
    return SOUL_TYPES.map(t => ({
      token: t.id,
      emoji: t.emoji,
      title: t[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || t.nameEn,
      tagline: pick(t.slogan, lang),
      desc: pick(t.description, lang)
    }));
  }
  if (product === 'compatibility') {
    return Object.entries(ANIMAL_COUPLES).map(([key, c]) => ({
      token: key,
      // The couple key is `a-b`; emoji live in the ANIMALS table, not on the pair.
      emoji: key.split('-').map(a => ANIMAL_EMOJI[a] || '').join(c.chemistry || '') || '🐾',
      title: pick(c.title, lang, key),
      tagline: '',
      desc: pick(c.desc, lang)
    }));
  }
  if (product === 'age-calculator') {
    return AGE_BANDS.map(b => ({
      token: b.token, emoji: b.emoji,
      title: pick(b.title, lang), tagline: '', desc: pick(b.desc, lang)
    }));
  }
  throw new Error('unknown product ' + product);
}

// ── Page template (mirrors the shipped /t/ pages) ────────────────────────
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms; object-src 'none'; base-uri 'self'; form-action 'self';";

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(product, lang, item) {
  const ui = UI[lang];
  const url = `${ORIGIN}/${lang}/${product}/s/${item.token}/`;
  const landing = `/${lang}/${product}/`;
  const pname = PRODUCT_NAME[product][lang] || PRODUCT_NAME[product].en;
  const lead = LEAD[product][lang] || LEAD[product].en;
  const ogTitle = `${item.emoji} ${item.title}`;
  const metaDesc = (item.tagline || item.desc || pname).slice(0, 155);

  const alts = LANGS.map(l =>
    `<link rel="alternate" hreflang="${l}" href="${ORIGIN}/${l}/${product}/s/${item.token}/">`).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<title>${esc(item.title)} — ${esc(pname)} | AI Test Lab</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${url}">
${alts}
<link rel="alternate" hreflang="x-default" href="${ORIGIN}/en/${product}/s/${item.token}/">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:site_name" content="AI Test Lab">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(metaDesc)}">
<link rel="stylesheet" href="/css/pretendard.css">
<style>
:root{--stage:#0E0E10;--lav:#D9C8F0;--lav2:#BBA8DA}
*{box-sizing:border-box}
body{margin:0;background:var(--stage);color:#F4F1F8;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;flex-direction:column}
.tp-nav{padding:18px 24px}
.tp-nav a{color:#F4F1F8;text-decoration:none;font-weight:800;font-size:16px;opacity:.9}
.tp-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 20px 64px}
.tp-card{width:100%;max-width:560px;text-align:center;background:rgba(255,255,255,.04);border:1px solid rgba(217,200,240,.14);border-radius:28px;padding:44px 32px;box-shadow:0 20px 60px rgba(0,0,0,.35),0 0 40px rgba(217,200,240,.06)}
.tp-lead{font-size:13px;font-weight:700;letter-spacing:.06em;color:rgba(244,241,248,.5);text-transform:uppercase;margin-bottom:14px}
.tp-emoji{font-size:96px;line-height:1;margin-bottom:8px}
.tp-code{font-size:20px;font-weight:800;letter-spacing:.12em;color:var(--lav2);margin-bottom:6px}
.tp-name{font-size:40px;font-weight:800;margin:0 0 12px;background:linear-gradient(135deg,#FFFFFF 0%,#E4D6F5 45%,#BBA8DA 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.tp-tagline{font-size:18px;color:rgba(244,241,248,.82);margin:0 0 20px}
.tp-desc{font-size:15px;line-height:1.7;color:rgba(244,241,248,.66);margin:0 0 28px}
.tp-cta{display:inline-block;width:100%;max-width:340px;padding:16px 24px;border-radius:16px;font-size:17px;font-weight:800;text-decoration:none;color:#16130F;background:linear-gradient(135deg,#EFE6FA 0%,#C9B3EA 100%);box-shadow:0 8px 24px rgba(217,200,240,.28);transition:transform .2s}
.tp-cta:hover{transform:translateY(-2px)}
.tp-all{display:block;margin-top:16px;color:rgba(244,241,248,.6);text-decoration:none;font-size:14px}
.tp-all:hover{color:#fff}
.tp-note{margin-top:22px;font-size:12px;color:rgba(244,241,248,.4);line-height:1.6}
.tp-foot{text-align:center;padding:20px;font-size:12px;color:rgba(244,241,248,.3)}
@media(max-width:480px){.tp-name{font-size:32px}.tp-emoji{font-size:78px}.tp-card{padding:36px 22px}}
</style>
</head>
<body>
<div class="tp-nav"><a href="/${lang}/">🔮 ${esc(ui.brand)}</a></div>
<main class="tp-wrap">
<div class="tp-card">
<div class="tp-lead">${esc(lead)}</div>
<div class="tp-emoji">${item.emoji}</div>
<div class="tp-code">${esc(ui.kicker[product])}</div>
<h1 class="tp-name">${esc(item.title)}</h1>
${item.tagline ? `<p class="tp-tagline">${esc(item.tagline)}</p>` : ''}
${item.desc ? `<p class="tp-desc">${esc(item.desc)}</p>` : ''}
<a class="tp-cta" id="shared-cta" href="${landing}">${esc(ui.cta)}</a>
<a class="tp-all" href="${landing}">${esc(ui.all)}</a>
<p class="tp-note">${esc(ui.note)}</p>
</div>
</main>
<footer class="tp-foot">© AI Test Lab · smartaitest.com</footer>
<script src="/js/consent-manager.js"></script>
<script src="/js/analytics-events.js" defer></script>
<script>
(function () {
  var P = { test_type: '${product}', share_token: '${item.token}', lang: '${lang}' };
  var entryFired = false;

  // analytics-events.js is deferred and gates on consent + GA config, so wait
  // for it rather than firing into nothing. track() does its own queueing.
  function withAnalytics(cb, tries) {
    tries = tries || 0;
    if (window.AnalyticsEvents && typeof window.AnalyticsEvents.track === 'function') { cb(); return; }
    if (tries < 100) { setTimeout(function () { withAnalytics(cb, tries + 1); }, 50); }
  }
  function track(name) {
    withAnalytics(function () { window.AnalyticsEvents.track(name, P); });
  }

  withAnalytics(function () {
    if (entryFired) return;
    entryFired = true;
    window.AnalyticsEvents.track('share_entry', P);
    window.AnalyticsEvents.track('shared_result_view', P);
  });

  var cta = document.getElementById('shared-cta') || document.querySelector('.tp-cta');
  if (cta) {
    cta.addEventListener('click', function (e) {
      var href = cta.getAttribute('href');
      if (!href || e.defaultPrevented || e.metaKey || e.ctrlKey ||
          e.shiftKey || e.altKey || e.button !== 0) { return; }
      // Navigating immediately cancels the in-flight beacon, so hold the hop
      // briefly. The landing fires its own test_start; this marks the hand-off.
      e.preventDefault();
      track('shared_to_test_start');
      setTimeout(function () { window.location.href = href; }, 250);
    });
  }
}());
</script>
</body>
</html>
`;
}

// ── Emit ─────────────────────────────────────────────────────────────────
const PRODUCTS = ['life-summary', 'compatibility', 'age-calculator'];
let written = 0, stale = 0;

for (const product of PRODUCTS) {
  for (const lang of LANGS) {
    for (const item of tokensFor(product, lang)) {
      const dir = path.join(ROOT, lang, product, 's', item.token);
      const file = path.join(dir, 'index.html');
      const html = page(product, lang, item);
      const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
      // stamp-asset-version.js rewrites ?v=... after this script runs, so
      // compare content with the cache-buster normalised away.
      const norm = t => (t == null ? null : t.replace(/\?v=[0-9a-f]+/g, ''));
      if (norm(prev) === norm(html)) continue;
      if (CHECK) { stale++; console.error('stale: ' + path.relative(ROOT, file)); continue; }
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, html);
      written++;
    }
  }
}

if (CHECK) {
  if (stale) { console.error(`\nbuild-shared-entry: ${stale} page(s) out of date. Run: node scripts/build-shared-entry.js`); process.exit(1); }
  console.log('build-shared-entry: all shared-entry pages up to date');
} else {
  const total = PRODUCTS.reduce((n, p) => n + tokensFor(p, 'en').length * LANGS.length, 0);
  console.log(`build-shared-entry: wrote ${written} page(s) (${total} total across ${PRODUCTS.length} products x ${LANGS.length} locales)`);
}
