/**
 * Soul Type System - 12 Unique Soul Types
 * SmartAITest.com Stage 2
 */

const SOUL_TYPES = [
  {
    id: "flame-fox",
    nameEn: "Flame Fox",
    nameKo: "플레임 폭스",
    nameJa: "フレイムフォックス",
    nameZh: "烈焰狐",
    nameEs: "Zorro de Fuego",
    emoji: "🦊🔥",
    slogan: {
      ko: "날카로운 직관과 뜨거운 열정의 소유자",
      en: "Master of sharp intuition and burning passion",
      ja: "鋭い直感と燃える情熱の持ち主",
      zh: "敏锐直觉与燃烧热情的主人",
      es: "Dueño de aguda intuición y ardiente pasión"
    },
    description: {
      ko: "당신은 타고난 직관력으로 상황을 꿰뚫어 보며, 한번 시작한 일에는 불꽃처럼 뜨거운 열정을 쏟아붓습니다. 주변 사람들은 당신의 에너지와 통찰력에 자주 놀라곤 합니다.",
      en: "You possess an innate ability to see through situations, and pour fiery passion into everything you start. People around you are often amazed by your energy and insight.",
      ja: "あなたは生まれつきの直感力で状況を見抜き、一度始めたことには炎のような情熱を注ぎます。周りの人々はあなたのエネルギーと洞察力によく驚きます。",
      zh: "你拥有与生俱来的直觉力，能洞察情况，并对开始的每一件事倾注火焰般的热情。周围的人常常被你的能量和洞察力所惊叹。",
      es: "Posees una capacidad innata para ver a través de las situaciones, y viertes una pasión ardiente en todo lo que comienzas. La gente a tu alrededor a menudo se sorprende por tu energía y perspicacia."
    },
    rarity: 7,
    traits: { intuition: 92, passion: 88, empathy: 52, logic: 63, creativity: 85 },
    color: "#FF6B35",
    gradient: "from-orange-400 to-red-500"
  },
  {
    id: "diamond-lion",
    nameEn: "Diamond Lion",
    nameKo: "다이아몬드 라이온",
    nameJa: "ダイヤモンドライオン",
    nameZh: "钻石狮王",
    nameEs: "León de Diamante",
    emoji: "🦁💎",
    slogan: {
      ko: "변함없는 충성심과 빛나는 리더십",
      en: "Unwavering loyalty and radiant leadership",
      ja: "変わらぬ忠誠心と輝くリーダーシップ",
      zh: "坚定不移的忠诚与闪耀的领导力",
      es: "Lealtad inquebrantable y liderazgo radiante"
    },
    description: {
      ko: "당신은 흔들리지 않는 신념과 카리스마로 주변 사람들에게 영감을 줍니다. 어려운 상황에서도 빛나는 리더십을 발휘하며, 한번 맺은 인연은 끝까지 소중히 여깁니다.",
      en: "You inspire those around you with unshakeable conviction and charisma. You demonstrate brilliant leadership even in difficult situations, and treasure every connection you make.",
      ja: "あなたは揺るぎない信念とカリスマで周りの人々にインスピレーションを与えます。困難な状況でも輝くリーダーシップを発揮し、一度結んだ縁は最後まで大切にします。",
      zh: "你以坚定的信念和魅力激励周围的人。即使在困难的情况下也能展现出闪耀的领导力，并珍惜每一段缘分。",
      es: "Inspiras a quienes te rodean con convicción inquebrantable y carisma. Demuestras un liderazgo brillante incluso en situaciones difíciles, y valoras cada conexión que haces."
    },
    rarity: 5,
    traits: { intuition: 65, passion: 78, empathy: 72, logic: 70, creativity: 60 },
    color: "#FFD700",
    gradient: "from-yellow-400 to-amber-500"
  },
  {
    id: "ocean-bear",
    nameEn: "Ocean Bear",
    nameKo: "오션 베어",
    nameJa: "オーシャンベア",
    nameZh: "海洋熊",
    nameEs: "Oso del Océano",
    emoji: "🐻🌊",
    slogan: {
      ko: "깊은 포용력과 잔잔한 안정감",
      en: "Deep embrace and calm stability",
      ja: "深い包容力と穏やかな安定感",
      zh: "深厚的包容力与平静的安定感",
      es: "Abrazo profundo y estabilidad serena"
    },
    description: {
      ko: "당신은 바다처럼 깊은 마음으로 주변 사람들을 포용합니다. 어떤 상황에서도 흔들리지 않는 안정감으로 모두에게 편안한 쉼터가 되어줍니다.",
      en: "You embrace those around you with a heart as deep as the ocean. With stability that never wavers, you become a comfortable haven for everyone.",
      ja: "あなたは海のように深い心で周りの人々を包み込みます。どんな状況でも揺るがない安定感で、皆にとって居心地の良い安らぎの場所となります。",
      zh: "你以如海洋般深沉的心包容周围的人。以从不动摇的稳定感，成为每个人舒适的避风港。",
      es: "Abrazas a quienes te rodean con un corazón tan profundo como el océano. Con una estabilidad que nunca vacila, te conviertes en un refugio cómodo para todos."
    },
    rarity: 12,
    traits: { intuition: 58, passion: 45, empathy: 95, logic: 68, creativity: 52 },
    color: "#4A90D9",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    id: "crystal-butterfly",
    nameEn: "Crystal Butterfly",
    nameKo: "크리스탈 버터플라이",
    nameJa: "クリスタルバタフライ",
    nameZh: "水晶蝴蝶",
    nameEs: "Mariposa de Cristal",
    emoji: "🦋✨",
    slogan: {
      ko: "섬세한 감성과 아름다운 변화",
      en: "Delicate sensitivity and beautiful transformation",
      ja: "繊細な感性と美しい変化",
      zh: "细腻的感性与美丽的蜕变",
      es: "Sensibilidad delicada y hermosa transformación"
    },
    description: {
      ko: "당신은 섬세한 감각으로 세상의 아름다움을 발견하며, 끊임없이 변화하고 성장합니다. 당신의 존재 자체가 주변을 환하게 밝히는 빛이 됩니다.",
      en: "You discover the beauty of the world with delicate senses, constantly changing and growing. Your very existence becomes a light that brightens everything around you.",
      ja: "あなたは繊細な感覚で世界の美しさを発見し、絶えず変化し成長します。あなたの存在そのものが周りを明るく照らす光となります。",
      zh: "你以细腻的感觉发现世界的美丽，不断变化和成长。你的存在本身就是照亮周围一切的光。",
      es: "Descubres la belleza del mundo con sentidos delicados, cambiando y creciendo constantemente. Tu existencia misma se convierte en una luz que ilumina todo a tu alrededor."
    },
    rarity: 8,
    traits: { intuition: 75, passion: 62, empathy: 88, logic: 42, creativity: 95 },
    color: "#E066FF",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    id: "storm-eagle",
    nameEn: "Storm Eagle",
    nameKo: "스톰 이글",
    nameJa: "ストームイーグル",
    nameZh: "风暴鹰",
    nameEs: "Águila de Tormenta",
    emoji: "🦅⚡",
    slogan: {
      ko: "대담한 도전과 날카로운 통찰력",
      en: "Bold challenge and sharp insight",
      ja: "大胆な挑戦と鋭い洞察力",
      zh: "大胆的挑战与锐利的洞察力",
      es: "Desafío audaz y perspicacia aguda"
    },
    description: {
      ko: "당신은 폭풍 속에서도 흔들리지 않는 대담함으로 새로운 도전을 두려워하지 않습니다. 높은 곳에서 내려다보는 독수리처럼 상황을 꿰뚫어 봅니다.",
      en: "You fear no new challenge with boldness that remains steady even in storms. Like an eagle looking down from high above, you see through every situation.",
      ja: "あなたは嵐の中でも揺るがない大胆さで新しい挑戦を恐れません。高いところから見下ろす鷲のように、状況を見通します。",
      zh: "你以在风暴中也不动摇的大胆，不惧任何新挑战。像从高处俯瞰的雄鹰一样，洞察每一个情况。",
      es: "No temes ningún nuevo desafío con una audacia que permanece firme incluso en tormentas. Como un águila mirando desde lo alto, ves a través de cada situación."
    },
    rarity: 6,
    traits: { intuition: 85, passion: 82, empathy: 48, logic: 78, creativity: 70 },
    color: "#4169E1",
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    id: "moonlit-wolf",
    nameEn: "Moonlit Wolf",
    nameKo: "문릿 울프",
    nameJa: "ムーンリットウルフ",
    nameZh: "月光狼",
    nameEs: "Lobo de Luna",
    emoji: "🐺🌙",
    slogan: {
      ko: "신비로운 지혜와 깊은 유대감",
      en: "Mysterious wisdom and deep bonds",
      ja: "神秘的な知恵と深い絆",
      zh: "神秘的智慧与深厚的羁绊",
      es: "Sabiduría misteriosa y lazos profundos"
    },
    description: {
      ko: "당신은 달빛 아래 빛나는 신비로운 지혜를 품고 있으며, 소중한 사람들과 깊은 유대감을 형성합니다. 혼자만의 시간도 소중히 여기며 내면의 힘을 키워갑니다.",
      en: "You hold mysterious wisdom that shines under the moonlight, forming deep bonds with those dear to you. You treasure time alone to cultivate your inner strength.",
      ja: "あなたは月明かりの下で輝く神秘的な知恵を持ち、大切な人々と深い絆を形成します。一人の時間も大切にし、内なる力を育てていきます。",
      zh: "你拥有在月光下闪耀的神秘智慧，与珍视的人建立深厚的羁绊。你珍惜独处的时光，培养内心的力量。",
      es: "Posees una sabiduría misteriosa que brilla bajo la luz de la luna, formando lazos profundos con quienes aprecias. Valoras el tiempo a solas para cultivar tu fuerza interior."
    },
    rarity: 9,
    traits: { intuition: 90, passion: 55, empathy: 78, logic: 72, creativity: 68 },
    color: "#7B68EE",
    gradient: "from-violet-500 to-indigo-600"
  },
  {
    id: "golden-phoenix",
    nameEn: "Golden Phoenix",
    nameKo: "골든 피닉스",
    nameJa: "ゴールデンフェニックス",
    nameZh: "金凤凰",
    nameEs: "Fénix Dorado",
    emoji: "🔥🏆",
    slogan: {
      ko: "불굴의 회복력과 화려한 재탄생",
      en: "Indomitable resilience and glorious rebirth",
      ja: "不屈の回復力と華やかな再生",
      zh: "不屈的恢复力与华丽的重生",
      es: "Resiliencia indomable y renacimiento glorioso"
    },
    description: {
      ko: "당신은 어떤 어려움도 이겨내고 더욱 강하게 일어서는 불굴의 정신을 가졌습니다. 실패를 두려워하지 않으며, 매번 더 빛나는 모습으로 다시 태어납니다.",
      en: "You possess an indomitable spirit that overcomes any difficulty and rises stronger. You fear no failure, and are reborn more radiant each time.",
      ja: "あなたはどんな困難も乗り越え、より強く立ち上がる不屈の精神を持っています。失敗を恐れず、毎回より輝く姿で生まれ変わります。",
      zh: "你拥有克服任何困难、更加坚强站起来的不屈精神。你不惧失败，每次都以更加闪耀的姿态重生。",
      es: "Posees un espíritu indomable que supera cualquier dificultad y se levanta más fuerte. No temes al fracaso, y renaces más radiante cada vez."
    },
    rarity: 4,
    traits: { intuition: 72, passion: 95, empathy: 60, logic: 65, creativity: 88 },
    color: "#FF4500",
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: "jade-turtle",
    nameEn: "Jade Turtle",
    nameKo: "제이드 터틀",
    nameJa: "ジェイドタートル",
    nameZh: "翡翠龟",
    nameEs: "Tortuga de Jade",
    emoji: "🐢💚",
    slogan: {
      ko: "깊은 지혜와 꾸준한 성장",
      en: "Deep wisdom and steady growth",
      ja: "深い知恵と着実な成長",
      zh: "深邃的智慧与稳健的成长",
      es: "Sabiduría profunda y crecimiento constante"
    },
    description: {
      ko: "당신은 서두르지 않고 꾸준히 나아가며, 시간이 지날수록 더욱 깊어지는 지혜를 가졌습니다. 조용하지만 확실한 방식으로 목표를 향해 전진합니다.",
      en: "You move steadily without rushing, possessing wisdom that deepens with time. You advance toward your goals in a quiet but certain manner.",
      ja: "あなたは急がず着実に前進し、時間とともにより深まる知恵を持っています。静かだが確実な方法で目標に向かって進みます。",
      zh: "你不急不躁稳步前进，拥有随时间沉淀的智慧。以安静但确定的方式向目标前进。",
      es: "Avanzas firmemente sin prisa, poseyendo una sabiduría que se profundiza con el tiempo. Avanzas hacia tus metas de manera tranquila pero segura."
    },
    rarity: 10,
    traits: { intuition: 68, passion: 45, empathy: 75, logic: 92, creativity: 55 },
    color: "#50C878",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "silver-swan",
    nameEn: "Silver Swan",
    nameKo: "실버 스완",
    nameJa: "シルバースワン",
    nameZh: "银天鹅",
    nameEs: "Cisne de Plata",
    emoji: "🦢✨",
    slogan: {
      ko: "우아한 품격과 내면의 힘",
      en: "Elegant grace and inner strength",
      ja: "優雅な品格と内なる力",
      zh: "优雅的气质与内在的力量",
      es: "Gracia elegante y fuerza interior"
    },
    description: {
      ko: "당신은 겉으로는 우아하고 차분하지만, 내면에는 강인한 힘을 품고 있습니다. 어떤 상황에서도 품위를 잃지 않으며, 조용히 자신만의 길을 걸어갑니다.",
      en: "You appear elegant and calm on the outside, but hold strong power within. You never lose your dignity in any situation, quietly walking your own path.",
      ja: "あなたは外見は優雅で落ち着いていますが、内面には強い力を秘めています。どんな状況でも品位を失わず、静かに自分だけの道を歩みます。",
      zh: "你外表优雅沉稳，但内心蕴藏着强大的力量。在任何情况下都不失风度，静静地走着自己的路。",
      es: "Pareces elegante y calmado por fuera, pero guardas un poder fuerte en tu interior. Nunca pierdes tu dignidad en ninguna situación, caminando tranquilamente tu propio camino."
    },
    rarity: 6,
    traits: { intuition: 70, passion: 52, empathy: 82, logic: 75, creativity: 78 },
    color: "#C0C0C0",
    gradient: "from-slate-300 to-gray-500"
  },
  {
    id: "cosmic-owl",
    nameEn: "Cosmic Owl",
    nameKo: "코스믹 아울",
    nameJa: "コズミックアウル",
    nameZh: "宇宙猫头鹰",
    nameEs: "Búho Cósmico",
    emoji: "🦉🌌",
    slogan: {
      ko: "무한한 호기심과 심오한 통찰",
      en: "Infinite curiosity and profound insight",
      ja: "無限の好奇心と深遠な洞察",
      zh: "无限的好奇心与深邃的洞察",
      es: "Curiosidad infinita y perspicacia profunda"
    },
    description: {
      ko: "당신은 밤하늘의 별처럼 무한한 호기심으로 세상을 탐구합니다. 다른 사람들이 놓치는 것들을 발견하며, 깊은 통찰력으로 진실을 꿰뚫어 봅니다.",
      en: "You explore the world with infinite curiosity like the stars in the night sky. You discover what others miss, and see through to the truth with deep insight.",
      ja: "あなたは夜空の星のような無限の好奇心で世界を探求します。他の人が見逃すものを発見し、深い洞察力で真実を見抜きます。",
      zh: "你以如夜空中星星般的无限好奇心探索世界。发现别人忽略的东西，以深邃的洞察力看透真相。",
      es: "Exploras el mundo con curiosidad infinita como las estrellas en el cielo nocturno. Descubres lo que otros pasan por alto, y ves la verdad con profunda perspicacia."
    },
    rarity: 8,
    traits: { intuition: 95, passion: 58, empathy: 62, logic: 88, creativity: 82 },
    color: "#191970",
    gradient: "from-indigo-600 to-purple-700"
  },
  {
    id: "rainbow-dolphin",
    nameEn: "Rainbow Dolphin",
    nameKo: "레인보우 돌핀",
    nameJa: "レインボードルフィン",
    nameZh: "彩虹海豚",
    nameEs: "Delfín Arcoíris",
    emoji: "🐬🌈",
    slogan: {
      ko: "밝은 에너지와 자유로운 영혼",
      en: "Bright energy and free spirit",
      ja: "明るいエネルギーと自由な魂",
      zh: "明亮的能量与自由的灵魂",
      es: "Energía brillante y espíritu libre"
    },
    description: {
      ko: "당신은 태양처럼 밝은 에너지로 주변을 환하게 만들며, 자유로운 영혼으로 삶을 즐깁니다. 어디서든 즐거움을 찾고, 그 기쁨을 주변과 나눕니다.",
      en: "You brighten your surroundings with energy like the sun, enjoying life with a free spirit. You find joy everywhere and share that happiness with others.",
      ja: "あなたは太陽のような明るいエネルギーで周りを明るくし、自由な魂で人生を楽しみます。どこでも楽しみを見つけ、その喜びを周りと分かち合います。",
      zh: "你以如太阳般明亮的能量照亮周围，以自由的灵魂享受生活。到处寻找快乐，并与他人分享这份喜悦。",
      es: "Iluminas tu entorno con energía como el sol, disfrutando de la vida con un espíritu libre. Encuentras alegría en todas partes y compartes esa felicidad con otros."
    },
    rarity: 11,
    traits: { intuition: 62, passion: 85, empathy: 90, logic: 48, creativity: 88 },
    color: "#00CED1",
    gradient: "from-cyan-400 to-teal-500"
  },
  {
    id: "shadow-panther",
    nameEn: "Shadow Panther",
    nameKo: "섀도우 팬서",
    nameJa: "シャドウパンサー",
    nameZh: "暗影豹",
    nameEs: "Pantera de Sombra",
    emoji: "🐆🌑",
    slogan: {
      ko: "강렬한 카리스마와 은밀한 힘",
      en: "Intense charisma and hidden power",
      ja: "強烈なカリスマと秘められた力",
      zh: "强烈的魅力与隐藏的力量",
      es: "Carisma intenso y poder oculto"
    },
    description: {
      ko: "당신은 말없이도 존재감을 드러내는 강렬한 카리스마를 가졌습니다. 겉으로 드러내지 않는 은밀한 힘으로 상황을 주도하며, 필요할 때 놀라운 능력을 발휘합니다.",
      en: "You possess an intense charisma that commands attention even without words. You lead situations with hidden power, revealing surprising abilities when needed.",
      ja: "あなたは言葉なしでも存在感を示す強烈なカリスマを持っています。表に出さない秘められた力で状況を主導し、必要な時に驚くべき能力を発揮します。",
      zh: "你拥有即使不言语也能展现存在感的强烈魅力。以不外露的隐藏力量主导局势，在需要时展现惊人的能力。",
      es: "Posees un carisma intenso que llama la atención incluso sin palabras. Diriges las situaciones con poder oculto, revelando habilidades sorprendentes cuando es necesario."
    },
    rarity: 5,
    traits: { intuition: 78, passion: 72, empathy: 55, logic: 80, creativity: 75 },
    color: "#2F2F2F",
    gradient: "from-gray-700 to-slate-900"
  }
];

