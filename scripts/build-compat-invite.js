#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ko', 'ja', 'zh', 'es'];
const ORIGIN = 'https://smartaitest.com';
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms; object-src 'none'; base-uri 'self'; form-action 'self';";
const COPY = {
  en: ['Find your animal type', 'Answer on your own, then invite the other person.', 'Your type', 'Their type', 'Send to the other person', 'Send my type back', 'Retake', 'Take the full test together', 'Compare types only; both people must answer the full test for a real score. Just for fun.', 'Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree', 'See my type', 'Link copied!', 'Copy this link', 'Sharing is unavailable. Copy the link below.', 'Continue', 'The other person invited you. Answer 8 questions to see your compatibility right away.'],
  ko: ['나의 동물 유형 찾기', '혼자 답하고 상대에게 보내 보세요.', '나의 유형', '상대의 유형', '상대에게 보내기', '내 유형 답장하기', '다시 하기', '둘이 함께 전체 테스트 하기', '유형만 비교해요. 실제 점수는 둘 다 전체 테스트에 답해야 알 수 있으며, 재미로만 봐 주세요.', '전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다', '내 유형 보기', '링크를 복사했어요!', '이 링크를 복사하세요', '공유할 수 없어요. 아래 링크를 복사해 주세요.', '계속', '상대가 초대했어요. 8문항에 답하면 둘의 궁합이 바로 나와요.'],
  ja: ['自分の動物タイプを見つけよう', '一人で答えて、相手に送ってみよう。', 'あなたのタイプ', '相手のタイプ', '相手に送る', '自分のタイプを返信する', 'やり直す', '二人でフル診断を受ける', 'タイプだけの比較です。本当のスコアには二人ともフル診断への回答が必要です。楽しみとしてご覧ください。', '全くそう思わない', 'そう思わない', 'どちらでもない', 'そう思う', 'とてもそう思う', '自分のタイプを見る', 'リンクをコピーしました！', 'このリンクをコピー', '共有できません。下のリンクをコピーしてください。', '次へ', '相手から招待が届きました。8つの質問に答えると、二人の相性がすぐにわかります。'],
  zh: ['找到你的动物类型', '先独自作答，再邀请对方。', '你的类型', '对方的类型', '发送给对方', '回复我的类型', '重新测试', '两人一起完成完整测试', '这里只比较类型；真实分数需要两人都完成完整测试。仅供娱乐。', '非常不同意', '不同意', '一般', '同意', '非常同意', '查看我的类型', '链接已复制！', '复制此链接', '暂时无法分享，请复制下方链接。', '继续', '对方邀请了你。回答8道题，就能立即查看你们的契合度。'],
  es: ['Descubre tu tipo animal', 'Responde por tu cuenta y después invita a la otra persona.', 'Tu tipo', 'Su tipo', 'Enviar a la otra persona', 'Responder con mi tipo', 'Repetir', 'Hacer el test completo juntos', 'Solo comparamos tipos; la puntuación real requiere que ambos respondan el test completo. Es solo por diversión.', 'Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo', 'Ver mi tipo', '¡Enlace copiado!', 'Copia este enlace', 'No se puede compartir. Copia el enlace de abajo.', 'Continuar', 'La otra persona te ha invitado. Responde 8 preguntas para descubrir al instante su compatibilidad.']
};
const NAMES = {
  en: 'Lion,Cat,Bear,Rabbit,Fox,Dog,Wolf,Dolphin,Owl,Eagle,Panda,Tiger,Deer,Penguin,Butterfly,Koala',
  ko: '사자,고양이,곰,토끼,여우,강아지,늑대,돌고래,부엉이,독수리,판다,호랑이,사슴,펭귄,나비,코알라',
  ja: 'ライオン,猫,クマ,うさぎ,キツネ,犬,オオカミ,イルカ,フクロウ,鷲,パンダ,トラ,鹿,ペンギン,蝶,コアラ',
  zh: '狮子,猫咪,熊,兔子,狐狸,狗狗,狼,海豚,猫头鹰,鹰,熊猫,老虎,鹿,企鹅,蝴蝶,考拉',
  es: 'León,Gato,Oso,Conejo,Zorro,Perro,Lobo,Delfín,Búho,Águila,Panda,Tigre,Ciervo,Pingüino,Mariposa,Koala'
};
function loadData() {
  const source = fs.readFileSync(path.join(ROOT, 'js/compatibility.js'), 'utf8');
  const data = {};
  for (const name of ['ANIMALS', 'ANIMAL_COUPLES', 'DEFAULT_COUPLE', 'COMPAT_QUESTIONS']) {
    // Evaluate only the top-level data literal, never the existing browser runtime.
    const match = source.match(new RegExp('const ' + name + ' = ([\\s\\S]*?\\n[}\\]]);'));
    if (!match) throw new Error('Missing data: ' + name);
    data[name] = vm.runInNewContext('(' + match[1] + ')', Object.create(null), { timeout: 1000 });
  }
  const share = fs.readFileSync(path.join(ROOT, 'js/compatibility-share.js'), 'utf8').match(/const SHARE_SRC = (\[[\s\S]*?\]);/);
  if (!share) throw new Error('Missing data: SHARE_SRC');
  data.SHARE_SRC = vm.runInNewContext('(' + share[1] + ')', Object.create(null), { timeout: 1000 });
  if (data.ANIMALS.length !== 16 || data.COMPAT_QUESTIONS.length !== 8) throw new Error('Unexpected data shape');
  return data;
}
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
function page(lang, data) {
  const ui = COPY[lang];
  const url = ORIGIN + '/' + lang + '/compatibility/invite/';
  const payload = JSON.stringify({ lang, ui, names: NAMES[lang].split(','), ...data })
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="robots" content="noindex, follow">
<meta name="referrer" content="no-referrer">
<link rel="canonical" href="${url}">
${LANGS.map(l => '<link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + '/' + l + '/compatibility/invite/">').join('\n')}
<link rel="alternate" hreflang="x-default" href="${ORIGIN}/en/compatibility/invite/">
<title>${esc(ui[0])} | AI Test Lab</title>
<meta name="description" content="${esc(ui[1])}">
<link rel="stylesheet" href="/css/pretendard.css">
<style>
*{box-sizing:border-box}body{margin:0;background:#0e0e10;color:#f4f1f8;font-family:Pretendard,system-ui,sans-serif;line-height:1.6}nav,main{max-width:560px;margin:auto;padding:20px}a{color:#d9c8f0}h1{font-size:1.8rem}button,input{font:inherit}button{cursor:pointer;min-height:48px;padding:12px 18px;border:0;border-radius:12px;background:#d9c8f0;color:#171020}button:disabled{opacity:.5;cursor:default}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #fff;outline-offset:4px}fieldset{border:0;padding:0;margin:24px 0}legend{font-weight:700;margin-bottom:16px}label{display:flex;gap:12px;align-items:center;min-height:48px;padding:8px;border:1px solid #655673;border-radius:10px;margin:8px 0}input[type=radio]{width:20px;height:20px;flex-shrink:0}.pair{display:flex;gap:12px}.animal{flex:1;min-width:0;text-align:center;padding:16px 8px;background:#241e2c;border-radius:16px;overflow-wrap:anywhere}.emoji{display:block;font-size:3rem}.actions{display:grid;gap:16px;margin-top:24px}.note{font-size:.85rem;color:#d2c9db}#copy-link{width:100%;min-width:0;padding:12px}#status{overflow-wrap:anywhere}[hidden]{display:none!important}
body:has(#consent-banner.visible){padding-bottom:calc(240px + env(safe-area-inset-bottom, 0px))}
</style>
</head>
<body>
<nav><a href="/${lang}/">🔮 AI Test Lab</a></nav>
<main>
<h1>${esc(ui[0])}</h1><p id="invite-subtitle">${esc(ui[1])}</p>
<div id="sender"></div>
<form id="quiz"></form>
<section id="result" hidden aria-live="polite"></section>
<p class="note">${esc(ui[8])}</p>
<p id="status" role="status"></p>
<label id="copy-box" hidden>${esc(ui[16])}<input id="copy-link" readonly type="url"></label>
<noscript>${esc(ui[7])}: <a href="/${lang}/compatibility/">/${lang}/compatibility/</a></noscript>
</main>
<script id="invite-data" type="application/json">${payload}</script>
<script src="/js/compat-invite.js"></script>
<script src="/js/consent-manager.js"></script>
<script src="/js/analytics-events.js" defer></script>
</body>
</html>
`;
}
function build(check) {
  const data = loadData();
  let stale = 0;
  for (const lang of LANGS) {
    const file = path.join(ROOT, lang, 'compatibility/invite/index.html');
    const html = page(lang, data);
    const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\?v=[0-9a-f]+/g, '') : '';
    if (old === html) continue;
    if (check) { console.error('Stale invite page: ' + lang); stale++; }
    else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html); }
  }
  if (stale) throw new Error('Run build:compat-invite');
}
module.exports = { LANGS, page, loadData, build };
if (require.main === module) build(process.argv.includes('--check'));
