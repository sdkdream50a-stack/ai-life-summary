/**
 * AI Life Summary - Main Sentence Generation Logic
 * Contains 800+ sentence components for generating unique life summaries
 * Supports multiple languages: EN, KO, JA, ZH, ES
 *
 * Performance optimizations applied:
 * - Hash caching for repeated birthdate lookups
 * - Map-based language lookups for O(1) access
 * - Hoisted RegExp patterns for line break formatting
 */

// ===== Performance: Hash Cache =====
const birthdateHashCache = new Map();

// Sentence Templates (50+) - English
const templates = [
    "You are someone who {trait} and {context}.",
    "Your journey is marked by {trait}, especially when {context}.",
    "Strength comes naturally when you {trait}, for you are {context}.",
    "In life, you {trait}—this is how you {context}.",
    "You find purpose through {trait}, and {context} guides your way.",
    "What defines you is how you {trait} while {context}.",
    "Your essence lies in {trait}, always {context}.",
    "You navigate life by {trait}, naturally {context}.",
    "The world sees someone who {trait}, yet beneath this, you are {context}.",
    "Your gift is {trait}, paired with the ability to {context}.",
    "You embody {trait}, which allows you to {context}.",
    "Life has taught you to {trait}, and now you {context}.",
    "At your core, you {trait}, and this helps you {context}.",
    "You were born to {trait}, destined to {context}.",
    "Your path is illuminated by {trait}, leading you to {context}.",
    "Others admire how you {trait} while effortlessly {context}.",
    "You carry within you {trait}, which empowers you to {context}.",
    "Your spirit is defined by {trait}, always seeking to {context}.",
    "The universe aligned to make you someone who {trait} and {context}.",
    "Deep inside, you {trait}, which naturally allows you to {context}.",
    "Your life story is one of {trait}, beautifully interwoven with {context}.",
    "You possess the rare ability to {trait}, enabling you to {context}.",
    "What makes you unique is how you {trait}, combined with {context}.",
    "Your destiny unfolds through {trait}, guiding you to {context}.",
    "You transform challenges by {trait}, ultimately {context}.",
    "The essence of your being is to {trait}, forever {context}.",
    "You illuminate the world by {trait}, gracefully {context}.",
    "Your heart knows how to {trait}, which is why you {context}.",
    "Life reveals itself to you through {trait}, as you continue to {context}.",
    "You are blessed with {trait}, allowing you to constantly {context}.",
    "Your authentic self shines when you {trait}, naturally {context}.",
    "The stars aligned for someone who {trait} and {context}.",
    "You have mastered {trait}, which enables you to {context}.",
    "Your inner light comes from {trait}, radiating outward as you {context}.",
    "You walk through life {trait}, always finding ways to {context}.",
    "Your presence is marked by {trait}, inspiring others to {context}.",
    "You create meaning by {trait}, while simultaneously {context}.",
    "The magic within you is {trait}, manifesting as you {context}.",
    "You stand apart because you {trait}, gracefully {context}.",
    "Your wisdom flows from {trait}, teaching you to {context}.",
    "You touch lives through {trait}, endlessly {context}.",
    "Your power comes from {trait}, which guides you to {context}.",
    "You heal the world by {trait}, compassionately {context}.",
    "Your legacy is built on {trait}, as you continue to {context}.",
    "You inspire others to {trait}, showing them how to {context}.",
    "The depth of your soul reveals {trait}, always {context}.",
    "You lead with {trait}, teaching others to {context}.",
    "Your journey celebrates {trait}, forever {context}.",
    "You embrace life by {trait}, joyfully {context}.",
    "Your truth is found in {trait}, expressed through {context}."
];

// Korean Templates - 자연스러운 한국어 문장 구조
// {trait}는 명사형 특성, {context}는 완결된 동사구
const templatesKo = [
    "당신은 {trait}을 가진 사람이며, {context}.",
    "당신의 가장 큰 강점은 {trait}이며, 그것으로 {context}.",
    "{trait}이 당신을 정의하며, 당신은 {context}.",
    "당신 안에는 {trait}이 있어 {context}.",
    "타고난 {trait}으로 당신은 {context}.",
    "{trait}을 통해 당신은 {context}.",
    "당신의 본질은 {trait}이고, 그래서 {context}.",
    "{trait}이 당신의 삶을 이끌며, {context}.",
    "당신은 {trait}의 소유자이며, {context}.",
    "{trait}이 당신의 빛이 되어 {context}.",
    "당신에게는 특별한 {trait}이 있어 {context}.",
    "{trait}을 지닌 당신은 {context}.",
    "당신의 {trait}은 세상을 향해 {context}.",
    "{trait}이 당신의 길을 밝혀 {context}.",
    "당신은 {trait}으로 가득 차 {context}.",
    "깊은 {trait}을 가진 당신은 {context}.",
    "{trait}이 당신의 날개가 되어 {context}.",
    "당신의 {trait}은 자연스럽게 {context}.",
    "놀라운 {trait}을 지닌 당신은 {context}.",
    "{trait}이 당신을 특별하게 만들어 {context}.",
    "당신은 {trait}을 품고 살며, {context}.",
    "{trait}이 당신의 핵심이며, 그것이 {context}.",
    "당신의 {trait}은 {context}.",
    "{trait}을 타고난 당신은 {context}.",
    "당신에게 {trait}이 주어졌기에 {context}.",
    "당신은 {trait}의 화신이며, {context}.",
    "{trait}이 당신의 선물이 되어 {context}.",
    "당신의 깊은 {trait}은 {context}.",
    "{trait}을 발휘하여 당신은 {context}.",
    "당신은 {trait}으로 빛나며, {context}.",
    "{trait}이 당신의 삶에 의미를 부여하고, {context}.",
    "특별한 {trait}을 가진 당신은 {context}.",
    "{trait}이 당신의 DNA에 새겨져 있어 {context}.",
    "당신의 {trait}은 타인에게 {context}.",
    "{trait}이 당신 안에서 꽃피어 {context}.",
    "당신은 {trait}을 자연스럽게 발휘하며 {context}.",
    "{trait}이 당신의 존재 이유가 되어 {context}.",
    "당신의 놀라운 {trait}으로 인해 {context}.",
    "{trait}을 통해 당신의 삶은 {context}.",
    "당신은 {trait}의 상징이며, {context}.",
    "{trait}이 당신에게 힘을 주어 {context}.",
    "당신의 {trait}은 세상에 {context}.",
    "{trait}이 당신의 여정을 이끌어 {context}.",
    "당신에게는 남다른 {trait}이 있어 {context}.",
    "{trait}으로 무장한 당신은 {context}.",
    "당신의 {trait}이 빛을 발해 {context}.",
    "{trait}이 당신의 정체성이며, 그래서 {context}.",
    "당신은 {trait}을 통해 {context}.",
    "{trait}이 당신의 원동력이 되어 {context}.",
    "당신의 {trait}은 결국 {context}."
];

