/**
 * Monetization System for SmartAITest.com
 * Contextual affiliate recommendations.
 */

// ===== Contextual Affiliate Manager =====
const ContextualAffiliateManager = {
    // Romance movie recommendations based on compatibility score
    ROMANCE_MOVIES: {
        high: [ // 85%+
            {
                title: { ko: '노트북', en: 'The Notebook', ja: 'きみに読む物語', zh: '恋恋笔记本', es: 'Diario de una Pasión' },
                platform: 'netflix',
                emoji: '💕',
                tag: { ko: '완벽한 사랑', en: 'Perfect Love', ja: '完璧な愛', zh: '完美爱情', es: 'Amor Perfecto' }
            },
            {
                title: { ko: '어바웃 타임', en: 'About Time', ja: 'アバウト・タイム', zh: '时空恋旅人', es: 'Una Cuestión de Tiempo' },
                platform: 'netflix',
                emoji: '⏰',
                tag: { ko: '시간을 초월한 사랑', en: 'Timeless Love', ja: '時を超えた愛', zh: '超越时间的爱', es: 'Amor Atemporal' }
            },
            {
                title: { ko: '라라랜드', en: 'La La Land', ja: 'ラ・ラ・ランド', zh: '爱乐之城', es: 'La La Land' },
                platform: 'disney',
                emoji: '🎭',
                tag: { ko: '꿈과 사랑', en: 'Dreams & Love', ja: '夢と愛', zh: '梦想与爱情', es: 'Sueños y Amor' }
            }
        ],
        medium: [ // 70-84%
            {
                title: { ko: '500일의 썸머', en: '500 Days of Summer', ja: '(500)日のサマー', zh: '和莎莫的500天', es: '500 Días con Ella' },
                platform: 'disney',
                emoji: '🌻',
                tag: { ko: '성장하는 사랑', en: 'Growing Love', ja: '成長する愛', zh: '成长中的爱', es: 'Amor Creciente' }
            },
            {
                title: { ko: '이터널 선샤인', en: 'Eternal Sunshine', ja: 'エターナル・サンシャイン', zh: '暖暖内含光', es: 'Eterno Resplandor' },
                platform: 'netflix',
                emoji: '🧠',
                tag: { ko: '기억 속 사랑', en: 'Memorable Love', ja: '記憶の中の愛', zh: '记忆中的爱', es: 'Amor Memorable' }
            }
        ],
        low: [ // Below 70%
            {
                title: { ko: '비긴 어게인', en: 'Begin Again', ja: 'はじまりのうた', zh: '再次出发', es: 'Empezar de Nuevo' },
                platform: 'netflix',
                emoji: '🎵',
                tag: { ko: '새로운 시작', en: 'Fresh Start', ja: '新しい始まり', zh: '新的开始', es: 'Nuevo Comienzo' }
            },
            {
                title: { ko: '그녀', en: 'Her', ja: 'her/世界でひとつの彼女', zh: '她', es: 'Ella' },
                platform: 'netflix',
                emoji: '🤖',
                tag: { ko: '특별한 연결', en: 'Unique Connection', ja: '特別なつながり', zh: '特别的联系', es: 'Conexión Única' }
            }
        ]
    },

    // Affiliate link configurations
    AFFILIATE_LINKS: {
        netflix: {
            url: 'https://www.netflix.com/',
            color: 'bg-red-600 hover:bg-red-700',
            logo: 'N',
            name: 'Netflix'
        },
        disney: {
            url: 'https://www.disneyplus.com/',
            color: 'bg-blue-700 hover:bg-blue-800',
            logo: 'D+',
            name: 'Disney+'
        }
    },

    /**
     * Get movie recommendations based on compatibility score
     */
    getMovieRecommendations(score) {
        if (score >= 85) return this.ROMANCE_MOVIES.high;
        if (score >= 70) return this.ROMANCE_MOVIES.medium;
        return this.ROMANCE_MOVIES.low;
    },

    /**
     * Create romance movie affiliate section HTML
     */
    createMovieAffiliateSection(score, lang = 'ko') {
        const movies = this.getMovieRecommendations(score);

        const titles = {
            ko: '이 커플에게 추천하는 로맨스 영화',
            en: 'Romance Movies for This Couple',
            ja: 'このカップルにおすすめのロマンス映画',
            zh: '推荐给这对情侣的浪漫电影',
            es: 'Películas Románticas para Esta Pareja'
        };

        const subtitles = {
            ko: '당신들의 궁합과 어울리는 영화를 추천해 드려요',
            en: 'Movies that match your compatibility',
            ja: '相性にぴったりの映画をおすすめ',
            zh: '与你们配对度匹配的电影推荐',
            es: 'Películas que combinan con su compatibilidad'
        };

        const watchNow = {
            ko: '지금 보기',
            en: 'Watch Now',
            ja: '今すぐ見る',
            zh: '立即观看',
            es: 'Ver Ahora'
        };

        let moviesHtml = movies.map(movie => {
            const platform = this.AFFILIATE_LINKS[movie.platform];
            return `
                <div class="affiliate-movie-card">
                    <div class="movie-emoji">${movie.emoji}</div>
                    <h4 class="movie-title">${movie.title[lang] || movie.title.en}</h4>
                    <span class="movie-tag">${movie.tag[lang] || movie.tag.en}</span>
                    <a href="${platform.url}" target="_blank" rel="noopener sponsored"
                       class="movie-cta ${platform.color}">
                        <span class="platform-logo">${platform.logo}</span>
                        ${watchNow[lang] || watchNow.en}
                    </a>
                </div>
            `;
        }).join('');

        return `
            <section class="affiliate-section movie-affiliate">
                <div class="affiliate-header">
                    <span class="affiliate-icon">🎬</span>
                    <h3 class="affiliate-title">${titles[lang] || titles.en}</h3>
                    <p class="affiliate-subtitle">${subtitles[lang] || subtitles.en}</p>
                </div>
                <div class="affiliate-movies-grid">
                    ${moviesHtml}
                </div>
                <p class="affiliate-disclosure">
                    <span class="lang-ko">* 제휴 링크가 포함되어 있습니다</span>
                    <span class="lang-en">* Contains affiliate links</span>
                    <span class="lang-ja">* アフィリエイトリンクが含まれています</span>
                    <span class="lang-zh">* 包含联盟链接</span>
                    <span class="lang-es">* Contiene enlaces de afiliados</span>
                </p>
            </section>
        `;
    },

    /**
     * Insert affiliate section into DOM
     */
    insertAffiliateSection(containerId, html) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = html;
        container.classList.remove('hidden');

        // Track impression
        if (typeof gtag === 'function') {
            gtag('event', 'affiliate_impression', {
                section: containerId
            });
        }
    },

    /**
     * Track affiliate click
     */
    trackClick(platform, product) {
        if (typeof gtag === 'function') {
            gtag('event', 'affiliate_click', {
                platform: platform,
                product: product
            });
        }
    }
};


// ===== Export for global use =====
if (typeof window !== 'undefined') {
    window.ContextualAffiliateManager = ContextualAffiliateManager;
}
