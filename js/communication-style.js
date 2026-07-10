// communication-style.js
// Communication style quiz: 15 Likert questions, 3 dimensions, 8 result types.

(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CommunicationStyleTest = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';

  var QUESTIONS = [
    {id:1, dim:'DI', reverse:false, ko:'할 말이 있으면 돌려 말하기보다 그대로 말하는 편이다.', en:'When I have something to say, I tend to say it plainly rather than hinting.', ja:'言いたいことがあるときは、遠回しにせずそのまま伝えるほうだ。', zh:'有话要说时，我更倾向于直接说出来，而不是绕着说。', es:'Cuando tengo algo que decir, suelo decirlo de forma clara en vez de insinuarlo.'},
    {id:2, dim:'DI', reverse:false, ko:'내 의견이 다르면 그 자리에서 분명히 밝힌다.', en:'If my opinion is different, I make that clear in the moment.', ja:'自分の意見が違うときは、その場ではっきり伝える。', zh:'如果我的意见不同，我会当场明确表达。', es:'Si mi opinión es distinta, lo digo con claridad en ese momento.'},
    {id:3, dim:'DI', reverse:true, ko:'상대가 상처받을까 봐 말을 고르고 다듬는 편이다.', en:'I tend to choose and soften my words so the other person does not feel hurt.', ja:'相手を傷つけないように、言葉を選んで整えるほうだ。', zh:'我会斟酌和修饰措辞，避免让对方受伤。', es:'Tiendo a escoger y suavizar mis palabras para no herir a la otra persona.'},
    {id:4, dim:'DI', reverse:false, ko:'피드백은 솔직해야 서로에게 도움이 된다고 생각한다.', en:'I think feedback helps more when it is honest.', ja:'フィードバックは率直なほうが、お互いのためになると思う。', zh:'我认为反馈越真诚直接，越能对彼此有帮助。', es:'Creo que la retroalimentación ayuda más cuando es honesta.'},
    {id:5, dim:'DI', reverse:true, ko:'부탁이나 거절은 에둘러 표현하는 게 편하다.', en:'I feel more comfortable making requests or saying no indirectly.', ja:'頼みごとや断りは、やわらかく遠回しに伝えるほうが楽だ。', zh:'提出请求或拒绝别人时，我觉得委婉一点更自在。', es:'Me siento más cómodo/a pidiendo algo o diciendo que no de manera indirecta.'},
    {id:6, dim:'SE', reverse:false, ko:'고민 상담을 들으면 해결 방법부터 찾게 된다.', en:'When someone shares a concern, I start looking for solutions first.', ja:'相談を聞くと、まず解決方法を探したくなる。', zh:'听别人倾诉烦恼时，我会先开始找解决办法。', es:'Cuando alguien me cuenta una preocupación, empiezo buscando soluciones.'},
    {id:7, dim:'SE', reverse:true, ko:'해결책보다 "그랬구나" 하는 공감이 먼저라고 생각한다.', en:'I think empathy like "that must have been hard" should come before solutions.', ja:'解決策より先に、「そうだったんだ」と受け止めることが大事だと思う。', zh:'比起解决方案，我认为先说“原来是这样”并共情更重要。', es:'Creo que la empatía, como decir "entiendo lo que pasó", debe venir antes que la solución.'},
    {id:8, dim:'SE', reverse:false, ko:'대화가 결론 없이 길어지면 답답하다.', en:'I feel frustrated when a conversation goes on without reaching a point.', ja:'結論のない会話が長く続くと、もどかしく感じる。', zh:'对话一直没有结论时，我会觉得有点憋闷。', es:'Me frustra cuando una conversación se alarga sin llegar a nada concreto.'},
    {id:9, dim:'SE', reverse:true, ko:'상대의 기분이 어떤지에 먼저 귀를 기울인다.', en:'I listen first for how the other person is feeling.', ja:'まず相手がどんな気持ちなのかに耳を傾ける。', zh:'我会先留意对方现在是什么感受。', es:'Primero presto atención a cómo se siente la otra persona.'},
    {id:10, dim:'SE', reverse:false, ko:'회의나 대화는 목적이 분명해야 만족스럽다.', en:'I am most satisfied when meetings or conversations have a clear purpose.', ja:'会議や会話は、目的がはっきりしているほうが満足できる。', zh:'会议或对话目标明确时，我会更满意。', es:'Me siento más satisfecho/a cuando una reunión o conversación tiene un propósito claro.'},
    {id:11, dim:'FA', reverse:false, ko:'마음에 걸리는 일은 바로 이야기해서 풀어야 한다.', en:'If something bothers me, I think it should be talked through right away.', ja:'気になることは、すぐ話して解消したほうがいい。', zh:'让我介意的事，我觉得应该马上说开。', es:'Si algo me incomoda, creo que conviene hablarlo enseguida.'},
    {id:12, dim:'FA', reverse:true, ko:'갈등이 생기면 시간을 두고 생각을 정리한 뒤 말한다.', en:'When conflict comes up, I take time to organize my thoughts before speaking.', ja:'対立が起きたら、少し時間を置いて考えを整理してから話す。', zh:'发生冲突时，我会先花时间整理想法，再开口。', es:'Cuando surge un conflicto, me tomo tiempo para ordenar mis ideas antes de hablar.'},
    {id:13, dim:'FA', reverse:false, ko:'불편한 주제라도 미루지 않고 꺼내는 편이다.', en:'Even with uncomfortable topics, I tend to bring them up without putting them off.', ja:'話しにくいテーマでも、後回しにせず切り出すほうだ。', zh:'即使是不舒服的话题，我也倾向于不拖延、直接提出来。', es:'Aunque sea un tema incómodo, suelo sacarlo sin dejarlo para después.'},
    {id:14, dim:'FA', reverse:true, ko:'감정이 격할 때는 대화를 잠시 미루는 게 낫다고 본다.', en:'When emotions are intense, I think it is better to pause the conversation for a while.', ja:'感情が高ぶっているときは、会話を少し先延ばしにしたほうがいいと思う。', zh:'情绪很激动时，我认为暂时推迟对话会更好。', es:'Cuando las emociones están muy intensas, creo que es mejor pausar la conversación un rato.'},
    {id:15, dim:'FA', reverse:false, ko:'오해는 그날 안에 푸는 게 마음 편하다.', en:'I feel better when misunderstandings are cleared up the same day.', ja:'誤解はその日のうちに解いたほうが安心する。', zh:'误会当天解开，我会比较安心。', es:'Me quedo más tranquilo/a cuando los malentendidos se aclaran el mismo día.'}
  ];

  var TYPES = {
    DSF: {emoji:'🎯', name:'명쾌한 해결사', tagline:'문제는 바로, 답은 분명하게.', desc:'하고 싶은 말을 분명히 하고 문제가 보이면 즉시 해결로 움직이는 유형. 대화가 빠르고 시원시원하다.', strengths:['추진력','명확한 전달','빠른 문제 해결'], compatible:['ISF','IEF'], i18n:{en:{name:'Clear-Cut Fixer',tagline:'Address the issue now. Make the answer clear.',desc:'You say what you mean and move quickly toward a solution when you see a problem. Conversations with you feel fast, direct, and refreshing.',strengths:['Drive','Clear delivery','Quick problem solving']},ja:{name:'明快な解決屋',tagline:'問題はすぐに、答えははっきり。',desc:'言いたいことを明確に伝え、問題が見えたらすぐ解決に動くタイプ。会話はテンポがよく、すっきりしています。',strengths:['推進力','明確な伝達','素早い問題解決']},zh:{name:'清晰解决者',tagline:'问题马上处理，答案说得明确。',desc:'你会清楚说出想法，看到问题就立刻行动解决。和你对话节奏快，也很干脆。',strengths:['推进力','表达清晰','快速解决问题']},es:{name:'Solucionador/a directo/a',tagline:'El problema, ahora. La respuesta, clara.',desc:'Dices lo que quieres decir y, cuando ves un problema, avanzas rápido hacia una solución. Hablar contigo se siente ágil, claro y directo.',strengths:['Impulso','Comunicación clara','Resolución rápida']}}},
    DSA: {emoji:'♟️', name:'논리적인 전략가', tagline:'정리된 생각만 꺼낸다.', desc:'솔직하되 충분히 생각을 정리한 뒤 핵심만 말하는 유형. 결론이 명확하고 설득력이 있다.', strengths:['논리적','신중한 판단','핵심 전달'], compatible:['ISA','IEA'], i18n:{en:{name:'Logical Strategist',tagline:'Only the organized thought gets spoken.',desc:'You are honest, but you prefer to sort your thoughts first and say only what matters. Your conclusions are clear and persuasive.',strengths:['Logical thinking','Careful judgment','Gets to the point']},ja:{name:'論理的な戦略家',tagline:'整理した考えだけを言葉にする。',desc:'率直ではあるものの、十分に考えを整えてから要点だけを伝えるタイプ。結論が明確で説得力があります。',strengths:['論理的','慎重な判断','要点を伝える力']},zh:{name:'逻辑策略家',tagline:'只说整理好的想法。',desc:'你很坦诚，但会先充分整理思路，再说出重点。你的结论清楚，也有说服力。',strengths:['逻辑性','谨慎判断','抓住重点']},es:{name:'Estratega lógico/a',tagline:'Solo digo lo que ya está ordenado.',desc:'Eres honesto/a, pero prefieres ordenar tus ideas antes de hablar y quedarte con lo esencial. Tus conclusiones son claras y convincentes.',strengths:['Lógica','Juicio cuidadoso','Comunicación al punto']}}},
    DEF: {emoji:'🔥', name:'솔직한 공감러', tagline:'마음도 말도 숨기지 않는다.', desc:'감정과 생각을 그대로 표현하면서도 상대의 마음에 먼저 반응하는 유형. 대화에 온기와 에너지가 있다.', strengths:['진솔함','즉각적 공감','활기찬 대화'], compatible:['IEF','ISF'], i18n:{en:{name:'Open Empath',tagline:'No hiding the heart, no hiding the words.',desc:'You express your thoughts and feelings openly while responding first to the other person’s emotions. Your conversations carry warmth and energy.',strengths:['Sincerity','Immediate empathy','Lively conversation']},ja:{name:'率直な共感タイプ',tagline:'気持ちも言葉も隠さない。',desc:'感情や考えをそのまま表現しながら、相手の気持ちにも先に反応するタイプ。会話に温かさとエネルギーがあります。',strengths:['誠実さ','すぐに寄り添える','活気ある会話']},zh:{name:'坦率共情者',tagline:'心意和语言都不隐藏。',desc:'你会直接表达情绪和想法，同时也会先回应对方的感受。你的对话带着温度和能量。',strengths:['真诚','即时共情','对话有活力']},es:{name:'Empático/a franco/a',tagline:'No escondo ni lo que siento ni lo que digo.',desc:'Expresas tus emociones e ideas tal como son, pero también respondes primero al estado emocional de la otra persona. Tus conversaciones tienen calidez y energía.',strengths:['Sinceridad','Empatía inmediata','Conversación viva']}}},
    DEA: {emoji:'🌳', name:'진심 어린 조언가', tagline:'천천히, 그러나 진심으로.', desc:'상대의 마음을 헤아린 뒤 솔직한 생각을 정성껏 전하는 유형. 무게 있는 한마디로 신뢰를 얻는다.', strengths:['진정성','깊은 배려','믿음직한 조언'], compatible:['IEA','ISA'], i18n:{en:{name:'Sincere Advisor',tagline:'Slowly, but with real care.',desc:'You consider the other person’s feelings, then share your honest thoughts with care. A few grounded words from you can build real trust.',strengths:['Sincerity','Deep consideration','Trustworthy advice']},ja:{name:'心からの助言者',tagline:'ゆっくり、でも心を込めて。',desc:'相手の気持ちをくみ取ったうえで、率直な考えを丁寧に伝えるタイプ。重みのあるひと言で信頼を得ます。',strengths:['真摯さ','深い配慮','信頼できる助言']},zh:{name:'真诚建议者',tagline:'慢慢说，但真心说。',desc:'你会先体察对方的心情，再用心表达真实想法。你有分量的一句话，常常能赢得信任。',strengths:['真诚','深度体贴','可靠建议']},es:{name:'Consejero/a sincero/a',tagline:'Despacio, pero de corazón.',desc:'Primero consideras cómo se siente la otra persona y luego compartes tus ideas honestas con cuidado. Tus palabras, aunque pocas, transmiten confianza.',strengths:['Sinceridad','Cuidado profundo','Consejo confiable']}}},
    ISF: {emoji:'🕊️', name:'부드러운 조율사', tagline:'둥글게, 그래도 빠르게.', desc:'표현은 부드럽지만 문제는 미루지 않고 조율해내는 유형. 갈등을 큰 소리 없이 풀어낸다.', strengths:['원만한 중재','배려 있는 화법','실행력'], compatible:['DSF','DEF'], i18n:{en:{name:'Gentle Coordinator',tagline:'Soft in tone, quick in action.',desc:'You speak gently, but you do not let issues sit unresolved. You work through conflict without making it louder than it needs to be.',strengths:['Smooth mediation','Considerate wording','Follow-through']},ja:{name:'やわらかな調整役',tagline:'まるく、でも素早く。',desc:'表現はやわらかいものの、問題は先延ばしにせず調整していくタイプ。大きな声を出さずに衝突をほどきます。',strengths:['円満な仲裁','配慮ある話し方','実行力']},zh:{name:'温和协调者',tagline:'说得圆融，也处理得很快。',desc:'你表达温和，但不会把问题拖着不管。你能在不把冲突放大的情况下把事情协调好。',strengths:['顺畅调解','体贴表达','执行力']},es:{name:'Coordinador/a amable',tagline:'Con tacto, pero sin demorarlo.',desc:'Te expresas con suavidad, pero no dejas los problemas pendientes. Resuelves conflictos sin hacer más ruido del necesario.',strengths:['Mediación fluida','Forma cuidadosa de hablar','Capacidad de actuar']}}},
    ISA: {emoji:'🦉', name:'신중한 설계자', tagline:'말 한마디도 설계한다.', desc:'말을 고르고 때를 기다려 가장 부드럽고 정확한 방식으로 전하는 유형. 실수가 적고 안정감을 준다.', strengths:['사려 깊음','정제된 표현','차분함'], compatible:['DSA','DEA'], i18n:{en:{name:'Careful Architect',tagline:'Even one sentence is designed.',desc:'You choose your words, wait for the right timing, and deliver them in the softest accurate way you can. You make fewer missteps and offer steadiness.',strengths:['Thoughtfulness','Refined expression','Calm presence']},ja:{name:'慎重な設計者',tagline:'ひと言までも設計する。',desc:'言葉を選び、タイミングを待ち、もっともやわらかく正確な形で伝えるタイプ。失敗が少なく、安心感を与えます。',strengths:['思慮深さ','整った表現','落ち着き']},zh:{name:'谨慎设计者',tagline:'一句话也会先设计好。',desc:'你会选择措辞、等待时机，再用最温和且准确的方式表达。你不容易失言，也能给人稳定感。',strengths:['思虑周到','表达精炼','沉着']},es:{name:'Arquitecto/a cuidadoso/a',tagline:'Diseño hasta una sola frase.',desc:'Escoges tus palabras, esperas el momento adecuado y las dices de la forma más suave y precisa posible. Sueles cometer pocos errores y das estabilidad.',strengths:['Consideración','Expresión pulida','Calma']}}},
    IEF: {emoji:'🤗', name:'따뜻한 경청가', tagline:'먼저 듣고, 바로 안아준다.', desc:'판단보다 공감이 먼저이고, 상대가 힘들 때 바로 곁에서 반응해주는 유형. 함께 있으면 마음이 놓인다.', strengths:['경청','따뜻한 반응','편안한 분위기'], compatible:['DEF','DSF'], i18n:{en:{name:'Warm Listener',tagline:'Listen first, comfort right away.',desc:'You offer empathy before judgment and respond quickly when someone is having a hard time. People feel emotionally safe around you.',strengths:['Listening','Warm response','Comfortable atmosphere']},ja:{name:'温かな聞き手',tagline:'まず聞いて、すぐ受け止める。',desc:'判断より共感が先で、相手がつらいときにすぐそばで反応できるタイプ。一緒にいると心が落ち着きます。',strengths:['傾聴','温かな反応','安心できる雰囲気']},zh:{name:'温暖倾听者',tagline:'先听见，再马上接住。',desc:'你会先共情而不是评判，对方难过时也会立刻在身边回应。和你在一起让人安心。',strengths:['倾听','温暖回应','舒服的氛围']},es:{name:'Oyente cálido/a',tagline:'Primero escucho, luego acompaño.',desc:'Ofreces empatía antes que juicio y respondes rápido cuando alguien lo está pasando mal. Estar contigo se siente seguro y tranquilo.',strengths:['Escucha','Respuesta cálida','Ambiente cómodo']}}},
    IEA: {emoji:'🌙', name:'깊은 이해자', tagline:'말없이도 마음을 읽는다.', desc:'조용히 오래 들어주고 시간을 들여 상대를 이해하는 유형. 깊은 대화에서 진가가 드러난다.', strengths:['깊은 이해','인내심','신중한 공감'], compatible:['DEA','DSA'], i18n:{en:{name:'Deep Understander',tagline:'Reads the heart, even without many words.',desc:'You listen quietly for a long time and take time to understand the other person. Your strength shows most in deep conversations.',strengths:['Deep understanding','Patience','Careful empathy']},ja:{name:'深く理解する人',tagline:'言葉が少なくても、心を読む。',desc:'静かに長く耳を傾け、時間をかけて相手を理解するタイプ。深い会話で真価が表れます。',strengths:['深い理解','忍耐力','慎重な共感']},zh:{name:'深度理解者',tagline:'不用太多话，也能读懂心。',desc:'你会安静地听很久，也愿意花时间理解对方。越是深入的对话，越能看出你的价值。',strengths:['深度理解','耐心','谨慎共情']},es:{name:'Entendedor/a profundo/a',tagline:'Leo el corazón incluso con pocas palabras.',desc:'Escuchas con calma durante mucho tiempo y te das espacio para comprender a la otra persona. Tu valor aparece especialmente en las conversaciones profundas.',strengths:['Comprensión profunda','Paciencia','Empatía cuidadosa']}}}
  };

  var AXES = [
    {key:'DI', label:'표현', first:'D', second:'I', firstName:'직설형', secondName:'완곡형', i18n:{en:{label:'Expression',firstName:'Direct',secondName:'Indirect'},ja:{label:'表現',firstName:'直接型',secondName:'婉曲型'},zh:{label:'表达',firstName:'直接型',secondName:'委婉型'},es:{label:'Expresión',firstName:'Directo/a',secondName:'Indirecto/a'}}},
    {key:'SE', label:'목적', first:'S', second:'E', firstName:'해결형', secondName:'공감형', i18n:{en:{label:'Purpose',firstName:'Solution-focused',secondName:'Empathy-focused'},ja:{label:'目的',firstName:'解決型',secondName:'共感型'},zh:{label:'目的',firstName:'解决型',secondName:'共情型'},es:{label:'Propósito',firstName:'Resolutivo/a',secondName:'Empático/a'}}},
    {key:'FA', label:'타이밍', first:'F', second:'A', firstName:'즉시형', secondName:'숙고형', i18n:{en:{label:'Timing',firstName:'Immediate',secondName:'Reflective'},ja:{label:'タイミング',firstName:'即時型',secondName:'熟考型'},zh:{label:'时机',firstName:'即时型',secondName:'深思型'},es:{label:'Momento',firstName:'Inmediato/a',secondName:'Reflexivo/a'}}}
  ];
  var UI = {
    ko: {agree:'동의', disagree:'비동의', likert:['매우 동의','동의','보통','비동의','매우 비동의'], sharePrefix:'내 소통 유형은 ', shareTitle:'소통 유형 테스트', shareUrl:'https://smartaitest.com/ko/communication-style/', copied:'복사 완료', cardTitle:'나의 소통 유형'},
    en: {agree:'Agree', disagree:'Disagree', likert:['Strongly agree','Agree','Neutral','Disagree','Strongly disagree'], sharePrefix:'My communication style is ', shareTitle:'Communication Style Test', shareUrl:'https://smartaitest.com/en/communication-style/', copied:'Copied', cardTitle:'My Communication Style'},
    ja: {agree:'同意', disagree:'不同意', likert:['とてもそう思う','そう思う','どちらともいえない','そう思わない','まったくそう思わない'], sharePrefix:'私のコミュニケーションタイプは ', shareTitle:'コミュニケーションタイプ診断', shareUrl:'https://smartaitest.com/ja/communication-style/', copied:'コピーしました', cardTitle:'私のコミュニケーションタイプ'},
    zh: {agree:'同意', disagree:'不同意', likert:['非常同意','同意','普通','不同意','非常不同意'], sharePrefix:'我的沟通类型是 ', shareTitle:'沟通类型测试', shareUrl:'https://smartaitest.com/zh/communication-style/', copied:'已复制', cardTitle:'我的沟通类型'},
    es: {agree:'De acuerdo', disagree:'En desacuerdo', likert:['Muy de acuerdo','De acuerdo','Neutral','En desacuerdo','Muy en desacuerdo'], sharePrefix:'Mi estilo de comunicación es ', shareTitle:'Test de estilo de comunicación', shareUrl:'https://smartaitest.com/es/communication-style/', copied:'Copiado', cardTitle:'Mi estilo de comunicación'}
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
    var scoreByAxis = {DI:0, SE:0, FA:0};

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

      sessionStorage.setItem('communication-style-result', result.code);
      sessionStorage.setItem('communication-style-answers', JSON.stringify(answers));
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
        var code = sessionStorage.getItem('communication-style-result') || 'DSF';
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
        var code = sessionStorage.getItem('communication-style-result') || 'DSF';
        renderShareCard(code, lang, function(blob) {
          if (!blob) return;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'communication-style-' + code + '.png';
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
    g.addColorStop(0, '#182033');
    g.addColorStop(0.5, '#244f68');
    g.addColorStop(1, '#7dd3fc');
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
      '.pt-question-card.pt-current{border-color:rgba(125,211,252,0.48);}',
      '.pt-question-num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.42);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}',
      '.pt-question-text{font-size:16px;font-weight:600;color:#F4F1F8;line-height:1.5;margin-bottom:18px;}',
      '.pt-likert{display:flex;align-items:center;justify-content:center;gap:clamp(3px,1.5vw,11px);flex-wrap:nowrap;}',
      '.pt-likert .pt-end{font-size:11px;font-weight:700;width:38px;text-align:center;flex:0 0 auto;line-height:1.2;}',
      '.pt-likert .pt-end.agree{color:#7DD3FC;}',
      '.pt-likert .pt-end.disagree{color:#D9C8F0;}',
      '.pt-likert .pt-likert-btn{position:relative;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,255,255,0.55);background:rgba(255,255,255,0.09);cursor:pointer;flex:0 0 auto;min-width:0;padding:0;box-sizing:border-box;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,background .15s;}',
      '.pt-likert .pt-likert-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0;}',
      '.pt-likert .pt-likert-btn:hover{transform:scale(1.12);}',
      '.pt-likert .pt-likert-btn .pt-ck{opacity:0;color:#16130F;font-weight:900;font-size:13px;pointer-events:none;transition:opacity .15s;}',
      '.pt-likert .pt-likert-btn.active .pt-ck{opacity:1;}',
      '.pt-likert .pt-likert-btn.s0,.pt-likert .pt-likert-btn.s4{width:38px;height:38px;}',
      '.pt-likert .pt-likert-btn.s1,.pt-likert .pt-likert-btn.s3{width:30px;height:30px;}',
      '.pt-likert .pt-likert-btn.s2{width:24px;height:24px;}',
      '.pt-likert .pt-likert-btn.agree.active{background:#7DD3FC;border-color:#7DD3FC;}',
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
