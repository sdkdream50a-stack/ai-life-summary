/**
 * Community Data Management
 * Sample posts and localStorage management for community feed
 * Multilingual support: ko, en, ja, zh, es
 */

// Sample names by language
const SAMPLE_NAMES = {
  ko: [
    '별빛여행자', '달빛소울', '햇살가득', '바람돌이', '구름위산책',
    '꿈꾸는나무', '숲속요정', '하늘정원', '무지개빛', '반짝별',
    '고양이사랑', '강아지맘', '행복나무', '따뜻한봄', '시원한바람',
    '별똥별', '은하수여행', '달콤한꿈', '푸른하늘', '노을빛',
    '소울탐험가', '테스트러버', '궁합매니아', '일일챌린저', '스트릭마스터'
  ],
  en: [
    'StarTraveler', 'MoonlightSoul', 'SunshineVibes', 'WindWalker', 'CloudDreamer',
    'DreamTree', 'ForestSpirit', 'SkyGarden', 'RainbowLight', 'TwinkleStar',
    'CatLover', 'PuppyMom', 'HappyTree', 'WarmSpring', 'CoolBreeze',
    'ShootingStar', 'GalaxyTrip', 'SweetDream', 'BlueSky', 'SunsetGlow',
    'SoulExplorer', 'TestLover', 'MatchMaster', 'DailyChallenger', 'StreakKing'
  ],
  ja: [
    '星旅人', '月光ソウル', '陽光いっぱい', '風の子', '雲の上散歩',
    '夢見る木', '森の妖精', '空の庭', '虹色', 'キラキラ星',
    '猫好き', 'わんこママ', '幸せの木', '暖かい春', '涼しい風',
    '流れ星', '銀河旅行', '甘い夢', '青空', '夕焼け',
    'ソウル探検家', 'テスト好き', '相性マニア', 'デイリー挑戦者', 'ストリークマスター'
  ],
  zh: [
    '星光旅者', '月光灵魂', '阳光满溢', '风之子', '云上漫步',
    '梦想树', '森林精灵', '天空花园', '彩虹光', '闪亮星',
    '爱猫人', '狗狗妈妈', '幸福树', '温暖春天', '凉爽微风',
    '流星', '银河之旅', '甜蜜梦', '蓝天', '晚霞',
    '灵魂探索者', '测试爱好者', '配对达人', '日常挑战者', '连续大师'
  ],
  es: [
    'ViajeroDeLasEstrellas', 'AlmaLunar', 'LuzDelSol', 'CaminanteDelViento', 'SoñadorDeNubes',
    'ÁrbolDeSueños', 'EspírituDelBosque', 'JardínDelCielo', 'LuzArcoíris', 'EstrellaFugaz',
    'AmanteDeLosGatos', 'MamáPerro', 'ÁrbolFeliz', 'PrimaveraCálida', 'BrisaFresca',
    'EstrellaFugaz', 'ViajeGaláctico', 'DulceSueño', 'CieloAzul', 'ResplandorDelAtardecer',
    'ExploradorDeAlmas', 'AmanteDePruebas', 'MaestroDeCompatibilidad', 'RetadorDiario', 'MaestroDeRacha'
  ]
};

