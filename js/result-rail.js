/**
 * Result rail — what a visitor sees after the result itself.
 *
 * Order is fixed on purpose: the result has already been delivered above this
 * rail, so everything here comes after value. friend → next test (one) →
 * related reading → contextual FateAIverse bridge → affiliate slot.
 *
 * Mount: <div id="sat-result-rail" data-test="<slug>"></div> placed at the end
 * of the result container. Locale comes from the URL path, never from
 * localStorage (the page language is the path language).
 *
 * Nothing here sends personal data: no answers, names or birthdates are read.
 * Events go through window.AnalyticsEvents.track so consent gating and the
 * GA4-config queue stay the single path.
 */
(function () {
  'use strict';

  var LOCALES = ['ko', 'en', 'ja', 'zh', 'es'];
  var ALL = LOCALES;
  var KO_EN_JA = ['ko', 'en', 'ja'];

  // name/desc per locale; `in` = locales where the test page exists.
  var TESTS = {
    'personality-type': { emoji: '🧭', in: ALL,
      name: { ko: '성격 유형 테스트', en: 'Personality Type Test', ja: '性格タイプ診断', zh: '性格类型测试', es: 'Test de Personalidad' },
      desc: { ko: '질문으로 나의 성향을 4가지 축으로 정리해요', en: 'Sort your tendencies into four axes', ja: '質問から自分の傾向を4つの軸で整理', zh: '用问题把你的倾向整理成四个维度', es: 'Ordena tus tendencias en cuatro ejes' } },
    'compatibility': { emoji: '💞', in: ALL,
      name: { ko: '연인 궁합 테스트', en: 'Couple Compatibility Test', ja: 'カップル相性診断', zh: '情侣配对测试', es: 'Test de Compatibilidad' },
      desc: { ko: '두 사람의 답으로 케미를 비교해요', en: 'Compare your chemistry through both answers', ja: '二人の回答でケミを比べる', zh: '用两个人的回答比较默契', es: 'Compara vuestra química con las respuestas' } },
    'love-type': { emoji: '💌', in: ALL,
      name: { ko: '연애 유형 테스트', en: 'Love Type Test', ja: '恋愛タイプ診断', zh: '恋爱类型测试', es: 'Test de tipo de amor' },
      desc: { ko: '연애할 때 나는 어떤 모습인지 알아봐요', en: 'See how you tend to act in relationships', ja: '恋愛中の自分の傾向をチェック', zh: '看看恋爱中的你是什么样', es: 'Descubre cómo sueles ser en pareja' } },
    'friend-compatibility': { emoji: '🤝', in: KO_EN_JA,
      name: { ko: '친구 궁합 테스트', en: 'Friend Compatibility Test', ja: '友達相性診断' },
      desc: { ko: '친구와 같이 풀고 우정 케미를 비교해요', en: 'Take it with a friend and compare', ja: '友達と一緒に答えて比べる' } },
    'marriage-compatibility': { emoji: '💍', in: KO_EN_JA,
      name: { ko: '결혼 궁합 테스트', en: 'Marriage Compatibility Test', ja: '結婚相性診断' },
      desc: { ko: '생활 방식과 가치관 궁합을 질문으로 봐요', en: 'Compare lifestyles and values', ja: '生活スタイルと価値観の相性を見る' } },
    'communication-style': { emoji: '💬', in: ALL,
      name: { ko: '소통 유형 테스트', en: 'Communication Style Test', ja: 'コミュニケーションタイプ診断', zh: '沟通类型测试', es: 'Test de estilo de comunicación' },
      desc: { ko: '말하고 듣는 방식의 습관을 알아봐요', en: 'Find your habits in talking and listening', ja: '話し方・聞き方のクセを知る', zh: '了解你说话和倾听的习惯', es: 'Conoce tus hábitos al hablar y escuchar' } },
    'work-style': { emoji: '🗂️', in: ALL,
      name: { ko: '워크스타일 테스트', en: 'Work Style Test', ja: 'ワークスタイル診断', zh: '工作风格测试', es: 'Test de estilo de trabajo' },
      desc: { ko: '일할 때 편한 방식과 환경을 정리해요', en: 'Map how and where you work best', ja: '働きやすいやり方と環境を整理', zh: '整理你最顺手的工作方式', es: 'Descubre cómo trabajas mejor' } },
    'age-calculator': { emoji: '🎂', in: ALL,
      name: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算機', zh: '年龄计算器', es: 'Calculadora de Edad' },
      desc: { ko: '실제 나이와 마음 나이를 재미로 비교해요', en: 'Compare calendar age and mental age for fun', ja: '実年齢と精神年齢を楽しく比べる', zh: '趣味比较实际年龄与心理年龄', es: 'Compara edad real y mental, por diversión' } },
    'life-summary': { emoji: '📜', in: ALL,
      name: { ko: '인생 요약', en: 'Life Summary', ja: 'ライフサマリー', zh: '人生总结', es: 'Resumen de Vida' },
      desc: { ko: '생년월일로 만드는 재미용 인생 한 문장', en: 'A just-for-fun one-line life summary', ja: '生年月日で作る遊びの一文', zh: '用生日生成的趣味一句话', es: 'Una frase divertida sobre tu vida' } },
    'vibe-check': { emoji: '✨', in: ALL,
      name: { ko: '바이브 체크', en: 'Vibe Check', ja: 'バイブチェック', zh: 'Vibe 测验', es: 'Vibe Check' },
      desc: { ko: '60초 만에 끝나는 가벼운 유형 테스트', en: 'A light 60-second type quiz', ja: '60秒で終わる軽いタイプ診断', zh: '60秒轻松类型测验', es: 'Un test ligero de 60 segundos' } },
    'kpop-match': { emoji: '🎤', in: ALL,
      name: { ko: 'K-팝 페르소나 매칭', en: 'K-Pop Persona Match', ja: 'K-POPペルソナ診断', zh: 'K-pop人格匹配', es: 'K-Pop Persona Match' },
      desc: { ko: '나와 닮은 아이돌 아키타입 찾기', en: 'Find the idol archetype that fits you', ja: '自分に近いアイドルタイプを探す', zh: '找到与你相似的偶像原型', es: 'Encuentra tu arquetipo de ídolo' } }
  };

  // First entry is the one recommendation; the rest sit behind "more".
  var NEXT = {
    'personality-type': ['love-type', 'communication-style', 'work-style'],
    'love-type': ['compatibility', 'marriage-compatibility', 'personality-type'],
    'compatibility': ['love-type', 'friend-compatibility', 'marriage-compatibility', 'communication-style'],
    'friend-compatibility': ['communication-style', 'compatibility', 'personality-type'],
    'marriage-compatibility': ['communication-style', 'love-type', 'compatibility'],
    'communication-style': ['friend-compatibility', 'compatibility', 'personality-type'],
    'work-style': ['personality-type', 'communication-style', 'age-calculator'],
    'age-calculator': ['life-summary', 'vibe-check', 'personality-type'],
    'life-summary': ['personality-type', 'age-calculator', 'vibe-check'],
    'vibe-check': ['kpop-match', 'personality-type', 'age-calculator'],
    'kpop-match': ['vibe-check', 'friend-compatibility', 'personality-type']
  };

  var KO_BLOG = {
    'big-five-personality-guide': 'Big Five 성격 5요인 가이드',
    'mbti-vs-big5': 'MBTI vs 빅5 성격 모델',
    'does-personality-change': '성격은 변하는가?',
    'love-style-psychology': '연애 스타일의 심리학',
    'attachment-styles-relationships': '애착 유형과 연애',
    'personality-types-love-patterns': '성격 유형별 연애 패턴',
    'blood-type-compatibility-science': '혈액형 궁합의 과학: 데이터가 말하는 진실',
    'relationship-compatibility-factors': '연인 궁합을 결정하는 5가지 요인',
    'couple-compatibility-science': '커플 궁합 테스트, 믿을 수 있을까?',
    'communication-style-psychology': '소통 스타일의 심리학',
    'sternberg-triangular-love': '스턴버그 사랑의 삼각형 이론',
    'love-languages-psychology': '사랑의 언어 5가지, 과학은?',
    'emotional-intelligence-psychology': '정서지능(EQ)의 심리학',
    'work-style-psychology': '워크스타일의 심리학',
    'personality-career-guide': '성격 유형별 직업 적성 가이드',
    'introversion-extraversion-science': '내향성과 외향성의 과학',
    'mental-age-meaning': '정신 나이란?',
    'biological-vs-mental-age': '생물학적 나이 vs 정신적 나이',
    'erikson-psychosocial-stages': '에릭슨 심리사회 발달 8단계',
    'barnum-effect-psychology': '바넘 효과: 테스트에 공감하는 이유',
    'cold-reading-psychology': '콜드리딩의 심리학',
    'test-reliability-validity': '심리 테스트의 신뢰도와 타당도',
    'psychology-test-stress-relief': '심리 테스트와 스트레스 해소'
  };
  var COMPAT_BLOG = {
    ja: { 'blood-type-compatibility-science': '血液型相性の科学', 'relationship-compatibility-factors': '恋人の相性を決める5つの要因', 'couple-compatibility-science': 'カップル相性診断は信頼できる？' },
    es: { 'blood-type-compatibility-science': 'La ciencia de la compatibilidad por grupo sanguíneo', 'relationship-compatibility-factors': 'Los 5 factores de la compatibilidad', 'couple-compatibility-science': '¿Es fiable el test de compatibilidad?' }
  };
  var RELATED = {
    'personality-type': ['big-five-personality-guide', 'mbti-vs-big5', 'does-personality-change'],
    'love-type': ['love-style-psychology', 'attachment-styles-relationships', 'personality-types-love-patterns'],
    'compatibility': ['relationship-compatibility-factors', 'couple-compatibility-science', 'blood-type-compatibility-science'],
    'friend-compatibility': ['communication-style-psychology', 'emotional-intelligence-psychology', 'relationship-compatibility-factors'],
    'marriage-compatibility': ['sternberg-triangular-love', 'love-languages-psychology', 'attachment-styles-relationships'],
    'communication-style': ['communication-style-psychology', 'emotional-intelligence-psychology', 'attachment-styles-relationships'],
    'work-style': ['work-style-psychology', 'personality-career-guide', 'introversion-extraversion-science'],
    'age-calculator': ['mental-age-meaning', 'biological-vs-mental-age', 'erikson-psychosocial-stages'],
    'life-summary': ['barnum-effect-psychology', 'cold-reading-psychology', 'test-reliability-validity'],
    'vibe-check': ['barnum-effect-psychology', 'psychology-test-stress-relief', 'test-reliability-validity'],
    'kpop-match': ['barnum-effect-psychology', 'psychology-test-stress-relief']
  };

  // Relevance of a FateAIverse (birthdate-based traditional reading) bridge.
  // HIGH/MEDIUM render; LOW/NONE never do. Relevance beats reach.
  var FATE = {
    'compatibility': { level: 'HIGH', kind: 'pair' },
    'marriage-compatibility': { level: 'HIGH', kind: 'pair' },
    'love-type': { level: 'HIGH', kind: 'self' },
    'life-summary': { level: 'HIGH', kind: 'self' },
    'friend-compatibility': { level: 'MEDIUM', kind: 'pair' },
    'personality-type': { level: 'MEDIUM', kind: 'self' },
    'communication-style': { level: 'LOW' },
    'work-style': { level: 'LOW' },
    'age-calculator': { level: 'LOW' },
    'vibe-check': { level: 'LOW' },
    'kpop-match': { level: 'NONE' }
  };
  // FateAIverse serves ko, ja and English (unprefixed). zh/es get no bridge.
  var FATE_BASE = { ko: 'https://fateaiverse.com/ko', ja: 'https://fateaiverse.com/ja', en: 'https://fateaiverse.com' };

  // Affiliate foundation. Every provider is disabled until the program is
  // approved; a disabled or missing provider renders nothing at all.
  var AFFILIATE = {
    providers: {
      coupang_partners: { enabled: false, locales: ['ko'] },
      linkprice: { enabled: false, locales: ['ko'] },
      adpick: { enabled: false, locales: ['ko'] }
    },
    // test slug -> [{provider, href, label:{locale}}]; empty until approved.
    placements: {}
  };

  // Result text that may go on the shared brand card: the type name and its
  // one-line tagline only. Pages whose result carries names, birthdates or
  // ages (compatibility, age-calculator, life-summary) keep their own cards.
  var CARD_FIELDS = {
    'personality-type': ['#pt-type-name', '#pt-type-tagline', '#pt-type-emoji'],
    'love-type': ['#lt-type-name', '#lt-type-tagline', '#lt-type-emoji'],
    'work-style': ['#lt-type-name', '#lt-type-tagline', '#lt-type-emoji'],
    'communication-style': ['#lt-type-name', '#lt-type-tagline', '#lt-type-emoji'],
    'vibe-check': ['#r-name', '#r-tagline', null],
    'kpop-match': ['#r-name', '#r-tagline', null]
  };

  var T = {
    card_title: { ko: '결과 카드로 공유하기', en: 'Share your result card', ja: '結果カードでシェア', zh: '分享结果卡片', es: 'Comparte tu tarjeta de resultado' },
    card_btn: { ko: '결과 카드 만들기', en: 'Make my result card', ja: '結果カードを作る', zh: '生成结果卡片', es: 'Crear mi tarjeta' },
    card_note: { ko: '카드에는 결과 이름과 한 줄 설명만 들어가요', en: 'The card shows only the result name and one line', ja: 'カードには結果名とひと言だけが入ります', zh: '卡片只包含结果名称和一句话', es: 'La tarjeta solo muestra el nombre del resultado y una frase' },
    card_me: { ko: '나는', en: 'I am', ja: 'わたしは', zh: '我是', es: 'Soy' },
    card_try: { ko: '너도 해보기 →', en: 'Try it yourself →', ja: 'あなたもやってみて →', zh: '你也来测一测 →', es: 'Pruébalo tú también →' },
    card_saved: { ko: '카드 이미지를 저장했어요', en: 'Card image saved', ja: 'カード画像を保存しました', zh: '卡片图片已保存', es: 'Imagen guardada' },
    friend_title: { ko: '친구도 해보면 결과를 비교할 수 있어요', en: 'Have a friend take it and compare', ja: '友達もやれば結果を比べられます', zh: '让朋友也测一测，比较结果', es: 'Pídele a un amigo que lo haga y comparad' },
    friend_btn: { ko: '친구에게 같은 테스트 보내기', en: 'Send this test to a friend', ja: '友達に同じテストを送る', zh: '把这个测试发给朋友', es: 'Enviar este test a un amigo' },
    friend_note: { ko: '내 결과나 답변은 보내지 않고 테스트 링크만 보내요', en: 'Only the test link is sent — not your answers or result', ja: '回答や結果は送らず、テストのリンクだけを送ります', zh: '只发送测试链接，不会发送你的答案或结果', es: 'Solo se envía el enlace, no tus respuestas ni tu resultado' },
    copied: { ko: '링크를 복사했어요', en: 'Link copied', ja: 'リンクをコピーしました', zh: '链接已复制', es: 'Enlace copiado' },
    share_text: { ko: '이 테스트 해보고 결과 비교해볼래?', en: 'Try this test and let’s compare results?', ja: 'このテストやって結果比べてみない？', zh: '来做这个测试，比一比结果？', es: '¿Haces este test y comparamos resultados?' },
    next_title: { ko: '다음으로 해보면 좋은 테스트', en: 'A good next test', ja: '次におすすめのテスト', zh: '推荐下一个测试', es: 'Un buen siguiente test' },
    next_btn: { ko: '시작하기', en: 'Start', ja: 'はじめる', zh: '开始', es: 'Empezar' },
    more: { ko: '다른 테스트 더 보기', en: 'More tests', ja: 'ほかのテストを見る', zh: '更多测试', es: 'Más tests' },
    related_title: { ko: '함께 읽으면 좋은 글', en: 'Related reading', ja: 'あわせて読みたい', zh: '相关阅读', es: 'Lecturas relacionadas' },
    fate_title: { ko: '다른 관점의 나도 궁금한가요?', en: 'Curious about another perspective?', ja: '別の視点から見た自分も気になりますか？' },
    fate_self: {
      ko: '이 결과는 당신이 직접 답한 질문을 바탕으로 합니다. 생년월일을 사주·자미두수·서양 점성술 같은 전통적 해석 체계에서는 어떻게 읽는지 비교해볼 수 있어요.',
      en: 'This result is based on the questions you answered. You can also compare how traditional systems like Korean Saju, Zi Wei Dou Shu and Western astrology read a birthdate.',
      ja: 'この結果は、あなたが答えた質問にもとづいています。生年月日を四柱推命・紫微斗数・西洋占星術などの伝統的な体系ではどう読むのか、比べてみることもできます。' },
    fate_pair: {
      ko: '질문으로 본 두 사람의 케미는 여기까지예요. 생년월일을 바탕으로 한 전통적 관계 해석도 궁금하다면 비교해볼 수 있어요.',
      en: 'That’s your chemistry as seen through questions. If you’re curious, you can compare a traditional, birthdate-based reading of the relationship.',
      ja: '質問から見た二人のケミはここまで。生年月日にもとづく伝統的な関係の読み方も気になるなら、比べてみることができます。' },
    fate_btn: { ko: '다른 관점으로 나를 보기', en: 'See me from another perspective', ja: '別の視点で自分を見る' },
    fate_btn_pair: { ko: '다른 관점으로 우리 보기', en: 'See us from another perspective', ja: '別の視点で二人を見る' },
    fate_note: { ko: 'FateAIverse(외부 사이트)로 이동 · 기본 분석 무료 · 재미와 자기 성찰용', en: 'Opens FateAIverse (external site) · basic reading free · for reflection and fun', ja: 'FateAIverse（外部サイト）へ移動・基本分析は無料・楽しみと自己理解のために' },
    aff_title: { ko: '관련해서 참고할 만한 것', en: 'Things that may help', ja: '参考になるもの', zh: '或许有帮助', es: 'Cosas que pueden ayudar' },
    aff_disclosure: {
      ko: '이 영역에는 제휴 링크가 포함될 수 있으며, 링크를 통해 구매하면 운영자가 일정 수수료를 받을 수 있습니다. 구매 가격은 달라지지 않습니다.',
      en: 'This section may contain affiliate links. If you buy through them, the site may earn a commission at no extra cost to you.',
      ja: 'この欄にはアフィリエイトリンクが含まれる場合があり、リンク経由で購入すると運営者が手数料を受け取ることがあります。価格は変わりません。',
      zh: '此区域可能包含联盟链接，通过链接购买时本站可能获得佣金，价格不变。',
      es: 'Esta sección puede contener enlaces de afiliado; si compras a través de ellos, el sitio puede recibir una comisión sin coste extra.' }
  };

  function localeFromPath() {
    var m = window.location.pathname.match(/^\/(en|ko|ja|zh|es)(\/|$)/);
    return m ? m[1] : 'en';
  }
  function t(key, lang) { var v = T[key]; return (v && (v[lang] || v.en)) || ''; }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function track(name, params) {
    var ae = window.AnalyticsEvents;
    if (!ae || typeof ae.track !== 'function') return;
    var base = typeof ae.baseParams === 'function' ? ae.baseParams() : {};
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(params || {}).forEach(function (k) { out[k] = params[k]; });
    ae.track(name, out);
  }
  var seen = {};
  function trackOnce(name, params) { if (seen[name]) return; seen[name] = true; track(name, params); }
  function whenVisible(node, cb) {
    var done = false;
    function check() {
      if (done) return true;
      var r = node.getBoundingClientRect();
      if (r.height > 0 && r.top < window.innerHeight && r.bottom > 0) { done = true; cb(); return true; }
      return false;
    }
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !done) { done = true; io.disconnect(); cb(); } });
      }, { threshold: 0.3 });
      io.observe(node);
    }
    var onScroll = function () { if (check()) window.removeEventListener('scroll', onScroll); };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(check, 0);
  }

  function testUrl(slug, lang) { return '/' + lang + '/' + slug + '/'; }

  /** Adds non-identifying origin params to a FateAIverse URL. utm_* are kept as-is. */
  function withOrigin(href, test, lang, surface) {
    try {
      var u = new URL(href, window.location.href);
      if (u.hostname.indexOf('fateaiverse.com') === -1) return href;
      if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'smartaitest');
      if (!u.searchParams.get('origin_test')) u.searchParams.set('origin_test', test);
      if (!u.searchParams.get('origin_surface')) u.searchParams.set('origin_surface', surface);
      if (!u.searchParams.get('origin_locale')) u.searchParams.set('origin_locale', lang);
      return u.toString();
    } catch (e) { return href; }
  }

  function fateHref(test, lang, kind) {
    var base = FATE_BASE[lang];
    var path = kind === 'pair' ? '/compatibility' : '/profiles/new';
    var q = 'utm_source=smartaitest&utm_medium=referral&utm_campaign=' +
      test.replace(/-/g, '_') + '_result&utm_content=fate_bridge';
    return withOrigin(base + path + '?' + q, test, lang, 'result');
  }

  function injectStyles() {
    if (document.getElementById('sat-rail-style')) return;
    var css = [
      '#sat-result-rail{max-width:42rem;margin:2rem auto;padding:0 16px;display:grid;gap:16px;color:#111827;font-size:16px;line-height:1.55;text-align:left}',
      '#sat-result-rail .sr-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:18px;box-shadow:0 1px 3px rgba(0,0,0,.06)}',
      '#sat-result-rail h2{font-size:1.05rem;font-weight:700;margin:0 0 10px;color:#111827;overflow-wrap:anywhere}',
      '#sat-result-rail p{margin:0 0 12px;color:#374151;overflow-wrap:anywhere}',
      // keep-all only for Korean; Japanese/Chinese must break between characters.
      'html[lang=ko] #sat-result-rail h2,html[lang=ko] #sat-result-rail p{word-break:keep-all}',
      '#sat-result-rail .sr-note{font-size:.8rem;color:#4b5563;margin:8px 0 0}',
      '#sat-result-rail .sr-btn{display:flex;align-items:center;justify-content:center;gap:6px;min-height:48px;width:100%;box-sizing:border-box;padding:12px 16px;border-radius:12px;border:0;font-weight:700;font-size:1rem;cursor:pointer;text-decoration:none;text-align:center}',
      '#sat-result-rail .sr-primary{background:#db2777;color:#fff}',
      '#sat-result-rail .sr-secondary{background:#f3f4f6;color:#111827}',
      '#sat-result-rail .sr-next{display:flex;gap:12px;align-items:center;margin-bottom:12px}',
      '#sat-result-rail .sr-emoji{font-size:2rem;line-height:1;flex:none}',
      '#sat-result-rail .sr-next strong{display:block;font-size:1.05rem;color:#111827}',
      '#sat-result-rail .sr-next span{display:block;font-size:.9rem;color:#4b5563}',
      '#sat-result-rail details{margin-top:10px}',
      '#sat-result-rail summary{cursor:pointer;min-height:44px;display:flex;align-items:center;color:#374151;font-weight:600}',
      '#sat-result-rail ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}',
      '#sat-result-rail li a{display:flex;align-items:center;min-height:44px;padding:8px 12px;border-radius:10px;background:#f9fafb;color:#1f2937;text-decoration:none;overflow-wrap:anywhere}',
      '#sat-result-rail li a:hover,#sat-result-rail .sr-btn:hover{filter:brightness(.96)}',
      '#sat-result-rail a:focus-visible,#sat-result-rail button:focus-visible,#sat-result-rail summary:focus-visible{outline:3px solid #2563eb;outline-offset:2px}',
      '#sat-result-rail .sr-fate{background:linear-gradient(135deg,#eef2ff,#fdf2f8);border-color:#c7d2fe}',
      '#sat-result-rail .sr-fate .sr-primary{background:#4338ca}',
      '#sat-result-rail .sr-toast{font-size:.9rem;color:#047857;margin:8px 0 0;min-height:1.2em}'
    ].join('');
    var s = document.createElement('style');
    s.id = 'sat-rail-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function readCardText(test) {
    var f = CARD_FIELDS[test];
    if (!f) return null;
    var q = function (sel) { var n = sel && document.querySelector(sel); return n ? (n.textContent || '').trim() : ''; };
    var name = q(f[0]);
    if (!name) return null;
    return { name: name.slice(0, 40), tagline: q(f[1]).slice(0, 80), emoji: q(f[2]).slice(0, 8) };
  }

  function wrapLines(ctx, text, maxW, maxLines) {
    var lines = [], line = '';
    var units = /\s/.test(text) ? text.split(/(\s+)/) : Array.from(text);
    units.forEach(function (u) {
      var t = line + u;
      if (ctx.measureText(t).width > maxW && line.trim()) { lines.push(line.trim()); line = u.trim(); }
      else line = t;
    });
    if (line.trim()) lines.push(line.trim());
    return lines.slice(0, maxLines);
  }

  /** One brand card for every test: SMART AI TEST · I am · NAME · line · try it · domain. */
  function drawCard(test, lang, data) {
    var c = document.createElement('canvas');
    c.width = 1080; c.height = 1350;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 1080, 1350);
    g.addColorStop(0, '#1e1b4b'); g.addColorStop(1, '#831843');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(60, 60, 960, 1230);
    var font = function (w, px) { return w + ' ' + px + 'px Pretendard, "Apple SD Gothic Neo", "Hiragino Sans", "Noto Sans CJK KR", sans-serif'; };
    x.textAlign = 'center';
    x.fillStyle = '#f9a8d4'; x.font = font(800, 40); x.fillText('SMART AI TEST', 540, 170);
    x.fillStyle = 'rgba(255,255,255,0.75)'; x.font = font(600, 44); x.fillText(t('card_me', lang), 540, 340);
    var y = 430;
    if (data.emoji) { x.font = font(400, 150); x.fillText(data.emoji, 540, y + 110); y += 190; }
    x.fillStyle = '#ffffff'; x.font = font(900, 92);
    wrapLines(x, data.name, 880, 2).forEach(function (l) { x.fillText(l, 540, y + 60); y += 110; });
    if (data.tagline) {
      x.fillStyle = 'rgba(255,255,255,0.85)'; x.font = font(500, 46); y += 30;
      wrapLines(x, data.tagline, 860, 3).forEach(function (l) { x.fillText(l, 540, y + 40); y += 64; });
    }
    x.fillStyle = '#db2777';
    x.beginPath(); if (x.roundRect) x.roundRect(240, 1060, 600, 110, 55); else x.rect(240, 1060, 600, 110); x.fill();
    x.fillStyle = '#ffffff'; x.font = font(800, 46); x.fillText(t('card_try', lang), 540, 1130);
    x.fillStyle = 'rgba(255,255,255,0.7)'; x.font = font(600, 36); x.fillText('smartaitest.com', 540, 1240);
    return c;
  }

  function cardBlock(test, lang) {
    if (!CARD_FIELDS[test]) return null;
    var toast = el('p', { class: 'sr-toast', role: 'status', 'aria-live': 'polite' });
    // data-share/data-platform let the canonical funnel count this as share_click(method=image).
    var btn = el('button', { type: 'button', class: 'sr-btn sr-secondary', 'data-share': '', 'data-platform': 'image', 'data-rail': 'card', text: '🖼️ ' + t('card_btn', lang) });
    btn.addEventListener('click', function () {
      var data = readCardText(test);
      if (!data) return;
      var canvas = drawCard(test, lang, data);
      var fileName = 'smartaitest-' + test + '.png';
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var url = window.location.origin + testUrl(test, lang);
        var file = null;
        try { file = new File([blob], fileName, { type: 'image/png' }); } catch (e) {}
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: t('share_text', lang) + ' ' + url }).catch(function () {});
          return;
        }
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = fileName;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        toast.textContent = t('card_saved', lang);
      }, 'image/png');
    });
    return el('section', { class: 'sr-card', 'aria-label': t('card_title', lang) }, [
      el('h2', { text: t('card_title', lang) }), btn, el('p', { class: 'sr-note', text: t('card_note', lang) }), toast
    ]);
  }

  function friendBlock(test, lang) {
    var toast = el('p', { class: 'sr-toast', role: 'status', 'aria-live': 'polite' });
    var btn = el('button', { type: 'button', class: 'sr-btn sr-primary', 'data-rail': 'friend', text: t('friend_btn', lang) });
    btn.addEventListener('click', function () {
      var url = window.location.origin + testUrl(test, lang);
      track('share_invite_friend', { test_type: test, tool: test, placement: 'result_rail' });
      var text = t('share_text', lang);
      if (navigator.share) {
        navigator.share({ title: (TESTS[test].name[lang] || ''), text: text, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast.textContent = t('copied', lang); }).catch(function () {});
      } else {
        window.prompt(t('friend_btn', lang), url);
      }
    });
    return el('section', { class: 'sr-card', 'aria-label': t('friend_btn', lang) }, [
      el('h2', { text: t('friend_title', lang) }), btn,
      el('p', { class: 'sr-note', text: t('friend_note', lang) }), toast
    ]);
  }

  function nextBlock(test, lang) {
    var list = (NEXT[test] || []).filter(function (s) { return TESTS[s] && TESTS[s].in.indexOf(lang) !== -1; });
    if (!list.length) return null;
    var first = list[0];
    var info = TESTS[first];
    var link = el('a', { class: 'sr-btn sr-primary', href: testUrl(first, lang), 'data-rail': 'next', 'data-next': first, 'data-rank': '1',
      text: t('next_btn', lang) + ' → ' + info.name[lang] });
    var card = el('section', { class: 'sr-card', 'aria-label': t('next_title', lang) }, [
      el('h2', { text: t('next_title', lang) }),
      el('div', { class: 'sr-next' }, [
        el('span', { class: 'sr-emoji', 'aria-hidden': 'true', text: info.emoji }),
        el('div', {}, [el('strong', { text: info.name[lang] }), el('span', { text: info.desc[lang] })])
      ]),
      link
    ]);
    if (list.length > 1) {
      var ul = el('ul');
      list.slice(1).forEach(function (s, i) {
        ul.appendChild(el('li', {}, [el('a', { href: testUrl(s, lang), 'data-rail': 'next', 'data-next': s, 'data-rank': String(i + 2),
          text: TESTS[s].emoji + ' ' + TESTS[s].name[lang] })]));
      });
      card.appendChild(el('details', {}, [el('summary', { text: t('more', lang) }), ul]));
    }
    return card;
  }

  function relatedBlock(test, lang) {
    var slugs = RELATED[test] || [];
    var items = [];
    slugs.forEach(function (s) {
      if (lang === 'ko' && KO_BLOG[s]) items.push({ href: '/blog/' + s, title: KO_BLOG[s], slug: s });
      else if (COMPAT_BLOG[lang] && COMPAT_BLOG[lang][s]) items.push({ href: '/blog/' + lang + '/' + s, title: COMPAT_BLOG[lang][s], slug: s });
    });
    if (!items.length) return null;
    // Pages that already carry their own reading list keep it; no duplicate block.
    var existing = document.querySelectorAll('main a[href^="/blog/"]');
    var outside = 0;
    for (var i = 0; i < existing.length; i++) if (!existing[i].closest('#sat-result-rail')) outside++;
    if (outside >= 2) return null;
    var ul = el('ul');
    items.forEach(function (it) {
      ul.appendChild(el('li', {}, [el('a', { href: it.href, 'data-rail': 'related', 'data-article': it.slug, text: '📖 ' + it.title })]));
    });
    return el('section', { class: 'sr-card', 'aria-label': t('related_title', lang) }, [el('h2', { text: t('related_title', lang) }), ul]);
  }

  function fateBlock(test, lang) {
    var cfg = FATE[test];
    if (!cfg || (cfg.level !== 'HIGH' && cfg.level !== 'MEDIUM')) return null;
    if (!FATE_BASE[lang]) return null;
    // A page that already has its own FateAIverse CTA keeps that one only.
    var links = document.querySelectorAll('a[href*="fateaiverse"]');
    for (var i = 0; i < links.length; i++) if (!links[i].closest('#sat-result-rail')) return null;
    var pair = cfg.kind === 'pair';
    var a = el('a', { class: 'sr-btn sr-primary', href: fateHref(test, lang, cfg.kind), target: '_blank',
      rel: 'noopener sponsored nofollow', 'data-rail': 'fate', 'data-relevance': cfg.level,
      text: t(pair ? 'fate_btn_pair' : 'fate_btn', lang) + ' →' });
    return el('section', { class: 'sr-card sr-fate', 'data-fate-bridge': cfg.level, 'aria-label': t('fate_title', lang) }, [
      el('h2', { text: t('fate_title', lang) }),
      el('p', { text: t(pair ? 'fate_pair' : 'fate_self', lang) }),
      a, el('p', { class: 'sr-note', text: t('fate_note', lang) })
    ]);
  }

  function affiliateBlock(test, lang) {
    var list = (AFFILIATE.placements[test] || []).filter(function (p) {
      var prov = AFFILIATE.providers[p.provider];
      return prov && prov.enabled === true && prov.locales.indexOf(lang) !== -1 && p.label && p.label[lang] && /^https:\/\//.test(p.href || '');
    });
    if (!list.length) return null;
    var ul = el('ul');
    list.forEach(function (p) {
      ul.appendChild(el('li', {}, [el('a', { href: p.href, target: '_blank', rel: 'noopener sponsored nofollow',
        'data-rail': 'affiliate', 'data-provider': p.provider, text: p.label[lang] })]));
    });
    return el('section', { class: 'sr-card', 'data-affiliate': 'on', 'aria-label': t('aff_title', lang) }, [
      el('h2', { text: t('aff_title', lang) }),
      el('p', { class: 'sr-note', text: t('aff_disclosure', lang) }), ul
    ]);
  }

  /** Existing hard-coded FateAIverse links on this page also gain origin params. */
  function tagExistingFateLinks(test, lang) {
    var links = document.querySelectorAll('a[href*="fateaiverse.com"]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].closest('#sat-result-rail')) continue;
      links[i].setAttribute('href', withOrigin(links[i].getAttribute('href'), test, lang, 'result'));
    }
  }

  function mount() {
    var root = document.getElementById('sat-result-rail');
    if (!root || root.getAttribute('data-mounted')) return;
    var test = root.getAttribute('data-test');
    if (!TESTS[test]) return;
    var lang = localeFromPath();
    if (LOCALES.indexOf(lang) === -1) return;
    root.setAttribute('data-mounted', '1');
    injectStyles();
    tagExistingFateLinks(test, lang);

    // vibe-check and kpop-match already carry their own "bring a friend" card.
    var hasFriend = !!document.querySelector('#vb-friend-cta, [data-friend-cta]') || test === 'vibe-check' || test === 'kpop-match';
    [cardBlock(test, lang), hasFriend ? null : friendBlock(test, lang), nextBlock(test, lang), relatedBlock(test, lang),
      fateBlock(test, lang), affiliateBlock(test, lang)].forEach(function (b) { if (b) root.appendChild(b); });

    root.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-rail]');
      if (!a) return;
      var kind = a.getAttribute('data-rail');
      if (kind === 'next') track('next_test_click', { test_type: test, next_test: a.getAttribute('data-next'), rank: Number(a.getAttribute('data-rank')) });
      else if (kind === 'related') track('related_article_click', { test_type: test, article_slug: a.getAttribute('data-article') });
      else if (kind === 'affiliate') track('affiliate_click', { test_type: test, provider: a.getAttribute('data-provider'), placement: 'result_rail' });
      // fate clicks are already reported as deep_dive_click by analytics-events.js
    });

    // Tests that render the result in-page (no /result/ URL) never reach the
    // canonical result_view/test_complete bound by URL shape. The rail sits
    // inside the hidden result container, so its first non-zero size is the
    // moment the result is actually on screen.
    var urlResult = /\/result\/?$/.test(window.location.pathname);
    if (!urlResult) {
      var fired = false;
      var fire = function () {
        if (fired || root.getBoundingClientRect().height === 0) return;
        fired = true;
        // Resolved at fire time: analytics-events.js registers itself on
        // DOMContentLoaded, which is after this deferred script mounts.
        var ae = window.AnalyticsEvents;
        if (ae && typeof ae.once === 'function') {
          ae.once('result_view', 'result_view', { test_type: test });
          ae.once('test_complete', 'test_complete', { test_type: test });
        }
      };
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fire).observe(root);
      else { var iv = setInterval(function () { fire(); if (fired) clearInterval(iv); }, 800); }
      fire();
    }

    var nextCard = root.querySelector('a[data-rail="next"]');
    if (nextCard) whenVisible(nextCard, function () { trackOnce('next_test_impression', { test_type: test, next_test: nextCard.getAttribute('data-next') }); });
    var aff = root.querySelector('[data-affiliate]');
    if (aff) whenVisible(aff, function () { trackOnce('affiliate_impression', { test_type: test, placement: 'result_rail' }); });
  }

  window.SatResultRail = { mount: mount, _config: { CARD_FIELDS: CARD_FIELDS, drawCard: drawCard, TESTS: TESTS, NEXT: NEXT, RELATED: RELATED, FATE: FATE, FATE_BASE: FATE_BASE, AFFILIATE: AFFILIATE, fateHref: fateHref, withOrigin: withOrigin } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
