#!/usr/bin/env node

/**
 * Telemetry consent-ordering guards.
 *
 * Production defect this exists to prevent (verified in GA4 property 520476586
 * on 2026-09-09): the canonical on-load events — home_view, result_view,
 * test_complete, article_view — were 0 in every window, while interaction
 * events fired on the same pages were delivered normally.
 *
 * Cause: consent-manager.js appended the GA4 script asynchronously and then
 * dispatched `consentUpdated` synchronously on the next line. Anything
 * replaying queued events on that signal pushed them into dataLayer before
 * gtag('config', 'G-QDH2KJQT9Y') had run, and GA4 discards events that arrive
 * with no property configured. The returning-visitor path failed the same way
 * for a different reason: with consent already stored the events were never
 * queued at all, they were sent straight into that same gap, because `gtag` is
 * truthy from the first line of consent-manager.js (the Consent Mode shim).
 *
 * These are behavioural checks. Both real scripts are executed in a minimal
 * simulated browser and driven through each consent path, so a regression has
 * to actually break delivery to go red — matching a string is not enough.
 *
 * Usage: node scripts/check-telemetry-consent.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const CONSENT_JS = path.join(ROOT, 'js/consent-manager.js');
const ANALYTICS_JS = path.join(ROOT, 'js/analytics-events.js');
const MEASUREMENT_ID = 'G-QDH2KJQT9Y';

const failures = [];
const fail = m => failures.push(m);

// ------------------------------------------------------------------ sandbox
/**
 * Minimal browser surface — only what these two files touch. document.readyState
 * stays 'loading' so neither file self-initialises; each scenario drives init()
 * itself to control ordering.
 */
function makeWindow(pathname) {
  const listeners = {};
  const store = {};
  const appended = [];

  const win = {
    dataLayer: [],
    appendedScripts: appended,
    location: { pathname, href: 'https://smartaitest.com' + pathname, replace() {}, search: '' },
    navigator: { language: 'ko', languages: ['ko'], doNotTrack: null, userAgent: 'node' },
    innerWidth: 1280,
    innerHeight: 800,
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; }
    },
    addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); },
    removeEventListener: (t, fn) => {
      listeners[t] = (listeners[t] || []).filter(f => f !== fn);
    },
    dispatchEvent: ev => {
      (listeners[ev.type] || []).slice().forEach(fn => fn(ev));
      return true;
    },
    CustomEvent: class CustomEvent {
      constructor(type, init) { this.type = type; this.detail = init && init.detail; }
    },
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    console: { log() {}, warn() {}, error() {} }
  };

  win.window = win;
  win.globalThis = win;
  win.document = {
    readyState: 'loading',
    referrer: '',
    addEventListener() {},
    querySelectorAll: () => [],
    head: { appendChild(el) { appended.push(el); } },
    createElement: () => ({}),
    // Microsoft Clarity's loader inserts itself relative to an existing tag.
    getElementsByTagName: () => [{ parentNode: { insertBefore(el) { appended.push(el); } } }]
  };
  return win;
}

function bootstrap(pathname) {
  const win = makeWindow(pathname);
  const ctx = vm.createContext(win);
  vm.runInContext(fs.readFileSync(CONSENT_JS, 'utf8'), ctx, { filename: 'consent-manager.js' });
  vm.runInContext(fs.readFileSync(ANALYTICS_JS, 'utf8'), ctx, { filename: 'analytics-events.js' });
  return { win, ctx };
}

/** Run the pending GA4 <script> onload, i.e. the tag finishing loading. */
function completeGaLoad(win) {
  const script = win.appendedScripts.find(s => s.src && s.src.includes('gtag/js'));
  if (!script) return false;
  if (typeof script.onload === 'function') script.onload();
  return true;
}

const calls = win => win.dataLayer.map(a => Array.from(a));
const eventNames = win => calls(win).filter(c => c[0] === 'event').map(c => c[1]);
const countEvent = (win, name) => eventNames(win).filter(n => n === name).length;
const configIndex = win =>
  calls(win).findIndex(c => c[0] === 'config' && c[1] === MEASUREMENT_ID);
const eventIndex = (win, name) =>
  calls(win).findIndex(c => c[0] === 'event' && c[1] === name);

function setStoredConsent(win, analytics) {
  win.localStorage.setItem('ai-test-consent', JSON.stringify({
    version: '1.2',
    categories: { necessary: true, analytics, marketing: false, personalization: false },
    timestamp: Date.now()
  }));
}

