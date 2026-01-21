/**
 * Community Data Management
 * Sample posts and localStorage management for community feed
 */

// Sample Korean names for posts
const SAMPLE_NAMES = [
  '별빛여행자', '달빛소울', '햇살가득', '바람돌이', '구름위산책',
  '꿈꾸는나무', '숲속요정', '하늘정원', '무지개빛', '반짝별',
  '고양이사랑', '강아지맘', '행복나무', '따뜻한봄', '시원한바람',
  '별똥별', '은하수여행', '달콤한꿈', '푸른하늘', '노을빛',
  '초록이끼', '보라빛향기', '분홍구름', '하얀눈꽃', '빨간장미',
  '파도소리', '새벽이슬', '저녁노을', '아침햇살', '한밤의달',
  '소울탐험가', '테스트러버', '궁합매니아', '일일챌린저', '스트릭마스터',
  '호기심왕', '분석가', '감성파', '이성파', '직관형',
  '민트초코', '딸기우유', '바닐라빈', '카라멜맛', '레몬에이드'
];

// Sample post contents for each soul type
const SAMPLE_CONTENTS_BY_TYPE = {
  'flame-fox': [
    '오늘 직감을 믿고 결정했는데 역시 맞았어요! 플레임 폭스의 힘인가...',
    '새로운 프로젝트에 완전 불타오르는 중! 이 열정이 내 힘이야',
    '사람들이 어떻게 그렇게 빨리 상황 파악하냐고 물어보는데... 그냥 느껴지는 거 아닌가요?',
    '오늘도 열정 가득한 하루! 폭스 타입 여러분 다들 화이팅!',
    '직관이 말해주는 대로 살다 보니 인생이 재밌어요'
  ],
  'diamond-lion': [
    '팀원들이 힘들 때 옆에서 함께 해주는 게 리더의 역할이라고 생각해요',
    '한번 약속한 건 무조건 지킨다! 라이온의 자존심',
    '어려운 상황에서도 포기하지 않는 게 중요해요. 다들 힘내세요!',
    '오늘 프레젠테이션 대성공! 역시 리더십은 타고나는 거야',
    '소중한 사람들과 함께하는 시간이 제일 행복해요'
  ],
  'ocean-bear': [
    '오늘도 친구 고민 상담해줬어요. 베어 타입이라 그런지 들어주는 게 편해요',
    '힘들 때는 제가 있어요. 언제든 기대세요~',
    '차 한잔 하면서 여유롭게 하루를 마무리하는 중',
    '사람들이 저랑 있으면 편하대요. 베어 타입의 매력인가 봐요!',
    '오늘 하루도 평화롭게~ 모두 수고하셨어요'
  ],
  'crystal-butterfly': [
    '오늘 본 노을이 너무 예뻐서 사진 찍었어요. 세상은 아름다움으로 가득!',
    '요즘 새로운 취미 시작했는데 너무 재밌어요. 변화는 언제나 설레!',
    '음악 들으면서 글 쓰는 시간이 제일 좋아요',
    '작은 것에서 행복을 찾는 버터플라이 타입입니다',
    '오늘 카페에서 영감을 받았어요. 창의력 충전 완료!'
  ],
  'storm-eagle': [
    '새로운 도전이 두렵지 않아요. 이글 타입이니까!',
    '높은 곳에서 보면 모든 게 명확해져요. 관점의 차이죠',
    '오늘 대담한 결정을 내렸어요. 후회 없이!',
    '어려운 문제일수록 흥미로워요. 해결하면 그만큼 성장하니까',
    '폭풍 속에서도 흔들리지 않는 게 이글 타입의 강점!'
  ],
  'moonlit-wolf': [
    '조용히 혼자 생각하는 시간이 필요해요. 내면의 목소리를 듣는 시간',
    '소수의 깊은 관계가 많은 피상적 관계보다 좋아요',
    '밤에 더 집중이 잘 돼요. 울프 타입의 특징인가?',
    '신비로운 분위기 좋아하시는 분? 저도요!',
    '직감이 강해서 사람 파악이 빨라요'
  ],
  'golden-phoenix': [
    '실패해도 괜찮아요. 더 강하게 일어나면 되니까!',
    '역경을 이겨낸 경험이 저를 더 강하게 만들어요',
    '포기란 없다! 피닉스 타입 화이팅!',
    '오늘 어려운 일이 있었지만 극복했어요. 다시 태어난 기분!',
    '회복력이 제 장점이에요. 넘어져도 금방 일어나요'
  ],
  'jade-turtle': [
    '천천히 꾸준히 가는 게 제 스타일이에요',
    '급할수록 돌아가라! 터틀 타입의 지혜',
    '오늘도 한 걸음 성장했어요. 작은 진전도 진전이니까요',
    '인내심이 필요할 때 터틀 타입이 빛을 발해요',
    '장기적인 관점에서 보면 모든 게 이해돼요'
  ],
  'silver-swan': [
    '우아하게, 그러나 강하게. 그게 제 모토예요',
    '겉으로는 차분해 보이지만 내면은 열정으로 가득!',
    '품위를 지키면서 나만의 길을 가는 중',
    '조용히 실력을 키우는 타입이에요',
    '아름다움과 강인함은 공존할 수 있어요'
  ],
  'cosmic-owl': [
    '오늘 새벽에 재밌는 아이디어가 떠올랐어요!',
    '호기심이 이끄는 대로 탐구하는 게 제일 재밌어요',
    '밤하늘을 보면 무한한 가능성이 느껴져요',
    '깊이 생각하는 걸 좋아해요. 표면 아래의 진실을 찾는 거죠',
    '지식을 쌓는 건 끝이 없어요. 그래서 좋아요!'
  ],
  'rainbow-dolphin': [
    '오늘도 즐겁게! 돌핀 타입은 긍정 에너지 뿜뿜!',
    '친구들이랑 같이 있으면 에너지가 충전돼요',
    '자유롭게 사는 게 제일 행복해요~',
    '웃음은 전염된대요. 오늘도 많이 웃어요!',
    '새로운 사람 만나는 거 좋아해요. 다들 친구해요!'
  ],
  'shadow-panther': [
    '말없이도 존재감을 보여주는 게 팬서 타입',
    '필요할 때 놀라운 능력을 발휘하는 타입이에요',
    '겉으로 드러내지 않는 힘이 있어요',
    '조용히 관찰하다가 정확한 순간에 행동해요',
    '카리스마는 타고나는 거라고 생각해요'
  ]
};

