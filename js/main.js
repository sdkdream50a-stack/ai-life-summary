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
// Note: {trait}와 {context}는 "~하다" 형태의 동사구로 전달됨
const templatesKo = [
    "당신은 {trait}는 능력을 지녔으며, {context}는 삶을 살아갑니다.",
    "당신의 여정에서 가장 빛나는 순간은 {trait}는 때이며, 그 과정에서 {context}게 됩니다.",
    "당신에게 강함이란 {trait}는 것이고, 이를 통해 {context}게 됩니다.",
    "삶에서 당신은 {trait}며, 이것이 바로 당신이 {context}는 방법입니다.",
    "당신은 {trait}며 목적을 찾고, 그 여정에서 {context}게 됩니다.",
    "당신을 특별하게 만드는 것은 {trait}면서 동시에 {context}는 능력입니다.",
    "당신의 본질은 {trait}는 것이며, 언제나 {context}는 모습을 보여줍니다.",
    "당신은 {trait}며 삶을 항해하고, 자연스럽게 {context}게 됩니다.",
    "세상은 당신을 {trait}는 사람으로 보지만, 그 이면에서 당신은 {context}고 있습니다.",
    "당신의 재능은 {trait}는 것이며, {context}는 능력과 조화를 이룹니다.",
    "당신은 {trait}는 사람이며, 이것이 당신을 {context}게 만듭니다.",
    "삶은 당신에게 {trait}라고 가르쳤고, 지금 당신은 {context}고 있습니다.",
    "당신의 핵심에는 {trait}는 힘이 있고, 이것이 당신을 {context}게 합니다.",
    "당신은 {trait}기 위해 태어났고, {context}는 운명을 지녔습니다.",
    "당신의 길은 {trait}는 빛으로 밝혀지며, {context}는 방향으로 이어집니다.",
    "사람들은 당신이 {trait}면서 자연스럽게 {context}는 모습을 존경합니다.",
    "당신 안에는 {trait}는 힘이 있으며, 이것이 당신을 {context}게 합니다.",
    "당신의 영혼은 {trait}는 것으로 정의되며, 항상 {context}려고 합니다.",
    "우주는 당신이 {trait}고 {context}는 사람이 되도록 이끌었습니다.",
    "깊은 곳에서 당신은 {trait}며, 이것이 자연스럽게 당신을 {context}게 합니다.",
    "당신의 인생 이야기는 {trait}는 것이며, {context}는 것과 아름답게 얽혀 있습니다.",
    "당신은 {trait}는 드문 능력을 가지고 있어, {context}ㄹ 수 있습니다.",
    "당신을 독특하게 만드는 것은 {trait}면서 {context}는 방식입니다.",
    "당신의 운명은 {trait}는 길을 통해 펼쳐지며, {context}도록 안내합니다.",
    "당신은 {trait}며 도전을 변화시키고, 궁극적으로 {context}게 됩니다.",
    "당신 존재의 본질은 {trait}고, 영원히 {context}는 것입니다.",
    "당신은 {trait}며 세상을 밝히고, 우아하게 {context}고 있습니다.",
    "당신의 마음은 {trait}는 법을 알고, 그래서 당신은 {context}게 됩니다.",
    "삶은 당신에게 {trait}는 방식으로 드러나며, 당신은 계속 {context}고 있습니다.",
    "당신은 {trait}는 축복을 받아, 끊임없이 {context}ㄹ 수 있습니다.",
    "당신의 진정한 자아는 {trait}ㄹ 때 빛나며, 자연스럽게 {context}게 됩니다.",
    "별들은 {trait}고 {context}는 사람을 위해 정렬되었습니다.",
    "당신은 {trait}는 것을 마스터했고, 이것이 {context}는 것을 가능하게 합니다.",
    "당신의 내면의 빛은 {trait}는 데서 오며, {context}면서 바깥으로 발산됩니다.",
    "당신은 {trait}며 삶을 걸어가고, 항상 {context}는 방법을 찾습니다.",
    "당신의 존재는 {trait}는 것으로 표현되며, 다른 사람들에게 {context}도록 영감을 줍니다.",
    "당신은 {trait}며 의미를 창조하고, 동시에 {context}고 있습니다.",
    "당신 안의 마법은 {trait}는 것이며, {context}면서 나타납니다.",
    "당신은 {trait}기 때문에 돋보이며, 우아하게 {context}고 있습니다.",
    "당신의 지혜는 {trait}는 데서 흘러나오며, {context}도록 이끕니다.",
    "당신은 {trait}며 삶을 감동시키고, 끊임없이 {context}고 있습니다.",
    "당신의 힘은 {trait}는 데서 오며, {context}도록 안내합니다.",
    "당신은 {trait}며 세상을 치유하고, 연민을 가지고 {context}고 있습니다.",
    "당신의 유산은 {trait}는 것으로 세워지며, 당신은 계속 {context}고 있습니다.",
    "당신은 다른 사람들에게 {trait}도록 영감을 주고, 그들에게 {context}는 법을 보여줍니다.",
    "당신 영혼의 깊이는 {trait}는 것을 드러내며, 항상 {context}고 있습니다.",
    "당신은 {trait}며 이끌고, 다른 사람들에게 {context}도록 가르칩니다.",
    "당신의 여정은 {trait}는 것을 기념하며, 영원히 {context}고 있습니다.",
    "당신은 {trait}며 삶을 받아들이고, 기쁘게 {context}고 있습니다.",
    "당신의 진실은 {trait}는 데서 발견되며, {context}는 것을 통해 표현됩니다."
];

// Japanese Templates
const templatesJa = [
    "あなたは{trait}し、{context}する人です。",
    "あなたの旅は{trait}で特徴づけられ、特に{context}するときにそうです。",
    "あなたが{trait}するとき、強さは自然にやってきます、なぜならあなたは{context}からです。",
    "人生において、あなたは{trait}します—これがあなたが{context}する方法です。",
    "あなたは{trait}を通じて目的を見つけ、{context}があなたの道を導きます。",
    "あなたを定義するのは、{trait}しながら{context}する方法です。",
    "あなたの本質は{trait}にあり、常に{context}しています。",
    "あなたは{trait}しながら人生を航海し、自然に{context}します。",
    "世界は{trait}する人としてあなたを見ますが、その下であなたは{context}しています。",
    "あなたの才能は{trait}であり、{context}する能力と組み合わさっています。",
    "あなたは{trait}を体現し、これがあなたを{context}することを可能にします。",
    "人生はあなたに{trait}することを教え、今あなたは{context}しています。",
    "あなたの核心で、あなたは{trait}し、これがあなたを{context}するのに役立ちます。",
    "あなたは{trait}するために生まれ、{context}する運命にあります。",
    "あなたの道は{trait}で照らされ、{context}へと導きます。",
    "他の人々は、あなたが{trait}しながら楽に{context}することを賞賛します。",
    "あなたの中に{trait}を持ち、これがあなたを{context}する力を与えます。",
    "あなたの精神は{trait}で定義され、常に{context}しようとしています。",
    "宇宙はあなたを{trait}し{context}する人にするために整列しました。",
    "深いところで、あなたは{trait}し、これが自然にあなたを{context}することを可能にします。",
    "あなたの人生物語は{trait}のものであり、{context}と美しく織り交ぜられています。",
    "あなたは{trait}する稀な能力を持ち、{context}することができます。",
    "あなたをユニークにするのは、{trait}しながら{context}を組み合わせる方法です。",
    "あなたの運命は{trait}を通じて展開し、{context}するよう導きます。",
    "あなたは{trait}して挑戦を変革し、最終的に{context}します。",
    "あなたの存在の本質は{trait}し、永遠に{context}することです。",
    "あなたは{trait}して世界を照らし、優雅に{context}します。",
    "あなたの心は{trait}する方法を知っており、だからあなたは{context}します。",
    "人生は{trait}を通じてあなたに現れ、あなたは{context}し続けます。",
    "あなたは{trait}に恵まれ、絶えず{context}することができます。",
    "あなたの本当の自分は{trait}するとき輝き、自然に{context}します。",
    "星々は{trait}し{context}する人のために整列しました。",
    "あなたは{trait}をマスターし、これが{context}を可能にします。",
    "あなたの内なる光は{trait}から来て、{context}しながら外へ放射します。",
    "あなたは{trait}しながら人生を歩み、常に{context}する方法を見つけます。",
    "あなたの存在は{trait}で特徴づけられ、他の人々に{context}するよう影響を与えます。",
    "あなたは{trait}して意味を創造し、同時に{context}します。",
    "あなたの中の魔法は{trait}であり、{context}しながら現れます。",
    "あなたは{trait}するから際立ち、優雅に{context}します。",
    "あなたの知恵は{trait}から流れ、{context}することを教えます。",
    "あなたは{trait}を通じて人々の心を動かし、絶え間なく{context}します。",
    "あなたの力は{trait}から来て、{context}するよう導きます。",
    "あなたは{trait}して世界を癒し、思いやりを持って{context}します。",
    "あなたの遺産は{trait}で築かれ、あなたは{context}し続けます。",
    "あなたは他の人々に{trait}するよう影響を与え、{context}する方法を示します。",
    "あなたの魂の深さは{trait}を明らかにし、常に{context}しています。",
    "あなたは{trait}で導き、他の人々に{context}することを教えます。",
    "あなたの旅は{trait}を祝い、永遠に{context}しています。",
    "あなたは{trait}して人生を受け入れ、喜びを持って{context}します。",
    "あなたの真実は{trait}に見出され、{context}を通じて表現されます。"
];

