#!/usr/bin/env node

/**
 * S1 regression guards.
 *
 * Three things have broken repeatedly in this repo. Each is asserted here so a
 * rebuild or a future edit cannot silently undo them:
 *
 *   1. TEMPLATE PARITY — scripts/templates/*.html hold byte-for-byte locale
 *      snapshots that build:i18n emits verbatim. Editing only the generated
 *      {lang}/** page means the next `npm run build:i18n` reverts it. This has
 *      happened three times (see tasks/smartaitest-fateaiverse-funnel-0819).
 *      The only sanctioned exception is the AdSense loader line, which
 *      enforce-adsense-boundary.js injects into allowed generated pages and
 *      always strips from templates.
 *
 *   2. FUNNEL COVERAGE — js/analytics-events.js must load on the surfaces the
 *      business actually runs on. It previously shipped on 100 noindex leaf
 *      pages and zero home / test / result / blog pages, so nothing was
 *      measured.
 *
 *   3. REFERRAL UTM — the FateAIverse CTA must carry the canonical UTM set,
 *      with &amp; escaping preserved (a raw & regressed this once already).
 *
 * Usage: node scripts/check-s1-guards.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ko', 'ja', 'zh', 'es'];

const TEMPLATE_MAP = [
  ['scripts/templates/index.html', ''],
  ['scripts/templates/life-summary.html', 'life-summary'],
  ['scripts/templates/compatibility.html', 'compatibility'],
  ['scripts/templates/age-calculator.html', 'age-calculator'],
  ['scripts/templates/vibe-check.html', 'vibe-check'],
  ['scripts/templates/kpop-match.html', 'kpop-match'],
  ['scripts/templates/life-summary-result.html', 'life-summary/result'],
  ['scripts/templates/compatibility-result.html', 'compatibility/result'],
  ['scripts/templates/age-calculator-result.html', 'age-calculator/result'],
];

const SNAP_START = l => `<!-- I18N_PAGE_START ${l} -->\n`;
const SNAP_END = l => `<!-- I18N_PAGE_END ${l} -->`;
const ADSENSE_LOADER = /^[ \t]*<script\b[^>]*adsbygoogle\.js[^>]*><\/script>[ \t]*$/;
const ANALYTICS_TAG = '/js/analytics-events.js';

const failures = [];
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));
const outPath = (lang, slug) => (slug ? `${lang}/${slug}/index.html` : `${lang}/index.html`);

// ---------------------------------------------------------------- guard 1
function checkTemplateParity() {
  let compared = 0;
  for (const [tpl, slug] of TEMPLATE_MAP) {
    const template = read(tpl);
    for (const lang of LANGS) {
      const start = template.indexOf(SNAP_START(lang));
      if (start === -1) {
        failures.push(`${tpl}: missing locale snapshot for "${lang}"`);
        continue;
      }
      const contentStart = start + SNAP_START(lang).length;
      const end = template.indexOf(SNAP_END(lang), contentStart);
      if (end === -1) {
        failures.push(`${tpl}: unterminated snapshot for "${lang}"`);
        continue;
      }
      const out = outPath(lang, slug);
      if (!exists(out)) {
        failures.push(`${out}: generated page missing`);
        continue;
      }

      // Compare ignoring only the AdSense loader line the boundary owns.
      const strip = s => s.split('\n').filter(l => !ADSENSE_LOADER.test(l)).join('\n');
      const snap = strip(template.slice(contentStart, end));
      const gen = strip(read(out));
      compared++;

      if (snap !== gen) {
        const a = snap.split('\n');
        const b = gen.split('\n');
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i++;
        failures.push(
          `${out} has drifted from its snapshot in ${tpl} (locale ${lang}). ` +
          `A rebuild will revert the generated file. First difference at line ${i + 1}:\n` +
          `      template : ${JSON.stringify((a[i] || '').slice(0, 120))}\n` +
          `      generated: ${JSON.stringify((b[i] || '').slice(0, 120))}`
        );
      }
    }
  }
  return compared;
}

// ---------------------------------------------------------------- guard 2
function coreSurfaces() {
  const files = ['index.html'];
  for (const [, slug] of TEMPLATE_MAP) for (const l of LANGS) files.push(outPath(l, slug));
  for (const l of LANGS) {
    files.push(
      `${l}/personality-type/index.html`,
      `${l}/personality-type/result/index.html`,
      `${l}/love-type/index.html`,
      `${l}/work-style/index.html`,
      `${l}/communication-style/index.html`
    );
  }
  for (const dir of ['blog', 'blog/ja', 'blog/es']) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (f.endsWith('.html') && f !== 'index.html') files.push(`${dir}/${f}`);
    }
  }
  return files.filter(exists);
}

function checkFunnelCoverage() {
  const files = coreSurfaces();
  const missing = files.filter(f => !read(f).includes(ANALYTICS_TAG));
  if (missing.length) {
    failures.push(
      `${missing.length} core surface(s) do not load ${ANALYTICS_TAG} — the funnel is unmeasured there:\n` +
      missing.slice(0, 10).map(f => `      ${f}`).join('\n') +
      (missing.length > 10 ? `\n      …and ${missing.length - 10} more` : '')
    );
  }
  return files.length;
}

// ---------------------------------------------------------------- guard 3
function checkReferralUtm() {
  const bad = [];
  const seen = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (['node_modules', '.git', '.omc', '.claude', '.wrangler', 'docs'].includes(entry.name)) continue;
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.html')) {
        const rel = path.join(dir, entry.name);
        const html = read(rel);
        if (!html.includes('fateaiverse')) continue;
        seen.push(rel);
        if (html.includes('utm_campaign=gunghap-funnel')) bad.push(`${rel}: legacy utm_campaign=gunghap-funnel`);
        if (/utm_source=smartaitest&(?!amp;)/.test(html)) bad.push(`${rel}: unescaped & in UTM query`);
        if (!html.includes('utm_medium=referral')) bad.push(`${rel}: missing utm_medium=referral`);
        if (!html.includes('utm_content=deep_dive')) bad.push(`${rel}: missing utm_content=deep_dive`);
      }
    }
  };
  walk('.');
  if (!seen.length) failures.push('no FateAIverse CTA found anywhere — the referral funnel disappeared');
  bad.forEach(b => failures.push(b));
  return seen.length;
}

// ---------------------------------------------------------------- guard 4
/**
 * The URL path locale must win over browser language and stored preference.
 * Both override paths are asserted:
 *   a) the inline "Early Language Detection" block on generated pages
 *   b) getCurrentLanguage() in js/i18n.js, whose fallthrough defaults to 'ko'
 * Without (a)+(b) a /ja/ URL renders its result in the visitor's own language,
 * because every engine reads document.documentElement.lang.
 */