// Japanese Templates - {trait}は名詞、{context}は完結した動詞句
const templatesJa = [
    "あなたは{trait}を持つ人であり、{context}。",
    "あなたの最大の強みは{trait}であり、それによって{context}。",
    "{trait}があなたを定義し、あなたは{context}。",
    "あなたの中には{trait}があり、{context}。",
    "生まれ持った{trait}で、あなたは{context}。",
    "{trait}を通じて、あなたは{context}。",
    "あなたの本質は{trait}であり、だから{context}。",
    "{trait}があなたの人生を導き、{context}。",
    "あなたは{trait}の持ち主であり、{context}。",
    "{trait}があなたの光となり、{context}。",
    "あなたには特別な{trait}があり、{context}。",
    "{trait}を持つあなたは、{context}。",
    "あなたの{trait}は世界に向かって{context}。",
    "{trait}があなたの道を照らし、{context}。",
    "あなたは{trait}に満ちており、{context}。",
    "深い{trait}を持つあなたは、{context}。",
    "{trait}があなたの翼となり、{context}。",
    "あなたの{trait}は自然に{context}。",
    "素晴らしい{trait}を持つあなたは、{context}。",
    "{trait}があなたを特別にし、{context}。",
    "あなたは{trait}を抱いて生き、{context}。",
    "{trait}があなたの核心であり、それが{context}。",
    "あなたの{trait}は{context}。",
    "{trait}を生まれ持ったあなたは、{context}。",
    "あなたに{trait}が与えられたから、{context}。",
    "あなたは{trait}の化身であり、{context}。",
    "{trait}があなたの贈り物となり、{context}。",
    "あなたの深い{trait}は{context}。",
    "{trait}を発揮して、あなたは{context}。",
    "あなたは{trait}で輝き、{context}。",
    "{trait}があなたの人生に意味を与え、{context}。",
    "特別な{trait}を持つあなたは、{context}。",
    "{trait}があなたのDNAに刻まれており、{context}。",
    "あなたの{trait}は他者に{context}。",
    "{trait}があなたの中で花開き、{context}。",
    "あなたは{trait}を自然に発揮し、{context}。",
    "{trait}があなたの存在理由となり、{context}。",
    "あなたの素晴らしい{trait}により、{context}。",
    "{trait}を通じて、あなたの人生は{context}。",
    "あなたは{trait}の象徴であり、{context}。",
    "{trait}があなたに力を与え、{context}。",
    "あなたの{trait}は世界に{context}。",
    "{trait}があなたの旅を導き、{context}。",
    "あなたには並外れた{trait}があり、{context}。",
    "{trait}で武装したあなたは、{context}。",
    "あなたの{trait}が光を放ち、{context}。",
    "{trait}があなたのアイデンティティであり、だから{context}。",
    "あなたは{trait}を通じて{context}。",
    "{trait}があなたの原動力となり、{context}。",
    "あなたの{trait}は最終的に{context}。"
];

// Chinese Templates - 名词形式特质 + 完整动词短语
const templatesZh = [
    "你是一个拥有{trait}的人，{context}。",
    "你最大的优势是{trait}，用它来{context}。",
    "{trait}定义了你，你{context}。",
    "你的{trait}让你与众不同，你{context}。",
    "凭借{trait}，你{context}。",
    "{trait}是你的核心品质，使你能够{context}。",
    "你拥有强大的{trait}，因此{context}。",
    "你的{trait}照亮前路，帮助你{context}。",
    "{trait}是你的礼物，你用它{context}。",
    "你天生具有{trait}，让你{context}。",
    "你的{trait}是无价的，它使你{context}。",
    "在你身上，{trait}显得尤为突出，你{context}。",
    "{trait}赋予你力量，你{context}。",
    "你的{trait}引导着你，帮助你{context}。",
    "拥有{trait}的你，{context}。",
    "你的生命因{trait}而闪耀，你{context}。",
    "{trait}是你的根基，让你能够{context}。",
    "你展现出卓越的{trait}，{context}。",
    "你的{trait}是你的力量源泉，你{context}。",
    "{trait}使你独特，你{context}。",
    "你以{trait}著称，{context}。",
    "你内心的{trait}，让你{context}。",
    "{trait}是你的本质，你{context}。",
    "你的{trait}启发他人，你{context}。",
    "凭借你的{trait}，你{context}。",
    "你天赋的{trait}使你能够{context}。",
    "你的{trait}是一种祝福，你{context}。",
    "{trait}定义了你的旅程，你{context}。",
    "你拥有珍贵的{trait}，{context}。",
    "你的{trait}让世界变得更美好，你{context}。",
    "{trait}是你最闪亮的特质，你{context}。",
    "你的{trait}带来积极改变，你{context}。",
    "凭借非凡的{trait}，你{context}。",
    "你的{trait}温暖人心，你{context}。",
    "{trait}是你的指南针，帮助你{context}。",
    "你展现的{trait}令人钦佩，你{context}。",
    "你的{trait}创造奇迹，你{context}。",
    "{trait}赋予你独特魅力，你{context}。",
    "你的{trait}是你的财富，你{context}。",
    "凭借深厚的{trait}，你{context}。",
    "你的{trait}点亮希望，你{context}。",
    "{trait}使你成为特别的人，你{context}。",
    "你拥有令人羡慕的{trait}，{context}。",
    "你的{trait}带来和谐，你{context}。",
    "{trait}是你的超能力，你{context}。",
    "你的{trait}激励周围的人，你{context}。",
    "凭借你的{trait}，你每天都在{context}。",
    "你的{trait}是你的标志，你{context}。",
    "{trait}让你的人生有意义，你{context}。",
    "你的{trait}是无尽的宝藏，你{context}。"
];

// Spanish Templates - sustantivos + frases verbales completas
const templatesEs = [
    "Eres una persona con {trait}, y {context}.",
    "Tu mayor fortaleza es {trait}, y con ella {context}.",
    "{trait} te define, y tú {context}.",
    "Tu {trait} te hace especial, y {context}.",
    "Con {trait}, tú {context}.",
    "{trait} es tu cualidad esencial, lo que te permite {context}.",
    "Posees un gran {trait}, por eso {context}.",
    "Tu {trait} ilumina el camino, ayudándote a {context}.",
    "{trait} es tu regalo, y lo usas para {context}.",
    "Naciste con {trait}, lo que te permite {context}.",
    "Tu {trait} es invaluable, te permite {context}.",
    "En ti, {trait} destaca especialmente, y tú {context}.",
    "{trait} te da poder, y tú {context}.",
    "Tu {trait} te guía, ayudándote a {context}.",
    "Con tu {trait}, {context}.",
    "Tu vida brilla por {trait}, y tú {context}.",
    "{trait} es tu fundamento, permitiéndote {context}.",
    "Demuestras excelente {trait}, y {context}.",
    "Tu {trait} es tu fuente de poder, y tú {context}.",
    "{trait} te hace único, y tú {context}.",
    "Eres conocido por tu {trait}, y {context}.",
    "Tu {trait} interior te permite {context}.",
    "{trait} es tu esencia, y tú {context}.",
    "Tu {trait} inspira a otros, y tú {context}.",
    "Con tu {trait}, tú {context}.",
    "Tu {trait} natural te permite {context}.",
    "Tu {trait} es una bendición, y tú {context}.",
    "{trait} define tu camino, y tú {context}.",
    "Posees un precioso {trait}, y {context}.",
    "Tu {trait} hace el mundo mejor, y tú {context}.",
    "{trait} es tu cualidad más brillante, y tú {context}.",
    "Tu {trait} trae cambios positivos, y tú {context}.",
    "Con extraordinario {trait}, tú {context}.",
    "Tu {trait} calienta corazones, y tú {context}.",
    "{trait} es tu brújula, ayudándote a {context}.",
    "Tu {trait} es admirable, y tú {context}.",
    "Tu {trait} crea milagros, y tú {context}.",
    "{trait} te da un encanto único, y tú {context}.",
    "Tu {trait} es tu tesoro, y tú {context}.",
    "Con profundo {trait}, tú {context}.",
    "Tu {trait} enciende la esperanza, y tú {context}.",
    "{trait} te hace una persona especial, y tú {context}.",
    "Posees envidiable {trait}, y {context}.",
    "Tu {trait} trae armonía, y tú {context}.",
    "{trait} es tu superpoder, y tú {context}.",
    "Tu {trait} inspira a quienes te rodean, y tú {context}.",
    "Con tu {trait}, cada día {context}.",
    "Tu {trait} es tu marca, y tú {context}.",
    "{trait} da sentido a tu vida, y tú {context}.",
    "Tu {trait} es un tesoro infinito, y tú {context}."
];

