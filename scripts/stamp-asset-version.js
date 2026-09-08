#!/usr/bin/env node

/**
 * Runtime JS cache invalidation.
 *
 * WHY THIS EXISTS
 * ---------------
 * `/js/*.js` is served with `Cache-Control: public, max-age=604800` (7 days).
 * That is the right policy for a static asset — but only if the URL changes
 * when the bytes change. It did not. S1 shipped seven modified runtime scripts
 * behind unchanged URLs, so returning browsers kept executing the pre-S1 copy
 * from their own HTTP cache for up to a week. Production QA caught it live:
 * the Korean-only language banner that S1 deleted was still rendering, because
 * the browser was running the old consent-manager.js. Origin was correct the
 * whole time; only the invalidation path was missing.
 *
 * The one pre-existing attempt at versioning — `i18n.js?v=5` — proved the same
 * point from the other side: a hand-maintained integer nobody remembers to bump
 * is not a mechanism. It sat at v=5 while i18n.js changed (and blog.html had
 * drifted to v=6), so it invalidated nothing.
 *
 * HOW
 * ---
 * The version is the first 8 hex of the SHA-256 of the file's own bytes. That
 * gives the three properties this has to have:
 *
 *   - deterministic  — same bytes, same URL, on every machine and every rebuild
 *   - stable         — it does NOT change per request or per deploy, so the
 *                      7-day cache keeps working for unchanged files
 *   - self-bumping   — it changes exactly when, and only when, the file changes,
 *                      so no human has to remember anything
 *
 * Long max-age plus a content-addressed URL is the combination we actually
 * want; this restores the second half of it.
 *
 * SCOPE
 * -----
 * MANAGED is the seven runtime scripts S1 changed, and nothing else. This is a
 * hotfix, not a build-system rewrite. Any other `/js/*.js` still has the
 * original defect; extending coverage is a one-line change to MANAGED, and is a
 * deliberate decision left to a later batch rather than smuggled in here.
 *
 * Usage:
 *   node scripts/stamp-asset-version.js            rewrite references in place
 *   node scripts/stamp-asset-version.js --check    verify only, exit 1 on drift
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');

// The runtime scripts S1 changed (git diff 644c3f8..0adfcf0 -- 'js/*.js').
const MANAGED = [
  'analytics-events',
  'compatibility-share',
  'consent-manager',
  'i18n',
  'localization',
  'personality-type-result',
  'viral-link',
];

// Templates are included on purpose: build:i18n emits their locale snapshots
// byte-for-byte, so stamping only the generated pages would be reverted by the
// next rebuild — the exact failure mode guard #1 exists to catch.
const SKIP_DIRS = new Set(['node_modules', '.git', '.omc', '.claude', '.wrangler', 'docs', 'drafts']);

const versionOf = name => {
  const abs = path.join(ROOT, 'js', `${name}.js`);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
};

// Matches any prefix so both `/js/i18n.js` and `../../../js/personality-type-result.js`
// keep the path they already use — this hotfix changes the query, not the routing.
const refRe = name =>
  new RegExp(`(src=")([^"]*?js/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.js)(\\?[^"]*)?(")`, 'g');

const htmlFiles = () => {
  const out = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.html')) {
        out.push(path.join(dir, entry.name));
      }
    }
  };
  walk('.');
  return out;
};

const versions = {};
const missing = [];
for (const name of MANAGED) {
  const v = versionOf(name);
  if (!v) missing.push(`js/${name}.js`);
  else versions[name] = v;
}

if (missing.length) {
  console.error(`Managed asset(s) not found — MANAGED is out of date with the repo:`);
  missing.forEach(m => console.error(`  - ${m}`));
  process.exit(1);
}

let filesChanged = 0;
let refsStamped = 0;
const drift = [];

for (const rel of htmlFiles()) {
  const abs = path.join(ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  let after = before;

  for (const name of MANAGED) {
    const want = `?v=${versions[name]}`;
    after = after.replace(refRe(name), (m, pre, url, query, post) => {
      if (query !== want) {
        refsStamped++;
        if (CHECK) drift.push(`${rel}: ${url}${query || ''} → expected ${want}`);
      }
      return `${pre}${url}${want}${post}`;
    });
  }

  if (after !== before) {
    filesChanged++;
    if (!CHECK) fs.writeFileSync(abs, after, 'utf8');
  }
}

const summary = MANAGED.map(n => `${n}=${versions[n]}`).join(' ');

if (CHECK) {
  if (drift.length) {
    console.error(`Asset version check FAILED — ${drift.length} stale reference(s) in ${filesChanged} file(s).`);
    console.error(`A changed script behind an unchanged URL is invisible to returning browsers for 7 days.`);
    console.error(`Fix: npm run build:asset-version`);
    drift.slice(0, 15).forEach(d => console.error(`  - ${d}`));
    if (drift.length > 15) console.error(`  …and ${drift.length - 15} more`);
    process.exit(1);
  }
  console.log(`Asset versions verified: ${MANAGED.length} managed scripts, every reference current.`);
  console.log(`  ${summary}`);
} else {
  console.log(`Asset versions stamped: ${refsStamped} reference(s) updated across ${filesChanged} file(s).`);
  console.log(`  ${summary}`);
}