function checkLocaleAuthority() {
  let checked = 0;

  const i18n = read('js/i18n.js');
  const decl = i18n.indexOf('function getCurrentLanguage()');
  if (decl === -1) {
    failures.push('js/i18n.js: getCurrentLanguage() not found');
  } else {
    const body = i18n.slice(decl, decl + 1200);
    const guardAt = body.indexOf('pathLang');
    const savedAt = body.indexOf("localStorage.getItem('ai-life-summary-lang')");
    if (guardAt === -1) {
      failures.push('js/i18n.js: getCurrentLanguage() lost its path-locale guard — localized URLs will render in the visitor\'s language');
    } else if (savedAt !== -1 && guardAt > savedAt) {
      failures.push('js/i18n.js: the path-locale guard must run before the localStorage lookup');
    }
    checked++;
  }

  // Generated pages that carry the inline detector must consult the path too.
  for (const [, slug] of TEMPLATE_MAP) {
    for (const lang of LANGS) {
      const out = outPath(lang, slug);
      if (!exists(out)) continue;
      const html = read(out);
      if (!html.includes('Early Language Detection')) continue;
      checked++;
      if (!html.includes('var pathLang')) {
        failures.push(`${out}: inline language detection overwrites documentElement.lang without checking the URL locale`);
      }
    }
  }
  return checked;
}

// ---------------------------------------------------------------- guard 5
/**
 * Share channels must match the market. LINE is the primary channel in Japan and
 * was absent from every JA result surface while Kakao — a Korean messenger — sat
 * first, on a site whose home FAQ promised LINE sharing. Korea keeps Kakao first.
 */
function checkShareChannels() {
  const RESULTS = ['compatibility/result', 'life-summary/result', 'age-calculator/result', 'personality-type/result'];
  const ORDER_RE = /onclick="share(?:To|Viral)([A-Za-z]+)\(|id="share-(line|kakao)"|ptShare\('([a-z]+)'\)/g;
  let checked = 0;

  for (const lang of LANGS) {
    for (const slug of RESULTS) {
      const file = outPath(lang, slug);
      if (!exists(file)) continue;
      const html = read(file);
      checked++;

      const seq = [];
      let m;
      ORDER_RE.lastIndex = 0;
      while ((m = ORDER_RE.exec(html)) !== null) {
        const name = (m[1] || m[2] || m[3]).toLowerCase();
        if ((name === 'line' || name === 'kakao') && !seq.includes(name)) seq.push(name);
      }

      if (!seq.includes('line')) {
        failures.push(`${file}: no LINE share control — the home FAQ promises LINE sharing`);
        continue;
      }
      if (lang !== 'ko' && seq[0] === 'kakao') {
        failures.push(`${file}: Kakao is offered before LINE outside the Korean locale`);
      }
      if (lang === 'ko' && seq.includes('kakao') && seq[0] !== 'kakao') {
        failures.push(`${file}: Kakao must stay first on the Korean locale`);
      }
    }
  }
  return checked;
}

// ---------------------------------------------------------------- run
const parity = checkTemplateParity();
const surfaces = checkFunnelCoverage();
const ctas = checkReferralUtm();
const locale = checkLocaleAuthority();
const share = checkShareChannels();

if (failures.length) {
  console.error(`S1 guards FAILED (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
  failures.forEach(f => console.error(`  - ${f}`));
  process.exitCode = 1;
} else {
  console.log(
    `S1 guards passed: ${parity} template/generated pairs in sync, ` +
    `${surfaces} core surfaces instrumented, ${ctas} referral CTAs on canonical UTM, ` +
    `${locale} locale-authority checks, ${share} result surfaces with market-correct share channels.`
  );
}