// Traits (200+) - English
const traits = [
    // Resilience Category
    "bounce back from challenges with remarkable grace",
    "find strength in moments of adversity",
    "grow through difficult times with wisdom",
    "transform setbacks into stepping stones",
    "rise stronger after every fall",
    "embrace obstacles as opportunities for growth",
    "maintain hope even in darkness",
    "persist when others would give up",
    "turn pain into purpose",
    "weather storms with unwavering spirit",
    "rebuild yourself from the ground up",
    "face fears with courage and determination",
    "stand firm when life tests you",
    "find the silver lining in every cloud",
    "emerge from trials transformed",
    "carry scars as badges of honor",
    "refuse to be defined by setbacks",
    "discover inner resources you never knew existed",
    "thrive under pressure",
    "turn wounds into wisdom",

    // Creativity Category
    "see beauty in unexpected places",
    "turn imagination into reality",
    "paint life with unique colors",
    "find creative solutions to complex problems",
    "express yourself through multiple mediums",
    "connect ideas that others overlook",
    "bring fresh perspectives to old situations",
    "create something from nothing",
    "dream in vivid possibilities",
    "think outside conventional boundaries",
    "transform the ordinary into extraordinary",
    "weave stories from everyday moments",
    "see the world through an artist's eyes",
    "innovate where others imitate",
    "bring ideas to life with passion",
    "find inspiration in unexpected sources",
    "craft beauty from chaos",
    "envision possibilities others cannot see",
    "approach life as a creative canvas",
    "merge logic with imagination",

    // Empathy Category
    "understand others at a profound level",
    "feel the world's emotions deeply",
    "connect hearts across distances",
    "sense what others need before they ask",
    "offer comfort without needing words",
    "walk in others' shoes naturally",
    "create safe spaces for vulnerability",
    "listen with your whole being",
    "recognize the humanity in everyone",
    "bridge divides with compassion",
    "hold space for others' pain",
    "celebrate others' joys as your own",
    "intuit the unspoken feelings around you",
    "heal through presence alone",
    "bring people together through understanding",
    "see beyond surface appearances",
    "respond to emotional undercurrents",
    "nurture those who need it most",
    "transform conflict through empathy",
    "carry others' burdens with grace",

    // Wisdom Category
    "learn from every experience",
    "see patterns others miss",
    "find meaning in silence",
    "apply knowledge with discernment",
    "balance heart and mind perfectly",
    "know when to speak and when to listen",
    "see the bigger picture clearly",
    "make decisions with foresight",
    "understand timing and patience",
    "recognize truth in complexity",
    "distill wisdom from chaos",
    "guide others with gentle insight",
    "know yourself deeply",
    "accept what cannot be changed",
    "choose battles worth fighting",
    "find peace in uncertainty",
    "recognize lessons in disguise",
    "balance idealism with pragmatism",
    "trust the journey even without the map",
    "embrace paradox and complexity",

    // Adventure Category
    "seek new horizons fearlessly",
    "embrace the unknown with excitement",
    "write your own story boldly",
    "explore uncharted territories",
    "say yes to new experiences",
    "break free from comfort zones",
    "discover yourself through travel",
    "find magic in the unfamiliar",
    "collect experiences over possessions",
    "live life as an expedition",
    "chase dreams across boundaries",
    "turn life into an adventure",
    "explore both inner and outer worlds",
    "seek thrills that expand your soul",
    "embrace spontaneity with joy",
    "find freedom in movement",
    "let curiosity guide your path",
    "discover wonder in new places",
    "transform routine into discovery",
    "explore the edges of possibility",

    // Leadership Category
    "inspire others through example",
    "lead with integrity and purpose",
    "bring out the best in people",
    "unite diverse groups toward common goals",
    "make tough decisions with grace",
    "serve those you lead",
    "communicate vision clearly",
    "empower others to grow",
    "take responsibility for outcomes",
    "create positive change around you",
    "stand for what you believe",
    "guide without dominating",
    "build teams that thrive",
    "navigate complexity with clarity",
    "inspire loyalty through authenticity",
    "lead through service",
    "create environments where others flourish",
    "balance confidence with humility",
    "make others feel valued",
    "chart courses others follow",

    // Connection Category
    "build bridges between people",
    "create lasting relationships",
    "bring people together naturally",
    "maintain bonds across time and distance",
    "communicate with authenticity",
    "make others feel seen and heard",
    "cultivate community wherever you go",
    "turn strangers into friends",
    "nurture relationships with care",
    "find common ground with anyone",
    "weave networks of support",
    "remember what matters to others",
    "show up for people consistently",
    "create belonging for the isolated",
    "strengthen bonds through trust",
    "connect generations and cultures",
    "build family wherever you are",
    "make meaningful connections quickly",
    "keep relationships alive across years",
    "bring warmth to every interaction",

    // Authenticity Category
    "stay true to yourself always",
    "express your genuine nature",
    "live according to your values",
    "refuse to wear masks for others",
    "embrace your unique quirks",
    "honor your inner truth",
    "speak your mind with kindness",
    "live without pretense",
    "accept yourself fully",
    "show up as your real self",
    "own your story without shame",
    "celebrate your individuality",
    "align actions with beliefs",
    "trust your inner voice",
    "be comfortable in your own skin",
    "express vulnerability courageously",
    "reject conformity for authenticity",
    "honor your needs without guilt",
    "embrace all parts of yourself",
    "live your truth boldly",

    // Growth Category
    "embrace continuous improvement",
    "learn from mistakes gracefully",
    "seek growth in every situation",
    "evolve beyond your limitations",
    "transform through self-reflection",
    "push boundaries regularly",
    "invest in personal development",
    "welcome feedback openly",
    "stretch beyond comfort",
    "become better each day",
    "unlock hidden potential",
    "pursue mastery in your craft",
    "expand your capabilities constantly",
    "embrace the journey of becoming",
    "set goals that challenge you",
    "learn from everyone you meet",
    "refine yourself through experience",
    "grow through conscious effort",
    "evolve in response to life",
    "pursue excellence relentlessly",

    // Intuition Category
    "trust your gut instincts",
    "sense what logic cannot explain",
    "read between the lines naturally",
    "know things before they happen",
    "follow your inner compass",
    "perceive hidden truths",
    "navigate by inner knowing",
    "feel the energy of situations",
    "make decisions from the heart",
    "sense opportunities others miss",
    "trust the whispers of your soul",
    "recognize signs and synchronicities",
    "follow hunches that prove right",
    "understand without explanation",
    "feel your way through darkness",
    "tap into deeper knowledge",
    "honor your sixth sense",
    "let instinct guide you",
    "perceive the invisible connections",
    "trust what you feel to be true"
];

// Korean Traits - 명사형 특성
const traitsKo = [
    "회복력", "끈기", "인내심", "강인함", "불굴의 정신", "극복의 힘", "담대함", "의지력", "생명력", "저력",
    "창의력", "상상력", "독창성", "예술적 감각", "혁신 정신", "미적 감각", "영감", "표현력", "발상의 전환", "창조력",
    "공감 능력", "따뜻한 마음", "배려심", "이해심", "포용력", "연민", "감수성", "섬세함", "온정", "친화력",
    "지혜", "통찰력", "분별력", "판단력", "혜안", "깊은 이해", "현명함", "식견", "사려깊음", "직관력",
    "모험 정신", "도전 정신", "탐구심", "개척 정신", "용감함", "진취성", "대담함", "호기심", "열정", "추진력",
    "리더십", "카리스마", "결단력", "책임감", "영향력", "추진력", "비전", "통솔력", "지도력", "솔선수범",
    "유대감", "소통 능력", "관계 형성력", "네트워킹 능력", "사교성", "협동심", "연결 능력", "화합의 힘", "조화로움", "친밀감",
    "진정성", "정직함", "순수함", "진실됨", "솔직함", "일관성", "투명함", "신뢰성", "성실함", "올곧음",
    "성장 마인드", "자기 발전", "학습 능력", "적응력", "유연성", "발전 가능성", "잠재력", "변화의 힘", "진화", "성숙함",
    "육감", "영적 감각", "내면의 지혜", "감각적 예민함", "영감력", "예지력", "영적 깊이", "내면의 빛", "영혼의 힘", "신비로움"
];

