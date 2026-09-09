#!/usr/bin/env node

/**
 * Viral result-surface guards (life-summary result, age-calculator result).
 *
 * Production defects these exist to prevent, both reproduced on 2026-09-09
 * against the a4a5ec3 build at 390x844 / 430x932 / 768x1024 / 1280x900:
 *
 * A. Life Summary buried its own result behind three gates. The result route
 *    opened on a 4s synthetic "analyzing your birthday" screen, then swapped it
 *    for a face-down "?" card that only revealed the soul type on click or tap,
 *    and the flip handler then called window.scrollBy(0, 30vh). Measured after
 *    the mandatory tap: scrollY 253-307, card top -137 to -160 (clipped above
 *    the viewport), 51-56% of the card visible, and the "click or tap the card"
 *    hint still bouncing under a card that had already been revealed. A visitor
 *    who did not tap never saw their result at all.
 *
 * B. The age-calculator result derived its copy language from localStorage
 *    only. The pages under /{lang}/ are statically localized and never write
 *    that key, so anyone landing on /ko/age-calculator/ from search or a shared
 *    link ran the whole test and got English body copy ("16 years younger",
 *    "You have an exceptionally young mindset!") underneath Korean labels.
 *    Six fields leaked; all six are Korean once the document's own <html lang>
 *    is treated as the source of truth.
 *
 * C. Both result pages carry position:fixed bars (the navbar is pinned to the
 *    bottom under 768px, life-summary also has a full-width sticky action bar)
 *    over a document that reserved no space for them, so the closing body copy
 *    and the footer sat permanently underneath. Measured at document bottom
 *    before the fix: 2 blocks trapped per bar per mobile viewport.
 *
 * Guards 1-3 are behavioural: the page's own reveal script and the shipped
 * locale resolver are executed against a recording DOM, so a regression has to
 * actually break the rendered contract, not just the wording of the markup.
 *
 * Usage: node scripts/check-viral-result-surfaces.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LOCALES = ['en', 'ko', 'ja', 'zh', 'es'];

const LIFE_PAGES = LOCALES.map(l => `${l}/life-summary/result/index.html`)
  .concat(['life-summary/result.html']);
const AGE_PAGES = LOCALES.map(l => `${l}/age-calculator/result/index.html`)
  .concat(['age-calculator/result.html']);

// The pinned navbar measured 73px tall sitting 20px off the bottom edge, so a
// document has to give back at least that band to keep content clear of it.
const MIN_MOBILE_SAFE_PADDING = 93;

const failures = [];
const fail = m => failures.push(m);

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// ------------------------------------------------------------- recording DOM
/**
 * A permissive stand-in for the document. Every element is created on demand
 * and records what the page did to it, which is what the assertions read.
 */
function recordingDom() {
  const log = { scrolls: [], listeners: [], elements: new Map() };

  const makeEl = id => {
    const el = {
      id,
      _html: '',
      classes: new Set(['hidden']),
      dataset: {},
      style: {},
      classList: {
        add: (...c) => c.forEach(x => el.classes.add(x)),
        remove: (...c) => c.forEach(x => el.classes.delete(x)),
        contains: c => el.classes.has(c)
      },
      get innerHTML() { return el._html; },
      set innerHTML(v) { el._html = String(v); },
      get textContent() { return el._html; },
      set textContent(v) { el._html = String(v); },
      addEventListener: (type) => { log.listeners.push({ id, type }); },
      removeEventListener() {},
      appendChild() {},
      removeChild() {},
      insertBefore() {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 300, height: 400, bottom: 400, right: 300 }),
      parentNode: { insertBefore() {} },
      offsetParent: {},
      scrollIntoView: (...a) => { log.scrolls.push({ how: 'scrollIntoView', id, args: a }); }
    };
    return el;
  };

  const get = id => {
    if (!log.elements.has(id)) log.elements.set(id, makeEl(id));
    return log.elements.get(id);
  };

  const document = {
    readyState: 'loading',
    referrer: '',
    documentElement: { lang: 'ko', getAttribute: () => 'ko', classList: { add() {} } },
    body: { classList: { add() {}, remove() {} }, appendChild() {}, style: {} },
    head: { appendChild() {} },
    getElementById: get,
    querySelector: sel => get('sel:' + sel),
    querySelectorAll: () => [],
    createElement: () => makeEl('created'),
    addEventListener() {},
    removeEventListener() {}
  };

  return { log, document, get };
}