// Sample generic contents (for any type)
const GENERIC_CONTENTS = [
  '오늘 테스트 결과가 정말 잘 맞아서 신기해요!',
  '친구랑 궁합 테스트 해봤는데 재밌었어요',
  '매일 테스트하니까 스트릭이 올라서 뿌듯해요',
  '이 앱 덕분에 제 성격을 더 잘 알게 됐어요',
  '다른 타입분들은 어떻게 생각하시나요?',
  '오늘의 질문 재밌었어요! 다들 뭐 골랐어요?',
  '드디어 레벨업! 꾸준히 하니까 되네요',
  '같은 타입분들 계신가요? 반가워요!',
  '테스트 결과 공유해요~ 신기하게 잘 맞아요',
  '일일 테스트 하러 왔다가 글 남겨요',
  '벌써 7일 연속 참여! 스트릭 유지 중',
  '새로운 뱃지 획득했어요! 기분 좋다',
  '다들 오늘 하루도 화이팅이에요!',
  '제 소울 타입이 이거였다니... 신기해요',
  '친구 추천으로 왔는데 재밌어서 계속하게 되네요'
];

// Generate sample posts
function generateSamplePosts(count = 50) {
  const posts = [];
  const soulTypeIds = Object.keys(SAMPLE_CONTENTS_BY_TYPE);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const typeId = soulTypeIds[Math.floor(Math.random() * soulTypeIds.length)];
    const typeContents = SAMPLE_CONTENTS_BY_TYPE[typeId];
    const useTypeContent = Math.random() > 0.3;

    const content = useTypeContent
      ? typeContents[Math.floor(Math.random() * typeContents.length)]
      : GENERIC_CONTENTS[Math.floor(Math.random() * GENERIC_CONTENTS.length)];

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
      const attachType = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)];

      if (attachType === 'life-summary') {
        attachment = {
          type: 'life-summary',
          soulType: typeId,
          score: Math.floor(Math.random() * 30) + 70
        };
      } else if (attachType === 'compatibility') {
        const partnerType = soulTypeIds[Math.floor(Math.random() * soulTypeIds.length)];
        attachment = {
          type: 'compatibility',
          myType: typeId,
          partnerType: partnerType,
          score: Math.floor(Math.random() * 40) + 60
        };
      } else {
        attachment = {
          type: 'daily',
          question: '오늘의 질문',
          answer: '선택한 답변'
        };
      }
    }

    posts.push({
      id: `post_${i}_${Date.now()}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      authorName: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)],
      authorType: typeId,
      authorLevel: level,
      content: content,
      attachment: attachment,
      likes: likes,
      commentCount: commentCount,
      comments: generateSampleComments(Math.min(commentCount, 5)),
      timestamp: timestamp,
      createdAt: new Date(timestamp).toISOString()
    });
  }

  // Sort by timestamp (newest first)
  posts.sort((a, b) => b.timestamp - a.timestamp);

  return posts;
}

// Generate sample comments
function generateSampleComments(count = 3) {
  const comments = [];
  const soulTypeIds = Object.keys(SAMPLE_CONTENTS_BY_TYPE);

  const commentContents = [
    '공감해요!', '저도요!', '좋은 글이에요', '맞아요 ㅋㅋ',
    '오 신기하네요', '저도 같은 타입이에요!', '응원합니다!',
    '재밌어요', '와 대박', '공유해주셔서 감사해요',
    '저는 다르게 생각해요~', '맞는 말씀이에요', '화이팅!',
    '너무 공감돼요', '좋은 하루 보내세요', '대단해요!'
  ];

  for (let i = 0; i < count; i++) {
    const typeId = soulTypeIds[Math.floor(Math.random() * soulTypeIds.length)];
    const timeOffset = Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000);

    comments.push({
      id: `comment_${i}_${Date.now()}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      authorName: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)],
      authorType: typeId,
      content: commentContents[Math.floor(Math.random() * commentContents.length)],
      timestamp: Date.now() - timeOffset,
      createdAt: new Date(Date.now() - timeOffset).toISOString()
    });
  }

  return comments;
}

// Community Data Manager
class CommunityDataManager {
  constructor() {
    this.storageKey = 'smartaitest_community';
    this.postsPerPage = 10;
  }

  /**
   * Initialize community data
   */
  initialize() {
    const stored = this.getStoredData();

    if (!stored || !stored.posts || stored.posts.length === 0) {
      // Generate sample posts
      const samplePosts = generateSamplePosts(50);
      this.saveData({
        posts: samplePosts,
        userPosts: [],
        userLikes: [],
        userComments: [],
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

    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: userData?.odbc || 'guest',
      authorName: userData?.displayName || '익명',
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

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: userData?.odbc || 'guest',
      authorName: userData?.displayName || '익명',
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

    if (lang === 'ko') {
      if (days > 0) return `${days}일 전`;
      if (hours > 0) return `${hours}시간 전`;
      if (minutes > 0) return `${minutes}분 전`;
      return '방금 전';
    } else {
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'just now';
    }
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
  resetToSampleData() {
    this.clearData();
    return this.initialize();
  }
}

// Global instance
const communityData = new CommunityDataManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CommunityDataManager, communityData, generateSamplePosts };
}