// Sample post contents by type and language
const SAMPLE_CONTENTS_BY_TYPE = {
  ko: {
    'flame-fox': [
      '오늘 직감을 믿고 결정했는데 역시 맞았어요! 플레임 폭스의 힘인가...',
      '새로운 프로젝트에 완전 불타오르는 중! 이 열정이 내 힘이야',
      '오늘도 열정 가득한 하루! 폭스 타입 여러분 다들 화이팅!',
      '직관이 말해주는 대로 살다 보니 인생이 재밌어요'
    ],
    'diamond-lion': [
      '팀원들이 힘들 때 옆에서 함께 해주는 게 리더의 역할이라고 생각해요',
      '한번 약속한 건 무조건 지킨다! 라이온의 자존심',
      '어려운 상황에서도 포기하지 않는 게 중요해요. 다들 힘내세요!',
      '소중한 사람들과 함께하는 시간이 제일 행복해요'
    ],
    'shadow-bear': [
      '오늘도 친구 고민 상담해줬어요. 베어 타입이라 그런지 들어주는 게 편해요',
      '힘들 때는 제가 있어요. 언제든 기대세요~',
      '차 한잔 하면서 여유롭게 하루를 마무리하는 중',
      '오늘 하루도 평화롭게~ 모두 수고하셨어요'
    ],
    'crystal-deer': [
      '오늘 본 노을이 너무 예뻐서 사진 찍었어요. 세상은 아름다움으로 가득!',
      '요즘 새로운 취미 시작했는데 너무 재밌어요. 변화는 언제나 설레!',
      '음악 들으면서 글 쓰는 시간이 제일 좋아요',
      '오늘 카페에서 영감을 받았어요. 창의력 충전 완료!'
    ],
    'thunder-wolf': [
      '새로운 도전이 두렵지 않아요. 울프 타입이니까!',
      '높은 곳에서 보면 모든 게 명확해져요. 관점의 차이죠',
      '오늘 대담한 결정을 내렸어요. 후회 없이!',
      '폭풍 속에서도 흔들리지 않는 게 울프 타입의 강점!'
    ],
    'ocean-dolphin': [
      '오늘도 즐겁게! 돌핀 타입은 긍정 에너지 뿜뿜!',
      '친구들이랑 같이 있으면 에너지가 충전돼요',
      '자유롭게 사는 게 제일 행복해요~',
      '새로운 사람 만나는 거 좋아해요. 다들 친구해요!'
    ],
    'forest-owl': [
      '오늘 새벽에 재밌는 아이디어가 떠올랐어요!',
      '호기심이 이끄는 대로 탐구하는 게 제일 재밌어요',
      '깊이 생각하는 걸 좋아해요. 표면 아래의 진실을 찾는 거죠',
      '지식을 쌓는 건 끝이 없어요. 그래서 좋아요!'
    ],
    'star-phoenix': [
      '실패해도 괜찮아요. 더 강하게 일어나면 되니까!',
      '역경을 이겨낸 경험이 저를 더 강하게 만들어요',
      '포기란 없다! 피닉스 타입 화이팅!',
      '회복력이 제 장점이에요. 넘어져도 금방 일어나요'
    ],
    'moon-rabbit': [
      '조용히 혼자 생각하는 시간이 필요해요. 내면의 목소리를 듣는 시간',
      '소수의 깊은 관계가 많은 피상적 관계보다 좋아요',
      '밤에 더 집중이 잘 돼요. 래빗 타입의 특징인가?',
      '직감이 강해서 사람 파악이 빨라요'
    ],
    'earth-turtle': [
      '천천히 꾸준히 가는 게 제 스타일이에요',
      '급할수록 돌아가라! 터틀 타입의 지혜',
      '오늘도 한 걸음 성장했어요. 작은 진전도 진전이니까요',
      '장기적인 관점에서 보면 모든 게 이해돼요'
    ],
    'wind-hawk': [
      '우아하게, 그러나 강하게. 그게 제 모토예요',
      '겉으로는 차분해 보이지만 내면은 열정으로 가득!',
      '품위를 지키면서 나만의 길을 가는 중',
      '아름다움과 강인함은 공존할 수 있어요'
    ],
    'mystic-dragon': [
      '말없이도 존재감을 보여주는 게 드래곤 타입',
      '필요할 때 놀라운 능력을 발휘하는 타입이에요',
      '조용히 관찰하다가 정확한 순간에 행동해요',
      '카리스마는 타고나는 거라고 생각해요'
    ]
  },
  en: {
    'flame-fox': [
      'Trusted my gut today and it was right! Must be the Flame Fox power...',
      'Totally fired up about my new project! This passion is my strength',
      'Another day full of passion! Keep going, fellow Fox types!',
      'Living by my intuition makes life so exciting'
    ],
    'diamond-lion': [
      'Being there for team members when they struggle - that\'s what a leader does',
      'Once I make a promise, I keep it! Lion pride!',
      'Never giving up in tough situations is key. Stay strong everyone!',
      'Time with loved ones is the happiest time'
    ],
    'shadow-bear': [
      'Helped a friend with their worries today. Being a Bear type, I\'m good at listening',
      'I\'m here when you need someone. Lean on me anytime~',
      'Winding down the day with a cup of tea',
      'Another peaceful day~ Great job everyone'
    ],
    'crystal-deer': [
      'The sunset today was so beautiful I had to take a photo. The world is full of beauty!',
      'Started a new hobby recently and it\'s so fun. Change is always exciting!',
      'Writing while listening to music is my favorite time',
      'Got inspired at the cafe today. Creativity recharged!'
    ],
    'thunder-wolf': [
      'New challenges don\'t scare me. I\'m a Wolf type!',
      'From up high, everything becomes clear. It\'s all about perspective',
      'Made a bold decision today. No regrets!',
      'Staying strong in the storm is the Wolf type\'s strength!'
    ],
    'ocean-dolphin': [
      'Having fun today! Dolphin types radiate positive energy!',
      'Being with friends recharges my energy',
      'Living freely is the happiest way to live~',
      'Love meeting new people. Let\'s be friends!'
    ],
    'forest-owl': [
      'Had a fun idea early this morning!',
      'Following my curiosity and exploring is the most fun',
      'I love thinking deeply. Finding the truth beneath the surface',
      'Building knowledge never ends. That\'s why I love it!'
    ],
    'star-phoenix': [
      'It\'s okay to fail. Just rise stronger!',
      'Overcoming adversity makes me stronger',
      'Never give up! Phoenix types, fighting!',
      'Resilience is my strength. I bounce back quickly'
    ],
    'moon-rabbit': [
      'I need quiet time alone to think. Time to hear my inner voice',
      'Few deep relationships are better than many shallow ones',
      'I focus better at night. Must be a Rabbit type thing?',
      'My strong intuition helps me read people quickly'
    ],
    'earth-turtle': [
      'Slow and steady is my style',
      'More haste, less speed! Turtle type wisdom',
      'Grew one step today. Small progress is still progress',
      'In the long run, everything makes sense'
    ],
    'wind-hawk': [
      'Graceful yet strong. That\'s my motto',
      'I may look calm outside, but inside I\'m full of passion!',
      'Maintaining dignity while walking my own path',
      'Beauty and strength can coexist'
    ],
    'mystic-dragon': [
      'Making presence felt without words - that\'s the Dragon type',
      'I show amazing ability when needed',
      'I observe quietly and act at the right moment',
      'I believe charisma is innate'
    ]
  },
  ja: {
    'flame-fox': [
      '今日直感を信じて決めたら、やっぱり正解でした！フレイムフォックスの力かな...',
      '新しいプロジェクトに完全に燃えてる！この情熱が私の力',
      '今日も情熱いっぱいの一日！フォックスタイプの皆さん、ファイト！',
      '直感に従って生きると人生が楽しいです'
    ],
    'diamond-lion': [
      'チームメンバーが辛い時そばにいるのがリーダーの役割だと思います',
      '一度約束したことは必ず守る！ライオンのプライド',
      '困難な状況でも諦めないことが大切です。皆さん頑張って！',
      '大切な人との時間が一番幸せです'
    ]
  },
  zh: {
    'flame-fox': [
      '今天相信直觉做出的决定果然是对的！这就是火焰狐狸的力量吗...',
      '对新项目充满热情！这份激情就是我的力量',
      '又是充满热情的一天！狐狸类型的朋友们加油！',
      '按照直觉生活，人生变得很有趣'
    ],
    'diamond-lion': [
      '在队友困难时陪伴他们，这就是领导者的职责',
      '一旦承诺就一定会遵守！狮子的骄傲',
      '在困难情况下不放弃很重要。大家加油！',
      '和重要的人在一起的时光最幸福'
    ]
  },
  es: {
    'flame-fox': [
      '¡Hoy confié en mi intuición y tenía razón! ¿Será el poder del Flame Fox?',
      '¡Totalmente emocionado con mi nuevo proyecto! Esta pasión es mi fuerza',
      '¡Otro día lleno de pasión! ¡Ánimo, compañeros Fox!',
      'Vivir según mi intuición hace la vida emocionante'
    ],
    'diamond-lion': [
      'Estar ahí para los compañeros cuando lo necesitan - eso es lo que hace un líder',
      '¡Una vez que prometo algo, lo cumplo! ¡Orgullo de León!',
      'Nunca rendirse en situaciones difíciles es clave. ¡Ánimo a todos!',
      'El tiempo con los seres queridos es el más feliz'
    ]
  }
};