function lifeSandbox(rel) {
  const src = read(rel);
  // the inline block that owns the staging sequence
  const block = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .find(s => s.includes('function startSoulTypeReveal'));
  if (!block) return { error: `${rel}: no inline script defines startSoulTypeReveal — guard is blind` };

  const { log, document } = recordingDom();
  const timers = [];
  const win = {
    document,
    location: { href: 'https://smartaitest.com/ko/life-summary/result/', pathname: '/ko/life-summary/result/' },
    navigator: { language: 'ko', languages: ['ko'], share: undefined },
    innerWidth: 390,
    innerHeight: 844,
    scrollY: 0,
    localStorage: {
      getItem: k => (k === 'ai-life-summary-birthdate' ? '1990-06-15' : null),
      setItem() {}, removeItem() {}
    },
    scrollBy: (...a) => { log.scrolls.push({ how: 'scrollBy', args: a }); },
    scrollTo: (...a) => { log.scrolls.push({ how: 'scrollTo', args: a }); },
    addEventListener() {}, removeEventListener() {},
    requestAnimationFrame: fn => { fn(0); return 1; },
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    clearTimeout() {}, setInterval: () => 1, clearInterval() {},
    console: { log() {}, warn() {}, error() {} },
    Chart: undefined
  };
  win.window = win;
  const ctx = vm.createContext(win);

  try {
    vm.runInContext(read('js/soul-types.js'), ctx, { filename: 'soul-types.js' });
    vm.runInContext(block, ctx, { filename: rel + ' (inline)' });
    // the later stages are entrance polish; this guard is about the result itself
    vm.runInContext(
      'stageC_Character = function(){}; stageD_Analysis = function(){}; stageE_Share = function(){};' +
      'currentLang = "ko"; currentSoulType = getSoulTypeFromBirthday("1990-06-15");',
      ctx, { filename: 'guard-setup' });
    vm.runInContext('startSoulTypeReveal();', ctx, { filename: 'guard-run' });
  } catch (e) {
    return { error: `${rel}: reveal sequence threw ${e && e.message}` };
  }

  return { log, ctx, timers, soulType: vm.runInContext('currentSoulType', ctx) };
}

// ----------------------------------------------------------------- guard 1
// The result identity must be on screen from the reveal call itself: no click,
// no touch, no timer standing between the visitor and their own result.
function checkLifeResultNeedsNoInteraction() {
  for (const rel of LIFE_PAGES) {
    const s = lifeSandbox(rel);
    if (s.error) { fail(s.error); continue; }

    const back = s.log.elements.get('card-back');
    const expected = vm.runInContext('getSoulTypeName(currentSoulType, "ko")', s.ctx);
    if (!back || !back.innerHTML.includes(expected)) {
      fail(`${rel}: the soul type "${expected}" was not rendered into #card-back by ` +
           `startSoulTypeReveal() — the result is gated behind something else again`);
    }

    const gateListeners = s.log.listeners.filter(
      l => l.id === 'reveal-card' && ['click', 'touchstart', 'touchend', 'pointerdown'].includes(l.type));
    if (gateListeners.length) {
      fail(`${rel}: the result card registers ${gateListeners.map(l => l.type).join('/')} ` +
           `during the reveal — a mandatory tap gate is back`);
    }

    const stage = s.log.elements.get('reveal-stage');
    if (stage && stage.classList.contains('hidden')) {
      fail(`${rel}: #reveal-stage is still hidden after startSoulTypeReveal()`);
    }
  }
}

// ----------------------------------------------------------------- guard 2
// Revealing a result must never move the viewport for the visitor.
function checkLifeRevealDoesNotScroll() {
  for (const rel of LIFE_PAGES) {
    const s = lifeSandbox(rel);
    if (s.error) continue; // already reported by guard 1
    if (s.log.scrolls.length) {
      const how = s.log.scrolls.map(x => x.how).join(', ');
      fail(`${rel}: the reveal drives the viewport (${how}) — forced scroll pushed the ` +
           `result card to a negative top and clipped it in production`);
    }
    // Timers may animate, but none of them may be the thing that shows the result.
    const back = s.log.elements.get('card-back');
    if (back && !back.innerHTML) {
      fail(`${rel}: #card-back was still empty when startSoulTypeReveal() returned — ` +
           `the identity is being deferred to a timer again`);
    }
  }
}

