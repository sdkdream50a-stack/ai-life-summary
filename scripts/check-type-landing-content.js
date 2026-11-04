#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { LANGS, SLUGS, escapeHtml, faqs, render, build } = require('./build-type-landing-content');
const ROOT = path.resolve(__dirname, '..');
function checkPage(html, lang, quiz) {
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.equal(html.split('<!-- type-details:start -->').length - 1, 1);
  assert.equal(html.split('<!-- type-details:end -->').length - 1, 1);
  const block = html.split('<!-- type-details:start -->')[1].split('<!-- type-details:end -->')[0];
  assert.equal((block.match(/<h3\b/g) || []).length, 8);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
  const found = [];
  function collect(node) {
    if (Array.isArray(node)) return node.forEach(collect);
    if (!node || typeof node !== 'object') return;
    if ([].concat(node['@type'] || []).includes('FAQPage')) found.push(node);
    Object.values(node).forEach(collect);
  }
  schemas.forEach(collect);
  assert.equal(found.length, 1);
  assert.deepEqual(found[0].mainEntity, faqs(lang, quiz.questions.length));
  for (const q of found[0].mainEntity) {
    assert.ok(block.includes('<summary class="font-bold text-white">' + escapeHtml(q.name) + '</summary>'));
    assert.ok(block.includes('<p class="text-white/60 text-sm leading-relaxed">' + escapeHtml(q.acceptedAnswer.text) + '</p>'));
  }
  assert.equal(html, render(html, lang, quiz), 'Content drift or non-idempotent rendering');
}
function main() {
  assert.equal(escapeHtml('<&>"\''), '&lt;&amp;&gt;&quot;&#39;');
  for (const slug of SLUGS) {
    const quiz = require(path.join(ROOT, 'js', slug + '.js'));
    for (const lang of LANGS) {
      const html = fs.readFileSync(path.join(ROOT, lang, slug, 'index.html'), 'utf8');
      const positive = render(html, lang, quiz);
      checkPage(positive, lang, quiz);
      const legacy = '<script type="application/ld+json">' + JSON.stringify({
        '@context': 'https://schema.org', '@graph': [
          { '@type': 'FAQPage', mainEntity: [] }, { '@type': 'WebPage', name: 'preserved' }
        ]
      }) + '</script>';
      const replaced = render(positive.replace('</head>', legacy + '</head>'), lang, quiz);
      checkPage(replaced, lang, quiz);
      assert.ok(replaced.includes('"name":"preserved"'));
      for (const broken of [
        positive.replace('content="index, follow"', 'content="noindex, follow"'),
        positive.replace('<!-- type-details:start -->', ''),
        positive.replace('<!-- type-details:end -->', ''),
        positive.replace('"@type":"FAQPage"', '"@type":"WebPage"'),
        positive.replace(/(<!-- type-details:start -->[\s\S]*?)<h3\b[^>]*>[\s\S]*?<\/h3>/, '$1')
      ]) assert.throws(() => checkPage(broken, lang, quiz));
      checkPage(html, lang, quiz);
    }
  }
  for (const lang of LANGS) {
    for (const slug of ['friend-compatibility', 'marriage-compatibility', 'kpop-match', 'vibe-check', 'life-summary']) {
      const html = fs.readFileSync(path.join(ROOT, lang, slug, 'index.html'), 'utf8');
      assert.match(html, /<meta name="robots" content="noindex, follow">/, lang + '/' + slug);
    }
  }
  for (const lang of ['zh', 'es']) for (const slug of SLUGS) {
    const html = fs.readFileSync(path.join(ROOT, lang, slug, 'index.html'), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex, follow">/, lang + '/' + slug);
  }
  build(true);
  console.log('type-landing-content: 9 pages, FAQ parity, idempotence and controls passed');
}
module.exports = { checkPage };
if (require.main === module) main();
