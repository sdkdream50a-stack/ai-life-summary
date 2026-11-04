#!/usr/bin/env node
'use strict';

/*
 * CAVEATS
 * - 실행·빌드·검증은 오케스트레이터가 수행합니다.
 * - 세 테스트는 답변과 결과를 sessionStorage에 저장합니다. 서버 전송은
 *   없으므로 FAQ의 지정 문구를 유지합니다. 브라우저 저장까지 없다는 뜻은 아닙니다.
 * - build:all 마지막 단계에서 콘텐츠 적용 후 sitemap을 다시 생성합니다.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LANGS = ['ko', 'ja', 'en'];
const SLUGS = ['love-type', 'work-style', 'communication-style'];
const START = '<!-- type-details:start -->';
const END = '<!-- type-details:end -->';
const COPY = {
  ko: {
    reading: '결과 읽는 법', strengths: '강점', compatible: '잘 맞는 유형', faq: '자주 묻는 질문',
    sentences: [
      '세 축의 점수가 어느 쪽으로 기울었는지가 결과를 정합니다.',
      '가운데에 가까운 축은 상황에 따라 달라질 수 있어요.',
      '결과는 재미로 보는 참고 자료이고, 사람을 판단하는 기준이 아닙니다.'
    ],
    questions: ['몇 분 걸리나요?', '심리 진단인가요?', '다시 하면 결과가 달라지나요?', '내 답변이 저장되나요?'],
    answers: [
      n => n + '문항, 약 2분이면 끝나고 가입은 필요 없습니다.',
      '아닙니다. 자기 이해와 재미를 위한 테스트이며 의학·심리 평가를 대신하지 않습니다.',
      '답이 달라지면 달라질 수 있어요. 요즘의 생각에 따라 달라지는 것은 자연스럽습니다.',
      '답변은 서버로 보내지 않고 브라우저 안에서 계산합니다.'
    ]
  },
  ja: {
    reading: '結果の読み方', strengths: '強み', compatible: '相性のよいタイプ', faq: 'よくある質問',
    sentences: [
      '3つの軸のスコアがどちらに傾いているかで結果が決まります。',
      '中央に近い軸は、状況によって変わることがあります。',
      '結果は楽しむための参考情報であり、人を判断する基準ではありません。'
    ],
    questions: ['何分くらいかかりますか？', '心理診断ですか？', 'もう一度受けると結果は変わりますか？', '回答は保存されますか？'],
    answers: [
      n => n + '問、約2分で終わり、登録は不要です。',
      'いいえ。自己理解と楽しみのためのテストであり、医学的・心理学的な評価に代わるものではありません。',
      '回答が変われば、結果も変わることがあります。最近の考えに合わせて変わるのは自然なことです。',
      '回答はサーバーに送信せず、ブラウザ内で計算します。'
    ]
  },
  en: {
    reading: 'How to read your result', strengths: 'Strengths', compatible: 'Compatible types', faq: 'Frequently asked questions',
    sentences: [
      'Your result depends on which way the scores on the three axes lean.',
      'An axis close to the middle may vary with the situation.',
      'Results are a reference for fun and are not a basis for judging people.'
    ],
    questions: ['How long does it take?', 'Is this a psychological diagnosis?', 'Can my result change if I take it again?', 'Are my answers saved?'],
    answers: [
      n => n + ' questions take about 2 minutes, with no sign-up needed.',
      'No. This test is for self-understanding and fun and does not replace medical or psychological assessment.',
      'Your result may change if your answers change. It is natural for answers to vary with your recent thoughts.',
      'Your answers are not sent to a server; they are processed within your browser.'
    ]
  }
};
const escapeHtml = value => String(value).replace(/[&<>"']/g,
  ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
function faqs(lang, count) {
  const copy = COPY[lang];
  return copy.questions.map((question, i) => ({
    '@type': 'Question', name: question,
    acceptedAnswer: { '@type': 'Answer', text: typeof copy.answers[i] === 'function' ? copy.answers[i](count) : copy.answers[i] }
  }));
}
function removeFaq(node) {
  if (Array.isArray(node)) return node.map(removeFaq).filter(value => value !== null);
  if (!node || typeof node !== 'object') return node;
  if ([].concat(node['@type'] || []).includes('FAQPage')) return null;
  return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, removeFaq(value)]));
}
function typeRange(html) {
  const start = html.indexOf('<div id="lt-types">');
  if (start < 0) throw new Error('Missing lt-types block');
  const tags = /<\/?div\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0, match;
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return [start, tags.lastIndex];
  }
  throw new Error('Unclosed lt-types block');
}
function render(html, lang, quiz) {
  if (!COPY[lang]) throw new Error('Unsupported locale: ' + lang);
  const count = /id="pt-progress-text"[^>]*>\s*0\s*\/\s*(\d+)/.exec(html);
  if (!count || Number(count[1]) !== quiz.questions.length) throw new Error('Question count mismatch');
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (script, body) => {
    const data = JSON.parse(body), clean = removeFaq(data);
    if (JSON.stringify(data) === JSON.stringify(clean)) return script;
    return clean === null || (Array.isArray(clean) && !clean.length) ? '' :
      '<script type="application/ld+json">' + json(clean) + '</script>';
  });
  const [from, to] = typeRange(html);
  const heading = /<h2\b[^>]*>[\s\S]*?<\/h2>/.exec(html.slice(from, to));
  if (!heading || Object.keys(quiz.types).length !== 8) throw new Error('Missing eight-type heading or data');
  const copy = COPY[lang];
  const localized = code => {
    const type = quiz.types[code];
    const text = type && (lang === 'ko' ? type : type.i18n[lang]);
    if (!text || !['name', 'tagline', 'desc'].every(key => typeof text[key] === 'string') ||
        !Array.isArray(text.strengths)) throw new Error('Incomplete type: ' + code + '/' + lang);
    return { ...text, emoji: type.emoji, compatible: type.compatible };
  };
  const cards = Object.keys(quiz.types).map(code => {
    const type = localized(code);
    return '<article id="lt-type-' + escapeHtml(code) + '" class="lt-type-card">' +
      '<h3 class="font-bold text-white">' + escapeHtml(type.emoji + ' ' + type.name + ' (' + code + ')') + '</h3>' +
      '<p class="text-white/58 text-sm mt-1">' + escapeHtml(type.tagline) + '</p>' +
      '<p class="text-white/60 text-sm leading-relaxed">' + escapeHtml(type.desc) + '</p>' +
      '<h4 class="font-bold text-white mt-3">' + escapeHtml(copy.strengths) + '</h4>' +
      '<ul class="lt-strengths">' + type.strengths.map(s => '<li>' + escapeHtml(s) + '</li>').join('') + '</ul>' +
      '<h4 class="font-bold text-white mt-3">' + escapeHtml(copy.compatible) + '</h4>' +
      '<p class="text-white/60 text-sm">' + type.compatible.map(c => escapeHtml(localized(c).name)).join(' · ') + '</p></article>';
  }).join('\n');
  const questions = faqs(lang, Number(count[1]));
  const block = [
    START, '<div id="lt-types">', heading[0], '<div class="lt-type-grid">', cards, '</div>', '</div>',
    '<div><h2 class="text-xl font-bold text-white mb-3">' + escapeHtml(copy.reading) + '</h2>',
    ...copy.sentences.map(s => '<p class="text-white/60 text-sm leading-relaxed">' + escapeHtml(s) + '</p>'), '</div>',
    '<div><h2 class="text-xl font-bold text-white mb-4">' + escapeHtml(copy.faq) + '</h2>',
    ...questions.map(q => '<details class="lt-type-card"><summary class="font-bold text-white">' +
      escapeHtml(q.name) + '</summary><p class="text-white/60 text-sm leading-relaxed">' +
      escapeHtml(q.acceptedAnswer.text) + '</p></details>'), '</div>',
    '<script type="application/ld+json">' + json({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions }) + '</script>', END
  ].join('\n');
  const starts = html.split(START).length - 1, ends = html.split(END).length - 1;
  if (starts !== ends || starts > 1) throw new Error('Invalid type-details markers');
  html = starts ? html.slice(0, html.indexOf(START)) + block + html.slice(html.indexOf(END) + END.length) :
    html.slice(0, from) + block + html.slice(to);
  if (!/<meta name="robots" content="(?:noindex|index), follow">/.test(html)) throw new Error('Missing robots meta');
  return html.replace('<meta name="robots" content="noindex, follow">', '<meta name="robots" content="index, follow">');
}
function build(check = false) {
  const jobs = [];
  for (const slug of SLUGS) {
    const quiz = require(path.join(ROOT, 'js', slug + '.js'));
    for (const lang of LANGS) {
      const file = path.join(ROOT, lang, slug, 'index.html');
      const before = fs.readFileSync(file, 'utf8');
      jobs.push({ file, before, after: render(before, lang, quiz) });
    }
  }
  const changed = jobs.filter(job => job.before !== job.after);
  if (check && changed.length) throw new Error('Type landing content is stale: ' + changed.map(job => path.relative(ROOT, job.file)).join(', '));
  if (!check) for (const job of changed) fs.writeFileSync(job.file, job.after);
}
module.exports = { LANGS, SLUGS, escapeHtml, faqs, render, build };
if (require.main === module) {
  try { build(process.argv.includes('--check')); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