// ----------------------------------------------------------------- guard 3
// The gate markup itself must stay gone: a face-down "?" card, a tap hint that
// outlives its card, and the synthetic loading screen.
function checkLifeGateMarkupIsGone() {
  const BANNED = [
    [/id="card-front"|class="card-face card-front"|class="card-front/, 'a face-down "?" card front'],
    [/class="tap-hint"/, 'a "tap the card" hint'],
    [/id="loading-stage"/, 'the synthetic loading screen'],
    [/loading-enhanced\.js/, 'the fake terminal loading engine']
  ];
  for (const rel of LIFE_PAGES) {
    const src = read(rel);
    for (const [re, what] of BANNED) {
      if (re.test(src)) fail(`${rel}: ${what} is back in the markup`);
    }
    const openTag = (src.match(/<section[^>]*id="reveal-stage"[^>]*>/) || [])[0];
    if (!openTag) {
      fail(`${rel}: no #reveal-stage section — guard is blind`);
    } else if (/\bhidden\b/.test(openTag)) {
      fail(`${rel}: #reveal-stage ships with the hidden class, so the result is not ` +
           `on screen at first paint`);
    }
  }
}

// ----------------------------------------------------------------- guard 4
// A localized page's own <html lang> decides the language of its result copy.
function checkAgeLocaleComesFromTheDocument() {
  const source = read('js/age-calculator.js');

  for (const lang of LOCALES) {
    const win = {
      document: { documentElement: { getAttribute: () => lang } },
      // a visitor arriving straight from search has nothing stored
      localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
      console: { log() {}, warn() {}, error() {} }
    };
    win.window = win;
    const ctx = vm.createContext(win);
    try {
      vm.runInContext(source, ctx, { filename: 'age-calculator.js' });
    } catch (e) {
      fail(`js/age-calculator.js: threw ${e && e.message}`);
      return;
    }
    const resolved = vm.runInContext('resolveResultLang()', ctx);
    if (resolved !== lang) {
      fail(`js/age-calculator.js: a page declaring <html lang="${lang}"> with empty storage ` +
           `resolved its result copy to "${resolved}" — this is exactly how Korean pages ` +
           `printed English body copy`);
    }
  }

  // ...and the Korean page must actually come out in Korean end to end.
  const win = {
    document: { documentElement: { getAttribute: () => 'ko' } },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    console: { log() {}, warn() {}, error() {} }
  };
  win.window = win;
  const ctx = vm.createContext(win);
  vm.runInContext(source, ctx, { filename: 'age-calculator.js' });
  const rendered = vm.runInContext(`(function () {
    const lang = resolveResultLang();
    return [
      getAgeGapLabel(-16, lang),
      getMentalAgeDescription(-16, lang),
      getEnergyAgeDescription(-15, lang),
      generateDetailedAnalysis({ realAge: 36, mentalAge: 20, energyAge: 21 }, lang).overall
    ];
  })()`, ctx);
  for (const text of rendered) {
    if (!/[가-힣]/.test(String(text))) {
      fail(`js/age-calculator.js: a Korean page rendered "${String(text).slice(0, 60)}" — ` +
           `English body copy is leaking into the Korean result again`);
    }
  }
}

// ----------------------------------------------------------------- guard 5
// The result pages must read that resolver rather than guessing from storage.
function checkAgePagesUseTheResolver() {
  const PAGES = AGE_PAGES.concat(['scripts/templates/age-calculator-result.html']);
  for (const rel of PAGES) {
    const src = read(rel);
    if (!/const currentLang = resolveResultLang\(\);/.test(src)) {
      fail(`${rel}: the result script does not call resolveResultLang()`);
    }
    if (/currentLang\s*=\s*localStorage\.getItem/.test(src)) {
      fail(`${rel}: the result copy language is being read straight from localStorage again`);
    }
  }
}

// ----------------------------------------------------------------- guard 6
// A page that floats a fixed bar over itself has to give back the band it eats.
function checkFloatingBarsReserveSpace() {
  const PAGES = LIFE_PAGES.concat(AGE_PAGES,
    ['scripts/templates/life-summary-result.html', 'scripts/templates/age-calculator-result.html']);
  for (const rel of PAGES) {
    const src = read(rel);
    const blocks = [...src.matchAll(/<style id="floating-bar-safe-space">([\s\S]*?)<\/style>/g)]
      .map(m => m[1]);
    if (!blocks.length) {
      fail(`${rel}: no #floating-bar-safe-space rule — the fixed bars sit on the closing ` +
           `body copy and the footer again`);
      continue;
    }
    for (const css of blocks) {
      const mobile = css.match(/@media[^{]*max-width:\s*768px[^{]*\{[\s\S]*?padding-bottom:\s*(\d+)px/);
      if (!mobile) {
        fail(`${rel}: #floating-bar-safe-space reserves nothing under 768px, where the ` +
             `navbar is pinned to the bottom edge`);
      } else if (Number(mobile[1]) < MIN_MOBILE_SAFE_PADDING) {
        fail(`${rel}: reserves only ${mobile[1]}px under 768px; the pinned navbar occupies ` +
             `${MIN_MOBILE_SAFE_PADDING}px (73px tall, 20px off the edge)`);
      }
    }
  }

  // life-summary also floats a full-width action bar at every width
  for (const rel of LIFE_PAGES.concat(['scripts/templates/life-summary-result.html'])) {
    const src = read(rel);
    if (!/id="sticky-action-bar"/.test(src)) continue;
    const blocks = [...src.matchAll(/<style id="floating-bar-safe-space">([\s\S]*?)<\/style>/g)]
      .map(m => m[1]);
    for (const css of blocks) {
      const base = css.replace(/@media[\s\S]*$/, '');
      if (!/body\s*\{[^}]*padding-bottom:\s*\d+px/.test(base)) {
        fail(`${rel}: the sticky action bar is fixed at every width but no unconditional ` +
             `bottom space is reserved for it`);
      }
    }
  }
}

// ----------------------------------------------------------------- guard 7
// /js/* and /css/* are served with a 7-day cache. A fix that only lands in one
// of those files does not reach a returning visitor, so anything the new markup
// depends on has to survive a stale copy.
function checkFixesSurviveTheAssetCache() {
  // the result page calls resolveResultLang() from age-calculator.js; a cached
  // copy without it throws a ReferenceError and renders no result at all
  for (const rel of AGE_PAGES) {
    const src = read(rel);
    const tags = src.match(/<script[^>]*src="[^"]*js\/age-calculator\.js[^"]*"[^>]*>/g) || [];
    if (!tags.length) { fail(`${rel}: no age-calculator.js script tag — guard is blind`); continue; }
    for (const tag of tags) {
      if (!/age-calculator\.js\?v=[0-9a-f]{8}/.test(tag)) {
        fail(`${rel}: age-calculator.js is referenced without a version query, so a browser ` +
             `holding the 7-day-cached copy throws on resolveResultLang() and shows no result`);
      }
    }
  }

  // the revealed card must not depend on a fresh copy of reveal-animations.css
  for (const rel of LIFE_PAGES.concat(['scripts/templates/life-summary-result.html'])) {
    const src = read(rel);
    const blocks = [...src.matchAll(/<style id="result-card-immediate">([\s\S]*?)<\/style>/g)]
      .map(m => m[1]);
    if (!blocks.length) {
      fail(`${rel}: no #result-card-immediate rules — with a stale stylesheet .card-back keeps ` +
           `rotateY(180deg) and the result card renders blank`);
      continue;
    }
    for (const css of blocks) {
      if (!/\.reveal-card\.instant-reveal\s+\.card-back\s*\{[^}]*transform:\s*none/.test(css)) {
        fail(`${rel}: #result-card-immediate no longer neutralises the card-back rotation`);
      }
    }
  }
}

const guards = [
  ['life-summary result needs no interaction', checkLifeResultNeedsNoInteraction],
  ['life-summary reveal does not scroll', checkLifeRevealDoesNotScroll],
  ['life-summary gate markup is gone', checkLifeGateMarkupIsGone],
  ['age result locale comes from the document', checkAgeLocaleComesFromTheDocument],
  ['age result pages use the resolver', checkAgePagesUseTheResolver],
  ['floating bars reserve their space', checkFloatingBarsReserveSpace],
  ['fixes survive the asset cache', checkFixesSurviveTheAssetCache]
];

for (const [name, fn] of guards) {
  try { fn(); } catch (e) { fail(`${name}: threw ${e && e.message}`); }
}

if (failures.length) {
  console.error('VIRAL RESULT SURFACE GUARDS FAILED\n');
  failures.forEach(f => console.error('  ✗ ' + f));
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`viral result surface guards passed (${guards.length} guards, ` +
  `${LIFE_PAGES.length + AGE_PAGES.length} result surfaces)`);