// ------------------------------------------------------------------ guard 1
// Fresh visitor: event is emitted before any consent decision, so it must be
// held, and then delivered exactly once — after config.
function checkFreshConsentPath() {
  const { win, ctx } = bootstrap('/ko/');
  vm.runInContext('AnalyticsEvents.init();', ctx);

  if (countEvent(win, 'home_view') !== 0) {
    fail('fresh consent: home_view was transmitted before a consent decision');
  }

  vm.runInContext(
    "ConsentManager.categories = { necessary: true, analytics: true, marketing: false, personalization: false };" +
    "ConsentManager.applyConsent();", ctx);

  if (countEvent(win, 'home_view') !== 0) {
    fail('fresh consent: home_view was transmitted before GA4 was configured');
  }
  if (!completeGaLoad(win)) {
    fail('fresh consent: no GA4 script was appended after analytics consent');
    return;
  }

  const n = countEvent(win, 'home_view');
  if (n !== 1) fail(`fresh consent: expected home_view exactly 1, got ${n}`);
  const ci = configIndex(win);
  const ei = eventIndex(win, 'home_view');
  if (ci === -1) fail('fresh consent: gtag config for ' + MEASUREMENT_ID + ' never ran');
  else if (ei !== -1 && ei < ci) {
    fail('fresh consent: home_view reached dataLayer before gtag config — GA4 discards these');
  }
}

// ------------------------------------------------------------------ guard 2
// Returning visitor with consent already stored. The regression here is subtle:
// consent passes immediately, so without a configuration gate the event is sent
// straight into the pre-config gap and lost.
function checkReturningConsentPath() {
  const { win, ctx } = bootstrap('/ko/');
  setStoredConsent(win, true);
  vm.runInContext('ConsentManager.init();', ctx);
  vm.runInContext('AnalyticsEvents.init();', ctx);

  if (countEvent(win, 'home_view') !== 0) {
    fail('returning consent: home_view was transmitted before GA4 was configured');
  }
  if (!completeGaLoad(win)) {
    fail('returning consent: no GA4 script was appended for a stored analytics consent');
    return;
  }

  const n = countEvent(win, 'home_view');
  if (n !== 1) fail(`returning consent: expected home_view exactly 1, got ${n}`);
  const ci = configIndex(win);
  const ei = eventIndex(win, 'home_view');
  if (ci !== -1 && ei !== -1 && ei < ci) {
    fail('returning consent: home_view reached dataLayer before gtag config');
  }
}

// ------------------------------------------------------------------ guard 3
// Rejection must stay silent even though a queue exists.
function checkRejectPath() {
  const { win, ctx } = bootstrap('/ko/');
  vm.runInContext('AnalyticsEvents.init();', ctx);
  vm.runInContext(
    "ConsentManager.categories = { necessary: true, analytics: false, marketing: false, personalization: false };" +
    "ConsentManager.applyConsent();", ctx);

  if (win.appendedScripts.some(s => s.src && s.src.includes('gtag/js'))) {
    fail('reject: GA4 script was loaded despite analytics consent being denied');
  }
  for (const ev of ['home_view', 'result_view', 'test_complete', 'article_view']) {
    if (countEvent(win, ev) !== 0) fail(`reject: ${ev} was transmitted after rejection`);
  }
  // A later consentUpdated must not drain the queue either.
  vm.runInContext("window.dispatchEvent(new CustomEvent('consentUpdated', { detail: {} }));", ctx);
  if (countEvent(win, 'home_view') !== 0) {
    fail('reject: queued home_view was drained by a later consentUpdated');
  }
}

// ------------------------------------------------------------------ guard 4
// Repeated signals and rebinding must not multiply a once-per-page event.
// A re-init is the realistic duplicate vector (SPA rebind, or the script
// included twice); repeated consent signals are the second.
function checkNoDuplicates() {
  const { win, ctx } = bootstrap('/ko/');
  setStoredConsent(win, true);
  vm.runInContext('ConsentManager.init();', ctx);
  vm.runInContext('AnalyticsEvents.init();', ctx);
  completeGaLoad(win);

  vm.runInContext(
    "window.dispatchEvent(new CustomEvent('consentUpdated', { detail: {} }));" +
    "window.dispatchEvent(new CustomEvent('consentUpdated', { detail: {} }));", ctx);
  vm.runInContext('ConsentManager.applyConsent();', ctx);
  // Rebind the funnel, as a SPA navigation or a duplicated <script> would.
  vm.runInContext('AnalyticsEvents.init();', ctx);

  const n = countEvent(win, 'home_view');
  if (n !== 1) fail(`duplicates: home_view fired ${n} times across repeated signals/rebind, expected 1`);
}

