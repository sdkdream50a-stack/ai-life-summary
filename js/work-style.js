// work-style.js
// Work style quiz: 15 Likert questions, 3 dimensions, 8 result types.

(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.WorkStyleTest = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';

  var QUESTIONS = [
    {id:1, dim:'PA', reverse:false, ko:'일을 시작하기 전에 순서와 일정부터 정리한다.', en:'Before starting work, I first sort out the order and schedule.', ja:'仕事を始める前に、まず手順とスケジュールを整理する。', zh:'开始工作前，我会先整理顺序和时间安排。', es:'Antes de empezar una tarea, primero organizo el orden y el calendario.'},
    {id:2, dim:'PA', reverse:false, ko:'할 일 목록이나 플래너를 꾸준히 쓰는 편이다.', en:'I tend to use to-do lists or a planner consistently.', ja:'ToDoリストやプランナーを継続して使うほうだ。', zh:'我通常会持续使用待办清单或计划本。', es:'Suelo usar listas de tareas o una agenda de forma constante.'},
    {id:3, dim:'PA', reverse:true, ko:'계획이 틀어져도 크게 스트레스받지 않고 바로 조정한다.', en:'Even when plans change, I adjust right away without getting too stressed.', ja:'予定が崩れても、あまりストレスを感じずにすぐ調整する。', zh:'即使计划被打乱，我也不会太焦虑，会马上调整。', es:'Aunque el plan cambie, me adapto enseguida sin estresarme demasiado.'},
    {id:4, dim:'PA', reverse:false, ko:'마감보다 훨씬 앞서 미리 끝내두는 게 마음 편하다.', en:'I feel better when I finish things well before the deadline.', ja:'締め切りよりかなり前に終わらせておくほうが安心する。', zh:'比起临近截止，我更安心于提前很久完成。', es:'Me siento más tranquilo/a cuando termino mucho antes de la fecha límite.'},
    {id:5, dim:'PA', reverse:true, ko:'즉흥적으로 생긴 일도 흐름에 맡겨 처리하는 편이다.', en:'When something unexpected comes up, I tend to handle it by going with the flow.', ja:'急に入ったことも、その場の流れに任せて処理するほうだ。', zh:'临时冒出来的事情，我也倾向于顺着当下的节奏处理。', es:'Cuando surge algo improvisado, suelo resolverlo dejándome llevar por la situación.'},
    {id:6, dim:'TS', reverse:false, ko:'아이디어는 사람들과 이야기할 때 더 잘 떠오른다.', en:'Ideas come to me more easily when I talk with other people.', ja:'アイデアは、人と話しているときのほうが浮かびやすい。', zh:'和别人交流时，我更容易冒出想法。', es:'Las ideas me vienen con más facilidad cuando hablo con otras personas.'},
    {id:7, dim:'TS', reverse:true, ko:'혼자 조용히 집중할 때 능률이 가장 오른다.', en:'I work most efficiently when I can focus quietly on my own.', ja:'一人で静かに集中しているときが、いちばん効率が上がる。', zh:'独自安静专注时，我的效率最高。', es:'Rindo mejor cuando puedo concentrarme a solas y en silencio.'},
    {id:8, dim:'TS', reverse:false, ko:'일의 진행 상황을 동료와 자주 공유하는 게 좋다.', en:'I like sharing work progress with teammates often.', ja:'仕事の進み具合は、同僚とこまめに共有したい。', zh:'我喜欢经常和同事同步工作进展。', es:'Me gusta compartir con frecuencia el avance del trabajo con mis compañeros.'},
    {id:9, dim:'TS', reverse:true, ko:'협업보다 각자 맡은 부분을 나눠서 하는 게 편하다.', en:'I am more comfortable dividing up each person’s part than collaborating closely.', ja:'密に協業するより、それぞれの担当を分けて進めるほうが楽だ。', zh:'比起紧密协作，我更习惯各自分工完成自己的部分。', es:'Me siento más cómodo/a repartiendo partes claras que colaborando de forma muy estrecha.'},
    {id:10, dim:'TS', reverse:false, ko:'어려운 문제는 여럿이 머리를 맞대야 풀린다고 생각한다.', en:'I think difficult problems are best solved by putting several heads together.', ja:'難しい問題は、みんなで知恵を出し合ってこそ解けると思う。', zh:'我认为难题需要多人一起碰撞想法才更容易解决。', es:'Creo que los problemas difíciles se resuelven mejor pensando en equipo.'},
    {id:11, dim:'RE', reverse:false, ko:'일의 재미보다 눈에 보이는 결과가 더 중요하다.', en:'Visible results matter more to me than how fun the work is.', ja:'仕事の面白さより、目に見える成果のほうが大事だ。', zh:'比起工作本身有趣，我更看重看得见的结果。', es:'Para mí, los resultados visibles importan más que lo divertida que sea la tarea.'},
    {id:12, dim:'RE', reverse:true, ko:'결과가 늦어져도 새로운 방법을 실험해보는 게 즐겁다.', en:'I enjoy experimenting with new methods, even if results take longer.', ja:'結果が出るのが遅くなっても、新しい方法を試すのは楽しい。', zh:'即使结果来得慢一些，我也享受尝试新方法。', es:'Disfruto probar métodos nuevos, aunque el resultado tarde más.'},
    {id:13, dim:'RE', reverse:false, ko:'목표 수치나 마감이 있어야 몰입이 잘 된다.', en:'I focus better when there is a target number or deadline.', ja:'目標数値や締め切りがあるほうが集中しやすい。', zh:'有目标数字或截止时间时，我更容易投入。', es:'Me concentro mejor cuando hay una meta concreta o una fecha límite.'},
    {id:14, dim:'RE', reverse:true, ko:'"왜?"가 풀리지 않으면 일의 진도가 안 나간다.', en:'If I cannot answer “why?”, it is hard for me to move the work forward.', ja:'「なぜ？」が腑に落ちないと、仕事が前に進まない。', zh:'如果“为什么”没想通，我就很难推进工作。', es:'Si no entiendo el “por qué”, me cuesta avanzar con el trabajo.'},
    {id:15, dim:'RE', reverse:false, ko:'끝낸 일 목록이 늘어나는 것에서 성취감을 느낀다.', en:'I feel a sense of accomplishment when my list of completed tasks grows.', ja:'終わらせた仕事のリストが増えると、達成感がある。', zh:'看到已完成事项越来越多，我会有成就感。', es:'Siento logro cuando aumenta mi lista de tareas terminadas.'}
  ];

  var TYPES = {
    PTR: {emoji:'🧭', name:'플랜 리더', tagline:'계획으로 팀을 움직인다.', desc:'목표와 일정을 분명히 세우고 팀과 함께 착실히 성과를 쌓아가는 유형. 프로젝트의 중심을 잡아준다.', strengths:['체계적','책임감','추진력'], compatible:['ATR','ASR'], i18n:{en:{name:'Plan Leader',tagline:'Moves the team with a plan.',desc:'You set clear goals and timelines, then build steady results with the team. You help a project keep its center.',strengths:['Structured','Responsible','Driven']},ja:{name:'プランリーダー',tagline:'計画でチームを動かす。',desc:'目標と日程を明確にし、チームと一緒に着実に成果を積み上げるタイプ。プロジェクトの軸を支えます。',strengths:['体系的','責任感','推進力']},zh:{name:'计划型领队',tagline:'用计划带动团队。',desc:'你会明确目标和日程，并和团队一起稳步累积成果。你能帮项目稳住中心。',strengths:['有条理','责任感','推进力']},es:{name:'Líder planificador/a',tagline:'Mueve al equipo con un plan.',desc:'Defines objetivos y calendarios claros, y construyes resultados constantes junto al equipo. Ayudas a sostener el centro del proyecto.',strengths:['Estructura','Responsabilidad','Impulso']}}},
    PTE: {emoji:'🧪', name:'함께 배우는 설계자', tagline:'판을 짜고, 같이 배운다.', desc:'계획적으로 일하면서도 팀과 새로운 시도를 즐기는 유형. 학습과 구조를 동시에 챙긴다.', strengths:['설계력','학습 지향','협업 감각'], compatible:['ATE','ASE'], i18n:{en:{name:'Collaborative Learning Architect',tagline:'Build the frame, learn together.',desc:'You work with a plan while enjoying new experiments with the team. You care about both learning and structure.',strengths:['Design sense','Learning-oriented','Collaborative instinct']},ja:{name:'共に学ぶ設計者',tagline:'場を設計し、一緒に学ぶ。',desc:'計画的に働きながら、チームで新しい試みを楽しむタイプ。学びと構造の両方を大切にします。',strengths:['設計力','学習志向','協業感覚']},zh:{name:'共学型设计者',tagline:'搭好框架，一起学习。',desc:'你做事有计划，也享受和团队一起尝试新方法。你会同时照顾学习和结构。',strengths:['设计力','学习导向','协作感']},es:{name:'Arquitecto/a de aprendizaje compartido',tagline:'Diseña el marco y aprende en equipo.',desc:'Trabajas de forma planificada y disfrutas probar cosas nuevas con el equipo. Cuidas tanto el aprendizaje como la estructura.',strengths:['Capacidad de diseño','Orientación al aprendizaje','Sentido colaborativo']}}},
    PSR: {emoji:'🎯', name:'집중 실행가', tagline:'혼자서도 마감은 지킨다.', desc:'자기만의 계획대로 조용히 몰입해 결과를 만들어내는 유형. 맡긴 일은 반드시 끝낸다.', strengths:['자기관리','집중력','신뢰성'], compatible:['ASR','ATR'], i18n:{en:{name:'Focused Executor',tagline:'Keeps the deadline, even alone.',desc:'You quietly focus according to your own plan and turn work into results. When something is entrusted to you, it gets finished.',strengths:['Self-management','Focus','Reliability']},ja:{name:'集中実行家',tagline:'一人でも締め切りは守る。',desc:'自分の計画に沿って静かに集中し、成果を出すタイプ。任されたことは必ずやり切ります。',strengths:['自己管理','集中力','信頼性']},zh:{name:'专注执行者',tagline:'就算一个人，也会守住截止线。',desc:'你会按自己的计划安静投入，把事情做出结果。交给你的事，你一定会完成。',strengths:['自我管理','专注力','可靠']},es:{name:'Ejecutor/a enfocado/a',tagline:'Cumple la fecha límite, incluso a solas.',desc:'Te concentras en silencio siguiendo tu propio plan y conviertes el trabajo en resultados. Si algo queda en tus manos, lo terminas.',strengths:['Autogestión','Concentración','Fiabilidad']}}},
    PSE: {emoji:'🔬', name:'깊이 파는 장인', tagline:'한 우물을 정교하게.', desc:'관심 분야를 계획적으로 깊게 파고드는 유형. 전문성과 완성도가 강점.', strengths:['전문성','꼼꼼함','끈기'], compatible:['ASE','ATE'], i18n:{en:{name:'Deep Craftsperson',tagline:'Refine one well, deeply.',desc:'You dig into your field of interest with deliberate depth. Expertise and polish are your strengths.',strengths:['Expertise','Thoroughness','Persistence']},ja:{name:'深掘りする職人',tagline:'一つの井戸を丁寧に掘る。',desc:'関心のある分野を計画的に深く掘り下げるタイプ。専門性と完成度が強みです。',strengths:['専門性','丁寧さ','粘り強さ']},zh:{name:'深耕型匠人',tagline:'把一口井挖得精细。',desc:'你会有计划地深入钻研自己感兴趣的领域。专业度和完成度是你的强项。',strengths:['专业性','细致','韧性']},es:{name:'Artesano/a profundo/a',tagline:'Profundiza con precisión en lo tuyo.',desc:'Exploras tu área de interés con profundidad y planificación. Tu fortaleza está en la especialización y el acabado.',strengths:['Especialización','Detalle','Perseverancia']}}},
    ATR: {emoji:'⚡', name:'순발력 해결사', tagline:'현장에서 답을 만든다.', desc:'상황 변화에 빠르게 반응하며 팀과 함께 실질적인 결과를 내는 유형. 위기에서 빛난다.', strengths:['순발력','실행력','팀워크'], compatible:['PTR','PSR'], i18n:{en:{name:'Agile Problem Solver',tagline:'Finds the answer on the spot.',desc:'You respond quickly to changing situations and create practical results with the team. You shine when things get urgent.',strengths:['Quick response','Execution','Teamwork']},ja:{name:'瞬発力ある解決屋',tagline:'現場で答えをつくる。',desc:'状況の変化に素早く反応し、チームと一緒に実質的な成果を出すタイプ。ピンチのときに光ります。',strengths:['瞬発力','実行力','チームワーク']},zh:{name:'临场解决者',tagline:'在现场做出答案。',desc:'你能快速回应变化，并和团队一起做出实际成果。越是紧急的时候，你越能发光。',strengths:['反应快','执行力','团队合作']},es:{name:'Solucionador/a ágil',tagline:'Crea respuestas en el momento.',desc:'Respondes rápido a los cambios y generas resultados prácticos con el equipo. Brillas especialmente en situaciones urgentes.',strengths:['Rapidez de respuesta','Ejecución','Trabajo en equipo']}}},
    ATE: {emoji:'🎨', name:'아이디어 촉진자', tagline:'아이디어는 함께 굴릴수록 커진다.', desc:'사람들과 브레인스토밍하며 새로운 가능성을 여는 유형. 팀에 활기와 창의를 불어넣는다.', strengths:['창의성','에너지','개방성'], compatible:['PTE','PSE'], i18n:{en:{name:'Idea Catalyst',tagline:'Ideas grow when people roll them together.',desc:'You open new possibilities by brainstorming with people. You bring energy and creativity into the team.',strengths:['Creativity','Energy','Openness']},ja:{name:'アイデア促進者',tagline:'アイデアは一緒に転がすほど大きくなる。',desc:'人とブレインストーミングしながら、新しい可能性を開くタイプ。チームに活気と創造性を吹き込みます。',strengths:['創造性','エネルギー','開放性']},zh:{name:'创意促进者',tagline:'想法越一起滚动，越会变大。',desc:'你喜欢和别人头脑风暴，打开新的可能性。你会给团队注入活力和创造力。',strengths:['创造力','能量','开放性']},es:{name:'Catalizador/a de ideas',tagline:'Las ideas crecen cuando se trabajan juntas.',desc:'Abres nuevas posibilidades haciendo lluvia de ideas con otras personas. Aportas energía y creatividad al equipo.',strengths:['Creatividad','Energía','Apertura']}}},
    ASR: {emoji:'🏃', name:'스프린터', tagline:'빠르게 만들고, 바로 보여준다.', desc:'혼자 민첩하게 움직여 눈에 보이는 결과를 빠르게 내놓는 유형. 속도가 무기다.', strengths:['속도','독립성','결과 지향'], compatible:['PSR','PTR'], i18n:{en:{name:'Sprinter',tagline:'Build it fast, show it right away.',desc:'You move independently and quickly, producing visible results fast. Speed is your advantage.',strengths:['Speed','Independence','Results focus']},ja:{name:'スプリンター',tagline:'素早く作り、すぐ見せる。',desc:'一人で機敏に動き、目に見える成果を素早く出すタイプ。スピードが武器です。',strengths:['スピード','独立性','成果志向']},zh:{name:'冲刺者',tagline:'快速做出来，马上展示。',desc:'你能独立敏捷地行动，迅速拿出看得见的结果。速度就是你的武器。',strengths:['速度','独立性','结果导向']},es:{name:'Sprinter',tagline:'Hazlo rápido y muéstralo ya.',desc:'Te mueves con agilidad e independencia para entregar resultados visibles rápidamente. La velocidad es tu ventaja.',strengths:['Velocidad','Independencia','Orientación a resultados']}}},
    ASE: {emoji:'🌌', name:'자유로운 탐험가', tagline:'궁금한 길로 걷는다.', desc:'정해진 틀보다 호기심을 따라 자유롭게 탐구하는 유형. 남들이 못 보는 것을 발견한다.', strengths:['호기심','유연함','독창성'], compatible:['PSE','PTE'], i18n:{en:{name:'Free Explorer',tagline:'Follows the path of curiosity.',desc:'You explore freely through curiosity rather than staying inside fixed frames. You discover what others may miss.',strengths:['Curiosity','Flexibility','Originality']},ja:{name:'自由な探検家',tagline:'気になる道を歩く。',desc:'決まった枠よりも好奇心に従って自由に探求するタイプ。人が見落とすものを見つけます。',strengths:['好奇心','柔軟さ','独創性']},zh:{name:'自由探索者',tagline:'沿着好奇心走。',desc:'比起固定框架，你更愿意跟随好奇心自由探索。你能发现别人没看到的东西。',strengths:['好奇心','灵活','独创性']},es:{name:'Explorador/a libre',tagline:'Camina por donde va la curiosidad.',desc:'Exploras libremente siguiendo la curiosidad más que un marco fijo. Encuentras cosas que otros no ven.',strengths:['Curiosidad','Flexibilidad','Originalidad']}}}
  };

  var AXES = [
    {key:'PA', label:'계획', first:'P', second:'A', firstName:'플래너형', secondName:'즉응형', i18n:{en:{label:'Planning',firstName:'Planner',secondName:'Adaptive'},ja:{label:'計画',firstName:'プランナー型',secondName:'即応型'},zh:{label:'计划',firstName:'计划型',secondName:'即应型'},es:{label:'Planificación',firstName:'Planificador/a',secondName:'Adaptativo/a'}}},
    {key:'TS', label:'협업', first:'T', second:'S', firstName:'팀형', secondName:'솔로형', i18n:{en:{label:'Collaboration',firstName:'Team-oriented',secondName:'Solo-oriented'},ja:{label:'協業',firstName:'チーム型',secondName:'ソロ型'},zh:{label:'协作',firstName:'团队型',secondName:'独立型'},es:{label:'Colaboración',firstName:'De equipo',secondName:'Individual'}}},
    {key:'RE', label:'동력', first:'R', second:'E', firstName:'성과형', secondName:'탐구형', i18n:{en:{label:'Drive',firstName:'Results-driven',secondName:'Exploration-driven'},ja:{label:'原動力',firstName:'成果型',secondName:'探究型'},zh:{label:'驱动力',firstName:'成果型',secondName:'探索型'},es:{label:'Motor',firstName:'Orientado/a a resultados',secondName:'Explorador/a'}}}
  ];
  var UI = {
    ko: {agree:'동의', disagree:'비동의', likert:['매우 동의','동의','보통','비동의','매우 비동의'], sharePrefix:'내 워크스타일은 ', shareTitle:'워크스타일 테스트', shareUrl:'https://smartaitest.com/ko/work-style/', copied:'복사 완료', cardTitle:'나의 워크스타일'},
    en: {agree:'Agree', disagree:'Disagree', likert:['Strongly agree','Agree','Neutral','Disagree','Strongly disagree'], sharePrefix:'My work style is ', shareTitle:'Work Style Test', shareUrl:'https://smartaitest.com/en/work-style/', copied:'Copied', cardTitle:'My Work Style'},
    ja: {agree:'同意', disagree:'不同意', likert:['とてもそう思う','そう思う','どちらともいえない','そう思わない','まったくそう思わない'], sharePrefix:'私のワークスタイルは ', shareTitle:'ワークスタイル診断', shareUrl:'https://smartaitest.com/ja/work-style/', copied:'コピーしました', cardTitle:'私のワークスタイル'},
    zh: {agree:'同意', disagree:'不同意', likert:['非常同意','同意','普通','不同意','非常不同意'], sharePrefix:'我的工作风格是 ', shareTitle:'工作风格测试', shareUrl:'https://smartaitest.com/zh/work-style/', copied:'已复制', cardTitle:'我的工作风格'},
    es: {agree:'De acuerdo', disagree:'En desacuerdo', likert:['Muy de acuerdo','De acuerdo','Neutral','En desacuerdo','Muy en desacuerdo'], sharePrefix:'Mi estilo de trabajo es ', shareTitle:'Test de estilo de trabajo', shareUrl:'https://smartaitest.com/es/work-style/', copied:'Copiado', cardTitle:'Mi estilo de trabajo'}
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
    var scoreByAxis = {PA:0, TS:0, RE:0};

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

      sessionStorage.setItem('work-style-result', result.code);
      sessionStorage.setItem('work-style-answers', JSON.stringify(answers));
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
        var code = sessionStorage.getItem('work-style-result') || 'PTR';
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
        var code = sessionStorage.getItem('work-style-result') || 'PTR';
        renderShareCard(code, lang, function(blob) {
          if (!blob) return;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'work-style-' + code + '.png';
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