// Japanese Traits - 名詞形の特性
const traitsJa = [
    "回復力", "粘り強さ", "忍耐力", "強靭さ", "不屈の精神", "克服力", "勇敢さ", "意志力", "生命力", "底力",
    "創造力", "想像力", "独創性", "芸術的感覚", "革新精神", "美的感覚", "インスピレーション", "表現力", "発想の転換", "創作力",
    "共感力", "温かい心", "思いやり", "理解力", "包容力", "慈悲", "感受性", "繊細さ", "温情", "親和力",
    "知恵", "洞察力", "分別力", "判断力", "慧眼", "深い理解", "賢明さ", "識見", "思慮深さ", "直感力",
    "冒険心", "挑戦精神", "探求心", "開拓精神", "勇気", "進取性", "大胆さ", "好奇心", "情熱", "推進力",
    "リーダーシップ", "カリスマ", "決断力", "責任感", "影響力", "統率力", "ビジョン", "指導力", "率先垂範", "先見性",
    "絆", "コミュニケーション能力", "関係構築力", "ネットワーク力", "社交性", "協調性", "つながる力", "調和の力", "協和性", "親密さ",
    "誠実さ", "正直さ", "純粋さ", "真実味", "率直さ", "一貫性", "透明性", "信頼性", "誠意", "まっすぐさ",
    "成長マインド", "自己発展", "学習能力", "適応力", "柔軟性", "発展可能性", "潜在力", "変革力", "進化", "成熟",
    "第六感", "霊的感覚", "内なる知恵", "感覚的鋭敏さ", "霊感", "予知力", "霊的深さ", "内なる光", "魂の力", "神秘性"
];

// Japanese Contexts - 完全な動詞フレーズ
const contextsJa = [
    "人生に意味を与えます", "世界を明るく照らします", "周りを温かくします", "人々に希望を与えます",
    "変化をもたらします", "美しい影響を残します", "深い印象を与えます", "心に響きます",
    "困難を克服します", "夢を実現します", "目標を達成します", "限界を超えます",
    "新しい道を開きます", "可能性を広げます", "成長し続けます", "進化を遂げます",
    "人々を導きます", "インスピレーションを与えます", "勇気を与えます", "力を与えます",
    "心をつなぎます", "絆を深めます", "理解を広げます", "愛を分かち合います",
    "平和をもたらします", "調和を生み出します", "バランスを保ちます", "安定を与えます",
    "創造性を発揮します", "革新を起こします", "新しい価値を生み出します", "独自性を示します",
    "知恵を分かち合います", "経験を伝えます", "学びを提供します", "洞察を与えます",
    "信頼を築きます", "誠実さを示します", "正直に生きます", "真実を語ります",
    "奉仕の精神を持ちます", "他者を支えます", "手を差し伸べます", "助けを惜しみません",
    "喜びを分かち合います", "幸せを広げます", "笑顔をもたらします", "楽しさを共有します",
    "静けさをもたらします", "穏やかさを与えます", "落ち着きを提供します", "安らぎを与えます",
    "情熱を燃やします", "エネルギーを注ぎます", "熱意を示します", "活力を与えます",
    "忍耐強く歩みます", "着実に進みます", "一歩一歩前進します", "諦めません",
    "感謝の心を持ちます", "恵みを認識します", "幸運を大切にします", "ありがたみを感じます",
    "勇敢に立ち向かいます", "恐れを克服します", "挑戦を受け入れます", "困難に負けません",
    "優しさで包みます", "思いやりを示します", "温かく接します", "慈しみを与えます",
    "自由を追求します", "束縛から解放します", "可能性を探ります", "新境地を開きます",
    "美を創造します", "芸術を生み出します", "感動を与えます", "魂に触れます",
    "正義を貫きます", "公平さを保ちます", "正しいことをします", "倫理を守ります",
    "希望の光となります", "道を照らします", "未来を示します", "方向を与えます",
    "深い理解を示します", "本質を見抜きます", "核心に迫ります", "真理を追究します",
    "コミュニティを築きます", "つながりを作ります", "関係を育てます", "ネットワークを広げます",
    "伝統を守りつつ革新します", "過去と未来をつなぎます", "遺産を継承します", "文化を伝えます"
];

// Chinese Traits - 名词形式的特质
const traitsZh = [
    "坚韧", "毅力", "忍耐力", "坚强", "不屈精神", "克服力", "勇敢", "意志力", "生命力", "潜力",
    "创造力", "想象力", "独创性", "艺术感", "创新精神", "审美观", "灵感", "表现力", "创意思维", "创作力",
    "共情力", "温暖的心", "体贴", "理解力", "包容力", "慈悲", "敏感性", "细腻", "温情", "亲和力",
    "智慧", "洞察力", "分辨力", "判断力", "慧眼", "深刻理解", "明智", "见识", "深思熟虑", "直觉力",
    "冒险精神", "挑战精神", "探索心", "开拓精神", "勇气", "进取心", "大胆", "好奇心", "热情", "推动力",
    "领导力", "魅力", "决断力", "责任感", "影响力", "统率力", "远见", "指导力", "率先垂范", "先见之明",
    "纽带", "沟通能力", "关系构建力", "人脉力", "社交能力", "协调性", "连接力", "和谐力", "协作性", "亲密感",
    "诚实", "正直", "纯粹", "真诚", "坦率", "一致性", "透明度", "可靠性", "诚意", "直爽",
    "成长思维", "自我发展", "学习能力", "适应力", "灵活性", "发展潜力", "潜能", "变革力", "进化", "成熟",
    "第六感", "灵性感知", "内心智慧", "敏锐感觉", "灵感力", "预知力", "灵性深度", "内心之光", "灵魂力量", "神秘感"
];

// Spanish Traits - sustantivos
const traitsEs = [
    "resiliencia", "perseverancia", "paciencia", "fortaleza", "espíritu indomable", "capacidad de superación", "valentía", "fuerza de voluntad", "vitalidad", "potencial",
    "creatividad", "imaginación", "originalidad", "sensibilidad artística", "espíritu innovador", "sentido estético", "inspiración", "expresividad", "pensamiento creativo", "capacidad creadora",
    "empatía", "corazón cálido", "consideración", "comprensión", "capacidad de aceptación", "compasión", "sensibilidad", "delicadeza", "calidez", "afinidad",
    "sabiduría", "perspicacia", "discernimiento", "juicio", "visión aguda", "comprensión profunda", "prudencia", "conocimiento", "reflexión", "intuición",
    "espíritu aventurero", "espíritu de desafío", "curiosidad exploradora", "espíritu pionero", "coraje", "iniciativa", "audacia", "curiosidad", "pasión", "impulso",
    "liderazgo", "carisma", "determinación", "responsabilidad", "influencia", "capacidad de dirección", "visión", "guía", "ejemplo", "previsión",
    "capacidad de conexión", "habilidad comunicativa", "construcción de relaciones", "networking", "sociabilidad", "coordinación", "poder de conexión", "armonía", "colaboración", "cercanía",
    "honestidad", "integridad", "pureza", "sinceridad", "franqueza", "consistencia", "transparencia", "confiabilidad", "buena fe", "rectitud",
    "mentalidad de crecimiento", "autodesarrollo", "capacidad de aprendizaje", "adaptabilidad", "flexibilidad", "potencial de desarrollo", "potencial", "poder transformador", "evolución", "madurez",
    "sexto sentido", "percepción espiritual", "sabiduría interior", "sensibilidad aguda", "poder inspirador", "clarividencia", "profundidad espiritual", "luz interior", "fuerza del alma", "misterio"
];