// Generic contents by language
const GENERIC_CONTENTS = {
  ko: [
    '오늘 테스트 결과가 정말 잘 맞아서 신기해요!',
    '친구랑 궁합 테스트 해봤는데 재밌었어요',
    '매일 테스트하니까 스트릭이 올라서 뿌듯해요',
    '이 앱 덕분에 제 성격을 더 잘 알게 됐어요',
    '다른 타입분들은 어떻게 생각하시나요?',
    '오늘의 질문 재밌었어요! 다들 뭐 골랐어요?',
    '드디어 레벨업! 꾸준히 하니까 되네요',
    '같은 타입분들 계신가요? 반가워요!',
    '테스트 결과 공유해요~ 신기하게 잘 맞아요',
    '벌써 7일 연속 참여! 스트릭 유지 중',
    '새로운 뱃지 획득했어요! 기분 좋다',
    '다들 오늘 하루도 화이팅이에요!',
    '제 소울 타입이 이거였다니... 신기해요'
  ],
  en: [
    'My test result was so accurate today! Amazing!',
    'Tried the compatibility test with a friend - it was fun!',
    'Daily testing is keeping my streak up. Feeling proud!',
    'This app helped me understand my personality better',
    'What do other types think about this?',
    'Today\'s question was fun! What did everyone pick?',
    'Finally leveled up! Consistency pays off',
    'Any same type folks here? Nice to meet you!',
    'Sharing my test result~ It\'s surprisingly accurate',
    '7 days in a row! Keeping the streak alive',
    'Got a new badge! Feeling good',
    'Everyone, have a great day!',
    'So this is my soul type... Fascinating!'
  ],
  ja: [
    '今日のテスト結果がすごく当たっていて驚きです！',
    '友達と相性テストやってみたら楽しかった',
    '毎日テストしてストリーク上がって嬉しい',
    'このアプリのおかげで自分の性格がよく分かるようになりました',
    '他のタイプの方はどう思いますか？',
    '今日の質問面白かった！皆さん何を選びました？',
    'やっとレベルアップ！継続は力なり',
    '同じタイプの方いますか？よろしくお願いします！',
    'テスト結果シェアします～不思議と当たってる',
    'もう7日連続参加！ストリーク維持中',
    '新しいバッジゲット！嬉しい',
    '皆さん今日も頑張りましょう！',
    '私のソウルタイプがこれだったとは...不思議'
  ],
  zh: [
    '今天的测试结果太准了！太神奇了！',
    '和朋友一起做了配对测试，很有趣',
    '每天测试让我的连续天数增加了，很自豪',
    '这个应用帮助我更好地了解自己的性格',
    '其他类型的朋友怎么看？',
    '今天的问题很有趣！大家选了什么？',
    '终于升级了！坚持就是胜利',
    '有同类型的朋友吗？很高兴认识你！',
    '分享我的测试结果～真的很准',
    '连续7天了！保持连续记录中',
    '获得了新徽章！心情很好',
    '大家今天也加油！',
    '原来我的灵魂类型是这个...真神奇'
  ],
  es: [
    '¡Mi resultado de hoy fue muy preciso! ¡Increíble!',
    'Hice la prueba de compatibilidad con un amigo - ¡fue divertido!',
    'Las pruebas diarias mantienen mi racha. ¡Me siento orgulloso!',
    'Esta app me ayudó a entender mejor mi personalidad',
    '¿Qué piensan los otros tipos sobre esto?',
    '¡La pregunta de hoy fue divertida! ¿Qué eligieron todos?',
    '¡Por fin subí de nivel! La constancia da frutos',
    '¿Hay alguien del mismo tipo? ¡Encantado de conocerte!',
    'Comparto mi resultado~ Es sorprendentemente preciso',
    '¡7 días seguidos! Manteniendo la racha',
    '¡Obtuve una nueva insignia! Me siento bien',
    '¡Todos, tengan un gran día!',
    'Así que este es mi tipo de alma... ¡Fascinante!'
  ]
};

