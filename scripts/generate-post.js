const fs = require('fs');
const path = require('path');
const schedule = require('../config/content-schedule.json');
const affiliates = require('../config/affiliates-multilingual.json');

// 템플릿 함수: 각 글 내용 생성
function generateContent(post, affiliateData) {
  const templates = {
    mindset: () => ({
      intro: `50대에 코딩을 시작하는 것은 단순한 기술 습득이 아닌 인지적 도전입니다. ${post.title.split(':')[1] || ''}`,
      section2: "50대 뇌의 인지적 특성",
      section3: "실전 적용 전략",
      section4: "28일 실천 프로그램"
    }),
    nocode: () => ({
      intro: "코딩 없이도 강력한 웹앱을 만들 수 있습니다. 50대 비전공자에게 가장 현실적인 접근법을 설명합니다.",
      section2: "도구 선택의 기준",
      section3: "단계별 구현 가이드",
      section4: "실제 사례 분석"
    }),
    coding: () => ({
      intro: "JavaScript는 50대에게 가장 적합한 프로그래밍 언어입니다. 왜 그런지, 그리고 효과적으로 배우는 법을 알아봅니다.",
      section2: "개념의 쉬운 이해",
      section3: "50대를 위한 학습 팁",
      section4: "실습 예제"
    }),
    project: () => ({
      intro: "기술은 수단이며, 문제 해결이 목적입니다. 50대의 강점을 살린 프로젝트 기획법을 소개합니다.",
      section2: "아이디어 발굴",
      section3: "MVP 정의 및 개발",
      section4: "사용자 확보 전략"
    }),
    deploy: () => ({
      intro: "완성된 웹앱을 세상에 내놓는 과정. 50대도 쉽게 할 수 있는 배포와 운영 방법을 상세히 설명합니다.",
      section2: "배포 플랫폼 선택",
      section3: "도메인 및 SSL 설정",
      section4: "트러블슈팅"
    }),
    career: () => ({
      intro: "기술을 익혔다면 이제 커리어로 연결할 때입니다. 50대 개발자의 브랜딩과 취업 전략을 다룹니다.",
      section2: "포트폴리오 구성",
      section3: "면접 및 네트워킹",
      section4: "수익화 전략"
    })
  };

  const template = templates[post.category] || templates.mindset;
  const content = template();

  // 관련 어필리에이트 링크 선택
  let affiliateBox = '';
  if (affiliateData && affiliateData.links[post.affiliate_key]) {
    const aff = affiliateData.links[post.affiliate_key];
    affiliateBox = `
<div class="affiliate-box" style="border:2px solid #e0e0e0; border-radius:12px; padding:24px; margin:32px 0; background:linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
  <h3 style="font-size:1.25rem; margin-bottom:12px; color:#2c3e50;">${affiliateData.affiliate_box.title}</h3>
  <p style="color:#555; margin-bottom:16px; line-height:1.6;"><strong>${aff.title}</strong><br>${aff.description}</p>
  <a href="${aff.url}?utm_source=smartaitest&utm_medium=blog&utm_campaign=${post.category}" target="_blank" rel="nofollow sponsored" style="display:inline-block; background:#007bff; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">강의 보러가기 →</a>
  <p style="font-size:0.75rem; color:#999; margin-top:12px; font-style:italic;">${affiliateData.affiliate_box.disclaimer}</p>
</div>`;
  }

  return {
    ...content,
    affiliateBox
  };
}

