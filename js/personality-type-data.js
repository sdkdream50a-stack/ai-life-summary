// personality-type-data.js
// AI Personality Type Test — Data: Questions + 16 Types + UI Labels
// Based on Jungian psychological type theory (public domain)

const PT_LANG = document.documentElement.lang || 'en';

// ── UI Labels ───────────────────────────────────────────────────
const PT_LABELS = {
  en: {
    title: 'AI Personality Type Test',
    subtitle: 'Discover Your Personality Among 16 Types',
    progress: 'Progress',
    question: 'Question',
    next: 'Next →',
    back: '← Back',
    seeResult: 'See My Type',
    disclaimer: 'This test is based on Carl Jung\'s psychological type theory and is for entertainment purposes only. Not affiliated with Myers-Briggs Type Indicator® (MBTI®).',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    compatible: 'Compatible Types',
    tryOther: 'Try Other Tests',
    shareText: 'I got {type} — {name}! Discover your personality type →',
    loading: 'Analyzing your personality…',
    yourType: 'Your Personality Type',
    likert: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    resultDisclaimer: 'Results are for fun and self-reflection. Personality is complex and multifaceted.',
    retake: 'Retake Test',
    shareBtn: 'Share My Type'
  },
  ko: {
    title: 'AI 성격 유형 분석',
    subtitle: '16가지 성격 유형 중 당신은?',
    progress: '진행률',
    question: '문항',
    next: '다음 →',
    back: '← 이전',
    seeResult: '내 유형 보기',
    disclaimer: '이 테스트는 칼 융의 심리 유형론에 기반한 자체 개발 도구입니다. Myers-Briggs Type Indicator®(MBTI®)와 무관하며 오락 목적으로 제공됩니다.',
    strengths: '강점',
    weaknesses: '약점',
    compatible: '잘 맞는 유형',
    tryOther: '다른 테스트 해보기',
    shareText: '나의 성격 유형은 {type} — {name}! 당신의 유형도 확인해보세요 →',
    loading: '성격 유형을 분석하는 중…',
    yourType: '당신의 성격 유형',
    likert: ['매우 동의', '동의', '보통', '반대', '매우 반대'],
    resultDisclaimer: '결과는 자기 이해와 재미를 위한 참고 자료입니다. 성격은 복잡하고 다면적입니다.',
    retake: '다시 테스트하기',
    shareBtn: '내 유형 공유하기'
  },
  ja: {
    title: 'AI性格タイプ診断',
    subtitle: '16の性格タイプからあなたを発見',
    progress: '進捗',
    question: '問題',
    next: '次へ →',
    back: '← 戻る',
    seeResult: '結果を見る',
    disclaimer: 'このテストはカール・ユングの心理タイプ理論に基づく独自の診断ツールです。Myers-Briggs Type Indicator®（MBTI®）とは無関係です。',
    strengths: '強み',
    weaknesses: '弱み',
    compatible: '相性の良いタイプ',
    tryOther: '他のテストを試す',
    shareText: '私のタイプは{type}—{name}！あなたのタイプも調べてみて →',
    loading: '性格タイプを分析中…',
    yourType: 'あなたの性格タイプ',
    likert: ['強く同意', '同意', 'どちらでもない', '不同意', '強く不同意'],
    resultDisclaimer: '結果は自己理解と楽しみのための参考情報です。性格は複雑で多面的です。',
    retake: 'もう一度テストする',
    shareBtn: 'タイプをシェアする'
  },
  zh: {
    title: 'AI性格类型测试',
    subtitle: '在16种性格类型中发现你自己',
    progress: '进度',
    question: '题目',
    next: '下一题 →',
    back: '← 上一题',
    seeResult: '查看我的类型',
    disclaimer: '本测试基于卡尔·荣格的心理类型理论，仅供娱乐目的。与Myers-Briggs Type Indicator®（MBTI®）无关。',
    strengths: '优势',
    weaknesses: '弱点',
    compatible: '相配的类型',
    tryOther: '尝试其他测试',
    shareText: '我的性格类型是{type}—{name}！快来发现你的类型 →',
    loading: '正在分析你的性格类型…',
    yourType: '你的性格类型',
    likert: ['非常同意', '同意', '中立', '不同意', '非常不同意'],
    resultDisclaimer: '结果仅供自我了解和娱乐参考。性格是复杂和多面的。',
    retake: '重新测试',
    shareBtn: '分享我的类型'
  },
  es: {
    title: 'Test de Personalidad IA',
    subtitle: 'Descubre tu tipo entre 16 personalidades',
    progress: 'Progreso',
    question: 'Pregunta',
    next: 'Siguiente →',
    back: '← Anterior',
    seeResult: 'Ver Mi Tipo',
    disclaimer: 'Este test se basa en la teoría de tipos psicológicos de Carl Jung y es solo para entretenimiento. No está afiliado con Myers-Briggs Type Indicator® (MBTI®).',
    strengths: 'Fortalezas',
    weaknesses: 'Debilidades',
    compatible: 'Tipos Compatibles',
    tryOther: 'Probar Otros Tests',
    shareText: '¡Mi tipo es {type}—{name}! Descubre el tuyo →',
    loading: 'Analizando tu personalidad…',
    yourType: 'Tu Tipo de Personalidad',
    likert: ['Muy de acuerdo', 'De acuerdo', 'Neutral', 'En desacuerdo', 'Muy en desacuerdo'],
    resultDisclaimer: 'Los resultados son para diversión y reflexión personal. La personalidad es compleja y multifacética.',
    retake: 'Repetir el Test',
    shareBtn: 'Compartir Mi Tipo'
  }
};

