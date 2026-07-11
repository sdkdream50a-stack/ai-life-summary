// love-type.js
// Korean love type quiz: 15 Likert questions, 3 dimensions, 8 result types.

(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LoveTypeTest = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';

  var QUESTIONS = [
    {id:1, dim:'ER', reverse:false, ko:'좋아하는 마음은 표현해야 상대도 안다고 생각한다.', en:'I believe someone only really knows I like them when I express it.', ja:'好きな気持ちは、ちゃんと伝えてこそ相手に届くと思う。', zh:'我觉得喜欢就要表达出来，对方才会真正知道。', es:'Creo que hay que expresar lo que uno siente para que la otra persona lo sepa.'},
    {id:2, dim:'ER', reverse:false, ko:'애정 표현(연락·스킨십·칭찬)을 자주 하는 편이다.', en:'I tend to show affection often through messages, touch, or compliments.', ja:'連絡・スキンシップ・褒め言葉などの愛情表現は多いほうだ。', zh:'我比较常用联系、肢体亲近或称赞来表达爱意。', es:'Suelo mostrar cariño con frecuencia: mensajes, contacto físico o cumplidos.'},
    {id:3, dim:'ER', reverse:true, ko:'마음이 있어도 겉으로 잘 드러내지 않는 편이다.', en:"Even when I have feelings, I don't show them easily.", ja:'気持ちがあっても、あまり表に出さないほうだ。', zh:'就算心里有感觉，我也不太容易表现出来。', es:'Aunque sienta algo, no suelo demostrarlo mucho.'},
    {id:4, dim:'ER', reverse:false, ko:'"사랑한다·보고 싶다" 같은 말을 자주 하는 편이다.', en:'I often say things like "I love you" or "I miss you."', ja:'「好き」「会いたい」などの言葉をよく伝えるほうだ。', zh:'我常会说“我爱你”“想你了”这类话。', es:'Suelo decir cosas como "te quiero" o "te extraño".'},
    {id:5, dim:'ER', reverse:true, ko:'감정 표현은 낯간지러워서 아끼게 된다.', en:'Emotional expression feels a little embarrassing, so I tend to hold back.', ja:'感情を表すのは少し照れくさくて、つい控えめになる。', zh:'表达感情让我有点不好意思，所以会有所保留。', es:'Expresar emociones me da algo de vergüenza, así que tiendo a contenerme.'},
    {id:6, dim:'PS', reverse:false, ko:'데이트는 미리 계획을 세워야 마음이 편하다.', en:'I feel more at ease when dates are planned in advance.', ja:'デートは前もって予定を立てたほうが安心する。', zh:'约会提前安排好，我会比较安心。', es:'Me siento más tranquilo/a cuando las citas se planean con anticipación.'},
    {id:7, dim:'PS', reverse:true, ko:'약속은 그날 기분에 따라 정하는 게 좋다.', en:'I prefer making plans based on how we feel that day.', ja:'約束はその日の気分で決めるくらいがちょうどいい。', zh:'约定当天看心情再决定也挺好。', es:'Prefiero decidir los planes según el ánimo del día.'},
    {id:8, dim:'PS', reverse:false, ko:'기념일·이벤트를 미리 챙기고 준비하는 편이다.', en:'I tend to remember anniversaries and prepare little events ahead of time.', ja:'記念日やイベントは忘れずに前もって準備するほうだ。', zh:'我会提前记得纪念日和特别活动，并做些准备。', es:'Suelo recordar aniversarios y preparar detalles con tiempo.'},
    {id:9, dim:'PS', reverse:true, ko:'여행이나 데이트도 즉흥적으로 떠나는 게 즐겁다.', en:'Trips and dates are more fun when we go on a whim.', ja:'旅行やデートは、思い立って出かけるほうが楽しい。', zh:'旅行或约会临时出发更有趣。', es:'Los viajes y las citas son más divertidos cuando surgen de forma espontánea.'},
    {id:10, dim:'PS', reverse:false, ko:'관계의 다음 단계를 구체적으로 그려보는 편이다.', en:'I often picture the next step of the relationship in concrete terms.', ja:'関係の次のステップを具体的に考えることが多い。', zh:'我常会具体想象这段关系的下一步。', es:'Suelo imaginar de manera concreta el siguiente paso de la relación.'},
    {id:11, dim:'CF', reverse:false, ko:'연인과는 되도록 자주, 오래 함께 있고 싶다.', en:'I want to spend time with my partner as often and as long as possible.', ja:'恋人とはできるだけ頻繁に、長く一緒にいたい。', zh:'我希望尽可能经常、长时间和恋人在一起。', es:'Quiero pasar tiempo con mi pareja con frecuencia y durante mucho rato.'},
    {id:12, dim:'CF', reverse:true, ko:'연애 중에도 나만의 시간·취미가 꼭 필요하다.', en:'Even in a relationship, I need my own time and hobbies.', ja:'恋愛中でも、自分だけの時間や趣味は欠かせない。', zh:'即使恋爱中，我也需要自己的时间和爱好。', es:'Incluso en una relación, necesito mi propio tiempo y mis aficiones.'},
    {id:13, dim:'CF', reverse:false, ko:'하루 있었던 일을 시시콜콜 공유하는 게 좋다.', en:'I like sharing the small details of my day with my partner.', ja:'その日にあった小さな出来事まで恋人と共有したい。', zh:'我喜欢把一天里细小的事情都和恋人分享。', es:'Me gusta compartir con mi pareja los pequeños detalles de mi día.'},
    {id:14, dim:'CF', reverse:true, ko:'서로 조금 떨어져 있는 시간이 관계에 도움이 된다고 본다.', en:'I think a little time apart can be good for the relationship.', ja:'少し離れて過ごす時間も、関係には大切だと思う。', zh:'我认为适当分开一点时间，对关系也有帮助。', es:'Creo que pasar algo de tiempo separados puede beneficiar la relación.'},
    {id:15, dim:'CF', reverse:false, ko:'중요한 결정은 연인과 함께 상의해 내리고 싶다.', en:'I want to talk important decisions through with my partner.', ja:'大事な決断は恋人と相談しながら決めたい。', zh:'重要决定我希望和恋人一起商量后再做。', es:'Quiero tomar las decisiones importantes conversándolas con mi pareja.'}
  ];

  var TYPES = {
    EPC: {emoji:'🌹', name:'다정한 로맨티스트', tagline:'사랑은 표현하고, 챙기고, 함께.', desc:'애정을 아낌없이 표현하고 기념일과 데이트를 세심히 챙기며 늘 함께이고 싶어하는 유형. 상대는 사랑받는다는 걸 확실히 느낀다.', strengths:['표현이 풍부함','세심하고 다정함','헌신적'], compatible:['RPC','RSC'], i18n:{en:{name:'Caring Romantic',tagline:'Love is expressed, planned for, and shared closely.',desc:'You show affection generously, prepare dates and special days with care, and naturally want plenty of time together. Your partner can clearly feel that they are loved.',strengths:['Expressive affection','Thoughtful and warm','Devoted']},ja:{name:'やさしいロマンチスト',tagline:'愛は伝えて、準備して、一緒に育てるもの。',desc:'愛情を惜しまず表現し、記念日やデートも丁寧に準備し、いつも一緒にいたいタイプ。相手は愛されている実感を得やすいでしょう。',strengths:['表現が豊か','細やかでやさしい','献身的']},zh:{name:'体贴的浪漫派',tagline:'爱要表达、要用心准备，也要一起相伴。',desc:'你不吝表达爱意，会细心准备纪念日和约会，也希望常常陪在对方身边。对方很容易明确感受到被爱。',strengths:['表达丰富','细心温柔','愿意付出']},es:{name:'Romántico/a atento/a',tagline:'El amor se expresa, se cuida y se comparte de cerca.',desc:'Expresas cariño sin guardártelo, preparas citas y fechas especiales con detalle y sueles querer estar cerca. Tu pareja siente con claridad que es querida.',strengths:['Cariño expresivo','Detalle y calidez','Entrega']}}},
    EPF: {emoji:'🤝', name:'든든한 파트너', tagline:'확실한 애정, 존중하는 거리.', desc:'애정 표현은 분명하고 관계를 계획적으로 이끌되, 서로의 독립된 삶도 존중하는 균형형. 안정감과 자유를 동시에 준다.', strengths:['표현이 분명함','계획적이고 믿음직','상대 존중'], compatible:['RSF','ESF'], i18n:{en:{name:'Steady Partner',tagline:'Clear affection, respectful space.',desc:'You express love clearly and guide the relationship with intention, while respecting each person’s independent life. You bring both security and breathing room.',strengths:['Clear expression','Reliable planner','Respectful of space']},ja:{name:'頼れるパートナー',tagline:'はっきりした愛情、尊重できる距離。',desc:'愛情表現はきちんと伝え、関係を計画的に進めながらも、お互いの独立した時間を尊重するバランス型。安心感と自由を同時に与えます。',strengths:['愛情が伝わりやすい','計画的で信頼できる','相手を尊重する']},zh:{name:'可靠的伙伴',tagline:'明确的爱意，彼此尊重的距离。',desc:'你会清楚表达爱，也会有计划地经营关系，同时尊重彼此独立的生活。你能同时带来稳定感和自由感。',strengths:['表达明确','有计划且可靠','尊重对方']},es:{name:'Pareja firme',tagline:'Cariño claro, distancia respetuosa.',desc:'Expresas el afecto con claridad y llevas la relación con intención, pero también respetas la vida independiente de cada persona. Das estabilidad sin quitar libertad.',strengths:['Expresión clara','Planificación confiable','Respeto por el espacio']}}},
    ESC: {emoji:'🔥', name:'열정적인 연인', tagline:'지금 이 순간, 뜨겁게.', desc:'감정을 솔직하게 드러내고 즉흥 이벤트를 즐기며 매 순간 붙어 있고 싶은 뜨거운 유형. 연애에 활력이 넘친다.', strengths:['열정적','표현이 솔직함','함께를 즐김'], compatible:['RPC','RPF'], i18n:{en:{name:'Passionate Lover',tagline:'Right now, fully and intensely.',desc:'You show your feelings honestly, enjoy spontaneous surprises, and want to stay close in the moment. Your relationships are full of energy.',strengths:['Passionate','Emotionally honest','Loves togetherness']},ja:{name:'情熱的な恋人',tagline:'今この瞬間を、まっすぐ熱く。',desc:'感情を素直に出し、即興のイベントも楽しみ、今この瞬間を一緒に過ごしたい熱いタイプ。恋愛に活気をもたらします。',strengths:['情熱的','表現が率直','一緒にいる時間を楽しむ']},zh:{name:'热烈恋人',tagline:'此刻就要炽热而直接。',desc:'你会坦率表达情绪，喜欢即兴的小惊喜，也很想时时贴近对方。你的恋爱充满活力。',strengths:['热情','表达坦率','享受相伴']},es:{name:'Amante apasionado/a',tagline:'Aquí y ahora, con intensidad.',desc:'Muestras lo que sientes con honestidad, disfrutas las sorpresas espontáneas y quieres vivir el momento muy cerca. Tu forma de amar tiene mucha energía.',strengths:['Pasión','Expresión sincera','Disfruta la cercanía']}}},
    ESF: {emoji:'🎈', name:'자유로운 로맨티스트', tagline:'사랑도, 자유도 놓치지 않아.', desc:'사랑을 자유롭게 표현하고 즉흥을 즐기지만 서로를 구속하지 않는 쿨한 유형. 함께 있어도 숨 막히지 않는다.', strengths:['표현이 자유로움','즉흥을 즐김','구속하지 않음'], compatible:['RPC','EPF'], i18n:{en:{name:'Free-Spirited Romantic',tagline:'Love and freedom, both intact.',desc:'You express love freely and enjoy spontaneity, yet you do not try to hold the other person too tightly. Being with you feels light and unforced.',strengths:['Free expression','Spontaneous energy','Does not cling']},ja:{name:'自由なロマンチスト',tagline:'愛も自由も手放さない。',desc:'愛を自由に表現し、即興も楽しみながら、相手を縛りすぎないクールなタイプ。一緒にいても息苦しくなりにくいでしょう。',strengths:['表現が自由','即興を楽しむ','束縛しない']},zh:{name:'自由浪漫派',tagline:'爱和自由，都不想放手。',desc:'你能自在表达爱意，也享受随性的节奏，但不会过度束缚对方。和你在一起轻松、不压迫。',strengths:['表达自在','享受即兴','不爱束缚']},es:{name:'Romántico/a libre',tagline:'Ni el amor ni la libertad se pierden.',desc:'Expresas el amor con libertad y disfrutas lo espontáneo, pero no intentas controlar a la otra persona. Estar contigo se siente ligero y natural.',strengths:['Expresión libre','Gusto por lo espontáneo','No controla']}}},
    RPC: {emoji:'🛡️', name:'묵묵한 헌신가', tagline:'말보다 행동으로 지킨다.', desc:'티 내기보다 행동으로 사랑을 보여주고 미래를 함께 그리며 조용히 곁을 지키는 유형. 믿음직한 안정감이 강점.', strengths:['한결같음','책임감','미래를 함께 계획'], compatible:['ESC','EPC'], i18n:{en:{name:'Quiet Devotee',tagline:'Protecting love through actions, not words.',desc:'You show love through steady actions more than display, imagine a shared future, and stay quietly by your partner’s side. Your strength is dependable calm.',strengths:['Consistent','Responsible','Plans a shared future']},ja:{name:'寡黙な献身家',tagline:'言葉より行動で守る。',desc:'目立つ表現より行動で愛を示し、未来を一緒に描きながら静かにそばにいるタイプ。信頼できる安定感が魅力です。',strengths:['一貫している','責任感がある','未来を一緒に考える']},zh:{name:'默默守护者',tagline:'比起言语，更用行动守护。',desc:'你不太张扬表达，而是用行动证明爱，也会认真描绘共同的未来，安静地陪在对方身边。可靠的稳定感是你的优势。',strengths:['始终如一','有责任感','会规划共同未来']},es:{name:'Devoto/a silencioso/a',tagline:'Cuida con hechos más que con palabras.',desc:'Muestras amor con acciones constantes más que con grandes gestos, imaginas un futuro compartido y acompañas en silencio. Tu fortaleza es una calma confiable.',strengths:['Constancia','Responsabilidad','Planea un futuro en común']}}},
    RPF: {emoji:'♟️', name:'신중한 전략가', tagline:'감정보다 방향을 먼저.', desc:'감정을 드러내기보다 관계를 신중히 설계하고 각자의 성장을 중시하는 어른스러운 유형. 관계를 길게 본다.', strengths:['신중함','계획적','서로의 성장 존중'], compatible:['ESC','ESF'], i18n:{en:{name:'Careful Strategist',tagline:'Direction before emotion.',desc:'You reveal feelings slowly, design the relationship carefully, and value each person’s growth. You tend to think long term.',strengths:['Careful judgment','Strategic planning','Respects growth']},ja:{name:'慎重な戦略家',tagline:'感情より先に、関係の方向を見る。',desc:'感情をすぐ出すより、関係を慎重に設計し、お互いの成長を大切にする大人っぽいタイプ。長い目で関係を見ています。',strengths:['慎重','計画的','お互いの成長を尊重する']},zh:{name:'谨慎策略家',tagline:'先看方向，再谈情绪。',desc:'比起马上表达感情，你更会谨慎设计关系，也重视彼此成长。你通常会从长期角度看待感情。',strengths:['谨慎','有规划','尊重彼此成长']},es:{name:'Estratega prudente',tagline:'Primero la dirección, luego la emoción.',desc:'Muestras tus sentimientos poco a poco, construyes la relación con cuidado y valoras el crecimiento de cada persona. Sueles mirar a largo plazo.',strengths:['Prudencia','Planificación','Respeto por el crecimiento']}}},
    RSC: {emoji:'🌙', name:'은근한 낭만가', tagline:'티는 안 나도 마음은 깊다.', desc:'표현은 아껴도 마음은 깊고, 계획보다 분위기를 따라 함께하는 시간을 소중히 여기는 유형. 잔잔한 다정함이 매력.', strengths:['속 깊음','함께를 소중히','분위기를 탐'], compatible:['EPC','ESC'], i18n:{en:{name:'Subtle Romantic',tagline:'Quiet on the surface, deep at heart.',desc:'You may hold back expression, but your feelings run deep. You value shared moments that follow the mood more than a fixed plan, with a soft warmth that stays.',strengths:['Deep feelings','Values togetherness','Reads the mood']},ja:{name:'ひそかなロマンチスト',tagline:'表に出なくても、想いは深い。',desc:'表現は控えめでも気持ちは深く、計画よりも雰囲気に合わせて一緒に過ごす時間を大切にするタイプ。穏やかなやさしさが魅力です。',strengths:['想いが深い','一緒の時間を大切にする','雰囲気を読む']},zh:{name:'含蓄浪漫派',tagline:'看起来不张扬，心里却很深。',desc:'你表达不多，但感情很深；比起固定计划，更珍惜顺着氛围一起度过的时间。温柔而安静是你的魅力。',strengths:['内心深厚','珍惜相处','懂得氛围']},es:{name:'Romántico/a sutil',tagline:'Discreto/a por fuera, profundo/a por dentro.',desc:'Quizá expreses poco, pero tus sentimientos son profundos. Valoras los momentos compartidos que siguen el ambiente más que un plan rígido.',strengths:['Profundidad emocional','Valora estar juntos','Lee el ambiente']}}},
    RSF: {emoji:'🍃', name:'쿨한 자유인', tagline:'담백하게, 각자의 속도로.', desc:'감정 표현도 관계 운영도 담백하고 서로의 자유를 최우선으로 존중하는 유형. 편안하고 부담 없는 연애를 추구.', strengths:['담백함','독립적','상대를 존중'], compatible:['EPF','EPC'], i18n:{en:{name:'Cool Independent',tagline:'Simple, honest, at each person’s pace.',desc:'You keep emotional expression and relationship routines simple, and place strong value on mutual freedom. You look for a relaxed love without pressure.',strengths:['Uncomplicated','Independent','Respectful']},ja:{name:'クールな自由人',tagline:'さっぱりと、それぞれのペースで。',desc:'感情表現も関係の進め方もさっぱりしていて、お互いの自由を何より尊重するタイプ。気楽で負担の少ない恋愛を求めます。',strengths:['さっぱりしている','自立している','相手を尊重する']},zh:{name:'清爽自由派',tagline:'简单坦然，各有节奏。',desc:'你的情感表达和关系经营都比较清爽，也非常尊重彼此自由。你追求舒服、没有负担的恋爱。',strengths:['清爽直接','独立','尊重对方']},es:{name:'Independiente relajado/a',tagline:'Claro, ligero y al ritmo de cada uno.',desc:'Mantienes la expresión emocional y la relación de forma sencilla, y valoras mucho la libertad mutua. Buscas un amor cómodo y sin presión.',strengths:['Sencillez','Independencia','Respeto']}}}
  };

  var AXES = [
    {key:'ER', label:'표현', first:'E', second:'R', firstName:'표현형', secondName:'절제형', i18n:{en:{label:'Expression',firstName:'Expressive',secondName:'Reserved'},ja:{label:'表現',firstName:'表現型',secondName:'控えめ型'},zh:{label:'表达',firstName:'表达型',secondName:'克制型'},es:{label:'Expresión',firstName:'Expresivo/a',secondName:'Reservado/a'}}},
    {key:'PS', label:'계획', first:'P', second:'S', firstName:'계획형', secondName:'즉흥형', i18n:{en:{label:'Planning',firstName:'Planner',secondName:'Spontaneous'},ja:{label:'計画',firstName:'計画型',secondName:'即興型'},zh:{label:'计划',firstName:'计划型',secondName:'随性型'},es:{label:'Planificación',firstName:'Planificador/a',secondName:'Espontáneo/a'}}},
    {key:'CF', label:'거리감', first:'C', second:'F', firstName:'밀착형', secondName:'독립형', i18n:{en:{label:'Closeness',firstName:'Close',secondName:'Independent'},ja:{label:'距離感',firstName:'密着型',secondName:'自立型'},zh:{label:'距离感',firstName:'亲密型',secondName:'独立型'},es:{label:'Cercanía',firstName:'Cercano/a',secondName:'Independiente'}}}
  ];
  var UI = {
    ko: {agree:'동의', disagree:'비동의', likert:['매우 동의','동의','보통','비동의','매우 비동의'], sharePrefix:'내 연애 유형은 ', shareTitle:'연애 유형 테스트', shareUrl:'https://smartaitest.com/ko/love-type/', copied:'복사 완료', cardTitle:'나의 연애 유형'},
    en: {agree:'Agree', disagree:'Disagree', likert:['Strongly agree','Agree','Neutral','Disagree','Strongly disagree'], sharePrefix:'My love type is ', shareTitle:'Love Type Test', shareUrl:'https://smartaitest.com/en/love-type/', copied:'Copied', cardTitle:'My Love Type'},
    ja: {agree:'同意', disagree:'不同意', likert:['とてもそう思う','そう思う','どちらともいえない','そう思わない','まったくそう思わない'], sharePrefix:'私の恋愛タイプは ', shareTitle:'恋愛タイプ診断', shareUrl:'https://smartaitest.com/ja/love-type/', copied:'コピーしました', cardTitle:'私の恋愛タイプ'},
    zh: {agree:'同意', disagree:'不同意', likert:['非常同意','同意','普通','不同意','非常不同意'], sharePrefix:'我的恋爱类型是 ', shareTitle:'恋爱类型测试', shareUrl:'https://smartaitest.com/zh/love-type/', copied:'已复制', cardTitle:'我的恋爱类型'},
    es: {agree:'De acuerdo', disagree:'En desacuerdo', likert:['Muy de acuerdo','De acuerdo','Neutral','En desacuerdo','Muy en desacuerdo'], sharePrefix:'Mi tipo de amor es ', shareTitle:'Test de tipo de amor', shareUrl:'https://smartaitest.com/es/love-type/', copied:'Copiado', cardTitle:'Mi tipo de amor'}
  };
  var MIN_SCORE = 5;
  var MAX_SCORE = 25;

  function getLang(lang) {
    var raw = lang || (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) || 'ko';
    raw = String(raw || 'ko').toLowerCase().split('-')[0];
    return UI[raw] ? raw : 'ko';
  }

  function getUI(lang) {
    return UI[getLang(lang)] || UI.ko;
  }

  function getQuestionText(question, lang) {
    var currentLang = getLang(lang);
    return question[currentLang] || question.ko;
  }

  function getTypeText(code, lang) {
    var currentLang = getLang(lang);
    var type = TYPES[code];
    if (!type) return null;
    var data = currentLang === 'ko' ? null : (type.i18n && type.i18n[currentLang]);
    return {
      emoji: type.emoji,
      name: data && data.name ? data.name : type.name,
      tagline: data && data.tagline ? data.tagline : type.tagline,
      desc: data && data.desc ? data.desc : type.desc,
      strengths: data && data.strengths ? data.strengths : type.strengths,
      compatible: type.compatible
    };
  }

  function getAxisText(axis, lang) {
    var currentLang = getLang(lang);
    var data = currentLang === 'ko' ? null : (axis.i18n && axis.i18n[currentLang]);
    return {
      label: data && data.label ? data.label : axis.label,
      firstName: data && data.firstName ? data.firstName : axis.firstName,
      secondName: data && data.secondName ? data.secondName : axis.secondName
    };
  }

  function calculateResult(answers, lang) {
    var currentLang = getLang(lang);
    var scoreByAxis = {ER:0, PS:0, CF:0};

    QUESTIONS.forEach(function(q) {
      var raw = Number(answers[q.id]);
      var val = raw >= 1 && raw <= 5 ? raw : 3;
      scoreByAxis[q.dim] += q.reverse ? (6 - val) : val;
    });

    var code = AXES.map(function(axis) {
      return scoreByAxis[axis.key] >= 15 ? axis.first : axis.second;
    }).join('');

    var dimensions = AXES.map(function(axis) {
      var axisText = getAxisText(axis, currentLang);
      var firstScore = scoreByAxis[axis.key];
      var firstPct = Math.round(((firstScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100);
      firstPct = Math.max(0, Math.min(100, firstPct));
      var dominantFirst = firstScore >= 15;
      return {
        key: axis.key,
        label: axisText.label,
        first: axis.first,
        second: axis.second,
        firstName: axisText.firstName,
        secondName: axisText.secondName,
        firstScore: firstScore,
        secondScore: 30 - firstScore,
        firstPct: firstPct,
        secondPct: 100 - firstPct,
        dominant: dominantFirst ? axis.first : axis.second,
        dominantName: dominantFirst ? axisText.firstName : axisText.secondName,
        dominantPct: dominantFirst ? firstPct : 100 - firstPct
      };
    });

    return {code: code, type: currentLang === 'ko' ? TYPES[code] : getTypeText(code, currentLang), dimensions: dimensions, scores: scoreByAxis};
  }

  function init() {
    if (typeof document === 'undefined') return;

    var QS_PER_PAGE = 5;
    var lang = getLang();
    var ui = getUI(lang);
    var totalPages = Math.ceil(QUESTIONS.length / QS_PER_PAGE);
    var page = 0;
    var answers = {};

    var quizSection = document.getElementById('lt-quiz-section');
    var resultSection = document.getElementById('lt-result-section');
    var container = document.getElementById('pt-container');
    var progressBar = document.getElementById('pt-progress-bar');
    var progressText = document.getElementById('pt-progress-text');
    var progressWrap = progressBar ? progressBar.closest('.kick-glass') : null;
    var prevBtn = document.getElementById('pt-prev');
    var nextBtn = document.getElementById('pt-next');
    var submitBtn = document.getElementById('pt-submit');
    var errorMsg = document.getElementById('pt-error');

    if (!container) return;
    injectQuizStyles();

    function renderPage() {
      var start = page * QS_PER_PAGE;
      var pageQs = QUESTIONS.slice(start, start + QS_PER_PAGE);
      container.innerHTML = '';

      pageQs.forEach(function(q, idx) {
        var globalIdx = start + idx + 1;
        var saved = answers[q.id] || 0;
        var questionText = getQuestionText(q, lang);
        var card = document.createElement('div');
        card.className = 'pt-question-card' + (saved ? ' pt-answered' : '');
        card.innerHTML = [
          '<p class="pt-question-num">QUESTION ' + globalIdx + ' / ' + QUESTIONS.length + '</p>',
          '<p class="pt-question-text">' + escapeHtml(questionText) + '</p>',
          '<div class="pt-likert" role="radiogroup" aria-label="' + escapeHtml(questionText) + '">',
          '<span class="pt-end agree">' + escapeHtml(ui.agree) + '</span>',
          likertButtons(q.id, saved),
          '<span class="pt-end disagree">' + escapeHtml(ui.disagree) + '</span>',
          '</div>'
        ].join('');
        container.appendChild(card);
      });

      var firstUnanswered = container.querySelector('.pt-question-card:not(.pt-answered)');
      if (firstUnanswered) firstUnanswered.classList.add('pt-current');

      container.querySelectorAll('input[type=radio]').forEach(function(radio) {
        radio.addEventListener('change', function() {
          var qId = parseInt(this.name.replace('q', ''), 10);
          answers[qId] = parseInt(this.value, 10);
          var group = this.closest('.pt-likert');
          group.querySelectorAll('.pt-likert-btn').forEach(function(btn) { btn.classList.remove('active'); });
          this.closest('.pt-likert-btn').classList.add('active');
          this.closest('.pt-question-card').classList.add('pt-answered');
          if (errorMsg) errorMsg.style.display = 'none';
          updateProgress();
          advanceAfterAnswer();
        });
      });

      updateProgress();
      updateControls();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function likertButtons(questionId, saved) {
      return ui.likert.map(function(label, i) {
        var val = 5 - i;
        var pole = i < 2 ? 'agree' : (i === 2 ? 'neutral' : 'disagree');
        return '<label class="pt-likert-btn s' + i + ' ' + pole + (saved === val ? ' active' : '') + '" title="' + label + '" aria-label="' + label + '">' +
          '<input type="radio" name="q' + questionId + '" value="' + val + '"' + (saved === val ? ' checked' : '') + '>' +
          '<span class="pt-ck">&#10003;</span>' +
          '</label>';
      }).join('');
    }

    function updateProgress() {
      var answered = Object.keys(answers).length;
      var pct = Math.round((answered / QUESTIONS.length) * 100);
      if (progressBar) progressBar.style.width = Math.max(pct, 3) + '%';
      if (progressText) progressText.textContent = answered + ' / ' + QUESTIONS.length;
    }

    function updateControls() {
      if (prevBtn) prevBtn.style.display = page === 0 ? 'none' : 'inline-flex';
      if (nextBtn) nextBtn.style.display = page === totalPages - 1 ? 'none' : 'inline-flex';
      if (submitBtn) submitBtn.style.display = page === totalPages - 1 ? 'inline-flex' : 'none';
    }

    function setQuizVisible(visible) {
      var display = visible ? '' : 'none';
      if (quizSection) quizSection.style.display = visible ? 'block' : 'none';
      if (container) container.style.display = display;
      if (progressWrap) progressWrap.style.display = display;
      if (errorMsg) errorMsg.style.display = 'none';
    }

    function pageAnswered() {
      var start = page * QS_PER_PAGE;
      return QUESTIONS.slice(start, start + QS_PER_PAGE).every(function(q) { return answers[q.id]; });
    }

    function advanceAfterAnswer() {
      var cards = Array.prototype.slice.call(container.querySelectorAll('.pt-question-card'));
      cards.forEach(function(card) { card.classList.remove('pt-current'); });
      var next = cards.filter(function(card) { return !card.classList.contains('pt-answered'); })[0];
      if (next) {
        next.classList.add('pt-current');
        setTimeout(function() { next.scrollIntoView({behavior:'smooth', block:'center'}); }, 120);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function() {
      if (page > 0) {
        page -= 1;
        renderPage();
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', function() {
      if (!pageAnswered()) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
      }
      if (page < totalPages - 1) {
        page += 1;
        renderPage();
      }
    });

    if (submitBtn) submitBtn.addEventListener('click', function() {
      if (!pageAnswered()) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
      }
      var result = calculateResult(answers, lang);
      renderResult(result);
    });

    function renderResult(result) {
      var type = getTypeText(result.code, lang);
      setText('lt-type-emoji', type.emoji);
      setText('lt-type-code', result.code);
      setText('lt-type-name', type.name);
      setText('lt-type-tagline', type.tagline);
      setText('lt-type-desc', type.desc);

      var strengths = document.getElementById('lt-strengths-list');
      if (strengths) {
        strengths.innerHTML = type.strengths.map(function(item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('');
      }

      var compat = document.getElementById('lt-compatible-list');
      if (compat) {
        compat.innerHTML = type.compatible.map(function(code) {
          var t = getTypeText(code, lang);
          return '<a href="#lt-type-' + code + '" class="lt-compatible-badge">' + t.emoji + ' <strong>' + code + '</strong> ' + escapeHtml(t.name) + '</a>';
        }).join('');
      }

      var bars = document.getElementById('lt-dimension-bars');
      if (bars) {
        bars.innerHTML = result.dimensions.map(function(d) {
          return '<div class="lt-axis-row">' +
            '<div class="lt-axis-title">' + escapeHtml(d.label) + ' — ' + escapeHtml(d.dominantName) + ' ' + d.dominantPct + '%</div>' +
            '<div class="lt-axis-labels"><span class="' + (d.dominant === d.first ? 'active' : '') + '">' + d.first + ' ' + d.firstName + '</span><span class="' + (d.dominant === d.second ? 'active' : '') + '">' + d.second + ' ' + d.secondName + '</span></div>' +
            '<div class="lt-axis-track"><div class="lt-axis-fill" style="width:' + d.firstPct + '%"></div></div>' +
            '<div class="lt-axis-meta"><span>' + d.firstPct + '%</span><span>' + d.secondPct + '%</span></div>' +
            '</div>';
        }).join('');
      }

      sessionStorage.setItem('love-type-result', result.code);
      sessionStorage.setItem('love-type-answers', JSON.stringify(answers));
      setQuizVisible(false);
      if (resultSection) resultSection.style.display = 'block';
      window.scrollTo({top: resultSection ? resultSection.offsetTop - 90 : 0, behavior:'smooth'});
    }

    var retake = document.getElementById('lt-retake');
    if (retake) {
      retake.addEventListener('click', function() {
        answers = {};
        page = 0;
        if (resultSection) resultSection.style.display = 'none';
        setQuizVisible(true);
        renderPage();
      });
    }

    var share = document.getElementById('lt-share');
    if (share) {
      share.addEventListener('click', function() {
        var code = sessionStorage.getItem('love-type-result') || 'EPC';
        var type = getTypeText(code, lang);
        var text = ui.sharePrefix + code + ' ' + type.name + ' - ' + type.tagline;
        var url = ui.shareUrl;
        if (navigator.share) {
          navigator.share({title:ui.shareTitle, text:text, url:url}).catch(function(){});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text + '\n' + url).then(function() {
            var old = share.textContent;
            share.textContent = ui.copied;
            setTimeout(function() { share.textContent = old; }, 1600);
          });
        }
      });
    }

    var saveCard = document.getElementById('lt-save-card');
    if (saveCard) {
      saveCard.addEventListener('click', function() {
        var code = sessionStorage.getItem('love-type-result') || 'EPC';
        renderShareCard(code, lang, function(blob) {
          if (!blob) return;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'love-type-' + code + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(a.href); }, 3000);
        });
      });
    }

    renderPage();
  }

  function renderShareCard(code, lang, cb) {
    if (typeof document === 'undefined') return cb(null);
    var currentLang = getLang(lang);
    var ui = getUI(currentLang);
    var type = getTypeText(code, currentLang);
    if (!type) return cb(null);
    var canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    var ctx = canvas.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 1080, 1080);
    g.addColorStop(0, '#2b1021');
    g.addColorStop(0.5, '#71324f');
    g.addColorStop(1, '#f0b7c8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (var x = 0; x < 1080; x += 18) {
      for (var y = 0; y < 1080; y += 18) ctx.fillRect(x, y, 2, 2);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = '700 42px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(ui.cardTitle, 540, 120);
    ctx.font = '160px -apple-system,"Apple Color Emoji",sans-serif';
    ctx.fillText(type.emoji, 540, 340);
    ctx.font = '900 96px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(code, 540, 470);
    ctx.font = '800 64px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(type.name, 540, 570);
    ctx.font = '500 38px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    wrapCanvasText(ctx, type.tagline, 540, 650, 780, 56);
    ctx.globalAlpha = 0.72;
    ctx.font = '600 30px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(ui.shareUrl.replace('https://', '').replace(/\/$/, ''), 540, 980);
    ctx.globalAlpha = 1;
    canvas.toBlob(cb, 'image/png');
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = String(text).split('');
    var line = '';
    var lines = [];
    chars.forEach(function(ch) {
      var test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.forEach(function(ln, idx) { ctx.fillText(ln, x, y + idx * lineHeight); });
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function injectQuizStyles() {
    if (document.getElementById('lt-quiz-styles')) return;
    var s = document.createElement('style');
    s.id = 'lt-quiz-styles';
    s.textContent = [
      '.pt-question-card{padding:22px 18px;margin-bottom:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:18px;transition:border-color .3s ease;}',
      '.pt-question-card.pt-current{border-color:rgba(244,114,182,0.48);}',
      '.pt-question-num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.42);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}',
      '.pt-question-text{font-size:16px;font-weight:600;color:#F4F1F8;line-height:1.5;margin-bottom:18px;}',
      '.pt-likert{display:flex;align-items:center;justify-content:center;gap:clamp(3px,1.5vw,11px);flex-wrap:nowrap;}',
      '.pt-likert .pt-end{font-size:11px;font-weight:700;width:38px;text-align:center;flex:0 0 auto;line-height:1.2;}',
      '.pt-likert .pt-end.agree{color:#F9A8D4;}',
      '.pt-likert .pt-end.disagree{color:#D9C8F0;}',
      '.pt-likert .pt-likert-btn{position:relative;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,255,255,0.55);background:rgba(255,255,255,0.09);cursor:pointer;flex:0 0 auto;min-width:0;padding:0;box-sizing:border-box;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,background .15s;}',
      '.pt-likert .pt-likert-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0;}',
      '.pt-likert .pt-likert-btn:hover{transform:scale(1.12);}',
      '.pt-likert .pt-likert-btn .pt-ck{opacity:0;color:#16130F;font-weight:900;font-size:13px;pointer-events:none;transition:opacity .15s;}',
      '.pt-likert .pt-likert-btn.active .pt-ck{opacity:1;}',
      '.pt-likert .pt-likert-btn.s0,.pt-likert .pt-likert-btn.s4{width:38px;height:38px;}',
      '.pt-likert .pt-likert-btn.s1,.pt-likert .pt-likert-btn.s3{width:30px;height:30px;}',
      '.pt-likert .pt-likert-btn.s2{width:24px;height:24px;}',
      '.pt-likert .pt-likert-btn.agree.active{background:#F9A8D4;border-color:#F9A8D4;}',
      '.pt-likert .pt-likert-btn.neutral.active{background:rgba(255,255,255,0.60);border-color:rgba(255,255,255,0.60);}',
      '.pt-likert .pt-likert-btn.disagree.active{background:#D9C8F0;border-color:#D9C8F0;}',
      '@media (prefers-reduced-motion: reduce){.pt-likert .pt-likert-btn,.pt-question-card{transition:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(ch) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch];
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  return {
    questions: QUESTIONS,
    types: TYPES,
    axes: AXES,
    calculateResult: calculateResult
  };
});