// Comment contents by language
const COMMENT_CONTENTS = {
  ko: [
    '공감해요!', '저도요!', '좋은 글이에요', '맞아요 ㅋㅋ',
    '오 신기하네요', '저도 같은 타입이에요!', '응원합니다!',
    '재밌어요', '와 대박', '공유해주셔서 감사해요',
    '맞는 말씀이에요', '화이팅!', '너무 공감돼요',
    '좋은 하루 보내세요', '대단해요!'
  ],
  en: [
    'I agree!', 'Me too!', 'Great post', 'So true lol',
    'Oh interesting', 'I\'m the same type!', 'Cheering for you!',
    'Fun!', 'Wow amazing', 'Thanks for sharing',
    'That\'s right', 'Fighting!', 'I totally relate',
    'Have a great day', 'Amazing!'
  ],
  ja: [
    '共感です！', '私も！', 'いい投稿ですね', 'そうですねw',
    'お〜面白い', '私も同じタイプです！', '応援してます！',
    '楽しい', 'すごい', 'シェアありがとう',
    'その通りです', 'ファイト！', '超共感',
    '良い一日を', 'すごいです！'
  ],
  zh: [
    '同意！', '我也是！', '好帖子', '太对了哈哈',
    '哦有趣', '我也是同类型！', '支持你！',
    '有趣', '哇厉害', '谢谢分享',
    '说得对', '加油！', '太有同感了',
    '祝你有美好的一天', '太棒了！'
  ],
  es: [
    '¡De acuerdo!', '¡Yo también!', 'Gran publicación', 'Muy cierto jaja',
    'Oh interesante', '¡Soy del mismo tipo!', '¡Te apoyo!',
    '¡Divertido!', 'Wow increíble', 'Gracias por compartir',
    'Tienes razón', '¡Ánimo!', 'Me identifico totalmente',
    'Que tengas un buen día', '¡Increíble!'
  ]
};

