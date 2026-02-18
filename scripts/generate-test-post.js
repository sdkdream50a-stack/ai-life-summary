/**
 * Test Post Generator - 테스트용 포스트 1개만 생성
 */

const fs = require('fs');
const path = require('path');

const draftsDir = path.join(__dirname, '../drafts');

// 테스트 포스트 정보
const testPost = {
    episode: 1,
    slug: 'coding-mindset-50s-beginners',
    emoji: '🧠',
    gradient: 'from-indigo-400 to-purple-500',
    publish_date: '2026-01-31',
    ko: {
        title: '코딩 학습 첫걸음: 50대가 알아야 할 프로그래밍 마인드셋',
        description: '나이는 숫자에 불과합니다. 50대에 시작하는 코딩 학습, 올바른 마인드셋으로 시작하세요.'
    },
    en: {
        title: 'First Steps in Coding: Programming Mindset for Learners in Their 50s',
        description: 'Age is just a number. Start your coding journey in your 50s with the right mindset.'
    }
};

// 한국어 포스트 HTML
const koHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testPost.ko.title} | AI Test Lab</title>
    <meta name="description" content="${testPost.ko.description}">
    <link rel="canonical" href="https://smartaitest.com/blog/${testPost.slug}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="${testPost.ko.title}">
    <meta property="og:description" content="${testPost.ko.description}">
    <meta property="og:url" content="https://smartaitest.com/blog/${testPost.slug}.html">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="ko_KR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${testPost.ko.title}">
    <meta name="twitter:description" content="${testPost.ko.description}">

    <!-- Hreflang -->
    <link rel="alternate" hreflang="ko" href="https://smartaitest.com/blog/ko/${testPost.slug}.html">
    <link rel="alternate" hreflang="en" href="https://smartaitest.com/blog/en/${testPost.slug}.html">
    <link rel="alternate" hreflang="x-default" href="https://smartaitest.com/blog/${testPost.slug}.html">

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#4F46E5', secondary: '#7C3AED' },
                    fontFamily: { sans: ['Inter', 'Noto Sans KR', 'sans-serif'] }
                }
            }
        }
    </script>

    <style>
        .prose h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
        .prose h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 600; color: #374151; }
        .prose p { margin-bottom: 1rem; line-height: 1.8; color: #4b5563; }
        .prose ul, .prose ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; line-height: 1.7; color: #4b5563; }
        .prose ul li { list-style-type: disc; }
        .prose ol li { list-style-type: decimal; }
        .prose blockquote { border-left: 4px solid #4F46E5; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6b7280; }
        .affiliate-box { background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 1px solid #C7D2FE; border-radius: 0.75rem; padding: 1.5rem; margin: 2rem 0; }
        .affiliate-box h4 { color: #4338CA; font-weight: 600; margin-bottom: 0.75rem; }
        .affiliate-box a { color: #4F46E5; text-decoration: underline; font-weight: 500; }
        .affiliate-disclaimer { font-size: 0.75rem; color: #6b7280; margin-top: 1rem; font-style: italic; }
    </style>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${testPost.ko.title}",
        "description": "${testPost.ko.description}",
        "datePublished": "${testPost.publish_date}",
        "author": { "@type": "Organization", "name": "AI Test Lab" },
        "publisher": { "@type": "Organization", "name": "AI Test Lab", "url": "https://smartaitest.com" }
    }
    </script>

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6241798439911569" crossorigin="anonymous"></script>
</head>
<body class="bg-gray-50 font-sans">
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-primary">AI Test Lab</a>
                <a href="/blog.html" class="text-gray-600 hover:text-primary">← Blog</a>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-gradient-to-br ${testPost.gradient} rounded-2xl p-8 mb-8 text-center">
            <span class="text-6xl mb-4 block">${testPost.emoji}</span>
            <span class="text-white/80 text-sm">Episode ${testPost.episode} · ${testPost.publish_date}</span>
        </div>

        <article class="bg-white rounded-xl shadow-sm p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">${testPost.ko.title}</h1>

            <div class="prose max-w-none">
                <p>프로그래밍을 배우기에 50대가 너무 늦었다고 생각하시나요? 절대 그렇지 않습니다. 사실, 50대는 코딩을 배우기에 여러 면에서 <strong>최적의 시기</strong>일 수 있습니다.</p>

                <h2>왜 50대가 코딩을 배우기 좋은가?</h2>

                <p>수십 년간 쌓아온 <strong>문제 해결 경험</strong>과 <strong>인내심</strong>은 프로그래밍에서 가장 중요한 자질입니다. 젊은 개발자들이 몇 년에 걸쳐 배우는 것을 여러분은 이미 갖고 있습니다.</p>

                <h3>1. 풍부한 도메인 지식</h3>
                <p>회계, 영업, 제조업 등 어떤 분야에서 일하셨든, 그 분야의 전문 지식과 프로그래밍을 결합하면 독보적인 경쟁력이 됩니다.</p>

                <h3>2. 성숙한 학습 태도</h3>
                <p>빠른 결과를 기대하기보다 꾸준히 학습하는 자세가 프로그래밍에서 성공의 열쇠입니다.</p>

                <h3>3. 명확한 목표 의식</h3>
                <p>무엇을 위해 코딩을 배우는지 명확히 알고 있어 학습 동기가 강합니다.</p>

                <h2>올바른 마인드셋 갖추기</h2>

                <ul>
                    <li><strong>완벽주의를 버리세요</strong> - 처음부터 완벽한 코드를 작성하는 사람은 없습니다</li>
                    <li><strong>비교하지 마세요</strong> - 20대 개발자와 비교할 필요 없습니다</li>
                    <li><strong>작은 성공을 축하하세요</strong> - 첫 "Hello, World!"도 대단한 성취입니다</li>
                    <li><strong>실수를 환영하세요</strong> - 에러 메시지는 선생님입니다</li>
                </ul>

                <h2>시작하기 전 준비사항</h2>

                <ol>
                    <li>하루 30분 이상 꾸준히 학습할 시간 확보</li>
                    <li>편안한 학습 공간 마련</li>
                    <li>구글 검색과 친해지기</li>
                    <li>질문하는 것을 두려워하지 않기</li>
                </ol>

                <blockquote>
                    "The best time to plant a tree was 20 years ago. The second best time is now."
                    <br>- 중국 속담
                </blockquote>

                <p>다음 포스트에서는 실제로 개발 환경을 설정하고 첫 코드를 실행하는 방법을 알아보겠습니다.</p>
            </div>

            <div class="affiliate-box">
                <h4>추천 강좌</h4>
                <p><a href="https://www.inflearn.com/course/web-development-basics" target="_blank" rel="noopener noreferrer">웹 개발 입문 - HTML/CSS 기초부터 반응형까지</a></p>
                <p>웹 개발의 기초를 탄탄하게 다지는 입문 강좌</p>
                <p class="affiliate-disclaimer">이 포스트는 인프런 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
            </div>
        </article>

        <div class="mt-8 text-center">
            <a href="/blog.html" class="inline-flex items-center text-primary hover:underline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                블로그 목록으로
            </a>
        </div>
    </main>

    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <p class="text-gray-400">© 2026 AI Test Lab. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

// 영어 포스트 HTML (간단 버전)
const enHtml = koHtml
    .replace(/lang="ko"/g, 'lang="en"')
    .replace(/ko_KR/g, 'en_US')
    .replace(testPost.ko.title, testPost.en.title)
    .replace(testPost.ko.description, testPost.en.description)
    .replace('블로그 목록으로', 'Back to Blog')
    .replace('추천 강좌', 'Recommended Course')
    .replace('이 포스트는 인프런 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',
             'This post contains affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you.');

// 스케줄 JSON
const scheduleJson = {
    scheduled_posts: [
        {
            episode: testPost.episode,
            publish_date: testPost.publish_date,
            title_ko: testPost.ko.title,
            title_en: testPost.en.title,
            description_ko: testPost.ko.description,
            description_en: testPost.en.description,
            emoji: testPost.emoji,
            gradient: testPost.gradient,
            slug: testPost.slug,
            files: {
                ko: `${testPost.slug}-ko.html`,
                en: `${testPost.slug}-en.html`,
                default: `${testPost.slug}.html`
            }
        }
    ]
};

// 파일 생성
console.log('Creating test post...');

fs.writeFileSync(path.join(draftsDir, `${testPost.slug}-ko.html`), koHtml);
console.log(`Created: drafts/${testPost.slug}-ko.html`);

fs.writeFileSync(path.join(draftsDir, `${testPost.slug}-en.html`), enHtml);
console.log(`Created: drafts/${testPost.slug}-en.html`);

fs.writeFileSync(path.join(draftsDir, `${testPost.slug}.html`), koHtml);
console.log(`Created: drafts/${testPost.slug}.html`);

fs.writeFileSync(path.join(draftsDir, 'schedule.json'), JSON.stringify(scheduleJson, null, 2));
console.log(`Created: drafts/schedule.json`);

console.log('\nTest post ready for publish date: ' + testPost.publish_date);
console.log('Run GitHub Actions manually to test publishing.');