// Contexts (200+)
const contexts = [
    // Finding meaning
    "finding meaning in the smallest moments",
    "discovering purpose in unexpected places",
    "creating significance from ordinary days",
    "understanding the deeper layers of life",
    "seeking truth in everything you do",
    "illuminating darkness for others",
    "transforming experiences into wisdom",
    "building a legacy of love",
    "making each moment count",
    "living with intention and purpose",
    "finding your unique path",
    "creating your own definition of success",
    "pursuing what truly matters",
    "aligning with your higher purpose",
    "discovering your life's calling",
    "contributing to something greater",
    "leaving the world better than you found it",
    "making a difference in quiet ways",
    "living a life of significance",
    "crafting a meaningful existence",

    // Relationships
    "nurturing the relationships that matter most",
    "creating a family of choice and love",
    "building connections that transcend time",
    "being the person others can rely on",
    "spreading kindness wherever you go",
    "touching lives in profound ways",
    "building bridges across differences",
    "creating harmony in your circles",
    "being a source of support for many",
    "cultivating deep and lasting bonds",
    "inspiring those fortunate to know you",
    "leading others toward their potential",
    "healing relationships around you",
    "bringing people together",
    "being someone's anchor in storms",
    "creating a ripple effect of positivity",
    "mentoring the next generation",
    "being present for those who need you",
    "celebrating others' successes genuinely",
    "making everyone feel valued",

    // Personal growth
    "becoming the best version of yourself",
    "evolving through every experience",
    "embracing transformation courageously",
    "learning from each chapter of life",
    "growing stronger with every challenge",
    "expanding your horizons continuously",
    "developing wisdom through reflection",
    "refining your character daily",
    "unlocking your hidden potential",
    "pursuing excellence in all you do",
    "pushing past your perceived limits",
    "welcoming change as a teacher",
    "transforming obstacles into opportunities",
    "embracing the journey of self-discovery",
    "building resilience through experience",
    "cultivating your unique gifts",
    "honoring your personal evolution",
    "walking the path of continuous learning",
    "becoming who you were meant to be",
    "growing through conscious effort",

    // Living fully
    "embracing life's adventures wholeheartedly",
    "living each day with gratitude",
    "finding joy in simple pleasures",
    "creating beautiful memories",
    "experiencing life to its fullest",
    "savoring every precious moment",
    "dancing through life with grace",
    "celebrating existence itself",
    "making every day an adventure",
    "finding wonder in the ordinary",
    "living with passion and purpose",
    "embracing both light and shadow",
    "creating a life you love",
    "finding balance in chaos",
    "thriving in your own unique way",
    "writing your own rules for happiness",
    "living authentically and freely",
    "pursuing dreams without apology",
    "creating space for what matters",
    "designing a life of intention",

    // Impact and legacy
    "making the world a little brighter",
    "leaving a positive mark on humanity",
    "creating change that ripples outward",
    "building something that outlasts you",
    "inspiring future generations",
    "contributing to collective progress",
    "being a force for good",
    "championing causes close to your heart",
    "creating solutions that help many",
    "being remembered for kindness",
    "building bridges for others to cross",
    "planting seeds you may never see bloom",
    "making lasting contributions",
    "being part of something larger",
    "creating positive change around you",
    "standing up for what's right",
    "using your gifts to serve others",
    "building a better tomorrow",
    "leaving places better than you found them",
    "being the change you wish to see",

    // Inner peace
    "maintaining inner calm amid chaos",
    "finding peace within yourself",
    "creating stillness in a busy world",
    "accepting what cannot be changed",
    "finding contentment in the present",
    "releasing what no longer serves you",
    "embracing serenity as a practice",
    "balancing action with reflection",
    "finding your center always",
    "cultivating inner harmony",
    "letting go with grace",
    "finding strength in stillness",
    "creating sanctuary within",
    "practicing acceptance daily",
    "finding calm in any storm",
    "trusting life's unfolding",
    "embracing impermanence peacefully",
    "finding freedom in letting go",
    "maintaining equanimity through change",
    "resting in your true nature",

    // Creativity and expression
    "expressing your unique voice",
    "creating beauty wherever you go",
    "sharing your gifts with the world",
    "bringing ideas to life",
    "transforming vision into reality",
    "inspiring creativity in others",
    "painting your world with imagination",
    "crafting experiences that matter",
    "building something meaningful",
    "expressing truth through art",
    "creating with passion and purpose",
    "bringing fresh perspectives to life",
    "manifesting your dreams",
    "sharing your inner world",
    "creating what only you can create",
    "giving form to the formless",
    "translating feelings into expression",
    "building bridges through creativity",
    "inspiring through your unique vision",
    "making the intangible tangible",

    // Courage and authenticity
    "walking your own path bravely",
    "standing in your truth",
    "facing life with courage",
    "being unapologetically yourself",
    "following your heart fearlessly",
    "breaking free from expectations",
    "charting your own course",
    "living on your own terms",
    "embracing your authentic self",
    "defying limitations with grace",
    "pursuing your unique destiny",
    "honoring your individual journey",
    "being true to your values",
    "standing firm in your beliefs",
    "living without regret",
    "choosing courage over comfort",
    "owning your story completely",
    "being real in a filtered world",
    "walking tall in your truth",
    "living with integrity always",

    // Love and compassion
    "spreading love wherever you go",
    "being a source of compassion",
    "opening hearts around you",
    "healing through unconditional love",
    "being kind without expectation",
    "loving deeply and completely",
    "showing compassion to all beings",
    "being a beacon of warmth",
    "nurturing with your whole heart",
    "loving even when it's hard",
    "being gentle with yourself and others",
    "forgiving freely and fully",
    "holding space for others' pain",
    "loving without conditions",
    "being a safe harbor for many",
    "radiating warmth to everyone",
    "caring deeply about others' wellbeing",
    "loving through actions more than words",
    "being someone's reason to smile",
    "spreading kindness like wildflowers",

    // Wisdom and insight
    "sharing wisdom gained through experience",
    "seeing what others overlook",
    "guiding with gentle insight",
    "understanding life's deeper currents",
    "recognizing patterns and connections",
    "offering perspective when needed",
    "navigating complexity with clarity",
    "distilling truth from noise",
    "knowing when silence speaks loudest",
    "teaching through your example",
    "understanding the rhythm of life",
    "perceiving hidden truths",
    "offering counsel with care",
    "seeing beyond surface appearances",
    "understanding human nature deeply",
    "recognizing wisdom in unexpected places",
    "learning from every experience",
    "growing wiser with each year",
    "sharing lessons learned gracefully",
    "understanding life's greater patterns"
];

