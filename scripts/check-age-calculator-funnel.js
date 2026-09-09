#!/usr/bin/env node

/**
 * Age-calculator funnel guards.
 *
 * Production defect this exists to prevent (reproduced live on 2026-09-09):
 * the wizard's answer buttons were <button class="option-btn"> with no type
 * attribute, rendered inside <form id="age-calculator-form" method="get">.
 * A typeless <button> inside a form is type="submit", so every answer click
 * submitted the form, navigated to
 * /{locale}/age-calculator/?birth-year=…&birth-month=…&birth-day=…, reloaded
 * the landing page and reset the wizard to step 1. The result route was
 * unreachable — 90 days of GA4 showed 111 landing views and 1 result view.
 * The same applied to #interstitial-button, the continue button shown between
 * questions.
 *
 * Second, separate defect: step 1 is three <input type="number"> fields with
 * no radio/checkbox/select, so the canonical test_start delegation never
 * matched and a real user could complete the whole first step unmeasured.
 *
 * Guard 1 is structural (the buttons must declare type="button"), guard 2 is
 * behavioural — analytics-events.js is executed in a simulated browser and
 * driven with real events, so a regression has to actually break measurement.
 *
 * Usage: node scripts/check-age-calculator-funnel.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LOCALES = ['ko', 'ja', 'en', 'zh', 'es'];
const PAGES = LOCALES.map(l => `${l}/age-calculator/index.html`)
  .concat(['scripts/templates/age-calculator.html']);

const failures = [];
const fail = m => failures.push(m);

// ------------------------------------------------------------------ guard 1
// Every answer / continue button must be an explicit type="button". Anything
// else inside the wizard form submits it and destroys the user's progress.
function checkButtonsCannotSubmit() {
  const WIZARD = [
    { label: 'option-btn', re: /<button[^>]*class="option-btn"[^>]*>/g },
    { label: 'interstitial-button', re: /<button[^>]*id="interstitial-button"[^>]*>/g }
  ];
  for (const rel of PAGES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) { fail(`${rel}: missing`); continue; }
    const src = fs.readFileSync(file, 'utf8');
    for (const { label, re } of WIZARD) {
      const tags = src.match(re) || [];
      if (!tags.length) {
        fail(`${rel}: no ${label} button found — markup moved, guard is blind`);
        continue;
      }
      for (const tag of tags) {
        if (/type=["']submit["']/.test(tag)) {
          fail(`${rel}: ${label} declares type="submit" — clicking it submits the wizard form`);
        } else if (!/type=["']button["']/.test(tag)) {
          fail(`${rel}: ${label} has no type attribute — defaults to submit inside a form, ` +
               `which reloads the landing page and resets the wizard`);
        }
      }
    }
  }
}

// ------------------------------------------------------------------ sandbox
function runAnalytics(pathname, drive) {
  const listeners = {};
  const win = {
    dataLayer: [],
    gaLoaded: true,
    location: { pathname, href: 'https://smartaitest.com' + pathname, search: '' },
    navigator: { language: 'ko', languages: ['ko'], userAgent: 'node' },
    innerWidth: 1280,
    innerHeight: 800,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
    CustomEvent: class { constructor(t, i) { this.type = t; this.detail = i && i.detail; } },
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    console: { log() {}, warn() {}, error() {} },
    // consent already granted and GA4 configured, so track() sends immediately
    ConsentManager: { hasConsent: () => true }
  };
  // Stand-in for the gtag the real page gets from consent-manager.js; without
  // it track() has nothing to send through and every event vanishes silently.
  win.gtag = function () { win.dataLayer.push(arguments); };
  win.window = win;
  win.document = {
    readyState: 'loading',
    referrer: '',
    querySelectorAll: () => [],
    addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); },
    head: { appendChild() {} },
    createElement: () => ({})
  };
  const ctx = vm.createContext(win);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/analytics-events.js'), 'utf8'),
                  ctx, { filename: 'analytics-events.js' });
  vm.runInContext('AnalyticsEvents.init();', ctx);

  /** Fire a delegated DOM event the way the page would. */
  const fire = (type, target) => {
    (listeners[type] || []).forEach(fn => fn({ type, target }));
  };
  drive(fire, win);
  return win.dataLayer.map(a => Array.from(a))
    .filter(c => c[0] === 'event');
}

/** A stand-in for a real element, supporting the matches() the code uses. */
const el = selectorsItMatches => ({
  matches: sel => sel.split(',').map(s => s.trim())
    .some(s => selectorsItMatches.includes(s)),
  closest: () => null
});

// ------------------------------------------------------------------ guard 2
// A committed birthdate field is the first real interaction on this tool, and
// must register exactly one start.
function checkNumberInputStartsTheTest() {
  const events = runAnalytics('/ko/age-calculator/', fire => {
    fire('change', el(['input[type=number]']));
  });
  const starts = events.filter(c => c[1] === 'test_start');
  if (starts.length !== 1) {
    fail(`test_start: expected exactly 1 after a birthdate field change, got ${starts.length} ` +
         `— step 1 has only <input type="number"> fields, so a real user would go unmeasured`);
    return;
  }
  const params = starts[0][2] || {};
  if (params.test_type !== 'age-calculator') {
    fail(`test_start: test_type was "${params.test_type}", expected "age-calculator"`);
  }
}

// ------------------------------------------------------------------ guard 3
// Repeated interaction must not multiply the start.
function checkStartIsNotDuplicated() {
  const events = runAnalytics('/ko/age-calculator/', fire => {
    fire('change', el(['input[type=number]']));
    fire('change', el(['input[type=number]']));
    fire('change', el(['input[type=number]']));
  });
  const n = events.filter(c => c[1] === 'test_start').length;
  if (n !== 1) fail(`test_start: fired ${n} times across three field changes, expected 1`);
}

// ------------------------------------------------------------------ guard 4
// No interaction, no start — page load alone must never count as a start.
function checkNoSyntheticStart() {
  const events = runAnalytics('/ko/age-calculator/', () => {});
  const n = events.filter(c => c[1] === 'test_start').length;
  if (n !== 0) fail(`test_start: fired ${n} times on page load with no user interaction, expected 0`);
}

const guards = [
  ['wizard buttons cannot submit', checkButtonsCannotSubmit],
  ['number input starts the test', checkNumberInputStartsTheTest],
  ['start is not duplicated', checkStartIsNotDuplicated],
  ['no synthetic start', checkNoSyntheticStart]
];

for (const [name, fn] of guards) {
  try { fn(); } catch (e) { fail(`${name}: threw ${e && e.message}`); }
}

if (failures.length) {
  console.error('AGE CALCULATOR FUNNEL GUARDS FAILED\n');
  failures.forEach(f => console.error('  ✗ ' + f));
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`age-calculator funnel guards passed (${guards.length} guards, ${PAGES.length} surfaces)`);