// Trait labels for multi-language support
const TRAIT_LABELS = {
  intuition: { ko: "직관력", en: "Intuition", ja: "直感力", zh: "直觉力", es: "Intuición" },
  passion: { ko: "열정", en: "Passion", ja: "情熱", zh: "热情", es: "Pasión" },
  empathy: { ko: "공감력", en: "Empathy", ja: "共感力", zh: "共情力", es: "Empatía" },
  logic: { ko: "논리력", en: "Logic", ja: "論理力", zh: "逻辑力", es: "Lógica" },
  creativity: { ko: "창의력", en: "Creativity", ja: "創造力", zh: "创造力", es: "Creatividad" }
};

// Rarity tier labels
const RARITY_TIERS = {
  ko: { legendary: "레전더리", epic: "에픽", rare: "레어", common: "커먼" },
  en: { legendary: "Legendary", epic: "Epic", rare: "Rare", common: "Common" },
  ja: { legendary: "レジェンダリー", epic: "エピック", rare: "レア", common: "コモン" },
  zh: { legendary: "传奇", epic: "史诗", rare: "稀有", common: "普通" },
  es: { legendary: "Legendario", epic: "Épico", rare: "Raro", common: "Común" }
};

/**
 * Get soul type by ID
 * @param {string} id - Soul type ID
 * @returns {Object|null} Soul type data or null
 */