// Korean Contexts - 완결된 동사구
const contextsKo = [
    "삶에 의미를 더합니다", "세상을 밝게 비춥니다", "주변을 따뜻하게 합니다", "사람들에게 희망을 줍니다", "긍정적인 변화를 이끕니다",
    "다른 이들에게 영감을 줍니다", "어둠 속에서도 빛을 찾습니다", "어려움을 기회로 바꿉니다", "사랑을 나누며 삽니다", "진정한 가치를 추구합니다",
    "아름다운 유산을 남깁니다", "의미 있는 관계를 만들어 갑니다", "자신만의 길을 개척합니다", "세상에 선한 영향을 미칩니다", "타인의 성장을 돕습니다",
    "깊은 유대를 형성합니다", "조화로운 삶을 만들어 갑니다", "감동을 선사합니다", "기쁨을 전파합니다", "희망의 메시지를 전합니다",
    "진실된 삶을 삽니다", "꿈을 현실로 만듭니다", "변화의 물결을 일으킵니다", "소중한 추억을 만들어 갑니다", "삶의 아름다움을 발견합니다",
    "내면의 평화를 찾습니다", "성장을 멈추지 않습니다", "더 나은 내일을 만듭니다", "따뜻한 울림을 전합니다", "사람들을 하나로 모읍니다",
    "진정한 행복을 추구합니다", "삶을 풍요롭게 합니다", "긍정의 에너지를 퍼뜨립니다", "사람들의 마음을 움직입니다", "새로운 가능성을 열어갑니다",
    "깊은 인상을 남깁니다", "삶에 색채를 더합니다", "감사의 마음으로 살아갑니다", "진심을 다해 사랑합니다", "자신답게 살아갑니다",
    "타인을 이해하고 품습니다", "지혜롭게 살아갑니다", "용기 있게 나아갑니다", "꾸준히 성장해 나갑니다", "균형 잡힌 삶을 살아갑니다",
    "창의적으로 문제를 해결합니다", "사람들에게 위안이 됩니다", "더 큰 꿈을 향해 나아갑니다", "진정한 자아를 찾아갑니다", "삶을 축제처럼 살아갑니다",
    "다른 이들의 빛이 됩니다", "세상에 아름다움을 더합니다", "지속적인 발전을 이룹니다", "사람들의 가능성을 깨웁니다", "깊은 연결을 만들어 갑니다",
    "삶의 의미를 깨달아 갑니다", "진정한 리더가 됩니다", "평화로운 세상을 만들어 갑니다", "사랑의 씨앗을 뿌립니다", "값진 교훈을 전합니다",
    "삶에 활력을 불어넣습니다", "주변을 행복하게 합니다", "끊임없이 도전합니다", "감동적인 이야기를 써 내려갑니다", "빛나는 존재가 됩니다",
    "삶의 진정한 가치를 깨닫습니다", "사람들을 연결하는 다리가 됩니다", "꿈을 향해 달려갑니다", "따뜻한 세상을 만들어 갑니다", "삶을 예술로 승화시킵니다",
    "진심 어린 관계를 쌓아 갑니다", "세상에 기여합니다", "자신의 가치를 증명합니다", "사람들에게 용기를 줍니다", "삶의 주인공이 됩니다",
    "깊은 감동을 선사합니다", "긍정적인 변화를 만들어 갑니다", "타인의 삶을 풍요롭게 합니다", "진정한 성공을 이룹니다", "삶을 빛나게 합니다",
    "사람들의 마음속에 남습니다", "새로운 길을 열어갑니다", "아름다운 세상을 꿈꿉니다", "진정한 나를 발견합니다", "삶의 여정을 즐깁니다",
    "사랑과 감사로 채웁니다", "주변에 희망을 전합니다", "성장의 기회를 만듭니다", "깊은 지혜를 나눕니다", "삶에 감동을 더합니다",
    "진심으로 사람들을 대합니다", "삶의 소중함을 일깨웁니다", "행복을 나누며 살아갑니다", "세상을 더 나은 곳으로 만듭니다", "삶의 아름다운 순간들을 만들어 갑니다"
];

// Japanese Contexts
const contextsJa = [
    "最も小さな瞬間に意味を見出す", "予期しない場所で目的を発見する", "平凡な日々から重要性を創る",
    "人生のより深い層を理解する", "すべての行いで真実を追求する", "他の人のために暗闇を照らす",
    "経験を知恵に変える", "愛の遺産を築く", "一瞬一瞬を大切にする",
    "意図と目的を持って生きる", "自分だけのユニークな道を見つける", "成功の自分だけの定義を創る",
    "本当に大切なことを追求する", "より高い目的と一致する", "人生の使命を発見する",
    "より大きなものに貢献する", "世界をより良い場所にする", "静かな方法で変化をもたらす",
    "意義ある人生を生きる", "意味のある存在を創る",
    "最も大切な関係を育む", "選択と愛の家族を創る", "時を超える繋がりを築く",
    "他の人が頼れる人になる", "どこへ行っても親切を広める", "深い方法で人々の心を動かす",
    "違いを超えて橋を架ける", "周囲に調和を創る", "多くの人のサポートになる",
    "深く永続的な絆を育む", "あなたを知る幸運を持つ人々にインスピレーションを与える", "他の人を潜在能力へ導く",
    "周囲の関係を癒す", "人々を一つにする", "嵐の中で誰かの錨になる",
    "ポジティブな波及効果を創る", "次の世代を指導する", "必要としている人のそばにいる",
    "他の人の成功を心から祝う", "すべての人が価値を感じるようにする",
    "最高の自分になる", "すべての経験を通じて進化する", "勇気を持って変化を受け入れる",
    "人生の各章から学ぶ", "すべての挑戦と共に強くなる", "視野を継続的に広げる",
    "内省を通じて知恵を育む", "毎日性格を磨く", "隠れた可能性を解き放つ",
    "すべての行いで卓越性を追求する", "認識された限界を超える", "変化を教師として歓迎する",
    "障害を機会に変える", "自己発見の旅を受け入れる", "経験を通じて回復力を築く",
    "ユニークな才能を育む", "個人的な進化を尊重する", "継続的な学びの道を歩む",
    "なるべき人になる", "意識的な努力で成長する",
    "人生の冒険を心から受け入れる", "毎日感謝と共に生きる", "シンプルな喜びに幸せを見出す",
    "美しい思い出を創る", "人生を最大限に経験する", "すべての貴重な瞬間を味わう",
    "優雅に人生を踊る", "存在そのものを祝う", "毎日を冒険にする",
    "普通の中に驚きを見出す", "情熱と目的を持って生きる", "光と影の両方を受け入れる",
    "愛する人生を創る", "混沌の中にバランスを見出す", "自分だけのユニークな方法で繁栄する",
    "幸せのための自分だけのルールを書く", "本当に自由に生きる", "謝罪なしに夢を追う",
    "大切なことのための空間を創る", "意図的な人生を設計する",
    "世界を少し明るくする", "人類にポジティブな足跡を残す", "外へ広がる変化を創る",
    "自分を超えて続くものを築く", "未来の世代にインスピレーションを与える", "集団的な進歩に貢献する",
    "善の力になる", "心に近い大義を支持する", "多くの人を助ける解決策を創る",
    "親切さで記憶される", "他の人が渡る橋を架ける", "咲くのを見ないかもしれない種を蒔く",
    "永続的な貢献をする", "より大きなものの一部になる", "周囲にポジティブな変化を創る",
    "正しいことのために立ち上がる", "才能を他の人に仕えるために使う", "より良い明日を築く",
    "場所を見つけた時よりも良い状態で残す", "見たい変化になる",
    "混沌の中で内なる平穏を保つ", "自分の中に平和を見出す", "忙しい世界で静けさを創る",
    "変えられないものを受け入れる", "現在に満足を見出す", "もはや役立たないものを手放す",
    "平穏を実践として受け入れる", "行動と内省のバランスを取る", "常に中心を見つける",
    "内なる調和を育む", "優雅に手放す", "静けさの中に強さを見出す",
    "内に聖域を創る", "毎日受容を実践する", "どんな嵐でも平穏を見出す",
    "人生の展開を信頼する", "無常を平和に受け入れる", "手放すことに自由を見出す",
    "変化を通じて平静を保つ", "本当の自分の中で休む",
    "ユニークな声を表現する", "どこへ行っても美を創る", "才能を世界と分かち合う",
    "アイデアに命を吹き込む", "ビジョンを現実に変える", "他の人の創造性にインスピレーションを与える",
    "想像力で世界を彩る", "大切な経験を創る", "意味のあるものを築く",
    "アートを通じて真実を表現する", "情熱と目的を持って創造する", "人生に新鮮な視点をもたらす",
    "夢を実現する", "内なる世界を分かち合う", "あなただけが創れるものを創る",
    "形のないものに形を与える", "感情を表現に翻訳する", "創造性を通じて橋を架ける",
    "ユニークなビジョンでインスピレーションを与える", "無形を有形にする",
    "勇敢に自分の道を歩く", "真実の中に立つ", "勇気で人生に立ち向かう",
    "堂々と自分自身である", "恐れずに心に従う", "期待から自由になる",
    "自分の航路を開く", "自分の条件で生きる", "本当の自分を受け入れる",
    "優雅に限界に挑戦する", "ユニークな運命を追求する", "個人の旅を尊重する",
    "価値に忠実である", "信念に確固として立つ", "後悔なく生きる",
    "快適さより勇気を選ぶ", "完全に自分の物語を所有する", "フィルターされた世界で本物である",
    "真実の中で堂々と歩く", "常に誠実に生きる",
    "どこへ行っても愛を広める", "思いやりの源になる", "周囲の心を開く",
    "無条件の愛で癒す", "期待なしに親切にする", "深く完全に愛する",
    "すべての存在に思いやりを示す", "温かさの灯台になる", "全身全霊で育む",
    "難しい時も愛する", "自分と他の人に優しくある", "自由に完全に許す",
    "他の人の痛みのための空間を保つ", "条件なしに愛する", "多くの人の安全な港になる",
    "すべての人に温かさを放つ", "他の人の幸福を深く気にかける", "言葉より行動で愛する",
    "誰かの笑顔の理由になる", "野の花のように親切を広める",
    "経験を通じて得た知恵を分かち合う", "他の人が見過ごすことを見る", "穏やかな洞察で導く",
    "人生のより深い流れを理解する", "パターンとつながりを認識する", "必要な時に視点を提供する",
    "明確さで複雑さを乗り越える", "騒音から真実を蒸留する", "沈黙が最も大きく語る時を知る",
    "模範を通じて教える", "人生のリズムを理解する", "隠された真実を認識する",
    "丁寧にアドバイスを提供する", "表面の先を見る", "人間の本質を深く理解する",
    "予期しない場所で知恵を認識する", "すべての経験から学ぶ", "毎年より賢くなる",
    "優雅に学んだ教訓を分かち合う", "人生のより大きなパターンを理解する"
];

