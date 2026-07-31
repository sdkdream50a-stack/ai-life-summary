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

    // Supplement recommendations based on mental/body age
    SUPPLEMENTS: {
        youngMentalAge: [ // Mental age younger than actual
            {
                name: { ko: '비타민 D3', en: 'Vitamin D3', ja: 'ビタミンD3', zh: '维生素D3', es: 'Vitamina D3' },
                benefit: { ko: '활력 유지', en: 'Energy Boost', ja: 'エネルギー維持', zh: '保持活力', es: 'Energía' },
                emoji: '☀️',
                link: 'iherb'
            },
            {
                name: { ko: '오메가-3', en: 'Omega-3', ja: 'オメガ3', zh: 'Omega-3', es: 'Omega-3' },
                benefit: { ko: '두뇌 건강', en: 'Brain Health', ja: '脳の健康', zh: '大脑健康', es: 'Salud Cerebral' },
                emoji: '🧠',
                link: 'iherb'
            }
        ],
        oldMentalAge: [ // Mental age older than actual
            {
                name: { ko: '코엔자임 Q10', en: 'CoQ10', ja: 'コエンザイムQ10', zh: '辅酶Q10', es: 'CoQ10' },
                benefit: { ko: '세포 에너지', en: 'Cell Energy', ja: '細胞エネルギー', zh: '细胞能量', es: 'Energía Celular' },
                emoji: '⚡',
                link: 'iherb'
            },
            {
                name: { ko: '마그네슘', en: 'Magnesium', ja: 'マグネシウム', zh: '镁', es: 'Magnesio' },
                benefit: { ko: '스트레스 완화', en: 'Stress Relief', ja: 'ストレス軽減', zh: '缓解压力', es: 'Alivio del Estrés' },
                emoji: '😌',
                link: 'amazon'
            }
        ],
        antiAging: [ // General anti-aging
            {
                name: { ko: 'NMN', en: 'NMN', ja: 'NMN', zh: 'NMN', es: 'NMN' },
                benefit: { ko: '노화 방지', en: 'Anti-aging', ja: 'アンチエイジング', zh: '抗衰老', es: 'Antienvejecimiento' },
                emoji: '🔬',
                link: 'iherb'
            },
            {
                name: { ko: '콜라겐 펩타이드', en: 'Collagen Peptides', ja: 'コラーゲンペプチド', zh: '胶原蛋白肽', es: 'Péptidos de Colágeno' },
                benefit: { ko: '피부 탄력', en: 'Skin Elasticity', ja: '肌の弾力', zh: '皮肤弹性', es: 'Elasticidad de la Piel' },
                emoji: '✨',
                link: 'amazon'
            },
            {
                name: { ko: '레스베라트롤', en: 'Resveratrol', ja: 'レスベラトロール', zh: '白藜芦醇', es: 'Resveratrol' },
                benefit: { ko: '항산화', en: 'Antioxidant', ja: '抗酸化', zh: '抗氧化', es: 'Antioxidante' },
                emoji: '🍇',
                link: 'iherb'
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
        },
        iherb: {
            url: 'https://www.iherb.com/',
            color: 'bg-green-600 hover:bg-green-700',
            logo: 'iH',
            name: 'iHerb'
        },
        amazon: {
            url: 'https://www.amazon.com/',
            color: 'bg-orange-500 hover:bg-orange-600',
            logo: 'A',
            name: 'Amazon'
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
     * Get supplement recommendations based on age difference
     */
    getSupplementRecommendations(actualAge, mentalAge) {
        const diff = mentalAge - actualAge;

        if (diff <= -5) {
            // Mental age much younger - energy supplements
            return this.SUPPLEMENTS.youngMentalAge;
        } else if (diff >= 5) {
            // Mental age older - stress/energy supplements
            return this.SUPPLEMENTS.oldMentalAge;
        }
        // General anti-aging for balanced ages
        return this.SUPPLEMENTS.antiAging;
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
     * Create supplement affiliate section HTML
     */
    createSupplementAffiliateSection(actualAge, mentalAge, lang = 'ko') {
        const supplements = this.getSupplementRecommendations(actualAge, mentalAge);
        const ageDiff = mentalAge - actualAge;

        const titles = {
            ko: '신체 나이를 되돌리는 영양제',
            en: 'Supplements to Turn Back Your Body Age',
            ja: '体年齢を若返らせるサプリ',
            zh: '逆转身体年龄的营养补充剂',
            es: 'Suplementos para Rejuvenecer tu Cuerpo'
        };

        const subtitles = {
            ko: ageDiff > 0
                ? `정신 나이가 ${Math.abs(ageDiff)}살 더 높아요. 활력이 필요해요!`
                : ageDiff < 0
                ? `정신 나이가 ${Math.abs(ageDiff)}살 어려요. 젊음을 유지하세요!`
                : '균형 잡힌 나이! 건강을 유지하세요.',
            en: ageDiff > 0
                ? `Your mental age is ${Math.abs(ageDiff)} years higher. You need energy!`
                : ageDiff < 0
                ? `Your mental age is ${Math.abs(ageDiff)} years younger. Keep it up!`
                : 'Balanced age! Maintain your health.',
            ja: ageDiff > 0
                ? `精神年齢が${Math.abs(ageDiff)}歳高いです。エネルギーが必要です！`
                : ageDiff < 0
                ? `精神年齢が${Math.abs(ageDiff)}歳若いです。キープしましょう！`
                : 'バランスの取れた年齢！健康を維持しましょう。',
            zh: ageDiff > 0
                ? `心理年龄高${Math.abs(ageDiff)}岁。需要补充能量！`
                : ageDiff < 0
                ? `心理年龄小${Math.abs(ageDiff)}岁。保持年轻！`
                : '年龄平衡！保持健康。',
            es: ageDiff > 0
                ? `Tu edad mental es ${Math.abs(ageDiff)} años mayor. ¡Necesitas energía!`
                : ageDiff < 0
                ? `Tu edad mental es ${Math.abs(ageDiff)} años menor. ¡Sigue así!`
                : 'Edad equilibrada! Mantén tu salud.'
        };

        const shopNow = {
            ko: '구매하기',
            en: 'Shop Now',
            ja: '購入する',
            zh: '立即购买',
            es: 'Comprar'
        };

        let supplementsHtml = supplements.map(supp => {
            const affiliate = this.AFFILIATE_LINKS[supp.link];
            return `
                <div class="affiliate-supplement-card">
                    <div class="supplement-emoji">${supp.emoji}</div>
                    <h4 class="supplement-name">${supp.name[lang] || supp.name.en}</h4>
                    <span class="supplement-benefit">${supp.benefit[lang] || supp.benefit.en}</span>
                    <a href="${affiliate.url}" target="_blank" rel="noopener sponsored"
                       class="supplement-cta ${affiliate.color}">
                        <span class="affiliate-logo">${affiliate.logo}</span>
                        ${shopNow[lang] || shopNow.en}
                    </a>
                </div>
            `;
        }).join('');

        return `
            <section class="affiliate-section supplement-affiliate">
                <div class="affiliate-header">
                    <span class="affiliate-icon">💊</span>
                    <h3 class="affiliate-title">${titles[lang] || titles.en}</h3>
                    <p class="affiliate-subtitle">${subtitles[lang] || subtitles.en}</p>
                </div>
                <div class="affiliate-supplements-grid">
                    ${supplementsHtml}
                </div>
                <p class="affiliate-disclosure">
                    <span class="lang-ko">* 제휴 링크가 포함되어 있습니다. 구매 시 소정의 수수료를 받습니다.</span>
                    <span class="lang-en">* Contains affiliate links. We may earn a commission on purchases.</span>
                    <span class="lang-ja">* アフィリエイトリンクが含まれています。購入時に手数料が発生する場合があります。</span>
                    <span class="lang-zh">* 包含联盟链接。购买时我们可能会获得佣金。</span>
                    <span class="lang-es">* Contiene enlaces de afiliados. Podemos ganar una comisión en las compras.</span>
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