// ── 40 Questions ─────────────────────────────────────────────────
// axis: EI | SN | TF | JP
// pole: E,S,T,J = "forward" (agree → stronger first letter)
//       I,N,F,P = "reverse" (agree → stronger second letter)
const PT_QUESTIONS = [
  // ── E/I axis ──
  {id:1,  axis:'EI', pole:'E', en:'I enjoy meeting new people and starting conversations.',      ko:'새로운 사람들을 만나고 대화를 시작하는 것이 즐겁다.',           ja:'新しい人々と出会い、会話を始めるのが楽しい。',                   zh:'我喜欢认识新朋友并主动开始对话。',                      es:'Disfruto conocer nuevas personas e iniciar conversaciones.'},
  {id:2,  axis:'EI', pole:'E', en:'I gain energy from being around other people.',              ko:'사람들과 함께할 때 에너지가 채워진다.',                        ja:'人と一緒にいるとエネルギーが湧いてくる。',                       zh:'与他人在一起时我会获得能量。',                          es:'Me siento con más energía cuando estoy con otras personas.'},
  {id:3,  axis:'EI', pole:'E', en:'I prefer group activities over doing things alone.',         ko:'혼자 하는 것보다 여럿이 함께하는 활동이 더 좋다.',               ja:'一人でやるよりグループ活動の方が好きだ。',                        zh:'我更喜欢集体活动而不是独自行动。',                       es:'Prefiero actividades en grupo a hacer las cosas solo.'},
  {id:4,  axis:'EI', pole:'E', en:'I tend to speak up and share my thoughts openly.',           ko:'생각을 망설임 없이 말하는 편이다.',                           ja:'自分の考えを率直に話す方だ。',                              zh:'我倾向于直接表达自己的想法。',                          es:'Suelo hablar abiertamente y compartir mis ideas.'},
  {id:5,  axis:'EI', pole:'E', en:'I feel comfortable in large social gatherings.',             ko:'많은 사람이 모인 자리가 편하다.',                             ja:'大勢の集まりでも居心地が良い。',                            zh:'在大型社交场合我感到自在。',                            es:'Me siento cómodo en reuniones sociales grandes.'},
  {id:6,  axis:'EI', pole:'I', en:'Spending time alone recharges me more than socializing.',   ko:'사람들과 어울리는 것보다 혼자 있을 때 에너지가 회복된다.',        ja:'社交よりも一人の時間の方がエネルギーが回復する。',                 zh:'独处比社交更能让我恢复精力。',                          es:'Pasar tiempo solo me recarga más que socializar.'},
  {id:7,  axis:'EI', pole:'I', en:'I need quiet time alone to process my thoughts.',           ko:'생각을 정리하려면 혼자만의 조용한 시간이 필요하다.',             ja:'考えをまとめるには一人の静かな時間が必要だ。',                    zh:'我需要独处的安静时间来整理思路。',                       es:'Necesito tiempo tranquilo a solas para procesar mis pensamientos.'},
  {id:8,  axis:'EI', pole:'I', en:'I prefer deep one-on-one conversations over small talk.',   ko:'가벼운 잡담보다 깊은 일대일 대화가 좋다.',                     ja:'雑談よりも深い一対一の会話が好きだ。',                         zh:'我更喜欢深度的一对一交流而不是闲聊。',                   es:'Prefiero conversaciones profundas uno a uno sobre charla superficial.'},
  {id:9,  axis:'EI', pole:'I', en:'I often think before I speak.',                             ko:'말하기 전에 먼저 생각하는 편이다.',                           ja:'話す前によく考える方だ。',                                  zh:'我通常先思考再开口说话。',                              es:'Generalmente pienso antes de hablar.'},
  {id:10, axis:'EI', pole:'I', en:'I find it draining to be around many people for long periods.', ko:'오랫동안 많은 사람과 어울리면 피곤해진다.',               ja:'長時間多くの人といると疲れてしまう。',                          zh:'长时间与很多人在一起会让我感到疲惫。',                   es:'Me agota estar rodeado de mucha gente durante mucho tiempo.'},

  // ── S/N axis ──
  {id:11, axis:'SN', pole:'S', en:'I focus on concrete facts rather than abstract theories.',  ko:'추상적 이론보다 구체적인 사실에 집중한다.',                    ja:'抽象的な理論よりも具体的な事実に集中する。',                     zh:'我更注重具体事实而非抽象理论。',                        es:'Me centro en hechos concretos más que en teorías abstractas.'},
  {id:12, axis:'SN', pole:'S', en:'I trust established methods and proven experience.',         ko:'검증된 방법과 경험을 신뢰한다.',                              ja:'実証された方法と経験を信頼する。',                          zh:'我信任经过验证的方法和实际经验。',                       es:'Confío en métodos establecidos y experiencias probadas.'},
  {id:13, axis:'SN', pole:'S', en:'I prefer to work step-by-step with clear guidelines.',       ko:'명확한 지침에 따라 단계별로 진행하는 것을 선호한다.',            ja:'明確なガイドラインに従って段階的に進めるのが好きだ。',             zh:'我喜欢按照清晰的指导方针一步一步地工作。',               es:'Prefiero trabajar paso a paso con guías claras.'},
  {id:14, axis:'SN', pole:'S', en:'I pay close attention to details and specific information.', ko:'세부사항과 구체적인 정보에 세심한 주의를 기울인다.',             ja:'細部と具体的な情報に細かく注意を払う。',                       zh:'我密切关注细节和具体信息。',                            es:'Presto mucha atención a los detalles e información específica.'},
  {id:15, axis:'SN', pole:'S', en:'I am grounded in the present rather than dreaming about possibilities.', ko:'가능성을 꿈꾸기보다 현재 현실에 집중한다.',    ja:'可能性を夢見るより現在の現実に集中する。',                        zh:'我更关注当下现实而非遐想可能性。',                       es:'Estoy enfocado en el presente, no soñando con posibilidades.'},
  {id:16, axis:'SN', pole:'N', en:'I enjoy exploring new ideas and possibilities.',              ko:'새로운 아이디어와 가능성을 탐구하는 것이 즐겁다.',               ja:'新しいアイデアと可能性を探求するのが楽しい。',                   zh:'我喜欢探索新的想法和可能性。',                          es:'Disfruto explorar nuevas ideas y posibilidades.'},
  {id:17, axis:'SN', pole:'N', en:'I often think about the bigger picture and underlying patterns.', ko:'큰 그림과 숨겨진 패턴을 자주 생각한다.',               ja:'大きな絵と隠れたパターンをよく考える。',                         zh:'我经常思考大局和潜在的规律。',                          es:'A menudo pienso en el panorama general y patrones subyacentes.'},
  {id:18, axis:'SN', pole:'N', en:'I prefer working with concepts and ideas over facts and details.', ko:'사실과 세부사항보다 개념과 아이디어를 다루는 것을 선호한다.',ja:'事実や細部よりもコンセプトやアイデアを扱う方が好きだ。',            zh:'我更喜欢处理概念和想法，而不是事实和细节。',              es:'Prefiero trabajar con conceptos e ideas que con hechos y detalles.'},
  {id:19, axis:'SN', pole:'N', en:'I am drawn to innovative and unconventional approaches.',     ko:'혁신적이고 독창적인 접근 방식에 끌린다.',                       ja:'革新的で型破りなアプローチに引かれる。',                        zh:'我被创新和非传统的方法所吸引。',                        es:'Me atraen los enfoques innovadores y poco convencionales.'},
  {id:20, axis:'SN', pole:'N', en:'I often imagine how things could be different or better.',   ko:'사물이 다르게 혹은 더 나을 수 있는 방법을 자주 상상한다.',       ja:'物事がどのように変わり、より良くなるかよく想像する。',             zh:'我经常想象事物可以如何不同或更好。',                     es:'A menudo imagino cómo las cosas podrían ser diferentes o mejores.'},

  // ── T/F axis ──
  {id:21, axis:'TF', pole:'T', en:'I make decisions based on logic and objective analysis.',    ko:'논리와 객관적 분석을 바탕으로 결정을 내린다.',                 ja:'論理と客観的な分析に基づいて決断する。',                       zh:'我基于逻辑和客观分析做决定。',                          es:'Tomo decisiones basadas en lógica y análisis objetivo.'},
  {id:22, axis:'TF', pole:'T', en:'I value truth and accuracy over people\'s feelings.',        ko:'사람들의 감정보다 진실과 정확성을 중시한다.',                   ja:'人々の感情よりも真実と正確さを重視する。',                      zh:'我更重视真相和准确性，而非他人的感受。',                 es:'Valoro la verdad y la precisión por encima de los sentimientos.'},
  {id:23, axis:'TF', pole:'T', en:'I can give honest feedback even when it might upset others.', ko:'다른 사람이 불편해할지라도 솔직한 피드백을 줄 수 있다.',      ja:'他人が不快に思っても率直なフィードバックを与えられる。',           zh:'即使可能让他人不高兴，我也能给出诚实的反馈。',           es:'Puedo dar retroalimentación honesta aunque pueda molestar a otros.'},
  {id:24, axis:'TF', pole:'T', en:'I think fairness is more important than personal harmony.',  ko:'개인적 화합보다 공정함이 더 중요하다고 생각한다.',              ja:'個人的な調和よりも公平さの方が重要だと思う。',                  zh:'我认为公平比个人和谐更重要。',                          es:'Creo que la imparcialidad es más importante que la armonía personal.'},
  {id:25, axis:'TF', pole:'T', en:'I prefer to analyze problems systematically rather than intuitively.', ko:'직관보다 체계적으로 문제를 분석하는 것을 선호한다.',  ja:'直感よりも体系的に問題を分析することを好む。',                   zh:'我更喜欢系统性地分析问题，而不是凭直觉。',               es:'Prefiero analizar problemas sistemáticamente más que intuitivamente.'},
  {id:26, axis:'TF', pole:'F', en:'I am sensitive to others\' emotions and needs.',             ko:'다른 사람의 감정과 필요에 민감하게 반응한다.',                  ja:'他人の感情やニーズに敏感に反応する。',                        zh:'我对他人的情感和需求很敏感。',                          es:'Soy sensible a las emociones y necesidades de los demás.'},
  {id:27, axis:'TF', pole:'F', en:'Maintaining harmony and avoiding conflict is important to me.', ko:'조화를 유지하고 갈등을 피하는 것이 중요하다.',             ja:'調和を保ち、対立を避けることが重要だ。',                       zh:'对我来说，维护和谐和避免冲突很重要。',                   es:'Mantener la armonía y evitar conflictos es importante para mí.'},
  {id:28, axis:'TF', pole:'F', en:'I consider how my decisions will affect others\' feelings.',  ko:'내 결정이 다른 사람의 감정에 어떤 영향을 미칠지 먼저 생각한다.', ja:'自分の決断が他人の感情にどう影響するか考える。',               zh:'我会先考虑我的决定会如何影响他人的感受。',               es:'Considero cómo mis decisiones afectarán los sentimientos de otros.'},
  {id:29, axis:'TF', pole:'F', en:'I feel deeply moved by others\' pain or struggles.',         ko:'다른 사람의 고통이나 어려움을 보면 깊이 공감된다.',              ja:'他人の苦しみや困難を見ると深く共感する。',                      zh:'看到他人的痛苦或挣扎时，我会深受触动。',                 es:'Me conmuevo profundamente por el dolor o las dificultades de otros.'},
  {id:30, axis:'TF', pole:'F', en:'I prefer empathy and understanding over winning arguments.',  ko:'논쟁에서 이기는 것보다 공감과 이해를 통한 해결을 선호한다.',     ja:'議論に勝つよりも共感と理解による解決を好む。',                   zh:'我更喜欢通过同理心和理解来解决问题，而不是赢得争论。',   es:'Prefiero la empatía y comprensión sobre ganar discusiones.'},

  // ── J/P axis ──
  {id:31, axis:'JP', pole:'J', en:'I like having a clear plan and sticking to it.',             ko:'명확한 계획을 세우고 그대로 실행하는 것이 좋다.',               ja:'明確な計画を立て、それに従うのが好きだ。',                     zh:'我喜欢制定明确的计划并坚持执行。',                      es:'Me gusta tener un plan claro y cumplirlo.'},
  {id:32, axis:'JP', pole:'J', en:'I prefer to settle decisions quickly rather than leave them open.', ko:'결정을 열어두기보다 빨리 확정짓는 것을 선호한다.',       ja:'決定を開けたままにするよりも早く確定させる方が好きだ。',          zh:'我更喜欢快速确定决策，而不是保持开放状态。',             es:'Prefiero tomar decisiones rápidamente antes que dejarlas abiertas.'},
  {id:33, axis:'JP', pole:'J', en:'I feel most productive in an organized, structured environment.', ko:'체계적이고 정리된 환경에서 가장 생산적으로 일한다.',       ja:'整理された構造化された環境で最も生産的に働ける。',               zh:'在有组织、有结构的环境中我最有效率。',                   es:'Me siento más productivo en un entorno organizado y estructurado.'},
  {id:34, axis:'JP', pole:'J', en:'I enjoy making to-do lists and completing tasks systematically.', ko:'할 일 목록을 만들고 체계적으로 완료하는 것을 즐긴다.',     ja:'やることリストを作り、体系的にタスクをこなすのが好きだ。',        zh:'我喜欢列待办事项清单并系统地完成任务。',                 es:'Disfruto hacer listas de tareas y completarlas sistemáticamente.'},
  {id:35, axis:'JP', pole:'J', en:'Deadlines and schedules help me stay focused and motivated.', ko:'마감과 일정이 집중력과 동기를 유지하는 데 도움이 된다.',         ja:'締め切りとスケジュールが集中力ととやる気を維持するのに役立つ。',  zh:'截止日期和日程安排有助于我保持专注和动力。',             es:'Los plazos y horarios me ayudan a mantenerme enfocado y motivado.'},
  {id:36, axis:'JP', pole:'P', en:'I like keeping my options open and adapting as I go.',       ko:'선택지를 열어두고 상황에 맞게 유연하게 적응하는 것이 좋다.',      ja:'選択肢を開けたまま状況に応じて柔軟に適応するのが好きだ。',       zh:'我喜欢保持选择余地，随机应变地调整。',                  es:'Me gusta mantener mis opciones abiertas y adaptarme sobre la marcha.'},
  {id:37, axis:'JP', pole:'P', en:'I enjoy spontaneous plans and unexpected changes.',          ko:'즉흥적인 계획과 예상치 못한 변화도 즐긴다.',                   ja:'自発的な計画や予期しない変化も楽しめる。',                      zh:'我享受即兴计划和意外变化。',                            es:'Disfruto los planes espontáneos y los cambios inesperados.'},
  {id:38, axis:'JP', pole:'P', en:'I prefer starting new projects to finishing existing ones.', ko:'기존 것을 마무리하기보다 새로운 프로젝트를 시작하는 것이 좋다.', ja:'既存のものを終わらせるより新しいプロジェクトを始める方が好きだ。',zh:'我更喜欢开始新项目，而不是完成现有的项目。',              es:'Prefiero comenzar nuevos proyectos a terminar los existentes.'},
  {id:39, axis:'JP', pole:'P', en:'I tend to do my best work close to a deadline.',             ko:'마감이 임박할수록 더 집중해서 좋은 결과를 낸다.',               ja:'締め切りが近づくほど集中して良い結果を出す傾向がある。',          zh:'我往往在截止日期临近时工作效率最高。',                   es:'Tiendo a hacer mi mejor trabajo cuando el plazo se acerca.'},
  {id:40, axis:'JP', pole:'P', en:'I am comfortable leaving things a bit unresolved or uncertain.', ko:'모든 것을 확정짓지 않고 열어두는 것이 편하다.',           ja:'すべてを確定させず、開けたままにするのが苦痛でない。',           zh:'对我来说，让事情保持一定的未解决或不确定状态是可以接受的。', es:'Me siento cómodo dejando cosas sin resolver o inciertas.'}
];