function getSoulTypeById(id) {
  return SOUL_TYPES.find(type => type.id === id) || null;
}

/**
 * Get soul type from birthday hash
 * @param {string} birthday - Birthday string (YYYY-MM-DD)
 * @returns {Object} Soul type data
 */
function getSoulTypeFromBirthday(birthday) {
  const hash = hashBirthday(birthday);
  const index = hash % SOUL_TYPES.length;
  return SOUL_TYPES[index];
}

/**
 * Simple hash function for birthday
 * @param {string} birthday - Birthday string
 * @returns {number} Hash value
 */
function hashBirthday(birthday) {
  let hash = 0;
  const str = birthday.replace(/-/g, '');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get rarity tier from percentage
 * @param {number} rarity - Rarity percentage (lower = rarer)
 * @returns {string} Tier name
 */
function getRarityTier(rarity) {
  if (rarity <= 5) return 'legendary';
  if (rarity <= 8) return 'epic';
  if (rarity <= 11) return 'rare';
  return 'common';
}

/**
 * Get trait label by language
 * @param {string} trait - Trait key
 * @param {string} lang - Language code
 * @returns {string} Localized trait label
 */
function getTraitLabel(trait, lang = 'ko') {
  return TRAIT_LABELS[trait]?.[lang] || TRAIT_LABELS[trait]?.en || trait;
}

/**
 * Get rarity tier label by language
 * @param {string} tier - Tier key
 * @param {string} lang - Language code
 * @returns {string} Localized tier label
 */
function getRarityTierLabel(tier, lang = 'ko') {
  return RARITY_TIERS[lang]?.[tier] || RARITY_TIERS.en[tier] || tier;
}

/**
 * Get soul type name by language
 * @param {Object} soulType - Soul type data
 * @param {string} lang - Language code
 * @returns {string} Localized name
 */
function getSoulTypeName(soulType, lang = 'ko') {
  const nameKey = `name${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
  return soulType[nameKey] || soulType.nameEn;
}

/**
 * Get soul type slogan by language
 * @param {Object} soulType - Soul type data
 * @param {string} lang - Language code
 * @returns {string} Localized slogan
 */
function getSoulTypeSlogan(soulType, lang = 'ko') {
  return soulType.slogan[lang] || soulType.slogan.en;
}

/**
 * Get soul type description by language
 * @param {Object} soulType - Soul type data
 * @param {string} lang - Language code
 * @returns {string} Localized description
 */
function getSoulTypeDescription(soulType, lang = 'ko') {
  return soulType.description[lang] || soulType.description.en;
}

/**
 * Get all soul types
 * @returns {Array} All soul types
 */
function getAllSoulTypes() {
  return SOUL_TYPES;
}

/**
 * Calculate compatibility between two soul types
 * @param {Object} type1 - First soul type
 * @param {Object} type2 - Second soul type
 * @returns {Object} Compatibility data
 */
function calculateSoulCompatibility(type1, type2) {
  const traits1 = type1.traits;
  const traits2 = type2.traits;

  // Calculate category scores
  const categories = {
    passion: Math.round((traits1.passion + traits2.passion) / 2),
    communication: Math.round((traits1.empathy + traits2.empathy) / 2),
    trust: Math.round((traits1.logic + traits2.logic) / 2),
    creativity: Math.round((traits1.creativity + traits2.creativity) / 2),
    intuition: Math.round((traits1.intuition + traits2.intuition) / 2)
  };

  // Calculate overall compatibility (weighted average + complementary bonus)
  const avgScore = Object.values(categories).reduce((a, b) => a + b, 0) / 5;

  // Bonus for complementary traits
  const complementaryBonus = Math.abs(traits1.intuition - traits2.intuition) < 30 ? 5 : 0;
  const balanceBonus = Math.abs(traits1.empathy - traits2.logic) < 20 ? 5 : 0;

  const overall = Math.min(99, Math.round(avgScore + complementaryBonus + balanceBonus));

  return {
    overall,
    categories,
    type1,
    type2
  };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SOUL_TYPES,
    TRAIT_LABELS,
    RARITY_TIERS,
    getSoulTypeById,
    getSoulTypeFromBirthday,
    hashBirthday,
    getRarityTier,
    getTraitLabel,
    getRarityTierLabel,
    getSoulTypeName,
    getSoulTypeSlogan,
    getSoulTypeDescription,
    getAllSoulTypes,
    calculateSoulCompatibility
  };
}