/**
 * Get content for a specific language with fallback
 */
function getLocalizedContent(contentObj, lang) {
  return contentObj[lang] || contentObj.en || contentObj.ko;
}

/**
 * Get random item from array
 */
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate sample posts
 */
function generateSamplePosts(count = 50, lang = 'ko') {
  const posts = [];
  const names = getLocalizedContent(SAMPLE_NAMES, lang);
  const contentsByType = getLocalizedContent(SAMPLE_CONTENTS_BY_TYPE, lang);
  const genericContents = getLocalizedContent(GENERIC_CONTENTS, lang);
  const soulTypeIds = Object.keys(contentsByType);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const typeId = getRandomItem(soulTypeIds);
    const typeContents = contentsByType[typeId] || genericContents;
    const useTypeContent = Math.random() > 0.3;

    const content = useTypeContent
      ? getRandomItem(typeContents)
      : getRandomItem(genericContents);

    // Random time within last 7 days
    const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const timestamp = now - timeOffset;

    // Random level 1-10
    const level = Math.floor(Math.random() * 10) + 1;

    // Random likes 0-150
    const likes = Math.floor(Math.random() * 150);

    // Random comments count 0-20
    const commentCount = Math.floor(Math.random() * 20);

    // Maybe include attachment
    const hasAttachment = Math.random() > 0.6;
    let attachment = null;

    if (hasAttachment) {
      const attachmentTypes = ['life-summary', 'compatibility', 'daily'];
      const attachType = getRandomItem(attachmentTypes);

      if (attachType === 'life-summary') {
        attachment = {
          type: 'life-summary',
          soulType: typeId,
          score: Math.floor(Math.random() * 30) + 70
        };
      } else if (attachType === 'compatibility') {
        const partnerType = getRandomItem(soulTypeIds);
        attachment = {
          type: 'compatibility',
          myType: typeId,
          partnerType: partnerType,
          score: Math.floor(Math.random() * 40) + 60
        };
      } else {
        attachment = {
          type: 'daily',
          question: lang === 'ko' ? '오늘의 질문' : 'Daily Question',
          answer: lang === 'ko' ? '선택한 답변' : 'Selected Answer'
        };
      }
    }

    posts.push({
      id: `post_${i}_${Date.now()}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      authorName: getRandomItem(names),
      authorType: typeId,
      authorLevel: level,
      content: content,
      attachment: attachment,
      likes: likes,
      commentCount: commentCount,
      comments: generateSampleComments(Math.min(commentCount, 5), lang),
      timestamp: timestamp,
      createdAt: new Date(timestamp).toISOString()
    });
  }

  // Sort by timestamp (newest first)
  posts.sort((a, b) => b.timestamp - a.timestamp);

  return posts;
}

/**
 * Generate sample comments
 */
function generateSampleComments(count = 3, lang = 'ko') {
  const comments = [];
  const names = getLocalizedContent(SAMPLE_NAMES, lang);
  const commentContents = getLocalizedContent(COMMENT_CONTENTS, lang);
  const contentsByType = getLocalizedContent(SAMPLE_CONTENTS_BY_TYPE, lang);
  const soulTypeIds = Object.keys(contentsByType);

  for (let i = 0; i < count; i++) {
    const typeId = getRandomItem(soulTypeIds);
    const timeOffset = Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000);

    comments.push({
      id: `comment_${i}_${Date.now()}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      authorName: getRandomItem(names),
      authorType: typeId,
      content: getRandomItem(commentContents),
      timestamp: Date.now() - timeOffset,
      createdAt: new Date(Date.now() - timeOffset).toISOString()
    });
  }

  return comments;
}