// Chinese Templates
const templatesZh = [
    "你是一个{trait}并且{context}的人。",
    "你的旅程以{trait}为特征，尤其是当{context}的时候。",
    "当你{trait}时，力量自然而来，因为你{context}。",
    "在生活中，你{trait}——这就是你{context}的方式。",
    "你通过{trait}找到目标，{context}指引你的道路。",
    "定义你的是你{trait}同时{context}的方式。",
    "你的本质在于{trait}，始终{context}。",
    "你{trait}地航行人生，自然地{context}。",
    "世界看到你是一个{trait}的人，但在这之下，你{context}。",
    "你的天赋是{trait}，与{context}的能力相配。",
    "你体现{trait}，这使你能够{context}。",
    "生活教会你{trait}，现在你{context}。",
    "在你的核心，你{trait}，这帮助你{context}。",
    "你生来就是为了{trait}，注定要{context}。",
    "你的道路被{trait}照亮，引导你{context}。",
    "其他人钦佩你{trait}同时轻松地{context}。",
    "你内心怀有{trait}，这赋予你{context}的力量。",
    "你的精神由{trait}定义，始终寻求{context}。",
    "宇宙排列让你成为一个{trait}并{context}的人。",
    "在内心深处，你{trait}，这自然地让你能够{context}。",
    "你的人生故事是{trait}的，与{context}美丽地交织在一起。",
    "你拥有{trait}的罕见能力，使你能够{context}。",
    "使你独特的是你{trait}同时结合{context}的方式。",
    "你的命运通过{trait}展开，引导你{context}。",
    "你通过{trait}改变挑战，最终{context}。",
    "你存在的本质是{trait}，永远{context}。",
    "你通过{trait}照亮世界，优雅地{context}。",
    "你的心知道如何{trait}，这就是为什么你{context}。",
    "生活通过{trait}向你揭示，你继续{context}。",
    "你被{trait}所祝福，能够不断地{context}。",
    "你真实的自我在{trait}时闪耀，自然地{context}。",
    "星星为{trait}并{context}的人排列。",
    "你已经掌握了{trait}，这使你能够{context}。",
    "你内在的光来自{trait}，在你{context}时向外辐射。",
    "你{trait}地走过人生，总是找到方法{context}。",
    "你的存在以{trait}为标志，激励他人{context}。",
    "你通过{trait}创造意义，同时{context}。",
    "你内心的魔力是{trait}，在你{context}时显现。",
    "你因为{trait}而与众不同，优雅地{context}。",
    "你的智慧源自{trait}，教导你{context}。",
    "你通过{trait}触动生命，不断地{context}。",
    "你的力量来自{trait}，引导你{context}。",
    "你通过{trait}治愈世界，充满同情地{context}。",
    "你的遗产建立在{trait}之上，你继续{context}。",
    "你激励他人{trait}，向他们展示如何{context}。",
    "你灵魂的深度揭示{trait}，始终{context}。",
    "你以{trait}为引领，教导他人{context}。",
    "你的旅程庆祝{trait}，永远{context}。",
    "你通过{trait}拥抱生活，欢乐地{context}。",
    "你的真相在{trait}中被发现，通过{context}表达。"
];