// ------------------------------------------------------------------ guard 8
// Consent withdrawn after GA4 was already configured. This is the only state
// where the configuration gate is open and consent alone is holding the line,
// so it is the case that actually proves the consent re-check in flushQueue.
function checkRevokeAfterAcceptStaysSilent() {
  const { win, ctx } = bootstrap('/ko/');
  setStoredConsent(win, true);
  vm.runInContext('ConsentManager.init();', ctx);
  vm.runInContext('AnalyticsEvents.init();', ctx);
  completeGaLoad(win);
  if (!win.gaLoaded) { fail('revoke-after-accept: GA4 never configured, scenario is void'); return; }

  vm.runInContext(
    "ConsentManager.categories = { necessary: true, analytics: false, marketing: false, personalization: false };", ctx);
  const before = countEvent(win, 'test_complete');
  // An event raised after withdrawal must be held, not sent…
  vm.runInContext("AnalyticsEvents.track('test_complete', {});", ctx);
  if (countEvent(win, 'test_complete') !== before) {
    fail('revoke-after-accept: event transmitted after analytics consent was withdrawn');
  }
  // …and must not be released by a later consent signal either.
  vm.runInContext("window.dispatchEvent(new CustomEvent('consentUpdated', { detail: {} }));", ctx);
  if (countEvent(win, 'test_complete') !== before) {
    fail('revoke-after-accept: queued event drained despite analytics consent being denied');
  }
}

// ------------------------------------------------------------------ guard 5
// The result surface owes two events; article owes one. Same ordering rule.
function checkResultAndArticleSurfaces() {
  const result = bootstrap('/ko/compatibility/result/');
  setStoredConsent(result.win, true);
  vm.runInContext('ConsentManager.init();', result.ctx);
  vm.runInContext('AnalyticsEvents.init();', result.ctx);
  completeGaLoad(result.win);
  for (const ev of ['result_view', 'test_complete']) {
    const n = countEvent(result.win, ev);
    if (n !== 1) fail(`result surface: expected ${ev} exactly 1, got ${n}`);
  }

  const article = bootstrap('/blog/erikson-psychosocial-stages');
  setStoredConsent(article.win, true);
  vm.runInContext('ConsentManager.init();', article.ctx);
  vm.runInContext('AnalyticsEvents.init();', article.ctx);
  completeGaLoad(article.win);
  const n = countEvent(article.win, 'article_view');
  if (n !== 1) fail(`article surface: expected article_view exactly 1, got ${n}`);
}

// ------------------------------------------------------------------ guard 6
// Static ordering contract: the dispatch that releases the queue must live
// inside the load callback, after config — not on the append path.
function checkDispatchIsAfterConfig() {
  const src = fs.readFileSync(CONSENT_JS, 'utf8');
  const cfg = src.indexOf(`gtag('config', '${MEASUREMENT_ID}'`);
  const onload = src.indexOf('gaScript.onload');
  if (cfg === -1) { fail('consent-manager.js: gtag config call not found'); return; }
  if (onload === -1) { fail('consent-manager.js: gaScript.onload not found'); return; }
  const dispatch = src.indexOf('dispatchConsentUpdated()', cfg);
  if (dispatch === -1) {
    fail('consent-manager.js: no consentUpdated dispatch after gtag config');
  }
  const appendIdx = src.indexOf('appendChild(gaScript)');
  const between = src.slice(appendIdx, cfg);
  if (/window\.dispatchEvent\(\s*new CustomEvent\(\s*'consentUpdated'/.test(between)) {
    fail('consent-manager.js: consentUpdated dispatched between script append and config');
  }
}

// ------------------------------------------------------------------ guard 7
// The configuration gate itself must remain in the send path.
function checkConfigGatePresent() {
  const src = fs.readFileSync(ANALYTICS_JS, 'utf8');
  if (!/if\s*\(\s*!\s*window\.gaLoaded\s*\)/.test(src)) {
    fail('analytics-events.js: window.gaLoaded gate missing — events can be sent pre-config');
  }
  if (!/flushQueue\s*\(\s*\)\s*\{/.test(src)) {
    fail('analytics-events.js: flushQueue() missing — queued events would never be replayed');
  }
}

const guards = [
  ['fresh consent path', checkFreshConsentPath],
  ['returning consent path', checkReturningConsentPath],
  ['reject path', checkRejectPath],
  ['no duplicates', checkNoDuplicates],
  ['result / article surfaces', checkResultAndArticleSurfaces],
  ['revoke after accept stays silent', checkRevokeAfterAcceptStaysSilent],
  ['dispatch ordering', checkDispatchIsAfterConfig],
  ['config gate present', checkConfigGatePresent]
];

for (const [name, fn] of guards) {
  try {
    fn();
  } catch (e) {
    fail(`${name}: threw ${e && e.message}`);
  }
}

if (failures.length) {
  console.error('TELEMETRY CONSENT GUARDS FAILED\n');
  failures.forEach(f => console.error('  ✗ ' + f));
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`telemetry consent guards passed (${guards.length} guards)`);