// Chinese Contexts - 完整动词短语
const contextsZh = [
    "为生活增添意义", "照亮世界", "温暖周围的人", "给人们带来希望",
    "带来改变", "留下美好印记", "给人深刻印象", "触动人心",
    "克服困难", "实现梦想", "达成目标", "超越极限",
    "开辟新路", "拓展可能性", "持续成长", "不断进化",
    "引导他人", "激励他人", "给予勇气", "赋予力量",
    "连接人心", "加深纽带", "增进理解", "分享爱",
    "带来和平", "创造和谐", "保持平衡", "给予稳定",
    "发挥创造力", "引领创新", "创造新价值", "展现独特性",
    "分享智慧", "传递经验", "提供学习", "给予洞察",
    "建立信任", "展现诚实", "诚实生活", "说出真相",
    "拥有奉献精神", "支持他人", "伸出援手", "毫不吝啬帮助",
    "分享喜悦", "传播幸福", "带来笑容", "共享快乐",
    "带来宁静", "给予平静", "提供安慰", "给予安宁",
    "燃烧热情", "倾注能量", "展现热忱", "给予活力",
    "坚持不懈", "稳步前进", "一步一步前行", "永不放弃",
    "怀着感恩之心", "认识恩典", "珍惜幸运", "感受感激",
    "勇敢面对", "克服恐惧", "接受挑战", "不屈服于困难",
    "用温柔包容", "展现体贴", "温暖对待", "给予慈爱",
    "追求自由", "从束缚中解放", "探索可能性", "开辟新天地",
    "创造美", "创作艺术", "给予感动", "触动灵魂",
    "坚持正义", "保持公正", "做正确的事", "遵守道德",
    "成为希望之光", "照亮道路", "指明未来", "给予方向",
    "展现深刻理解", "看透本质", "触及核心", "追求真理",
    "建立社区", "创造连接", "培育关系", "扩展网络",
    "在守护传统中创新", "连接过去与未来", "传承遗产", "传递文化"
];

// Spanish Contexts - frases verbales completas
const contextsEs = [
    "añades significado a la vida", "iluminas el mundo", "calientas a quienes te rodean", "das esperanza a la gente",
    "traes cambio", "dejas una huella hermosa", "causas una impresión profunda", "tocas corazones",
    "superas dificultades", "realizas sueños", "alcanzas metas", "superas límites",
    "abres nuevos caminos", "expandes posibilidades", "sigues creciendo", "evolucionas constantemente",
    "guías a otros", "inspiras a otros", "das coraje", "empoderas a otros",
    "conectas corazones", "profundizas lazos", "aumentas la comprensión", "compartes amor",
    "traes paz", "creas armonía", "mantienes equilibrio", "das estabilidad",
    "expresas creatividad", "lideras innovación", "creas nuevo valor", "muestras singularidad",
    "compartes sabiduría", "transmites experiencia", "proporcionas aprendizaje", "das perspicacia",
    "construyes confianza", "muestras honestidad", "vives con integridad", "dices la verdad",
    "tienes espíritu de servicio", "apoyas a otros", "extiendes la mano", "ayudas sin dudar",
    "compartes alegría", "difundes felicidad", "traes sonrisas", "compartes diversión",
    "traes tranquilidad", "das calma", "proporcionas consuelo", "das serenidad",
    "ardes con pasión", "inviertes energía", "muestras entusiasmo", "das vitalidad",
    "perseveras incansablemente", "avanzas firmemente", "progresas paso a paso", "nunca te rindes",
    "tienes un corazón agradecido", "reconoces bendiciones", "valoras la fortuna", "sientes gratitud",
    "enfrentas con valentía", "superas miedos", "aceptas desafíos", "no cedes ante dificultades",
    "envuelves con ternura", "muestras consideración", "tratas con calidez", "das cariño",
    "buscas libertad", "liberas de ataduras", "exploras posibilidades", "abres nuevos horizontes",
    "creas belleza", "produces arte", "das emoción", "tocas almas",
    "mantienes la justicia", "guardas equidad", "haces lo correcto", "sigues la ética",
    "te conviertes en luz de esperanza", "iluminas el camino", "señalas el futuro", "das dirección",
    "muestras comprensión profunda", "ves la esencia", "llegas al núcleo", "buscas la verdad",
    "construyes comunidad", "creas conexiones", "cultivas relaciones", "expandes redes",
    "innovas mientras proteges tradiciones", "conectas pasado y futuro", "heredas legado", "transmites cultura"
];

// Core Traits (for insights section)
const coreTraits = [
    "Resilience", "Creativity", "Empathy", "Wisdom", "Adventure",
    "Leadership", "Connection", "Authenticity", "Growth", "Intuition",
    "Compassion", "Courage", "Curiosity", "Determination", "Harmony",
    "Innovation", "Kindness", "Patience", "Passion", "Serenity",
    "Vision", "Adaptability", "Balance", "Depth", "Energy",
    "Focus", "Generosity", "Hope", "Integrity", "Joy",
    "Knowledge", "Love", "Mindfulness", "Nurturing", "Optimism",
    "Perseverance", "Quest", "Reflection", "Strength", "Trust"
];