// ── 16 Type Descriptions ─────────────────────────────────────────
const PT_TYPES = {
  INTJ: {
    emoji: '🏛️',
    gradient: 'from-slate-700 to-indigo-900',
    en: { name: 'The Architect', tagline: 'Mastermind with a plan for everything', desc: 'INTJs are strategic, independent thinkers who combine a sharp intellect with determined willpower. They set high standards and work relentlessly toward their long-term vision.', strengths: ['Strategic & long-term thinker', 'Fiercely independent', 'High standards & determination'], weaknesses: ['Can seem cold or arrogant', 'Overly critical of others'], compatible: ['ENFP', 'ENTP'] },
    ko: { name: '전략가', tagline: '모든 것에 계획이 있는 마스터마인드', desc: 'INTJ는 날카로운 지성과 강한 의지력을 겸비한 전략적이고 독립적인 사상가입니다. 높은 기준을 세우고 장기적 비전을 향해 끊임없이 나아갑니다.', strengths: ['전략적 장기 사고력', '강한 독립심', '높은 기준과 결단력'], weaknesses: ['냉정하거나 오만해 보일 수 있음', '타인에게 지나치게 비판적'], compatible: ['ENFP', 'ENTP'] },
    ja: { name: '建築家', tagline: 'すべてに計画があるマスターマインド', desc: 'INTJは鋭い知性と強い意志力を兼ね備えた戦略的で独立した思考者です。高い基準を持ち、長期的なビジョンに向かって休みなく進みます。', strengths: ['戦略的・長期的思考', '強い独立心', '高い基準と決断力'], weaknesses: ['冷たく傲慢に見える場合がある', '他人に過度に批判的'], compatible: ['ENFP', 'ENTP'] },
    zh: { name: '建筑师', tagline: '凡事都有计划的战略家', desc: 'INTJ是兼具敏锐智慧和强大意志力的战略性独立思考者。他们设定高标准，不懈地朝着长期愿景前进。', strengths: ['战略性长远思维', '强烈的独立性', '高标准与果断力'], weaknesses: ['可能显得冷漠或傲慢', '对他人过于挑剔'], compatible: ['ENFP', 'ENTP'] },
    es: { name: 'El Arquitecto', tagline: 'Un maestro estratega con plan para todo', desc: 'Los INTJ son pensadores estratégicos e independientes que combinan una mente aguda con una voluntad determinada. Establecen altos estándares y trabajan sin descanso hacia su visión.', strengths: ['Pensamiento estratégico a largo plazo', 'Fuertemente independiente', 'Altos estándares y determinación'], weaknesses: ['Pueden parecer fríos o arrogantes', 'Demasiado críticos con los demás'], compatible: ['ENFP', 'ENTP'] }
  },
  INTP: {
    emoji: '🔬',
    gradient: 'from-blue-900 to-cyan-900',
    en: { name: 'The Thinker', tagline: 'The philosopher who seeks truth above all', desc: 'INTPs are analytical, objective, and endlessly curious. They love exploring complex ideas and theories, always seeking to understand the underlying principles of how things work.', strengths: ['Exceptional analytical ability', 'Open-minded & objective', 'Creative problem-solver'], weaknesses: ['Can be absent-minded', 'Struggles with practical follow-through'], compatible: ['ENTJ', 'ENFJ'] },
    ko: { name: '사상가', tagline: '무엇보다 진실을 추구하는 철학자', desc: 'INTP는 분석적이고 객관적이며 끝없이 호기심이 많습니다. 복잡한 아이디어와 이론을 탐구하며 사물의 작동 원리를 이해하려 합니다.', strengths: ['탁월한 분석력', '개방적이고 객관적', '창의적 문제 해결사'], weaknesses: ['산만해질 수 있음', '실행력이 부족할 수 있음'], compatible: ['ENTJ', 'ENFJ'] },
    ja: { name: '論理学者', tagline: '何よりも真実を求める哲学者', desc: 'INTPは分析的で客観的、そして無限に好奇心旺盛です。複雑なアイデアや理論を探求し、物事の仕組みの根本原理を理解しようとします。', strengths: ['卓越した分析能力', 'オープンマインドで客観的', '創造的な問題解決者'], weaknesses: ['ぼんやりすることがある', '実践的なフォローが苦手'], compatible: ['ENTJ', 'ENFJ'] },
    zh: { name: '逻辑学家', tagline: '追求真理至上的哲学家', desc: 'INTP分析性强、客观且好奇心无限。他们热爱探索复杂的想法和理论，始终寻求理解事物运作的基本原理。', strengths: ['卓越的分析能力', '思想开放且客观', '富有创意的问题解决者'], weaknesses: ['可能心不在焉', '难以付诸实践'], compatible: ['ENTJ', 'ENFJ'] },
    es: { name: 'El Pensador', tagline: 'El filósofo que busca la verdad ante todo', desc: 'Los INTP son analíticos, objetivos y eternamente curiosos. Aman explorar ideas y teorías complejas, buscando siempre comprender los principios fundamentales.', strengths: ['Excepcional capacidad analítica', 'Mente abierta y objetivo', 'Solucionador creativo de problemas'], weaknesses: ['Puede ser distraído', 'Dificultad con la ejecución práctica'], compatible: ['ENTJ', 'ENFJ'] }
  },
  ENTJ: {
    emoji: '👑',
    gradient: 'from-amber-800 to-red-900',
    en: { name: 'The Commander', tagline: 'Born leader with unstoppable drive', desc: 'ENTJs are natural-born leaders who are bold, strategic, and driven. They excel at organizing people and resources to achieve ambitious long-term goals.', strengths: ['Natural leader', 'Efficient & strategic', 'Confident decision-maker'], weaknesses: ['Can be domineering', 'Impatient with inefficiency'], compatible: ['INTP', 'INFP'] },
    ko: { name: '통솔자', tagline: '멈출 수 없는 드라이브를 가진 타고난 리더', desc: 'ENTJ는 대담하고 전략적이며 추진력 있는 타고난 리더입니다. 야심찬 장기 목표를 달성하기 위해 사람과 자원을 조직하는 데 탁월합니다.', strengths: ['타고난 리더십', '효율적이고 전략적', '자신감 있는 의사결정'], weaknesses: ['지배적으로 보일 수 있음', '비효율성에 참을성이 없음'], compatible: ['INTP', 'INFP'] },
    ja: { name: '指揮官', tagline: '止まらない推進力を持つ生まれながらのリーダー', desc: 'ENTJは大胆で戦略的、そして推進力のある生まれながらのリーダーです。野心的な長期目標を達成するために人と資源を組織化することに長けています。', strengths: ['生まれながらのリーダーシップ', '効率的で戦略的', '自信ある意思決定'], weaknesses: ['支配的に見える場合がある', '非効率に対して忍耐が足りない'], compatible: ['INTP', 'INFP'] },
    zh: { name: '指挥官', tagline: '拥有无限驱动力的天生领导者', desc: 'ENTJ是大胆、战略性强且充满动力的天生领导者。他们擅长组织人员和资源以实现宏大的长期目标。', strengths: ['天生的领导力', '高效且有战略性', '自信的决策者'], weaknesses: ['可能显得专横', '对低效率缺乏耐心'], compatible: ['INTP', 'INFP'] },
    es: { name: 'El Comandante', tagline: 'Un líder nato con una fuerza imparable', desc: 'Los ENTJ son líderes natos, audaces, estratégicos y determinados. Sobresalen organizando personas y recursos para lograr objetivos ambiciosos a largo plazo.', strengths: ['Líder natural', 'Eficiente y estratégico', 'Tomador de decisiones seguro'], weaknesses: ['Puede ser dominante', 'Impaciente con la ineficiencia'], compatible: ['INTP', 'INFP'] }
  },
  ENTP: {
    emoji: '⚡',
    gradient: 'from-yellow-700 to-orange-900',
    en: { name: 'The Debater', tagline: 'The devil\'s advocate who loves a good challenge', desc: 'ENTPs are innovative, quick-witted, and love intellectual challenges. They thrive on debating ideas and questioning conventions, always searching for new angles.', strengths: ['Innovative & resourceful', 'Quick-thinking', 'Enjoys intellectual debate'], weaknesses: ['Can be argumentative', 'Struggles to follow through on ideas'], compatible: ['INTJ', 'INFJ'] },
    ko: { name: '변론가', tagline: '도전을 즐기는 악마의 변호인', desc: 'ENTP는 혁신적이고 재치 있으며 지적 도전을 좋아합니다. 아이디어를 토론하고 관행에 의문을 제기하며 새로운 관점을 찾는 것을 즐깁니다.', strengths: ['혁신적이고 임기응변에 뛰어남', '빠른 사고력', '지적 토론을 즐김'], weaknesses: ['논쟁적으로 보일 수 있음', '아이디어를 끝까지 실행하는 데 어려움'], compatible: ['INTJ', 'INFJ'] },
    ja: { name: '討論者', tagline: '挑戦を楽しむ悪魔の代弁者', desc: 'ENTPは革新的で機知に富み、知的な挑戦が大好きです。アイデアを議論し、慣例に疑問を投げかけ、常に新しい視点を探しています。', strengths: ['革新的で臨機応変', '素早い思考力', '知的討論を楽しむ'], weaknesses: ['議論好きに見える場合がある', 'アイデアを最後まで実行するのが難しい'], compatible: ['INTJ', 'INFJ'] },
    zh: { name: '辩论家', tagline: '热爱挑战的魔鬼代言人', desc: 'ENTP创新、机智，热爱智识挑战。他们在辩论思想和质疑传统中茁壮成长，总是寻找新的视角。', strengths: ['创新且随机应变', '思维敏捷', '享受智识辩论'], weaknesses: ['可能显得好争论', '难以将想法坚持到底'], compatible: ['INTJ', 'INFJ'] },
    es: { name: 'El Debatiente', tagline: 'El abogado del diablo que ama los desafíos', desc: 'Los ENTP son innovadores, ingeniosos y aman los desafíos intelectuales. Prosperan debatiendo ideas y cuestionando convenciones, siempre buscando nuevos ángulos.', strengths: ['Innovador y versátil', 'Pensamiento rápido', 'Disfruta el debate intelectual'], weaknesses: ['Puede ser argumentativo', 'Dificultad para ejecutar ideas'], compatible: ['INTJ', 'INFJ'] }
  },
  INFJ: {
    emoji: '🌟',
    gradient: 'from-purple-900 to-indigo-900',
    en: { name: 'The Advocate', tagline: 'The rare idealist with a quiet determination', desc: 'INFJs are insightful, principled, and quietly determined. They have a unique ability to see the deeper meaning in people and situations, driven by a vision of a better world.', strengths: ['Deep insight & empathy', 'Strong sense of purpose', 'Inspiring to others'], weaknesses: ['Perfectionistic & idealistic', 'Can burn out from helping others'], compatible: ['ENFP', 'ENTP'] },
    ko: { name: '옹호자', tagline: '조용하지만 강한 의지를 가진 희귀한 이상주의자', desc: 'INFJ는 통찰력 있고 원칙적이며 조용하지만 결단력이 있습니다. 사람과 상황의 더 깊은 의미를 파악하는 능력이 있으며, 더 나은 세상에 대한 비전에 이끌립니다.', strengths: ['깊은 통찰력과 공감 능력', '강한 사명감', '타인에게 영감을 줌'], weaknesses: ['완벽주의적이고 이상주의적', '타인을 돕다가 번아웃될 수 있음'], compatible: ['ENFP', 'ENTP'] },
    ja: { name: '提唱者', tagline: '静かな決意を持つ稀な理想主義者', desc: 'INFJは洞察力があり、原則的で、静かですが決断力があります。人や状況の深い意味を見抜く独特の能力を持ち、より良い世界のビジョンに動かされています。', strengths: ['深い洞察力と共感力', '強い使命感', '他者にインスピレーションを与える'], weaknesses: ['完璧主義で理想主義的', '他者を助けすぎてバーンアウトする'], compatible: ['ENFP', 'ENTP'] },
    zh: { name: '提倡者', tagline: '有着安静决心的稀有理想主义者', desc: 'INFJ富有洞察力、有原则且安静而坚定。他们有独特的能力看清人和情况的深层含义，被对更美好世界的愿景所驱动。', strengths: ['深刻的洞察力和同理心', '强烈的使命感', '能激励他人'], weaknesses: ['完美主义且理想化', '帮助他人可能导致精力耗尽'], compatible: ['ENFP', 'ENTP'] },
    es: { name: 'El Defensor', tagline: 'El idealista raro con una determinación tranquila', desc: 'Los INFJ son perspicaces, íntegros y calladamente determinados. Tienen una capacidad única para ver el significado más profundo en las personas y situaciones.', strengths: ['Profunda empatía e intuición', 'Fuerte sentido del propósito', 'Inspira a los demás'], weaknesses: ['Perfeccionista e idealista', 'Puede agotarse ayudando a otros'], compatible: ['ENFP', 'ENTP'] }
  },
  INFP: {
    emoji: '🌸',
    gradient: 'from-pink-900 to-purple-900',
    en: { name: 'The Mediator', tagline: 'The dreamer guided by heartfelt values', desc: 'INFPs are imaginative, empathetic, and guided by their deep personal values. They are creative souls who seek authenticity and meaning in everything they do.', strengths: ['Deeply empathetic', 'Creative & imaginative', 'Authentic & value-driven'], weaknesses: ['Can be overly idealistic', 'Dislikes conflict strongly'], compatible: ['ENFJ', 'ENTJ'] },
    ko: { name: '중재자', tagline: '진심 어린 가치에 이끌리는 몽상가', desc: 'INFP는 상상력이 풍부하고 공감 능력이 높으며 깊은 개인적 가치에 의해 이끌립니다. 하는 모든 일에서 진정성과 의미를 추구하는 창의적인 영혼입니다.', strengths: ['깊은 공감 능력', '창의적이고 상상력이 풍부', '진정성 있고 가치 중심적'], weaknesses: ['지나치게 이상적일 수 있음', '갈등을 극도로 싫어함'], compatible: ['ENFJ', 'ENTJ'] },
    ja: { name: '仲介者', tagline: '心からの価値観に導かれた夢想家', desc: 'INFPは想像力豊かで共感力が高く、深い個人的価値観に導かれています。するすべてのことに真正性と意味を求める創造的な魂です。', strengths: ['深い共感力', '創造的で想像力豊か', '真正で価値観重視'], weaknesses: ['過度に理想主義になりがち', '対立を強く嫌う'], compatible: ['ENFJ', 'ENTJ'] },
    zh: { name: '调停者', tagline: '被真诚价值观引导的梦想家', desc: 'INFP富有想象力、善于共情，被深刻的个人价值观所引导。他们是创造性的灵魂，在所做的一切事情中追求真实性和意义。', strengths: ['深刻的同理心', '富有创造力和想象力', '真实且价值驱动'], weaknesses: ['可能过于理想化', '强烈厌恶冲突'], compatible: ['ENFJ', 'ENTJ'] },
    es: { name: 'El Mediador', tagline: 'El soñador guiado por valores sinceros', desc: 'Los INFP son imaginativos, empáticos y guiados por sus valores personales profundos. Son almas creativas que buscan autenticidad y significado en todo lo que hacen.', strengths: ['Profundamente empático', 'Creativo e imaginativo', 'Auténtico y guiado por valores'], weaknesses: ['Puede ser demasiado idealista', 'Le disgusta fuertemente el conflicto'], compatible: ['ENFJ', 'ENTJ'] }
  },
  ENFJ: {
    emoji: '🌈',
    gradient: 'from-green-800 to-teal-900',
    en: { name: 'The Protagonist', tagline: 'The charismatic leader who lights up others', desc: 'ENFJs are charismatic, empathetic leaders who are genuinely invested in others\' growth. They have a gift for inspiring people and building strong communities.', strengths: ['Charismatic & inspiring', 'Deeply caring about others', 'Strong communicator'], weaknesses: ['Can be overly people-pleasing', 'Takes criticism personally'], compatible: ['INFP', 'ISFP'] },
    ko: { name: '주인공', tagline: '타인을 빛나게 하는 카리스마 있는 리더', desc: 'ENFJ는 카리스마 있고 공감 능력이 높은 리더로, 타인의 성장에 진심으로 관심을 가집니다. 사람들에게 영감을 주고 강한 커뮤니티를 구축하는 데 재능이 있습니다.', strengths: ['카리스마 있고 영감을 줌', '타인에 대한 깊은 배려', '강한 소통 능력'], weaknesses: ['지나치게 사람들을 맞추려 할 수 있음', '비판을 개인적으로 받아들임'], compatible: ['INFP', 'ISFP'] },
    ja: { name: '主人公', tagline: '他者を輝かせるカリスマ的リーダー', desc: 'ENFJはカリスマ的で共感力の高いリーダーで、他者の成長に心から関心を持ちます。人々にインスピレーションを与え、強いコミュニティを築く才能があります。', strengths: ['カリスマ的でインスピレーションを与える', '他者への深い思いやり', '強いコミュニケーション能力'], weaknesses: ['過度に人に合わせようとする', '批判を個人的に受け取る'], compatible: ['INFP', 'ISFP'] },
    zh: { name: '主人公', tagline: '让他人发光的魅力领导者', desc: 'ENFJ是富有魅力、善于共情的领导者，真心关注他人的成长。他们在激励人们和建立强大社区方面很有天赋。', strengths: ['富有魅力且鼓舞人心', '深深关心他人', '强大的沟通能力'], weaknesses: ['可能过于讨好他人', '把批评当作个人攻击'], compatible: ['INFP', 'ISFP'] },
    es: { name: 'El Protagonista', tagline: 'El líder carismático que ilumina a los demás', desc: 'Los ENFJ son líderes carismáticos y empáticos genuinamente comprometidos con el crecimiento de los demás. Tienen el don de inspirar a las personas y construir comunidades sólidas.', strengths: ['Carismático e inspirador', 'Profundamente preocupado por los demás', 'Comunicador fuerte'], weaknesses: ['Puede ser demasiado complaciente', 'Toma las críticas personalmente'], compatible: ['INFP', 'ISFP'] }
  },
  ENFP: {
    emoji: '🎆',
    gradient: 'from-orange-700 to-pink-900',
    en: { name: 'The Campaigner', tagline: 'The enthusiastic optimist full of ideas', desc: 'ENFPs are enthusiastic, creative, and sociable free-spirits who are always excited about new ideas and possibilities. Their infectious energy draws people toward them naturally.', strengths: ['Endlessly enthusiastic', 'Highly creative & imaginative', 'Warm & people-oriented'], weaknesses: ['Can lose focus easily', 'Dislikes routine'], compatible: ['INTJ', 'INFJ'] },
    ko: { name: '활동가', tagline: '아이디어로 가득 찬 열정적인 낙천주의자', desc: 'ENFP는 열정적이고 창의적이며 사교적인 자유로운 영혼으로, 항상 새로운 아이디어와 가능성에 흥분합니다. 그들의 전염성 있는 에너지가 자연스럽게 사람들을 끌어당깁니다.', strengths: ['끝없는 열정', '높은 창의성과 상상력', '따뜻하고 사람 지향적'], weaknesses: ['쉽게 집중력을 잃을 수 있음', '루틴을 싫어함'], compatible: ['INTJ', 'INFJ'] },
    ja: { name: '運動家', tagline: 'アイデアに満ちた熱狂的な楽観主義者', desc: 'ENFPは熱狂的で創造的、そして社交的な自由の魂です。常に新しいアイデアと可能性に興奮し、その感染力のあるエネルギーが自然と人々を引きつけます。', strengths: ['尽きない熱狂', '高い創造性と想像力', '温かみがあり人間指向'], weaknesses: ['集中力を失いやすい', 'ルーティンが嫌い'], compatible: ['INTJ', 'INFJ'] },
    zh: { name: '活动家', tagline: '充满想法的热情乐观主义者', desc: 'ENFP是热情、创造力强且善于交际的自由灵魂，总是对新想法和可能性感到兴奋。他们感染力强的能量自然地吸引着他人。', strengths: ['无限的热情', '高度的创造力和想象力', '温暖且以人为本'], weaknesses: ['容易失去专注力', '不喜欢常规'], compatible: ['INTJ', 'INFJ'] },
    es: { name: 'El Activista', tagline: 'El optimista entusiasta lleno de ideas', desc: 'Los ENFP son espíritus libres entusiastas, creativos y sociables, siempre emocionados con nuevas ideas y posibilidades. Su energía contagiosa atrae naturalmente a las personas.', strengths: ['Entusiasmo interminable', 'Altamente creativo e imaginativo', 'Cálido y orientado a las personas'], weaknesses: ['Puede perder el foco fácilmente', 'No le gusta la rutina'], compatible: ['INTJ', 'INFJ'] }
  },
  ISTJ: {
    emoji: '🏗️',
    gradient: 'from-stone-700 to-slate-900',
    en: { name: 'The Logistician', tagline: 'The dependable backbone of any organization', desc: 'ISTJs are responsible, thorough, and dedicated to duty. They are reliable individuals who follow through on commitments and value tradition, loyalty, and order.', strengths: ['Highly reliable & responsible', 'Detail-oriented', 'Strong work ethic'], weaknesses: ['Resistant to change', 'Can be inflexible or rigid'], compatible: ['ENFP', 'ESFP'] },
    ko: { name: '현실주의자', tagline: '조직의 든든한 기둥', desc: 'ISTJ는 책임감 있고 철저하며 의무에 헌신합니다. 헌신을 지키고 전통, 충성심, 질서를 중시하는 믿음직한 사람입니다.', strengths: ['높은 신뢰성과 책임감', '세부사항에 주의를 기울임', '강한 직업 윤리'], weaknesses: ['변화에 저항적', '융통성이 없을 수 있음'], compatible: ['ENFP', 'ESFP'] },
    ja: { name: '現実主義者', tagline: '組織の頼れる柱', desc: 'ISTJは責任感があり、徹底的で、義務に献身的です。約束を果たし、伝統、忠誠心、秩序を重んじる信頼できる人物です。', strengths: ['高い信頼性と責任感', '細部への注意', '強い職業倫理'], weaknesses: ['変化に抵抗する', '融通が利かないことがある'], compatible: ['ENFP', 'ESFP'] },
    zh: { name: '现实主义者', tagline: '任何组织的可靠支柱', desc: 'ISTJ负责任、彻底且尽职尽责。他们是履行承诺、重视传统、忠诚和秩序的可靠人士。', strengths: ['高度可靠且负责任', '注重细节', '强烈的职业道德'], weaknesses: ['抵制变化', '可能缺乏灵活性'], compatible: ['ENFP', 'ESFP'] },
    es: { name: 'El Realista', tagline: 'El pilar confiable de cualquier organización', desc: 'Los ISTJ son responsables, meticulosos y dedicados al deber. Son personas fiables que cumplen sus compromisos y valoran la tradición, la lealtad y el orden.', strengths: ['Muy confiable y responsable', 'Orientado a los detalles', 'Fuerte ética de trabajo'], weaknesses: ['Resistente al cambio', 'Puede ser inflexible'], compatible: ['ENFP', 'ESFP'] }
  },
  ISFJ: {
    emoji: '🛡️',
    gradient: 'from-emerald-800 to-green-900',
    en: { name: 'The Defender', tagline: 'The warm protector of those they love', desc: 'ISFJs are warm, protective, and deeply committed to the well-being of those they care for. They are the quiet heroes who consistently go above and beyond for others.', strengths: ['Warm & caring', 'Highly observant of others\' needs', 'Loyal & dependable'], weaknesses: ['Reluctant to ask for help', 'Suppresses own needs for others'], compatible: ['ENFP', 'ESTP'] },
    ko: { name: '수호자', tagline: '사랑하는 사람들을 따뜻하게 보호하는', desc: 'ISFJ는 따뜻하고 보호적이며 돌보는 사람들의 행복에 깊이 헌신합니다. 타인을 위해 꾸준히 기대 이상을 해내는 조용한 영웅입니다.', strengths: ['따뜻하고 배려심이 깊음', '타인의 필요를 잘 관찰', '충성스럽고 믿음직함'], weaknesses: ['도움을 요청하기 꺼려함', '자신의 필요를 억압'], compatible: ['ENFP', 'ESTP'] },
    ja: { name: '擁護者', tagline: '愛する人を温かく守る', desc: 'ISFJは温かく、保護的で、大切な人たちの幸福に深く献身しています。他者のために期待以上のことを一貫してやり遂げる静かなヒーローです。', strengths: ['温かみがあり思いやり深い', '他者のニーズをよく観察する', '忠実で頼れる'], weaknesses: ['助けを求めることを嫌がる', '自分のニーズを抑圧する'], compatible: ['ENFP', 'ESTP'] },
    zh: { name: '守卫者', tagline: '温暖保护所爱之人', desc: 'ISFJ温暖、有保护欲，深深致力于所关心之人的幸福。他们是默默无闻的英雄，始终为他人超越期望地付出。', strengths: ['温暖且有爱心', '善于观察他人的需求', '忠诚且可靠'], weaknesses: ['不愿意寻求帮助', '为他人压制自己的需求'], compatible: ['ENFP', 'ESTP'] },
    es: { name: 'El Defensor', tagline: 'El protector cálido de quienes ama', desc: 'Los ISFJ son cálidos, protectores y profundamente comprometidos con el bienestar de quienes cuidan. Son los héroes silenciosos que van más allá por los demás.', strengths: ['Cálido y compasivo', 'Muy observador de las necesidades ajenas', 'Leal y confiable'], weaknesses: ['Reacio a pedir ayuda', 'Suprime sus propias necesidades'], compatible: ['ENFP', 'ESTP'] }
  },
  ESTJ: {
    emoji: '⚙️',
    gradient: 'from-zinc-700 to-slate-800',
    en: { name: 'The Executive', tagline: 'The no-nonsense organizer who gets things done', desc: 'ESTJs are practical, organized, and results-driven. They thrive on implementing order, following established rules, and ensuring that things run efficiently.', strengths: ['Highly organized', 'Strong sense of duty', 'Decisive & reliable'], weaknesses: ['Can be judgmental', 'Struggles with abstract ideas'], compatible: ['ISTP', 'ISFP'] },
    ko: { name: '경영자', tagline: '일을 해내는 직접적인 조직자', desc: 'ESTJ는 실용적이고 체계적이며 결과 지향적입니다. 질서를 구현하고, 확립된 규칙을 따르고, 효율적으로 진행되도록 하는 데 탁월합니다.', strengths: ['매우 체계적', '강한 의무감', '단호하고 믿음직함'], weaknesses: ['단정적일 수 있음', '추상적인 아이디어에 어려움'], compatible: ['ISTP', 'ISFP'] },
    ja: { name: '幹部', tagline: 'ものごとをやり遂げる実直なオーガナイザー', desc: 'ESTJは実用的で組織的、結果重視です。秩序を実現し、確立されたルールに従い、効率的に物事を進めることに長けています。', strengths: ['非常に組織的', '強い義務感', '決断力があり頼れる'], weaknesses: ['批判的になりがち', '抽象的なアイデアが苦手'], compatible: ['ISTP', 'ISFP'] },
    zh: { name: '总经理', tagline: '将事情完成的务实组织者', desc: 'ESTJ务实、有组织且以结果为导向。他们善于建立秩序、遵循既定规则，确保事情高效运行。', strengths: ['高度有组织性', '强烈的责任感', '果断且可靠'], weaknesses: ['可能过于评判他人', '难以处理抽象概念'], compatible: ['ISTP', 'ISFP'] },
    es: { name: 'El Ejecutivo', tagline: 'El organizador directo que hace las cosas', desc: 'Los ESTJ son prácticos, organizados y orientados a resultados. Prosperan implementando orden, siguiendo reglas establecidas y asegurándose de que las cosas funcionen eficientemente.', strengths: ['Muy organizado', 'Fuerte sentido del deber', 'Decidido y confiable'], weaknesses: ['Puede ser sentencioso', 'Dificultad con ideas abstractas'], compatible: ['ISTP', 'ISFP'] }
  },
  ESFJ: {
    emoji: '🎁',
    gradient: 'from-rose-700 to-pink-900',
    en: { name: 'The Consul', tagline: 'The caring host who makes everyone feel welcome', desc: 'ESFJs are sociable, warm, and driven by a desire to be helpful. They put others first and take great pride in maintaining strong relationships and social harmony.', strengths: ['Warm & sociable', 'Highly supportive of others', 'Organized & responsible'], weaknesses: ['Needs external validation', 'Can be overly focused on social status'], compatible: ['ISFP', 'INFP'] },
    ko: { name: '집정관', tagline: '모두를 환영받게 하는 배려심 깊은 주인', desc: 'ESFJ는 사교적이고 따뜻하며 도움이 되고자 하는 욕구에 이끌립니다. 타인을 먼저 생각하고 강한 관계와 사회적 조화를 유지하는 데 자부심을 가집니다.', strengths: ['따뜻하고 사교적', '타인을 적극 지지', '체계적이고 책임감 있음'], weaknesses: ['외부 인정이 필요함', '사회적 지위에 지나치게 집중할 수 있음'], compatible: ['ISFP', 'INFP'] },
    ja: { name: '領事', tagline: '皆が歓迎されると感じさせる思いやり深いホスト', desc: 'ESFJは社交的で温かく、役に立ちたいという欲求に動かされています。他者を優先し、強い人間関係と社会的調和を維持することに誇りを持ちます。', strengths: ['温かみがあり社交的', '他者を積極的にサポート', '組織的で責任感がある'], weaknesses: ['外部からの承認が必要', '社会的地位に過度に焦点を当てる'], compatible: ['ISFP', 'INFP'] },
    zh: { name: '执政官', tagline: '让每个人都感到受欢迎的体贴主人', desc: 'ESFJ善于社交、温暖且被帮助他人的愿望所驱动。他们优先考虑他人，以维护强大的关系和社会和谐为荣。', strengths: ['温暖且善于交际', '积极支持他人', '有组织且负责任'], weaknesses: ['需要外部认可', '可能过于关注社会地位'], compatible: ['ISFP', 'INFP'] },
    es: { name: 'El Cónsul', tagline: 'El anfitrión atento que hace sentir bienvenido a todos', desc: 'Los ESFJ son sociables, cálidos y motivados por el deseo de ser útiles. Ponen a los demás primero y se enorgullecen de mantener relaciones sólidas y armonía social.', strengths: ['Cálido y sociable', 'Muy solidario con los demás', 'Organizado y responsable'], weaknesses: ['Necesita validación externa', 'Puede enfocarse demasiado en el estatus social'], compatible: ['ISFP', 'INFP'] }
  },
  ISTP: {
    emoji: '🔧',
    gradient: 'from-gray-700 to-zinc-900',
    en: { name: 'The Virtuoso', tagline: 'The bold master of tools and techniques', desc: 'ISTPs are observant, practical, and naturally gifted with tools. They are bold experimenters who learn through doing and thrive in crisis situations that require quick thinking.', strengths: ['Skilled with hands and tools', 'Calm under pressure', 'Highly observant'], weaknesses: ['Can seem emotionally distant', 'Dislikes long-term commitments'], compatible: ['ESTJ', 'ESFJ'] },
    ko: { name: '장인', tagline: '도구와 기술의 대담한 명인', desc: 'ISTP는 관찰력이 뛰어나고 실용적이며 도구를 다루는 데 타고난 재능이 있습니다. 행동으로 배우고 빠른 사고가 필요한 위기 상황에서 탁월한 대담한 실험가입니다.', strengths: ['손재주와 도구 활용 능력', '압박감 속에서도 침착함', '높은 관찰력'], weaknesses: ['감정적으로 거리를 둬 보일 수 있음', '장기적 헌신을 싫어함'], compatible: ['ESTJ', 'ESFJ'] },
    ja: { name: '巨匠', tagline: '道具と技術の大胆な名人', desc: 'ISTPは観察力が鋭く、実用的で、道具を扱う生まれながらの才能があります。行動から学ぶ大胆な実験者で、素早い思考が必要な危機的状況で力を発揮します。', strengths: ['手先の器用さと道具の活用能力', 'プレッシャーの下でも冷静', '高い観察力'], weaknesses: ['感情的に距離を置いて見える', '長期的なコミットメントが嫌い'], compatible: ['ESTJ', 'ESFJ'] },
    zh: { name: '工匠', tagline: '工具和技术的大胆能手', desc: 'ISTP观察力敏锐、务实，在使用工具方面天赋异禀。他们是通过实践学习的大胆实验者，在需要快速思考的危机情况下表现卓越。', strengths: ['动手能力和工具使用技巧', '压力下保持冷静', '高度的观察力'], weaknesses: ['可能显得情感疏远', '不喜欢长期承诺'], compatible: ['ESTJ', 'ESFJ'] },
    es: { name: 'El Virtuoso', tagline: 'El audaz maestro de herramientas y técnicas', desc: 'Los ISTP son observadores, prácticos y naturalmente dotados con herramientas. Son experimentadores audaces que aprenden haciendo y prosperan en situaciones de crisis.', strengths: ['Habilidades manuales y con herramientas', 'Calmado bajo presión', 'Muy observador'], weaknesses: ['Puede parecer emocionalmente distante', 'No le gustan los compromisos a largo plazo'], compatible: ['ESTJ', 'ESFJ'] }
  },
  ISFP: {
    emoji: '🎨',
    gradient: 'from-violet-800 to-pink-900',
    en: { name: 'The Adventurer', tagline: 'The free artist who lives in the moment', desc: 'ISFPs are gentle, sensitive, and spontaneous artists at heart. They live fully in the present moment, expressing their creativity and values through their actions and aesthetics.', strengths: ['Deeply in tune with senses & aesthetics', 'Open-minded & flexible', 'Warm & caring'], weaknesses: ['Can be unpredictable', 'Tends to avoid conflict'], compatible: ['ENFJ', 'ESFJ'] },
    ko: { name: '모험가', tagline: '현재 순간을 사는 자유로운 예술가', desc: 'ISFP는 마음속 깊이 온화하고 감수성이 풍부하며 자발적인 예술가입니다. 현재 순간에 완전히 살며, 행동과 미적 감각을 통해 창의성과 가치를 표현합니다.', strengths: ['감각과 미학에 깊이 동조', '개방적이고 유연함', '따뜻하고 배려심 있음'], weaknesses: ['예측 불가능할 수 있음', '갈등을 피하는 경향'], compatible: ['ENFJ', 'ESFJ'] },
    ja: { name: '冒険家', tagline: '今この瞬間を生きる自由なアーティスト', desc: 'ISFPは心の底から穏やかで、感受性豊かで、自発的なアーティストです。現在の瞬間を完全に生き、行動や美的感覚を通じて創造性と価値観を表現します。', strengths: ['感覚と美学への深い共鳴', 'オープンマインドで柔軟', '温かく思いやりがある'], weaknesses: ['予測不可能なことがある', '対立を避ける傾向'], compatible: ['ENFJ', 'ESFJ'] },
    zh: { name: '探险家', tagline: '活在当下的自由艺术家', desc: 'ISFP内心深处是温和、敏感且自发的艺术家。他们完全活在当下，通过行动和审美感受来表达创造力和价值观。', strengths: ['深度感知感官与美学', '开放且灵活', '温暖且有爱心'], weaknesses: ['可能难以预测', '倾向于回避冲突'], compatible: ['ENFJ', 'ESFJ'] },
    es: { name: 'El Aventurero', tagline: 'El artista libre que vive el momento', desc: 'Los ISFP son artistas gentiles, sensibles y espontáneos en su corazón. Viven plenamente el presente, expresando su creatividad y valores a través de sus acciones.', strengths: ['Profundamente sintonizado con los sentidos y la estética', 'De mente abierta y flexible', 'Cálido y compasivo'], weaknesses: ['Puede ser impredecible', 'Tiende a evitar el conflicto'], compatible: ['ENFJ', 'ESFJ'] }
  },
  ESTP: {
    emoji: '🏄',
    gradient: 'from-sky-700 to-blue-900',
    en: { name: 'The Entrepreneur', tagline: 'The energetic action-taker who loves the thrill', desc: 'ESTPs are energetic, perceptive, and thrive in the moment. They love action, prefer direct experience over theory, and have an uncanny ability to read people and situations quickly.', strengths: ['Bold & action-oriented', 'Excellent people skills', 'Resourceful in a crisis'], weaknesses: ['Can be impulsive', 'Dislikes theory and long-term planning'], compatible: ['ISFJ', 'ISTJ'] },
    ko: { name: '사업가', tagline: '스릴을 즐기는 에너제틱한 행동파', desc: 'ESTP는 에너제틱하고 지각력이 뛰어나며 현재 순간에 탁월합니다. 행동을 좋아하고, 이론보다 직접적인 경험을 선호하며, 사람과 상황을 빠르게 파악하는 놀라운 능력이 있습니다.', strengths: ['대담하고 행동 지향적', '뛰어난 대인 관계 기술', '위기에서 임기응변에 강함'], weaknesses: ['충동적일 수 있음', '이론과 장기 계획을 싫어함'], compatible: ['ISFJ', 'ISTJ'] },
    ja: { name: '起業家', tagline: 'スリルを楽しむエネルギッシュな行動派', desc: 'ESTPはエネルギッシュで知覚力が高く、現在の瞬間に輝きます。行動が好きで理論より直接経験を好み、人と状況を素早く読む驚異的な能力があります。', strengths: ['大胆で行動志向', '優れた対人スキル', '危機での臨機応変'], weaknesses: ['衝動的になりがち', '理論と長期計画が嫌い'], compatible: ['ISFJ', 'ISTJ'] },
    zh: { name: '企业家', tagline: '喜欢刺激的充沛行动派', desc: 'ESTP精力充沛、感知力强，在当下表现出色。他们喜欢行动，偏好直接经验而非理论，有快速读取人和情况的惊人能力。', strengths: ['大胆且行动导向', '出色的人际交往能力', '危机中临机应变'], weaknesses: ['可能冲动行事', '不喜欢理论和长期计划'], compatible: ['ISFJ', 'ISTJ'] },
    es: { name: 'El Emprendedor', tagline: 'El enérgico hombre de acción que ama la emoción', desc: 'Los ESTP son enérgicos, perceptivos y prosperan en el momento. Aman la acción, prefieren la experiencia directa a la teoría y tienen una habilidad extraordinaria para leer a las personas.', strengths: ['Audaz y orientado a la acción', 'Excelentes habilidades sociales', 'Versátil en crisis'], weaknesses: ['Puede ser impulsivo', 'No le gustan la teoría ni la planificación a largo plazo'], compatible: ['ISFJ', 'ISTJ'] }
  },
  ESFP: {
    emoji: '🎉',
    gradient: 'from-fuchsia-700 to-pink-800',
    en: { name: 'The Entertainer', tagline: 'The spontaneous showman who loves the spotlight', desc: 'ESFPs are spontaneous, energetic, and enthusiastic people-lovers who make everything more fun. They live for the moment and share their contagious joy with everyone around them.', strengths: ['Infectious enthusiasm', 'Highly observant of people', 'Great in social situations'], weaknesses: ['Easily bored', 'Avoids long-term planning'], compatible: ['ISFJ', 'ISTJ'] },
    ko: { name: '연예인', tagline: '주목받는 것을 좋아하는 자발적인 엔터테이너', desc: 'ESFP는 자발적이고 에너지 넘치며 열정적인 사람을 사랑하는 사람으로, 모든 것을 더 재미있게 만듭니다. 현재를 위해 살고 주변 모든 사람에게 전염성 있는 기쁨을 나눕니다.', strengths: ['전염성 있는 열정', '사람을 잘 관찰함', '사교적 상황에서 뛰어남'], weaknesses: ['쉽게 지루해함', '장기 계획을 피함'], compatible: ['ISFJ', 'ISTJ'] },
    ja: { name: '芸能人', tagline: 'スポットライトが好きな自発的なエンターテイナー', desc: 'ESFPは自発的でエネルギッシュ、そして熱狂的な人好きで、すべてをより楽しくします。現在のために生き、周囲の全員に感染力のある喜びを分かち合います。', strengths: ['感染力のある熱意', '人をよく観察する', '社交的な場面が得意'], weaknesses: ['すぐ退屈する', '長期的な計画を避ける'], compatible: ['ISFJ', 'ISTJ'] },
    zh: { name: '表演者', tagline: '喜爱聚光灯的自发表演者', desc: 'ESFP是自发、充满活力且热情的人际爱好者，让一切都变得更有趣。他们为当下而活，与周围的每个人分享他们感染力强的快乐。', strengths: ['充满感染力的热情', '善于观察他人', '在社交场合中游刃有余'], weaknesses: ['容易感到无聊', '回避长期计划'], compatible: ['ISFJ', 'ISTJ'] },
    es: { name: 'El Animador', tagline: 'El showman espontáneo que ama el protagonismo', desc: 'Los ESFP son personas espontáneas, energéticas y entusiastas que hacen todo más divertido. Viven el momento y comparten su alegría contagiosa con todos a su alrededor.', strengths: ['Entusiasmo contagioso', 'Muy observador de las personas', 'Excelente en situaciones sociales'], weaknesses: ['Se aburre fácilmente', 'Evita la planificación a largo plazo'], compatible: ['ISFJ', 'ISTJ'] }
  }
};
