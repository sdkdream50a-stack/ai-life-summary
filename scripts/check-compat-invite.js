#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const vm = require('vm');
const { LANGS, loadData, page, build } = require('./build-compat-invite');
const ROOT = path.join(__dirname, '..');
function checkPage(html, lang) {
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  assert.ok(html.includes('<link rel="canonical" href="https://smartaitest.com/' + lang + '/compatibility/invite/">'));
  assert.match(html, /Content-Security-Policy/);
  assert.ok(html.indexOf('/js/compat-invite.js') < html.indexOf('/js/analytics-events.js'));
  assert.match(html, /\/js\/consent-manager\.js/);
  assert.match(html, /\/js\/analytics-events\.js/);
}
function checkSitemap(xml) {
  assert.doesNotMatch(xml, /\/compatibility\/invite(?:\/|[?<])/i);
}
function checkSource(source) {
  // Fail closed on changes to the single URL-writing boundary. This also
  // rejects computed keys, aliases, object constructors and extra parameters.
  const boundary = source.match(/function inviteURL\(animal, channel\) \{[\s\S]*?\n  \}/);
  assert.ok(boundary, 'Missing audited URL boundary');
  assert.equal(boundary[0], `function inviteURL(animal, channel) {
    if (!valid(animal) || !SHARE_SRC.includes(channel)) throw new Error('Invalid invite link');
    const url = new URL('/' + lang + '/compatibility/invite/', location.origin);
    url.searchParams.set('from', animal);
    url.searchParams.set('src', channel);
    return url.href;
  }`);
  const rest = source.replace(boundary[0], '');
  assert.doesNotMatch(rest, /new\s+URL\s*\(|\.searchParams\b|\.(?:search|hash)\s*=|(?:https?:[^\s'"]*|\/[^\s'"]*)\?[^\s'"]*=/);
  assert.equal((source.match(/new URLSearchParams\(/g) || []).length, 1);
  const calls = source.match(/(?:window\.)?AnalyticsEvents\.track\([^;]*\);/g) || [];
  assert.deepEqual(calls, ["window.AnalyticsEvents.track(events.shift(), { lang, src });"]);
  const withoutTrack = source.replace(calls[0], '');
  assert.doesNotMatch(withoutTrack, /\.track\s*(?:\(|\[)|\btrack\s*\([^)]*,/);
  for (const match of source.matchAll(/\btrack\('([^']+)'\)/g)) {
    assert.ok(['invite_view', 'invite_sent', 'invite_complete'].includes(match[1]));
  }
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|sendBeacon|sessionStorage/);
  assert.equal((source.match(/localStorage\.setItem\(/g) || []).length, 1);
  assert.ok(source.includes('localStorage.setItem(KEY, own)'));
}
function checkMapping(source, data) {
  // Execute the actual function independently, including all 16 outcomes.
  const match = source.match(/function personalAnimal\(values\) \{[\s\S]*?\n  \}/);
  assert.ok(match);
  const personalAnimal = vm.runInNewContext('(' + match[0] + ')', {}, { timeout: 1000 });
  const order = ['lion', 'cat', 'bear', 'rabbit', 'fox', 'dog', 'wolf', 'dolphin',
    'owl', 'eagle', 'panda', 'tiger', 'deer', 'penguin', 'butterfly', 'koala'];
  for (let mask = 0; mask < 16; mask++) {
    const answers = [];
    for (let bit = 0; bit < 4; bit++) answers.push(3, mask & (1 << bit) ? 3 : 2);
    assert.equal(personalAnimal(answers), order[mask]);
    assert.ok(data.ANIMALS.some(a => a.id === order[mask]));
    assert.equal(personalAnimal(answers), personalAnimal(answers));
  }
  assert.throws(() => personalAnimal([1]));
  assert.throws(() => personalAnimal(Array(8).fill(6)));
  assert.equal(personalAnimal(Array(8).fill(1)), 'lion');
  assert.equal(personalAnimal(Array(8).fill(5)), 'koala');
}
function scanSitemaps(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.claude'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scanSitemaps(file);
    else if (/sitemap.*\.xml$/i.test(entry.name)) checkSitemap(fs.readFileSync(file, 'utf8'));
  }
}
function main() {
  const source = fs.readFileSync(path.join(ROOT, 'js/compat-invite.js'), 'utf8');
  const data = loadData();
  checkSource(source);
  checkMapping(source, data);
  // Negative controls must be rejected by the same guards as real inputs.
  assert.throws(() => checkSource(source.replace("url.searchParams.set('from', animal)", "url.searchParams.set('answers', animal)")));
  assert.throws(() => checkSource(source.replace('{ lang, src }', '{ lang, src, animal: own }')));
  assert.throws(() => checkPage(page('en', data).replace('noindex, follow', 'index, follow'), 'en'));
  assert.throws(() => checkSitemap('<urlset><url><loc>https://smartaitest.com/en/compatibility/invite/</loc></url></urlset>'));
  build(true);
  for (const lang of LANGS) {
    checkPage(fs.readFileSync(path.join(ROOT, lang, 'compatibility/invite/index.html'), 'utf8'), lang);
  }
  scanSitemaps(ROOT);
  console.log('compat-invite: pages, privacy boundaries, 16 mappings and negative controls passed');
}
module.exports = { checkPage, checkSitemap, checkSource, checkMapping };
if (require.main === module) main();