// HTML 파일 생성
function createHTML(post, content, lang) {
  const affiliateConfig = affiliates[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | 50대 개발자 가이드 | AI Test Lab</title>
    <meta name="description" content="${post.title}. 50대 비전공자의 현실적인 코딩 학습과 웹앱 개발 이야기.">
    <meta name="author" content="AI Test Lab 편집팀">
    <link rel="canonical" href="https://smartaitest.com/blog/${lang}/${createSlug(post.title)}">
    <link rel="alternate" hreflang="ko" href="https://smartaitest.com/blog/ko/${createSlug(post.title)}">
    <link rel="alternate" hreflang="en" href="https://smartaitest.com/blog/en/${createSlug(post.title)}">
    <link rel="alternate" hreflang="ja" href="https://smartaitest.com/blog/ja/${createSlug(post.title)}">
    <link rel="alternate" hreflang="zh" href="https://smartaitest.com/blog/zh/${createSlug(post.title)}">
    <link rel="alternate" hreflang="es" href="https://smartaitest.com/blog/es/${createSlug(post.title)}">

    <!-- Open Graph -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="50대 비전공자의 현실적인 코딩 학습과 웹앱 개발 이야기.">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://smartaitest.com/blog/${lang}/${createSlug(post.title)}">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${post.title}",
      "datePublished": "${post.date}",
      "author": {
        "@type": "Person",
        "name": "AI Test Lab 편집팀"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Test Lab",
        "url": "https://smartaitest.com"
      }
    }
    </script>

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6241798439911569" crossorigin="anonymous"></script>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
      body { font-family: 'Noto Sans KR', sans-serif; }
      .prose h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
      .prose p { margin-bottom: 1rem; line-height: 1.8; color: #4b5563; }
      .prose ul, .prose ol { margin-bottom: 1rem; padding-left: 1.5rem; }
      .prose li { margin-bottom: 0.5rem; line-height: 1.7; }
      .insight-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin: 1.5rem 0; }
      .action-checklist { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1.5rem; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-indigo-600">AI Test Lab</a>
                <a href="/blog.html" class="text-gray-600 hover:text-indigo-600">← 블로그</a>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 py-8">
        <article itemscope itemtype="https://schema.org/Article" class="bg-white rounded-xl shadow-sm p-8">
            <header class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                    <span class="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded">${post.category}</span>
                    <span class="text-gray-400 text-sm">Phase ${post.phase}</span>
                </div>
                <h1 itemprop="headline" class="text-3xl font-bold text-gray-900 mb-4">${post.title}</h1>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span itemprop="author">AI Test Lab 편집팀</span>
                    <time itemprop="datePublished" datetime="${post.date}">${post.date}</time>
                    <span>8분 읽기</span>
                </div>
            </header>

            <div class="bg-gray-50 rounded-lg p-4 mb-8">
                <h2 class="font-semibold text-gray-700 mb-2">목차</h2>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li><a href="#intro" class="hover:text-indigo-600">들어가며</a></li>
                    <li><a href="#section2" class="hover:text-indigo-600">1. ${content.section2}</a></li>
                    <li><a href="#section3" class="hover:text-indigo-600">2. ${content.section3}</a></li>
                    <li><a href="#section4" class="hover:text-indigo-600">3. ${content.section4}</a></li>
                    <li><a href="#action" class="hover:text-indigo-600">오늘 바로 실천하기</a></li>
                </ul>
            </div>

            <div class="prose max-w-none">
                <section id="intro" class="mb-8">
                    <p class="text-lg"><strong>핵심 요약:</strong> ${content.intro}</p>
                </section>

                <section id="section2" class="mb-8">
                    <h2>1. ${content.section2}</h2>
                    <p>Harvard Medical School 연구에 따르면, 50대 이후의 뇌는 새로운 정보를 처리하는 방식이 젊은 뇌와 다릅니다. 하지만 이것이 반드시 불리한 것은 아닙니다.</p>
                    <p>50대의 뇌는 패턴 인식과 맥락적 이해에서 오히려 강점을 보입니다. 수십 년간 축적된 경험이 새로운 개념을 기존 지식과 연결하는 데 도움을 주기 때문입니다.</p>
                    <div class="insight-box">
                        <h3 class="font-semibold text-blue-800 mb-2">50대에게 주는 조언</h3>
                        <p class="text-blue-700 text-sm">이 단계에서 흔히 하는 실수는 젊은 사람들과 같은 속도로 배우려고 하는 것입니다. 대신 깊이 있는 이해에 집중하세요.</p>
                    </div>
                </section>

                <section id="section3" class="mb-8">
                    <h2>2. ${content.section3}</h2>
                    <p>구체적인 실천 방법을 단계별로 설명합니다. 50대의 학습 특성을 고려한 맞춤형 접근법입니다.</p>
                    <ul>
                        <li><strong>첫째, 환경 설정을 최적화하세요.</strong> 눈의 피로를 줄이기 위해 화면 설정을 조정하고, 편안한 의자와 적절한 조명을 확보하세요.</li>
                        <li><strong>둘째, 작은 성공 경험을 쌓으세요.</strong> 거창한 프로젝트보다 10분 만에 완성할 수 있는 작은 과제부터 시작하세요.</li>
                        <li><strong>셋째, 커뮤니티에 참여하세요.</strong> 혼자 배우는 것보다 함께 배우는 것이 훨씬 효과적입니다.</li>
                    </ul>
                </section>

                <section id="section4" class="mb-8">
                    <h2>3. ${content.section4}</h2>
                    <p>실제 사례와 데이터를 바탕으로 검증된 방법론을 소개합니다. 50대 학습자들이 가장 효과적이라고 평가한 전략들입니다.</p>
                    <p>특히 중요한 것은 일관성입니다. 매일 30분씩 꾸준히 학습하는 것이 주말에 5시간 몰아서 하는 것보다 훨씬 효과적입니다.</p>
                </section>

                ${content.affiliateBox}

                <section id="action" class="action-checklist">
                    <h2 class="text-green-800 mb-4">오늘 바로 실천하기</h2>
                    <ul class="space-y-2">
                        <li class="flex items-center gap-2">
                            <input type="checkbox" class="w-4 h-4 text-green-600">
                            <span>본문의 핵심 개념 3가지 메모하기</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <input type="checkbox" class="w-4 h-4 text-green-600">
                            <span>15분 실습 시간 확보하기</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <input type="checkbox" class="w-4 h-4 text-green-600">
                            <span>관련 Pillar 가이드 읽어보기</span>
                        </li>
                    </ul>
                </section>
            </div>

            <div class="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                <strong>면책 조항:</strong> 본 콘텐츠는 정보 제공 목적이며 전문 상담을 대체하지 않습니다.
            </div>
        </article>

        <!-- Related Posts -->
        <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-lg mb-4">관련 포스트</h3>
            <p class="text-gray-500 text-sm">더 많은 50대 개발자 가이드를 <a href="/blog.html" class="text-indigo-600 hover:underline">블로그</a>에서 확인하세요.</p>
        </div>
    </main>

    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <p class="text-gray-400">© 2026 AI Test Lab. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^가-힣a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '.html';
}

// 메인 실행 함수
function generateNextPost() {
  const today = new Date().toISOString().split('T')[0];
  const nextPost = schedule.schedule.find(p => p.date === today && !p.published);

  if (!nextPost) {
    console.log('No post scheduled for today:', today);
    return null;
  }

  const content = generateContent(nextPost, affiliates[nextPost.lang]);
  const html = createHTML(nextPost, content, nextPost.lang);

  const outputDir = path.join(__dirname, '../blog', nextPost.lang);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = createSlug(nextPost.title);
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Generated: ${filePath}`);

  // 상태 업데이트
  nextPost.published = true;
  fs.writeFileSync(
    path.join(__dirname, '../config/content-schedule.json'),
    JSON.stringify(schedule, null, 2)
  );

  return filePath;
}

// 실행
generateNextPost();