// Life Phases
const lifePhases = [
    "Discovery", "Growth", "Transformation", "Integration", "Mastery",
    "Expansion", "Renewal", "Deepening", "Awakening", "Flourishing",
    "Exploration", "Creation", "Foundation", "Evolution", "Illumination",
    "Emergence", "Ascension", "Cultivation", "Revelation", "Transcendence"
];

// Lucky Elements
const elements = [
    "Water", "Fire", "Earth", "Air", "Ether",
    "Wood", "Metal", "Light", "Shadow", "Crystal",
    "Storm", "Moon", "Sun", "Star", "Ocean"
];

// ===== Performance: Language Maps for O(1) lookup =====
// Defined once at module level instead of recreating on every function call
const langTemplatesMap = new Map([
    ['en', templates],
    ['ko', templatesKo],
    ['ja', templatesJa],
    ['zh', templatesZh],
    ['es', templatesEs]
]);

const langTraitsMap = new Map([
    ['en', traits],
    ['ko', traitsKo],
    ['ja', traitsJa],
    ['zh', traitsZh],
    ['es', traitsEs]
]);

const langContextsMap = new Map([
    ['en', contexts],
    ['ko', contextsKo],
    ['ja', contextsJa],
    ['zh', contextsZh],
    ['es', contextsEs]
]);

// ===== Performance: Pre-compiled RegExp patterns for line breaks =====
// Hoisted outside functions to avoid recreation on every call
const lineBreakPatterns = {
    ko: [/,\s*/g, /\.\s*/g, /다\.\s*/g, /요\.\s*/g],
    ja: [/、\s*/g, /。\s*/g, /,\s*/g, /\.\s*/g],
    zh: [/，\s*/g, /。\s*/g, /,\s*/g, /\.\s*/g],
    default: [/,\s+/g, /\.\s+/g, /—/g]
};

/**
 * Create a hash from birthdate string with caching
 * @param {string} birthdate - Date string in YYYY-MM-DD format
 * @returns {number} - Hash value
 */
function createHash(birthdate) {
    // Check cache first for O(1) lookup on repeated calls
    if (birthdateHashCache.has(birthdate)) {
        return birthdateHashCache.get(birthdate);
    }

    const date = new Date(birthdate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Create a deterministic hash
    let hash = 0;
    const dateString = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    const len = dateString.length; // Cache length for loop optimization

    for (let i = 0; i < len; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Make it positive
    const result = Math.abs(hash);

    // Cache result (limit size to prevent memory issues)
    if (birthdateHashCache.size < 5000) {
        birthdateHashCache.set(birthdate, result);
    }

    return result;
}

/**
 * Generate secondary hash for more variation
 * @param {number} primaryHash - Primary hash value
 * @param {number} modifier - Modifier for variation
 * @returns {number} - Secondary hash value
 */
function secondaryHash(primaryHash, modifier) {
    return Math.abs((primaryHash * 31 + modifier * 17) % 2147483647);
}

/**
 * Generate life summary based on birthdate, gender, and language
 * @param {string} birthdate - Date string in YYYY-MM-DD format
 * @param {string} gender - Gender selection
 * @param {string} lang - Language code (en, ko, ja, zh, es)
 * @returns {object} - Result object containing sentence and insights
 */
function generateLifeSummary(birthdate, gender, lang) {
    const hash = createHash(birthdate);
    lang = lang || 'en';

    // Use pre-defined Maps for O(1) lookup instead of recreating objects
    const selectedTemplates = langTemplatesMap.get(lang) || templates;
    const selectedTraits = langTraitsMap.get(lang) || traits;
    const selectedContexts = langContextsMap.get(lang) || contexts;

    // Select components using hash
    const templateIndex = hash % selectedTemplates.length;
    const traitIndex = secondaryHash(hash, 1) % selectedTraits.length;
    const contextIndex = secondaryHash(hash, 2) % selectedContexts.length;

    // Get trait and context (now in noun/complete verb phrase form)
    const trait = selectedTraits[traitIndex];
    const context = selectedContexts[contextIndex];

    // Generate the sentence
    let sentence = selectedTemplates[templateIndex]
        .replace('{trait}', trait)
        .replace('{context}', context);

    // Capitalize first letter (for languages that use it)
    if (lang === 'en' || lang === 'es') {
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    // Generate insights
    const coreTraitIndex = secondaryHash(hash, 3) % coreTraits.length;
    const lifePhaseIndex = secondaryHash(hash, 4) % lifePhases.length;
    const elementIndex = secondaryHash(hash, 5) % elements.length;

    return {
        sentence: sentence,
        coreTrait: coreTraits[coreTraitIndex],
        lifePhase: lifePhases[lifePhaseIndex],
        element: elements[elementIndex],
        hash: hash
    };
}

/**
 * Format sentence with line breaks after punctuation for better readability
 * Uses pre-compiled RegExp patterns for performance
 * @param {string} sentence - The sentence to format
 * @param {string} lang - Language code (en, ko, ja, zh, es)
 * @returns {string} - Formatted sentence with line breaks
 */
function formatSentenceWithLineBreaks(sentence, lang) {
    if (!sentence) return sentence; // Early return

    lang = lang || 'en';

    // Use pre-compiled patterns based on language
    let result = sentence;

    if (lang === 'ko') {
        // Korean: use pre-compiled patterns
        result = result
            .replace(lineBreakPatterns.ko[0], ',\n')
            .replace(lineBreakPatterns.ko[1], '.\n')
            .replace(lineBreakPatterns.ko[2], '다.\n')
            .replace(lineBreakPatterns.ko[3], '요.\n');
    } else if (lang === 'ja') {
        // Japanese: use pre-compiled patterns
        result = result
            .replace(lineBreakPatterns.ja[0], '、\n')
            .replace(lineBreakPatterns.ja[1], '。\n')
            .replace(lineBreakPatterns.ja[2], ',\n')
            .replace(lineBreakPatterns.ja[3], '.\n');
    } else if (lang === 'zh') {
        // Chinese: use pre-compiled patterns
        result = result
            .replace(lineBreakPatterns.zh[0], '，\n')
            .replace(lineBreakPatterns.zh[1], '。\n')
            .replace(lineBreakPatterns.zh[2], ',\n')
            .replace(lineBreakPatterns.zh[3], '.\n');
    } else {
        // English/Spanish/default: use pre-compiled patterns
        result = result
            .replace(lineBreakPatterns.default[0], ',\n')
            .replace(lineBreakPatterns.default[1], '.\n')
            .replace(lineBreakPatterns.default[2], '—\n');
    }

    return result.trim();
}

/**
 * Get all sentences for a specific birth month/year (for archive)
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {array} - Array of sentences for each day
 */
function getMonthSentences(year, month) {
    const sentences = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const result = generateLifeSummary(dateStr, 'prefer-not-to-say');
        sentences.push({
            day: day,
            sentence: result.sentence
        });
    }

    return sentences;
}

/**
 * Get example sentences for display
 * @param {number} count - Number of examples to generate
 * @returns {array} - Array of example sentences
 */
function getExampleSentences(count = 6) {
    const examples = [];
    const sampleDates = [
        '1990-03-15', '1985-09-22', '1995-07-08',
        '1988-12-01', '1992-02-14', '1998-05-30',
        '1982-11-11', '1975-04-25', '2000-08-19',
        '1993-06-07', '1987-01-28', '1996-10-12'
    ];

    for (let i = 0; i < Math.min(count, sampleDates.length); i++) {
        const result = generateLifeSummary(sampleDates[i], 'prefer-not-to-say');
        examples.push({
            sentence: result.sentence,
            month: new Date(sampleDates[i]).toLocaleString('en-US', { month: 'long' })
        });
    }

    return examples;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateLifeSummary,
        formatSentenceWithLineBreaks,
        getMonthSentences,
        getExampleSentences,
        createHash
    };
}