/**
 * Community Data Manager
 */
class CommunityDataManager {
  constructor() {
    this.storageKey = 'smartaitest_community';
    this.postsPerPage = 10;
    this.lang = 'ko';
  }

  /**
   * Initialize community data
   */
  initialize(lang = 'ko') {
    this.lang = lang;
    const stored = this.getStoredData();

    // Check if we need to regenerate for different language
    const needsRegenerate = !stored ||
                           !stored.posts ||
                           stored.posts.length === 0 ||
                           stored.lang !== lang;

    if (needsRegenerate) {
      const samplePosts = generateSamplePosts(50, lang);
      this.saveData({
        posts: samplePosts,
        userPosts: [],
        userLikes: [],
        userComments: [],
        lang: lang,
        lastUpdated: Date.now()
      });
    }

    return this.getStoredData();
  }

  /**
   * Get stored data from localStorage
   */
  getStoredData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to get community data:', e);
      return null;
    }
  }

  /**
   * Save data to localStorage
   */
  saveData(data) {
    try {
      data.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save community data:', e);
      return false;
    }
  }

  /**
   * Get posts with pagination
   */
  getPosts(page = 1, filter = 'all') {
    const data = this.getStoredData();
    if (!data || !data.posts) return { posts: [], hasMore: false };

    let filteredPosts = data.posts;

    // Filter by type if specified
    if (filter !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.authorType === filter);
    }

    // Paginate
    const start = (page - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    return {
      posts: paginatedPosts,
      hasMore: end < filteredPosts.length,
      total: filteredPosts.length
    };
  }

  /**
   * Get single post by ID
   */
  getPost(postId) {
    const data = this.getStoredData();
    if (!data || !data.posts) return null;
    return data.posts.find(p => p.id === postId);
  }

  /**
   * Create new post
   */
  createPost(content, attachment = null) {
    const data = this.getStoredData();
    if (!data) return null;

    // Get user data
    const userData = typeof userDataManager !== 'undefined'
      ? userDataManager.getUserData()
      : null;

    const mostCommonType = typeof userDataManager !== 'undefined'
      ? userDataManager.getMostCommonType()
      : null;

    const defaultName = this.lang === 'ko' ? '익명' : 'Anonymous';

    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: userData?.odbc || 'guest',
      authorName: userData?.displayName || defaultName,
      authorType: mostCommonType?.type || 'flame-fox',
      authorLevel: userData?.gamification?.level || 1,
      content: content,
      attachment: attachment,
      likes: 0,
      commentCount: 0,
      comments: [],
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      isUserPost: true
    };

    // Add to beginning of posts array
    data.posts.unshift(newPost);
    data.userPosts.push(newPost.id);

    // Limit total posts
    if (data.posts.length > 200) {
      data.posts = data.posts.slice(0, 200);
    }

    this.saveData(data);

    return newPost;
  }

  /**
   * Toggle like on post
   */
  toggleLike(postId) {
    const data = this.getStoredData();
    if (!data) return { liked: false, likes: 0 };

    const post = data.posts.find(p => p.id === postId);
    if (!post) return { liked: false, likes: 0 };

    const likeIndex = data.userLikes.indexOf(postId);
    let liked = false;

    if (likeIndex === -1) {
      // Like
      data.userLikes.push(postId);
      post.likes = (post.likes || 0) + 1;
      liked = true;
    } else {
      // Unlike
      data.userLikes.splice(likeIndex, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
      liked = false;
    }

    this.saveData(data);

    return { liked, likes: post.likes };
  }

  /**
   * Check if user liked a post
   */
  isLiked(postId) {
    const data = this.getStoredData();
    return data?.userLikes?.includes(postId) || false;
  }

  /**
   * Add comment to post
   */
  addComment(postId, content) {
    const data = this.getStoredData();
    if (!data) return null;

    const post = data.posts.find(p => p.id === postId);
    if (!post) return null;

    const userData = typeof userDataManager !== 'undefined'
      ? userDataManager.getUserData()
      : null;

    const mostCommonType = typeof userDataManager !== 'undefined'
      ? userDataManager.getMostCommonType()
      : null;

    const defaultName = this.lang === 'ko' ? '익명' : 'Anonymous';

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: userData?.odbc || 'guest',
      authorName: userData?.displayName || defaultName,
      authorType: mostCommonType?.type || 'flame-fox',
      content: content,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);
    post.commentCount = post.comments.length;

    data.userComments.push(newComment.id);

    this.saveData(data);

    return newComment;
  }

  /**
   * Get comments for a post
   */
  getComments(postId) {
    const post = this.getPost(postId);
    return post?.comments || [];
  }

  /**
   * Delete user's own post
   */
  deletePost(postId) {
    const data = this.getStoredData();
    if (!data) return false;

    const postIndex = data.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return false;

    const post = data.posts[postIndex];

    // Only allow deleting user's own posts
    if (!post.isUserPost) return false;

    data.posts.splice(postIndex, 1);
    const userPostIndex = data.userPosts.indexOf(postId);
    if (userPostIndex !== -1) {
      data.userPosts.splice(userPostIndex, 1);
    }

    this.saveData(data);
    return true;
  }

  /**
   * Get user's posts
   */
  getUserPosts() {
    const data = this.getStoredData();
    if (!data) return [];

    return data.posts.filter(p => data.userPosts.includes(p.id));
  }

  /**
   * Format relative time
   */
  formatRelativeTime(timestamp, lang = 'ko') {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const formats = {
      ko: { d: '일 전', h: '시간 전', m: '분 전', now: '방금 전' },
      en: { d: 'd ago', h: 'h ago', m: 'm ago', now: 'just now' },
      ja: { d: '日前', h: '時間前', m: '分前', now: 'たった今' },
      zh: { d: '天前', h: '小时前', m: '分钟前', now: '刚刚' },
      es: { d: 'd atrás', h: 'h atrás', m: 'm atrás', now: 'ahora' }
    };

    const fmt = formats[lang] || formats.en;

    if (days > 0) return `${days}${fmt.d}`;
    if (hours > 0) return `${hours}${fmt.h}`;
    if (minutes > 0) return `${minutes}${fmt.m}`;
    return fmt.now;
  }

  /**
   * Clear all data (for testing)
   */
  clearData() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Reset to sample data
   */
  resetToSampleData(lang = 'ko') {
    this.clearData();
    return this.initialize(lang);
  }
}

// Global instance
const communityData = new CommunityDataManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CommunityDataManager, communityData, generateSamplePosts };
}