// Spanish Templates
const templatesEs = [
    "Eres alguien que {trait} y {context}.",
    "Tu viaje está marcado por {trait}, especialmente cuando {context}.",
    "La fuerza viene naturalmente cuando {trait}, porque eres {context}.",
    "En la vida, tú {trait}—así es como {context}.",
    "Encuentras propósito a través de {trait}, y {context} guía tu camino.",
    "Lo que te define es cómo {trait} mientras {context}.",
    "Tu esencia radica en {trait}, siempre {context}.",
    "Navegas la vida {trait}, naturalmente {context}.",
    "El mundo ve a alguien que {trait}, pero debajo de esto, eres {context}.",
    "Tu don es {trait}, combinado con la capacidad de {context}.",
    "Encarnas {trait}, lo que te permite {context}.",
    "La vida te ha enseñado a {trait}, y ahora tú {context}.",
    "En tu núcleo, tú {trait}, y esto te ayuda a {context}.",
    "Naciste para {trait}, destinado a {context}.",
    "Tu camino está iluminado por {trait}, llevándote a {context}.",
    "Otros admiran cómo {trait} mientras sin esfuerzo {context}.",
    "Llevas dentro {trait}, lo que te da el poder de {context}.",
    "Tu espíritu está definido por {trait}, siempre buscando {context}.",
    "El universo se alineó para hacerte alguien que {trait} y {context}.",
    "En lo profundo, tú {trait}, lo que naturalmente te permite {context}.",
    "Tu historia de vida es una de {trait}, bellamente entrelazada con {context}.",
    "Posees la rara habilidad de {trait}, permitiéndote {context}.",
    "Lo que te hace único es cómo {trait}, combinado con {context}.",
    "Tu destino se despliega a través de {trait}, guiándote a {context}.",
    "Transformas desafíos {trait}, finalmente {context}.",
    "La esencia de tu ser es {trait}, siempre {context}.",
    "Iluminas el mundo {trait}, graciosamente {context}.",
    "Tu corazón sabe cómo {trait}, por eso {context}.",
    "La vida se revela a ti a través de {trait}, mientras continúas {context}.",
    "Estás bendecido con {trait}, permitiéndote constantemente {context}.",
    "Tu yo auténtico brilla cuando {trait}, naturalmente {context}.",
    "Las estrellas se alinearon para alguien que {trait} y {context}.",
    "Has dominado {trait}, lo que te permite {context}.",
    "Tu luz interior viene de {trait}, irradiando hacia afuera mientras {context}.",
    "Caminas por la vida {trait}, siempre encontrando formas de {context}.",
    "Tu presencia está marcada por {trait}, inspirando a otros a {context}.",
    "Creas significado {trait}, mientras simultáneamente {context}.",
    "La magia dentro de ti es {trait}, manifestándose mientras {context}.",
    "Te destacas porque {trait}, graciosamente {context}.",
    "Tu sabiduría fluye de {trait}, enseñándote a {context}.",
    "Tocas vidas a través de {trait}, interminablemente {context}.",
    "Tu poder viene de {trait}, que te guía a {context}.",
    "Sanas el mundo {trait}, compasivamente {context}.",
    "Tu legado está construido sobre {trait}, mientras continúas {context}.",
    "Inspiras a otros a {trait}, mostrándoles cómo {context}.",
    "La profundidad de tu alma revela {trait}, siempre {context}.",
    "Lideras con {trait}, enseñando a otros a {context}.",
    "Tu viaje celebra {trait}, siempre {context}.",
    "Abrazas la vida {trait}, alegremente {context}.",
    "Tu verdad se encuentra en {trait}, expresada a través de {context}."
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

// Korean Traits
const traitsKo = [
    "놀라운 품위로 도전을 극복하다", "역경 속에서 힘을 찾다", "지혜로 어려운 시간을 통해 성장하다",
    "좌절을 디딤돌로 바꾸다", "매번 넘어진 후 더 강하게 일어서다", "장애물을 성장의 기회로 받아들이다",
    "어둠 속에서도 희망을 유지하다", "다른 사람들이 포기할 때 견디다", "고통을 목적으로 바꾸다",
    "흔들림 없는 정신으로 폭풍을 견디다", "바닥부터 자신을 재건하다", "용기와 결단력으로 두려움에 맞서다",
    "삶이 시험할 때 굳건히 서다", "모든 구름에서 희망을 찾다", "시련에서 변화하여 나오다",
    "상처를 명예의 훈장으로 여기다", "좌절로 정의되기를 거부하다", "존재조차 몰랐던 내면의 자원을 발견하다",
    "압박 속에서 번성하다", "상처를 지혜로 바꾸다",
    "예상치 못한 곳에서 아름다움을 보다", "상상을 현실로 바꾸다", "독특한 색으로 삶을 칠하다",
    "복잡한 문제에 창의적인 해결책을 찾다", "여러 매체를 통해 자신을 표현하다", "다른 사람들이 간과하는 아이디어를 연결하다",
    "오래된 상황에 신선한 관점을 가져오다", "무에서 유를 창조하다", "생생한 가능성 속에서 꿈꾸다",
    "전통적인 경계를 넘어 생각하다", "평범함을 비범함으로 변화시키다", "일상에서 이야기를 엮다",
    "예술가의 눈으로 세상을 보다", "다른 사람들이 모방할 때 혁신하다", "열정으로 아이디어에 생명을 불어넣다",
    "예상치 못한 곳에서 영감을 찾다", "혼돈에서 아름다움을 만들다", "다른 사람들이 볼 수 없는 가능성을 상상하다",
    "삶을 창의적인 캔버스로 대하다", "논리와 상상력을 융합하다",
    "깊은 수준에서 타인을 이해하다", "세상의 감정을 깊이 느끼다", "거리를 넘어 마음을 연결하다",
    "다른 사람들이 요청하기 전에 필요한 것을 감지하다", "말 없이 위안을 주다", "자연스럽게 타인의 입장에 서다",
    "취약함을 위한 안전한 공간을 만들다", "온 존재로 경청하다", "모든 사람 안의 인간성을 인식하다",
    "연민으로 분열을 연결하다", "다른 사람의 고통을 위한 공간을 만들다", "다른 사람의 기쁨을 자신의 것처럼 축하하다",
    "주변의 표현되지 않은 감정을 직감하다", "존재만으로 치유하다", "이해를 통해 사람들을 하나로 모으다",
    "표면 너머를 보다", "감정의 저류에 반응하다", "가장 필요로 하는 이들을 돌보다",
    "공감을 통해 갈등을 변화시키다", "품위 있게 다른 사람의 짐을 나누다",
    "모든 경험에서 배우다", "다른 사람들이 놓치는 패턴을 보다", "침묵 속에서 의미를 찾다",
    "분별력으로 지식을 적용하다", "마음과 정신을 완벽하게 균형 잡다", "말할 때와 들을 때를 알다",
    "더 큰 그림을 명확하게 보다", "선견지명으로 결정을 내리다", "타이밍과 인내를 이해하다",
    "복잡함 속에서 진실을 인식하다", "혼돈에서 지혜를 증류하다", "부드러운 통찰로 다른 사람들을 안내하다",
    "자신을 깊이 알다", "바꿀 수 없는 것을 받아들이다", "싸울 가치가 있는 전투를 선택하다",
    "불확실함 속에서 평화를 찾다", "위장된 교훈을 인식하다", "이상주의와 실용주의의 균형을 맞추다",
    "지도 없이도 여정을 신뢰하다", "역설과 복잡성을 받아들이다",
    "두려움 없이 새로운 지평을 찾다", "설렘으로 미지를 받아들이다", "대담하게 자신의 이야기를 쓰다",
    "미지의 영역을 탐험하다", "새로운 경험에 예라고 말하다", "안락함의 영역을 벗어나다",
    "여행을 통해 자신을 발견하다", "낯선 것에서 마법을 찾다", "소유물보다 경험을 모으다",
    "삶을 탐험으로 살다", "경계를 넘어 꿈을 쫓다", "삶을 모험으로 바꾸다",
    "내면과 외면의 세계를 탐험하다", "영혼을 확장하는 스릴을 추구하다", "기쁨으로 즉흥성을 받아들이다",
    "움직임에서 자유를 찾다", "호기심이 길을 안내하게 하다", "새로운 곳에서 경이로움을 발견하다",
    "일상을 발견으로 변화시키다", "가능성의 가장자리를 탐험하다",
    "모범을 통해 다른 사람들에게 영감을 주다", "진실성과 목적으로 이끌다", "사람들의 최선을 이끌어내다",
    "다양한 그룹을 공통의 목표로 통합하다", "품위 있게 어려운 결정을 내리다", "이끄는 사람들을 섬기다",
    "비전을 명확하게 전달하다", "다른 사람들이 성장하도록 힘을 주다", "결과에 대한 책임을 지다",
    "주변에 긍정적인 변화를 만들다", "믿는 것을 위해 서다", "지배하지 않고 안내하다",
    "번성하는 팀을 만들다", "명확성으로 복잡함을 헤쳐나가다", "진정성으로 충성심을 불러일으키다",
    "봉사를 통해 이끌다", "다른 사람들이 번성하는 환경을 만들다", "자신감과 겸손의 균형을 맞추다",
    "다른 사람들이 가치 있다고 느끼게 하다", "다른 사람들이 따르는 길을 개척하다",
    "사람들 사이에 다리를 놓다", "지속적인 관계를 만들다", "자연스럽게 사람들을 하나로 모으다",
    "시간과 거리를 넘어 유대를 유지하다", "진정성으로 소통하다", "다른 사람들이 보이고 들린다고 느끼게 하다",
    "어디를 가든 공동체를 키우다", "낯선 사람을 친구로 바꾸다", "관계를 정성껏 키우다",
    "누구와도 공통점을 찾다", "지원의 네트워크를 엮다", "다른 사람에게 중요한 것을 기억하다",
    "사람들을 위해 꾸준히 나타나다", "고립된 이들에게 소속감을 만들다", "신뢰로 유대를 강화하다",
    "세대와 문화를 연결하다", "어디서든 가족을 만들다", "빠르게 의미 있는 연결을 만들다",
    "수년에 걸쳐 관계를 유지하다", "모든 상호작용에 따뜻함을 가져오다",
    "항상 자신에게 진실하다", "진정한 본성을 표현하다", "가치에 따라 살다",
    "다른 사람을 위해 가면을 쓰기를 거부하다", "독특한 특성을 받아들이다", "내면의 진실을 존중하다",
    "친절함으로 마음을 말하다", "가식 없이 살다", "자신을 완전히 받아들이다",
    "진정한 자신으로 나타나다", "부끄러움 없이 자신의 이야기를 소유하다", "개성을 축하하다",
    "행동을 신념과 일치시키다", "내면의 목소리를 신뢰하다", "자신의 피부 안에서 편안하다",
    "용기 있게 취약함을 표현하다", "진정성을 위해 순응을 거부하다", "죄책감 없이 필요를 존중하다",
    "자신의 모든 부분을 받아들이다", "대담하게 진실을 살다",
    "지속적인 개선을 받아들이다", "실수에서 우아하게 배우다", "모든 상황에서 성장을 추구하다",
    "한계를 넘어 진화하다", "자기 성찰을 통해 변화하다", "정기적으로 경계를 밀어붙이다",
    "자기 개발에 투자하다", "피드백을 열린 마음으로 환영하다", "편안함을 넘어 확장하다",
    "매일 더 나아지다", "숨겨진 잠재력을 열다", "기술의 숙달을 추구하다",
    "능력을 지속적으로 확장하다", "되어가는 여정을 받아들이다", "도전하는 목표를 설정하다",
    "만나는 모든 사람에게서 배우다", "경험을 통해 자신을 다듬다", "의식적인 노력으로 성장하다",
    "삶에 반응하여 진화하다", "끊임없이 탁월함을 추구하다",
    "직감을 신뢰하다", "논리로 설명할 수 없는 것을 감지하다", "자연스럽게 행간을 읽다",
    "일이 일어나기 전에 알다", "내면의 나침반을 따르다", "숨겨진 진실을 인식하다",
    "내면의 앎으로 항해하다", "상황의 에너지를 느끼다", "마음에서 결정을 내리다",
    "다른 사람들이 놓치는 기회를 감지하다", "영혼의 속삭임을 신뢰하다", "징조와 동시성을 인식하다",
    "옳다고 증명되는 직감을 따르다", "설명 없이 이해하다", "어둠 속에서 느끼며 길을 찾다",
    "더 깊은 지식에 접근하다", "육감을 존중하다", "본능이 안내하게 하다",
    "보이지 않는 연결을 인식하다", "진실이라고 느끼는 것을 신뢰하다"
];

// Japanese Traits
const traitsJa = [
    "驚くべき品格で困難を乗り越える", "逆境の中で強さを見出す", "知恵で困難な時期を成長に変える",
    "挫折を踏み台に変える", "倒れるたびにより強く立ち上がる", "障害を成長の機会として受け入れる",
    "暗闇の中でも希望を持ち続ける", "他の人が諦める時に耐え続ける", "痛みを目的に変える",
    "揺るぎない精神で嵐を乗り越える", "ゼロから自分を再建する", "勇気と決意で恐れに立ち向かう",
    "人生が試す時も揺るがない", "すべての雲に希望の光を見出す", "試練から変容して現れる",
    "傷跡を名誉の印として持つ", "挫折に定義されることを拒む", "存在すら知らなかった内なる力を発見する",
    "プレッシャーの下で成長する", "傷を知恵に変える",
    "予期しない場所で美を見出す", "想像を現実に変える", "独自の色で人生を彩る",
    "複雑な問題に創造的な解決策を見つける", "複数の媒体を通じて自己表現する", "他の人が見過ごすアイデアをつなげる",
    "古い状況に新鮮な視点をもたらす", "無から有を創造する", "鮮やかな可能性の中で夢を見る",
    "従来の境界を超えて考える", "普通を非凡に変える", "日常から物語を紡ぐ",
    "芸術家の目で世界を見る", "他の人が模倣する時に革新する", "情熱でアイデアに命を吹き込む",
    "予期しない源からインスピレーションを見つける", "混沌から美を創る", "他の人が見えない可能性を思い描く",
    "人生を創造的なキャンバスとして扱う", "論理と想像力を融合する",
    "深いレベルで他者を理解する", "世界の感情を深く感じる", "距離を超えて心をつなげる",
    "求められる前に他の人が必要とするものを感じ取る", "言葉なしに慰めを与える", "自然に他者の立場に立つ",
    "脆弱性のための安全な空間を作る", "全存在で傾聴する", "すべての人の中の人間性を認識する",
    "思いやりで分断を橋渡しする", "他者の痛みのための空間を保つ", "他者の喜びを自分のことのように祝う",
    "周囲の語られない感情を直感する", "存在だけで癒す", "理解を通じて人々を一つにする",
    "表面の先を見る", "感情の底流に応答する", "最も必要としている人を育む",
    "共感を通じて対立を変容させる", "品格を持って他者の重荷を担う",
    "すべての経験から学ぶ", "他の人が見逃すパターンを見る", "沈黙の中に意味を見出す",
    "識別力で知識を適用する", "心と精神を完璧にバランスさせる", "話す時と聴く時を知る",
    "より大きな絵を明確に見る", "先見の明で決断を下す", "タイミングと忍耐を理解する",
    "複雑さの中に真実を認識する", "混沌から知恵を蒸留する", "穏やかな洞察で他者を導く",
    "自分自身を深く知る", "変えられないものを受け入れる", "戦う価値のある戦いを選ぶ",
    "不確実性の中に平和を見出す", "変装した教訓を認識する", "理想主義と実用主義のバランスを取る",
    "地図なしでも旅を信頼する", "逆説と複雑さを受け入れる",
    "恐れずに新しい地平を求める", "興奮を持って未知を受け入れる", "大胆に自分の物語を書く",
    "未開の領域を探検する", "新しい経験にイエスと言う", "コンフォートゾーンを抜け出す",
    "旅を通じて自分を発見する", "馴染みのないものに魔法を見出す", "所有物より経験を集める",
    "人生を探検として生きる", "境界を超えて夢を追いかける", "人生を冒険に変える",
    "内なる世界と外の世界を探検する", "魂を広げるスリルを求める", "喜びを持って即興性を受け入れる",
    "動きの中に自由を見出す", "好奇心に道を導かせる", "新しい場所で驚きを発見する",
    "日常を発見に変える", "可能性の端を探検する",
    "模範を通じて他者にインスピレーションを与える", "誠実さと目的を持って導く", "人々の最善を引き出す",
    "多様なグループを共通の目標に向けて統合する", "品格を持って難しい決断を下す", "導く人々に仕える",
    "ビジョンを明確に伝える", "他者の成長を支援する", "結果に責任を持つ",
    "周囲にポジティブな変化を生む", "信じるもののために立つ", "支配せずに導く",
    "繁栄するチームを作る", "明確さで複雑さを乗り越える", "真正性で忠誠心を呼び起こす",
    "奉仕を通じて導く", "他者が繁栄する環境を作る", "自信と謙虚さのバランスを取る",
    "他者に価値を感じさせる", "他者が従う道を開く",
    "人々の間に橋を架ける", "永続的な関係を築く", "自然に人々を一つにする",
    "時間と距離を超えて絆を保つ", "真正性を持ってコミュニケーションする", "他者に見られ聞かれていると感じさせる",
    "どこへ行ってもコミュニティを育む", "見知らぬ人を友人に変える", "丁寧に関係を育む",
    "誰とでも共通点を見つける", "サポートのネットワークを編む", "他者にとって大切なことを覚えている",
    "人々のために一貫して現れる", "孤立した人に居場所を作る", "信頼で絆を強める",
    "世代と文化をつなげる", "どこでも家族を作る", "素早く意味のあるつながりを作る",
    "何年にもわたって関係を生かし続ける", "すべての交流に温かみをもたらす",
    "常に自分に誠実である", "本当の自分を表現する", "価値観に従って生きる",
    "他者のために仮面をかぶることを拒む", "独自の特性を受け入れる", "内なる真実を尊重する",
    "優しさを持って心を語る", "見せかけなしに生きる", "自分を完全に受け入れる",
    "本当の自分として現れる", "恥じることなく自分の物語を所有する", "個性を祝う",
    "行動を信念と一致させる", "内なる声を信頼する", "自分の肌の中で快適でいる",
    "勇気を持って脆弱性を表現する", "真正性のために順応を拒む", "罪悪感なしに自分のニーズを尊重する",
    "自分のすべての部分を受け入れる", "大胆に真実を生きる",
    "継続的な改善を受け入れる", "優雅に失敗から学ぶ", "すべての状況で成長を求める",
    "限界を超えて進化する", "自己省察を通じて変容する", "定期的に境界を押し広げる",
    "自己啓発に投資する", "オープンにフィードバックを歓迎する", "快適さを超えて広がる",
    "毎日より良くなる", "隠れた可能性を解き放つ", "技術の習熟を追求する",
    "能力を絶えず拡大する", "なりゆく旅を受け入れる", "挑戦的な目標を設定する",
    "出会うすべての人から学ぶ", "経験を通じて自分を磨く", "意識的な努力で成長する",
    "人生に応じて進化する", "たゆまず卓越性を追求する",
    "直感を信頼する", "論理で説明できないことを感じ取る", "自然に行間を読む",
    "物事が起こる前に知る", "内なるコンパスに従う", "隠された真実を感知する",
    "内なる知識で航海する", "状況のエネルギーを感じる", "心から決断を下す",
    "他の人が見逃す機会を感じ取る", "魂の囁きを信頼する", "兆候と同時性を認識する",
    "正しいと証明される直感に従う", "説明なしに理解する", "暗闇の中で感じながら道を見つける",
    "より深い知識にアクセスする", "第六感を尊重する", "本能に導かせる",
    "見えないつながりを感知する", "真実だと感じることを信頼する"
];

// Chinese Traits
const traitsZh = [
    "以惊人的优雅克服挑战", "在逆境中找到力量", "通过困难时期智慧地成长",
    "将挫折变为垫脚石", "每次跌倒后更强大地站起来", "将障碍视为成长的机会",
    "即使在黑暗中也保持希望", "当他人放弃时坚持不懈", "将痛苦转化为目标",
    "以坚定的精神经受风暴", "从零开始重建自己", "以勇气和决心面对恐惧",
    "当生活考验时坚定不移", "在每朵云中找到银色衬里", "从试炼中蜕变而出",
    "将伤疤视为荣誉的徽章", "拒绝被挫折定义", "发现你从未知道的内在资源",
    "在压力下茁壮成长", "将伤痛化为智慧",
    "在意想不到的地方看到美", "将想象变为现实", "用独特的颜色描绘生活",
    "为复杂问题找到创造性解决方案", "通过多种媒介表达自己", "连接他人忽视的想法",
    "为旧情况带来新鲜视角", "从无到有创造", "在生动的可能性中做梦",
    "超越传统界限思考", "将平凡变为非凡", "从日常编织故事",
    "以艺术家的眼光看世界", "当他人模仿时创新", "以热情赋予想法生命",
    "在意外的来源中找到灵感", "从混乱中创造美", "想象他人看不到的可能性",
    "将生活作为创意画布", "融合逻辑与想象力",
    "在深层理解他人", "深深感受世界的情感", "跨越距离连接心灵",
    "在他人开口前感知其需求", "无需言语给予安慰", "自然地站在他人立场",
    "为脆弱创造安全空间", "全身心倾听", "认识每个人内在的人性",
    "以同情心架起分歧的桥梁", "为他人的痛苦保留空间", "像庆祝自己一样庆祝他人的喜悦",
    "直觉周围未表达的感受", "仅凭存在就能治愈", "通过理解将人们聚集在一起",
    "看透表面", "回应情感的潜流", "照顾最需要的人",
    "通过同理心化解冲突", "优雅地分担他人的负担",
    "从每次经历中学习", "看到他人错过的模式", "在沉默中找到意义",
    "以辨别力应用知识", "完美平衡心与脑", "知道何时说话何时倾听",
    "清晰地看到更大的图景", "以远见做决定", "理解时机和耐心",
    "在复杂中识别真理", "从混乱中提炼智慧", "以温和的洞察引导他人",
    "深刻了解自己", "接受无法改变的事物", "选择值得战斗的战役",
    "在不确定中找到平静", "识别伪装的教训", "平衡理想主义与务实主义",
    "即使没有地图也信任旅程", "拥抱悖论和复杂性",
    "无畏地寻求新视野", "以兴奋拥抱未知", "大胆地书写自己的故事",
    "探索未知领域", "对新体验说是", "突破舒适区",
    "通过旅行发现自己", "在陌生中发现魔力", "收集经历而非财物",
    "将生活当作探险", "跨越边界追逐梦想", "将生活变成冒险",
    "探索内在和外在世界", "寻求扩展灵魂的刺激", "以喜悦拥抱自发性",
    "在运动中找到自由", "让好奇心引导道路", "在新地方发现奇迹",
    "将日常变为发现", "探索可能性的边缘",
    "通过榜样激励他人", "以正直和目标领导", "激发人们的最佳状态",
    "将不同群体团结向共同目标", "优雅地做出艰难决定", "服务于你所领导的人",
    "清晰传达愿景", "赋予他人成长的力量", "对结果负责",
    "在周围创造积极变化", "为信念挺身而出", "引导而不支配",
    "建立蓬勃发展的团队", "以清晰度驾驭复杂性", "以真实性激发忠诚",
    "通过服务领导", "创造他人繁荣的环境", "平衡自信与谦逊",
    "让他人感到被重视", "开辟他人追随的道路",
    "在人与人之间架起桥梁", "创造持久的关系", "自然地将人们聚集在一起",
    "跨越时间和距离保持联系", "以真诚沟通", "让他人感到被看见和被听到",
    "无论去哪里都培育社区", "将陌生人变成朋友", "精心培育关系",
    "与任何人找到共同点", "编织支持网络", "记住对他人重要的事",
    "始终如一地为人们出现", "为孤立者创造归属感", "以信任加强纽带",
    "连接世代和文化", "无论在哪里都创建家庭", "快速建立有意义的联系",
    "多年保持关系活力", "为每次互动带来温暖",
    "始终忠于自己", "表达真实的自我", "按照价值观生活",
    "拒绝为他人戴面具", "拥抱独特的个性", "尊重内心的真实",
    "以善意说出心声", "不带伪装地生活", "完全接受自己",
    "以真实的自己出现", "毫无羞愧地拥有自己的故事", "庆祝个性",
    "使行动与信念一致", "信任内心的声音", "在自己的皮肤里感到舒适",
    "勇敢地表达脆弱", "为真实拒绝顺从", "毫无愧疚地尊重自己的需求",
    "拥抱自己的所有部分", "大胆地活出真实",
    "拥抱持续改进", "优雅地从错误中学习", "在每种情况下寻求成长",
    "超越局限进化", "通过自我反思转变", "定期突破界限",
    "投资于自我发展", "开放地欢迎反馈", "超越舒适区扩展",
    "每天变得更好", "解锁隐藏的潜力", "追求技艺的精通",
    "不断扩展能力", "拥抱成为的旅程", "设定挑战性目标",
    "向遇到的每个人学习", "通过经验完善自己", "通过有意识的努力成长",
    "响应生活而进化", "不懈追求卓越",
    "信任直觉", "感知逻辑无法解释的事物", "自然地读懂言外之意",
    "在事情发生之前就知道", "跟随内心的指南针", "感知隐藏的真相",
    "以内在的知识导航", "感受情境的能量", "从心做决定",
    "感知他人错过的机会", "信任灵魂的低语", "识别征兆和同步性",
    "跟随被证明正确的直觉", "无需解释就能理解", "在黑暗中凭感觉找到路",
    "接入更深的知识", "尊重第六感", "让本能引导",
    "感知无形的联系", "信任你感觉为真的事物"
];

// Spanish Traits
const traitsEs = [
    "superar desafíos con gracia notable", "encontrar fuerza en momentos de adversidad", "crecer a través de tiempos difíciles con sabiduría",
    "transformar contratiempos en peldaños", "levantarte más fuerte después de cada caída", "aceptar obstáculos como oportunidades de crecimiento",
    "mantener la esperanza incluso en la oscuridad", "persistir cuando otros se rendirían", "convertir el dolor en propósito",
    "resistir tormentas con espíritu inquebrantable", "reconstruirte desde cero", "enfrentar miedos con coraje y determinación",
    "mantenerte firme cuando la vida te pone a prueba", "encontrar el lado positivo en cada nube", "emerger transformado de las pruebas",
    "llevar cicatrices como insignias de honor", "negarte a ser definido por los contratiempos", "descubrir recursos internos que nunca supiste que existían",
    "prosperar bajo presión", "convertir heridas en sabiduría",
    "ver belleza en lugares inesperados", "convertir la imaginación en realidad", "pintar la vida con colores únicos",
    "encontrar soluciones creativas a problemas complejos", "expresarte a través de múltiples medios", "conectar ideas que otros pasan por alto",
    "traer perspectivas frescas a situaciones antiguas", "crear algo de la nada", "soñar en posibilidades vívidas",
    "pensar fuera de los límites convencionales", "transformar lo ordinario en extraordinario", "tejer historias de momentos cotidianos",
    "ver el mundo con ojos de artista", "innovar donde otros imitan", "dar vida a ideas con pasión",
    "encontrar inspiración en fuentes inesperadas", "crear belleza del caos", "imaginar posibilidades que otros no pueden ver",
    "abordar la vida como un lienzo creativo", "fusionar lógica con imaginación",
    "comprender a otros a un nivel profundo", "sentir las emociones del mundo profundamente", "conectar corazones a través de distancias",
    "percibir lo que otros necesitan antes de que lo pidan", "ofrecer consuelo sin necesidad de palabras", "ponerte en el lugar de otros naturalmente",
    "crear espacios seguros para la vulnerabilidad", "escuchar con todo tu ser", "reconocer la humanidad en todos",
    "tender puentes con compasión", "mantener espacio para el dolor de otros", "celebrar las alegrías de otros como propias",
    "intuir los sentimientos no expresados a tu alrededor", "sanar solo con tu presencia", "unir a las personas a través del entendimiento",
    "ver más allá de las apariencias", "responder a las corrientes emocionales", "nutrir a quienes más lo necesitan",
    "transformar conflictos a través de la empatía", "cargar las cargas de otros con gracia",
    "aprender de cada experiencia", "ver patrones que otros no ven", "encontrar significado en el silencio",
    "aplicar conocimiento con discernimiento", "equilibrar corazón y mente perfectamente", "saber cuándo hablar y cuándo escuchar",
    "ver el panorama completo claramente", "tomar decisiones con previsión", "entender el tiempo y la paciencia",
    "reconocer la verdad en la complejidad", "destilar sabiduría del caos", "guiar a otros con perspicacia gentil",
    "conocerte profundamente", "aceptar lo que no se puede cambiar", "elegir batallas que vale la pena pelear",
    "encontrar paz en la incertidumbre", "reconocer lecciones disfrazadas", "equilibrar idealismo con pragmatismo",
    "confiar en el viaje incluso sin mapa", "abrazar paradojas y complejidad",
    "buscar nuevos horizontes sin miedo", "abrazar lo desconocido con entusiasmo", "escribir tu propia historia con audacia",
    "explorar territorios inexplorados", "decir sí a nuevas experiencias", "liberarte de zonas de confort",
    "descubrirte a través de viajes", "encontrar magia en lo desconocido", "coleccionar experiencias sobre posesiones",
    "vivir la vida como una expedición", "perseguir sueños más allá de fronteras", "convertir la vida en una aventura",
    "explorar mundos internos y externos", "buscar emociones que expandan tu alma", "abrazar la espontaneidad con alegría",
    "encontrar libertad en el movimiento", "dejar que la curiosidad guíe tu camino", "descubrir asombro en nuevos lugares",
    "transformar la rutina en descubrimiento", "explorar los límites de lo posible",
    "inspirar a otros con tu ejemplo", "liderar con integridad y propósito", "sacar lo mejor de las personas",
    "unir grupos diversos hacia metas comunes", "tomar decisiones difíciles con gracia", "servir a quienes lideras",
    "comunicar visión claramente", "empoderar a otros para crecer", "asumir responsabilidad por los resultados",
    "crear cambio positivo a tu alrededor", "defender lo que crees", "guiar sin dominar",
    "construir equipos que prosperan", "navegar la complejidad con claridad", "inspirar lealtad a través de autenticidad",
    "liderar a través del servicio", "crear ambientes donde otros florezcan", "equilibrar confianza con humildad",
    "hacer que otros se sientan valorados", "trazar caminos que otros siguen",
    "construir puentes entre personas", "crear relaciones duraderas", "unir personas naturalmente",
    "mantener vínculos a través del tiempo y la distancia", "comunicar con autenticidad", "hacer que otros se sientan vistos y escuchados",
    "cultivar comunidad dondequiera que vayas", "convertir extraños en amigos", "nutrir relaciones con cuidado",
    "encontrar puntos en común con cualquiera", "tejer redes de apoyo", "recordar lo que importa a otros",
    "aparecer constantemente para las personas", "crear pertenencia para los aislados", "fortalecer lazos con confianza",
    "conectar generaciones y culturas", "crear familia dondequiera que estés", "crear conexiones significativas rápidamente",
    "mantener relaciones vivas a través de años", "traer calidez a cada interacción",
    "ser siempre fiel a ti mismo", "expresar tu naturaleza genuina", "vivir según tus valores",
    "negarte a usar máscaras para otros", "abrazar tus peculiaridades únicas", "honrar tu verdad interior",
    "hablar con tu mente con amabilidad", "vivir sin pretensiones", "aceptarte completamente",
    "presentarte como tu verdadero yo", "ser dueño de tu historia sin vergüenza", "celebrar tu individualidad",
    "alinear acciones con creencias", "confiar en tu voz interior", "sentirte cómodo en tu propia piel",
    "expresar vulnerabilidad con coraje", "rechazar conformidad por autenticidad", "honrar tus necesidades sin culpa",
    "abrazar todas las partes de ti mismo", "vivir tu verdad con audacia",
    "abrazar la mejora continua", "aprender de errores con gracia", "buscar crecimiento en cada situación",
    "evolucionar más allá de tus limitaciones", "transformarte a través de la autorreflexión", "empujar límites regularmente",
    "invertir en desarrollo personal", "dar la bienvenida a comentarios abiertamente", "expandirte más allá del confort",
    "ser mejor cada día", "desbloquear potencial oculto", "perseguir maestría en tu oficio",
    "expandir tus capacidades constantemente", "abrazar el viaje de convertirte", "establecer metas que te desafíen",
    "aprender de todos los que conoces", "refinarte a través de la experiencia", "crecer con esfuerzo consciente",
    "evolucionar en respuesta a la vida", "perseguir la excelencia sin descanso",
    "confiar en tus instintos", "percibir lo que la lógica no puede explicar", "leer entre líneas naturalmente",
    "saber las cosas antes de que sucedan", "seguir tu brújula interior", "percibir verdades ocultas",
    "navegar por conocimiento interior", "sentir la energía de las situaciones", "tomar decisiones desde el corazón",
    "percibir oportunidades que otros pierden", "confiar en los susurros de tu alma", "reconocer señales y sincronicidades",
    "seguir corazonadas que resultan correctas", "entender sin explicación", "sentir tu camino a través de la oscuridad",
    "acceder a conocimiento más profundo", "honrar tu sexto sentido", "dejar que el instinto te guíe",
    "percibir las conexiones invisibles", "confiar en lo que sientes que es verdad"
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

// Korean Contexts
const contextsKo = [
    "가장 작은 순간에서 의미를 찾다", "예상치 못한 곳에서 목적을 발견하다", "평범한 날에서 중요성을 만들다",
    "삶의 더 깊은 층을 이해하다", "하는 모든 일에서 진실을 추구하다", "다른 사람들을 위해 어둠을 밝히다",
    "경험을 지혜로 변화시키다", "사랑의 유산을 쌓다", "매 순간을 소중히 여기다",
    "의도와 목적으로 살다", "자신만의 독특한 길을 찾다", "성공의 자신만의 정의를 만들다",
    "진정으로 중요한 것을 추구하다", "높은 목적과 일치하다", "삶의 소명을 발견하다",
    "더 큰 것에 기여하다", "세상을 더 나은 곳으로 만들다", "조용한 방식으로 변화를 만들다",
    "의미 있는 삶을 살다", "의미 있는 존재를 만들다",
    "가장 중요한 관계를 키우다", "선택과 사랑의 가족을 만들다", "시간을 초월하는 연결을 쌓다",
    "다른 사람들이 의지할 수 있는 사람이 되다", "어디를 가든 친절을 베풀다", "깊은 방식으로 삶을 감동시키다",
    "차이를 넘어 다리를 놓다", "주변에 조화를 만들다", "많은 사람들의 지지가 되다",
    "깊고 지속적인 유대를 키우다", "당신을 알게 된 행운을 가진 이들에게 영감을 주다", "다른 사람들을 잠재력으로 이끌다",
    "주변의 관계를 치유하다", "사람들을 하나로 모으다", "폭풍 속에서 누군가의 닻이 되다",
    "긍정의 파급 효과를 만들다", "다음 세대를 멘토링하다", "필요로 하는 이들 곁에 있다",
    "다른 사람들의 성공을 진심으로 축하하다", "모든 사람이 가치 있다고 느끼게 하다",
    "최고의 자신이 되다", "모든 경험을 통해 진화하다", "용기 있게 변화를 받아들이다",
    "삶의 각 장에서 배우다", "모든 도전과 함께 더 강해지다", "지평을 지속적으로 확장하다",
    "성찰을 통해 지혜를 개발하다", "매일 성격을 다듬다", "숨겨진 잠재력을 열다",
    "하는 모든 일에서 탁월함을 추구하다", "인지된 한계를 넘어서다", "변화를 선생님으로 환영하다",
    "장애물을 기회로 변화시키다", "자기 발견의 여정을 받아들이다", "경험을 통해 회복력을 쌓다",
    "독특한 재능을 키우다", "개인적인 진화를 존중하다", "지속적인 배움의 길을 걷다",
    "되어야 할 사람이 되다", "의식적인 노력으로 성장하다",
    "삶의 모험을 온전히 받아들이다", "매일 감사로 살다", "단순한 즐거움에서 기쁨을 찾다",
    "아름다운 추억을 만들다", "삶을 최대한 경험하다", "소중한 모든 순간을 음미하다",
    "품위 있게 삶을 춤추다", "존재 자체를 축하하다", "매일을 모험으로 만들다",
    "평범함에서 경이로움을 찾다", "열정과 목적으로 살다", "빛과 그림자 모두를 받아들이다",
    "사랑하는 삶을 만들다", "혼돈 속에서 균형을 찾다", "자신만의 독특한 방식으로 번성하다",
    "행복을 위한 자신만의 규칙을 쓰다", "진정으로 자유롭게 살다", "사과 없이 꿈을 추구하다",
    "중요한 것을 위한 공간을 만들다", "의도적인 삶을 설계하다",
    "세상을 조금 더 밝게 만들다", "인류에 긍정적인 흔적을 남기다", "바깥으로 퍼지는 변화를 만들다",
    "자신을 넘어 지속되는 것을 쌓다", "미래 세대에게 영감을 주다", "집단적 진보에 기여하다",
    "선한 힘이 되다", "마음에 가까운 대의를 옹호하다", "많은 사람을 돕는 해결책을 만들다",
    "친절함으로 기억되다", "다른 사람들이 건널 다리를 놓다", "피어나는 것을 보지 못할 씨앗을 심다",
    "지속적인 기여를 하다", "더 큰 것의 일부가 되다", "주변에 긍정적인 변화를 만들다",
    "옳은 것을 위해 일어서다", "재능을 다른 사람을 섬기는 데 사용하다", "더 나은 내일을 쌓다",
    "장소를 발견했을 때보다 더 나은 상태로 남기다", "보고 싶은 변화가 되다",
    "혼돈 속에서 내면의 평온을 유지하다", "자신 안에서 평화를 찾다", "바쁜 세상에서 고요함을 만들다",
    "바꿀 수 없는 것을 받아들이다", "현재에서 만족을 찾다", "더 이상 도움이 되지 않는 것을 놓아주다",
    "평온을 실천으로 받아들이다", "행동과 성찰의 균형을 맞추다", "항상 중심을 찾다",
    "내면의 조화를 키우다", "품위 있게 놓아주다", "고요함 속에서 힘을 찾다",
    "내면에 안식처를 만들다", "매일 수용을 실천하다", "어떤 폭풍에서도 평온을 찾다",
    "삶의 펼쳐짐을 신뢰하다", "무상함을 평화롭게 받아들이다", "놓아줌에서 자유를 찾다",
    "변화를 통해 평정을 유지하다", "진정한 본성 안에서 쉬다",
    "독특한 목소리를 표현하다", "어디를 가든 아름다움을 창조하다", "재능을 세상과 나누다",
    "아이디어에 생명을 불어넣다", "비전을 현실로 변화시키다", "다른 사람들의 창의성에 영감을 주다",
    "상상력으로 세상을 칠하다", "중요한 경험을 만들다", "의미 있는 것을 쌓다",
    "예술을 통해 진실을 표현하다", "열정과 목적으로 창조하다", "삶에 신선한 관점을 가져오다",
    "꿈을 실현하다", "내면의 세계를 나누다", "오직 당신만이 만들 수 있는 것을 창조하다",
    "형태 없는 것에 형태를 부여하다", "감정을 표현으로 번역하다", "창의성을 통해 다리를 놓다",
    "독특한 비전으로 영감을 주다", "무형을 유형으로 만들다",
    "용감하게 자신만의 길을 걷다", "진실 안에 서다", "용기로 삶에 맞서다",
    "당당하게 자신이 되다", "두려움 없이 마음을 따르다", "기대에서 벗어나다",
    "자신만의 항로를 개척하다", "자신의 조건대로 살다", "진정한 자아를 받아들이다",
    "품위 있게 한계에 도전하다", "독특한 운명을 추구하다", "개인의 여정을 존중하다",
    "가치에 충실하다", "신념에 확고히 서다", "후회 없이 살다",
    "편안함보다 용기를 선택하다", "완전히 자신의 이야기를 소유하다", "필터링된 세상에서 진실되다",
    "진실 안에서 당당히 걷다", "항상 정직하게 살다",
    "어디를 가든 사랑을 베풀다", "연민의 원천이 되다", "주변의 마음을 열다",
    "무조건적인 사랑으로 치유하다", "기대 없이 친절하다", "깊이 완전히 사랑하다",
    "모든 존재에게 연민을 보이다", "따뜻함의 등대가 되다", "온 마음으로 돌보다",
    "어려울 때도 사랑하다", "자신과 다른 사람에게 부드럽다", "자유롭고 완전히 용서하다",
    "다른 사람의 고통을 위한 공간을 만들다", "조건 없이 사랑하다", "많은 사람의 안전한 항구가 되다",
    "모든 사람에게 따뜻함을 발산하다", "다른 사람의 안녕을 깊이 걱정하다", "말보다 행동으로 사랑하다",
    "누군가의 미소의 이유가 되다", "야생화처럼 친절을 퍼뜨리다",
    "경험을 통해 얻은 지혜를 나누다", "다른 사람들이 간과하는 것을 보다", "부드러운 통찰로 안내하다",
    "삶의 더 깊은 흐름을 이해하다", "패턴과 연결을 인식하다", "필요할 때 관점을 제공하다",
    "명확성으로 복잡함을 헤쳐나가다", "소음에서 진실을 증류하다", "침묵이 가장 크게 말할 때를 알다",
    "모범을 통해 가르치다", "삶의 리듬을 이해하다", "숨겨진 진실을 인식하다",
    "정성껏 조언을 제공하다", "표면 너머를 보다", "인간 본성을 깊이 이해하다",
    "예상치 못한 곳에서 지혜를 인식하다", "모든 경험에서 배우다", "매년 더 현명해지다",
    "우아하게 배운 교훈을 나누다", "삶의 더 큰 패턴을 이해하다"
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

// Chinese Contexts
const contextsZh = [
    "在最小的时刻找到意义", "在意想不到的地方发现目标", "从平凡的日子创造重要性",
    "理解生活更深层次", "在所做的一切中寻求真理", "为他人照亮黑暗",
    "将经历转化为智慧", "建立爱的遗产", "让每一刻都有价值",
    "带着意图和目标生活", "找到自己独特的道路", "创造自己对成功的定义",
    "追求真正重要的事", "与更高的目标对齐", "发现生命的使命",
    "为更伟大的事业做贡献", "让世界变得更美好", "以安静的方式创造改变",
    "过有意义的生活", "创造有意义的存在",
    "培育最重要的关系", "创造选择和爱的家庭", "建立超越时间的联系",
    "成为他人可以依靠的人", "无论走到哪里都传播善意", "以深刻的方式感动生命",
    "跨越差异架起桥梁", "在周围创造和谐", "成为许多人的支持来源",
    "培养深厚持久的纽带", "激励有幸认识你的人", "引导他人走向潜力",
    "治愈周围的关系", "将人们聚集在一起", "在风暴中成为某人的锚",
    "创造积极的连锁反应", "指导下一代", "在需要时陪伴",
    "真诚地庆祝他人的成功", "让每个人都感到被重视",
    "成为最好的自己", "通过每一次经历进化", "勇敢地拥抱转变",
    "从生活的每一章学习", "随着每次挑战变得更强", "不断扩展视野",
    "通过反思发展智慧", "每天完善品格", "释放隐藏的潜力",
    "在所做的一切中追求卓越", "超越感知的极限", "欢迎变化作为老师",
    "将障碍转化为机会", "拥抱自我发现的旅程", "通过经历建立韧性",
    "培养独特的天赋", "尊重个人的进化", "走持续学习的道路",
    "成为注定要成为的人", "通过有意识的努力成长",
    "全心全意拥抱生活的冒险", "每天带着感恩生活", "在简单的快乐中找到喜悦",
    "创造美丽的回忆", "充分体验生活", "品味每一个珍贵的时刻",
    "优雅地舞动人生", "庆祝存在本身", "让每一天都成为冒险",
    "在平凡中发现奇迹", "带着热情和目标生活", "拥抱光明和阴影",
    "创造你热爱的生活", "在混乱中找到平衡", "以自己独特的方式蓬勃发展",
    "写下自己的幸福规则", "真实自由地生活", "毫无歉意地追求梦想",
    "为重要的事创造空间", "设计有意图的生活",
    "让世界稍微明亮一点", "在人类身上留下积极的印记", "创造向外扩散的改变",
    "建造超越自己的东西", "激励未来的世代", "为集体进步做贡献",
    "成为善的力量", "倡导内心关注的事业", "创造帮助许多人的解决方案",
    "因善良被铭记", "为他人架起可以跨越的桥梁", "种下可能看不到开花的种子",
    "做出持久的贡献", "成为更大事物的一部分", "在周围创造积极的改变",
    "为正确的事挺身而出", "用天赋服务他人", "建设更美好的明天",
    "让地方比发现时更好", "成为你希望看到的改变",
    "在混乱中保持内心平静", "在自己内心找到平和", "在忙碌的世界创造宁静",
    "接受无法改变的事", "在当下找到满足", "放下不再有用的东西",
    "将宁静作为一种实践", "平衡行动与反思", "始终找到中心",
    "培养内在和谐", "优雅地放手", "在静止中找到力量",
    "在内心创造圣所", "每天练习接受", "在任何风暴中找到平静",
    "信任生活的展开", "平和地接受无常", "在放手中找到自由",
    "在变化中保持平静", "在真实的自我中休息",
    "表达独特的声音", "无论走到哪里都创造美", "与世界分享天赋",
    "赋予想法生命", "将愿景转化为现实", "激发他人的创造力",
    "用想象力描绘世界", "创造重要的体验", "建造有意义的东西",
    "通过艺术表达真理", "带着热情和目标创造", "为生活带来新鲜视角",
    "实现梦想", "分享内心世界", "创造只有你能创造的东西",
    "赋予无形以形式", "将感情翻译为表达", "通过创造力架起桥梁",
    "以独特的愿景激励", "使无形变有形",
    "勇敢地走自己的路", "站在真实中", "勇敢地面对生活",
    "毫无歉意地做自己", "无畏地跟随内心", "从期望中解放",
    "开辟自己的航线", "按自己的条件生活", "拥抱真实的自我",
    "优雅地挑战限制", "追求独特的命运", "尊重个人的旅程",
    "忠于价值观", "坚定地站在信念中", "无悔地生活",
    "选择勇气而非舒适", "完全拥有自己的故事", "在过滤的世界中保持真实",
    "在真实中昂首行走", "始终诚实地生活",
    "无论走到哪里都传播爱", "成为同情心的源泉", "打开周围的心扉",
    "通过无条件的爱治愈", "不带期望地善良", "深深完全地爱",
    "对所有生命展示同情", "成为温暖的灯塔", "全心全意地养育",
    "即使困难也去爱", "对自己和他人温柔", "自由完全地宽恕",
    "为他人的痛苦保留空间", "无条件地爱", "成为许多人的安全港湾",
    "向每个人散发温暖", "深切关心他人的福祉", "用行动而非言语去爱",
    "成为某人微笑的理由", "像野花一样传播善意",
    "分享通过经历获得的智慧", "看到他人忽视的东西", "以温和的洞察力引导",
    "理解生活更深的潮流", "识别模式和联系", "在需要时提供视角",
    "以清晰度驾驭复杂性", "从噪音中提炼真理", "知道沉默何时说得最响",
    "通过榜样教导", "理解生活的节奏", "感知隐藏的真相",
    "谨慎地提供建议", "看透表面", "深刻理解人性",
    "在意想不到的地方识别智慧", "从每次经历中学习", "每年变得更聪明",
    "优雅地分享学到的教训", "理解生活更大的模式"
];

// Spanish Contexts
const contextsEs = [
    "encontrar significado en los momentos más pequeños", "descubrir propósito en lugares inesperados", "crear importancia de días ordinarios",
    "comprender las capas más profundas de la vida", "buscar verdad en todo lo que haces", "iluminar la oscuridad para otros",
    "transformar experiencias en sabiduría", "construir un legado de amor", "hacer que cada momento cuente",
    "vivir con intención y propósito", "encontrar tu camino único", "crear tu propia definición de éxito",
    "perseguir lo que realmente importa", "alinearte con tu propósito superior", "descubrir tu llamado en la vida",
    "contribuir a algo más grande", "dejar el mundo mejor de como lo encontraste", "hacer la diferencia de maneras silenciosas",
    "vivir una vida de significado", "crear una existencia significativa",
    "nutrir las relaciones que más importan", "crear una familia de elección y amor", "construir conexiones que trascienden el tiempo",
    "ser la persona en quien otros pueden confiar", "esparcir bondad dondequiera que vayas", "tocar vidas de maneras profundas",
    "construir puentes a través de diferencias", "crear armonía en tus círculos", "ser una fuente de apoyo para muchos",
    "cultivar lazos profundos y duraderos", "inspirar a quienes tienen la fortuna de conocerte", "guiar a otros hacia su potencial",
    "sanar relaciones a tu alrededor", "unir a las personas", "ser el ancla de alguien en las tormentas",
    "crear un efecto dominó de positividad", "ser mentor de la próxima generación", "estar presente para quienes te necesitan",
    "celebrar genuinamente los éxitos de otros", "hacer que todos se sientan valorados",
    "convertirte en la mejor versión de ti mismo", "evolucionar a través de cada experiencia", "abrazar la transformación con valentía",
    "aprender de cada capítulo de la vida", "crecer más fuerte con cada desafío", "expandir tus horizontes continuamente",
    "desarrollar sabiduría a través de la reflexión", "refinar tu carácter diariamente", "desbloquear tu potencial oculto",
    "perseguir excelencia en todo lo que haces", "superar tus límites percibidos", "dar la bienvenida al cambio como maestro",
    "transformar obstáculos en oportunidades", "abrazar el viaje del autodescubrimiento", "construir resiliencia a través de la experiencia",
    "cultivar tus dones únicos", "honrar tu evolución personal", "caminar el sendero del aprendizaje continuo",
    "convertirte en quien estabas destinado a ser", "crecer a través del esfuerzo consciente",
    "abrazar las aventuras de la vida de todo corazón", "vivir cada día con gratitud", "encontrar alegría en placeres simples",
    "crear recuerdos hermosos", "experimentar la vida al máximo", "saborear cada momento precioso",
    "bailar por la vida con gracia", "celebrar la existencia misma", "hacer de cada día una aventura",
    "encontrar asombro en lo ordinario", "vivir con pasión y propósito", "abrazar tanto la luz como la sombra",
    "crear una vida que ames", "encontrar equilibrio en el caos", "prosperar a tu manera única",
    "escribir tus propias reglas para la felicidad", "vivir auténtica y libremente", "perseguir sueños sin disculpas",
    "crear espacio para lo que importa", "diseñar una vida de intención",
    "hacer el mundo un poco más brillante", "dejar una marca positiva en la humanidad", "crear cambio que se expande hacia afuera",
    "construir algo que te sobreviva", "inspirar a futuras generaciones", "contribuir al progreso colectivo",
    "ser una fuerza del bien", "defender causas cercanas a tu corazón", "crear soluciones que ayuden a muchos",
    "ser recordado por la bondad", "construir puentes para que otros crucen", "plantar semillas que quizás nunca veas florecer",
    "hacer contribuciones duraderas", "ser parte de algo más grande", "crear cambio positivo a tu alrededor",
    "defender lo que es correcto", "usar tus dones para servir a otros", "construir un mejor mañana",
    "dejar lugares mejor de como los encontraste", "ser el cambio que deseas ver",
    "mantener calma interior en medio del caos", "encontrar paz dentro de ti", "crear quietud en un mundo ocupado",
    "aceptar lo que no puede cambiarse", "encontrar contentamiento en el presente", "soltar lo que ya no te sirve",
    "abrazar la serenidad como práctica", "equilibrar acción con reflexión", "encontrar siempre tu centro",
    "cultivar armonía interior", "soltar con gracia", "encontrar fuerza en la quietud",
    "crear santuario dentro", "practicar aceptación diariamente", "encontrar calma en cualquier tormenta",
    "confiar en el desenvolvimiento de la vida", "abrazar la impermanencia pacíficamente", "encontrar libertad en soltar",
    "mantener ecuanimidad a través del cambio", "descansar en tu verdadera naturaleza",
    "expresar tu voz única", "crear belleza dondequiera que vayas", "compartir tus dones con el mundo",
    "dar vida a ideas", "transformar visión en realidad", "inspirar creatividad en otros",
    "pintar tu mundo con imaginación", "crear experiencias que importan", "construir algo significativo",
    "expresar verdad a través del arte", "crear con pasión y propósito", "traer perspectivas frescas a la vida",
    "manifestar tus sueños", "compartir tu mundo interior", "crear lo que solo tú puedes crear",
    "dar forma a lo informe", "traducir sentimientos en expresión", "construir puentes a través de la creatividad",
    "inspirar a través de tu visión única", "hacer lo intangible tangible",
    "caminar tu propio camino con valentía", "pararte en tu verdad", "enfrentar la vida con coraje",
    "ser tú mismo sin disculpas", "seguir tu corazón sin miedo", "liberarte de expectativas",
    "trazar tu propio curso", "vivir en tus propios términos", "abrazar tu yo auténtico",
    "desafiar limitaciones con gracia", "perseguir tu destino único", "honrar tu viaje individual",
    "ser fiel a tus valores", "mantenerte firme en tus creencias", "vivir sin arrepentimiento",
    "elegir coraje sobre comodidad", "ser dueño de tu historia completamente", "ser real en un mundo filtrado",
    "caminar alto en tu verdad", "vivir siempre con integridad",
    "esparcir amor dondequiera que vayas", "ser una fuente de compasión", "abrir corazones a tu alrededor",
    "sanar a través del amor incondicional", "ser amable sin expectativa", "amar profunda y completamente",
    "mostrar compasión a todos los seres", "ser un faro de calidez", "nutrir con todo tu corazón",
    "amar incluso cuando es difícil", "ser gentil contigo mismo y otros", "perdonar libre y completamente",
    "mantener espacio para el dolor de otros", "amar sin condiciones", "ser un puerto seguro para muchos",
    "irradiar calidez a todos", "preocuparte profundamente por el bienestar de otros", "amar a través de acciones más que palabras",
    "ser la razón de la sonrisa de alguien", "esparcir bondad como flores silvestres",
    "compartir sabiduría ganada a través de la experiencia", "ver lo que otros pasan por alto", "guiar con perspicacia gentil",
    "comprender las corrientes más profundas de la vida", "reconocer patrones y conexiones", "ofrecer perspectiva cuando se necesita",
    "navegar complejidad con claridad", "destilar verdad del ruido", "saber cuándo el silencio habla más fuerte",
    "enseñar a través de tu ejemplo", "comprender el ritmo de la vida", "percibir verdades ocultas",
    "ofrecer consejo con cuidado", "ver más allá de apariencias superficiales", "comprender la naturaleza humana profundamente",
    "reconocer sabiduría en lugares inesperados", "aprender de cada experiencia", "crecer más sabio con cada año",
    "compartir lecciones aprendidas con gracia", "comprender los patrones más grandes de la vida"
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
 * Remove trailing "-다" from Korean verb forms to get the stem
 * @param {string} text - Korean text ending in "-다"
 * @returns {string} - Verb stem without "-다"
 */
function removeKoreanVerbEnding(text) {
    if (text && text.endsWith('다')) {
        return text.slice(0, -1);
    }
    return text;
}

/**
 * Remove trailing "る" from Japanese verb forms to get the stem (for ru-verbs)
 * @param {string} text - Japanese text ending in "る"
 * @returns {string} - Verb stem without "る"
 */
function removeJapaneseVerbEnding(text) {
    if (text && text.endsWith('る')) {
        return text.slice(0, -1);
    }
    return text;
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

    // Get trait and context
    let trait = selectedTraits[traitIndex];
    let context = selectedContexts[contextIndex];

    // For Korean, remove the "-다" ending to allow proper conjugation in templates
    if (lang === 'ko') {
        trait = removeKoreanVerbEnding(trait);
        context = removeKoreanVerbEnding(context);
    }
    // For Japanese, remove the "る" ending to allow proper conjugation in templates
    else if (lang === 'ja') {
        trait = removeJapaneseVerbEnding(trait);
        context = removeJapaneseVerbEnding(context);
    }

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
