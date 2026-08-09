#!/usr/bin/env node
/**
 * Blog Build Script v2.0
 * 마크다운 파일을 SEO 최적화된 HTML로 변환하고 blog.html을 자동 업데이트합니다.
 *
 * 사용법:
 *   node scripts/build-blog.js
 *   npm run build:blog
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../posts');
const BLOG_DIR = path.join(__dirname, '../blog');
const BLOG_HTML = path.join(__dirname, '../blog.html');

// 색상 매핑 (순환용 배열로 변경)
const COLOR_LIST = [
  { name: 'indigo-purple', gradient: 'from-indigo-400 to-purple-500' },
  { name: 'pink-rose', gradient: 'from-pink-400 to-rose-500' },
  { name: 'emerald-teal', gradient: 'from-emerald-400 to-teal-500' },
  { name: 'blue-cyan', gradient: 'from-blue-400 to-cyan-500' },
  { name: 'amber-orange', gradient: 'from-amber-400 to-orange-500' },
  { name: 'violet-fuchsia', gradient: 'from-violet-400 to-fuchsia-500' },
  { name: 'teal-cyan', gradient: 'from-teal-400 to-cyan-500' },
  { name: 'rose-red', gradient: 'from-rose-400 to-red-500' },
  { name: 'green-lime', gradient: 'from-green-400 to-lime-500' },
  { name: 'sky-indigo', gradient: 'from-sky-400 to-indigo-500' }
];

// 이모지 목록 (포스트마다 다른 이모지 적용)
const EMOJI_LIST = [
  '🚀', '🛠️', '💻', '📚', '⚡',
  '🎯', '🔥', '✨', '🌟', '🎨',
  '💡', '🧩', '🔧', '📱', '🌈'
];

// 색상 이름으로 매핑 (호환성 유지)
const COLOR_MAP = {};
COLOR_LIST.forEach(c => COLOR_MAP[c.name] = c);

// 에피소드 번호에 따른 색상 자동 선택
function getColorForEpisode(episode) {
  const idx = (parseInt(episode) - 1) % COLOR_LIST.length;
  return COLOR_LIST[idx];
}

// 에피소드 번호에 따른 이모지 자동 선택
function getEmojiForEpisode(episode) {
  const idx = (parseInt(episode) - 1) % EMOJI_LIST.length;
  return EMOJI_LIST[idx];
}

// 새로운 포맷 파싱 (=== 구분자 사용)
function parsePostContent(content, filename) {
  const meta = {};

  // === 구분자로 메타데이터와 본문 분리
  const separatorMatch = content.match(/^([\s\S]*?)\n===+\n([\s\S]*)$/);

  if (!separatorMatch) {
    console.log('   ⚠️ === 구분자를 찾을 수 없습니다.');
    return { meta: {}, content };
  }

  const metaSection = separatorMatch[1].trim();
  const bodyContent = separatorMatch[2].trim();

  // 메타데이터 파싱 (여러 줄 필드 지원)
  const lines = metaSection.split('\n');
  let currentKey = null;
  let currentValues = [];

  const keyMap = {
    '포커스 키워드': 'focusKeyword',
    '관련 키워드': 'keywords',
    '관련 키워드 (LSI)': 'keywords',
    '메타디스크립션': 'description',
    '메타 디스크립션': 'description',
    'SEO 최적화 제목 제안': 'seoTitles',
    '날짜': 'date',
    '이모지': 'emoji',
    '색상': 'color'
  };

  const saveCurrentField = () => {
    if (currentKey && currentValues.length > 0) {
      const mappedKey = keyMap[currentKey] || currentKey;
      // 여러 줄 값은 쉼표로 합치기
      meta[mappedKey] = currentValues.join(', ').trim();
    }
    currentKey = null;
    currentValues = [];
  };

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');

    // 새로운 필드 시작 (콜론이 있고, keyMap에 등록된 키인 경우만)
    if (colonIndex > 0) {
      const potentialKey = line.slice(0, colonIndex).trim();
      // keyMap에 등록된 키만 새로운 필드로 인식 (SEO 제목 등에서 콜론 포함 값 처리)
      if (keyMap[potentialKey]) {
        saveCurrentField();
        currentKey = potentialKey;
        const value = line.slice(colonIndex + 1).trim();
        if (value) {
          currentValues.push(value);
        }
        return;
      }
    }

    // 현재 필드의 연속 값 (빈 줄이 아닌 경우)
    const trimmedLine = line.trim();
    if (trimmedLine && currentKey) {
      currentValues.push(trimmedLine);
    }
  });

  // 마지막 필드 저장
  saveCurrentField();

  // SEO 제목 제안에서 첫 번째 제목을 title로 사용
  if (meta.seoTitles) {
    // 여러 제목이 쉼표로 구분되어 있음 (줄바꿈된 제목들이 쉼표로 합쳐짐)
    const titles = meta.seoTitles.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 10 && !t.includes('SEO')); // 의미있는 제목만
    if (titles.length > 0 && !meta.title) {
      meta.title = titles[0];
    }
  }

  // 포커스 키워드 기반 제목 생성 (위에서 제목을 못 찾은 경우)
  if (!meta.title && meta.focusKeyword) {
    meta.title = meta.focusKeyword;
  }

  // 본문에서 첫 번째 # 제목 추출 (마크다운인 경우)
  if (!meta.title) {
    const titleMatch = bodyContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      meta.title = titleMatch[1].trim();
    }
  }

  // HTML 본문에서 제목 추출 시도
  if (!meta.title && isHtmlContent(bodyContent)) {
    meta.title = extractTitleFromHtml(bodyContent);
  }

  // 파일명에서 에피소드 번호 추출 (post-1.md -> 1)
  const episodeMatch = filename.match(/post-(\d+)\.md$/);
  if (episodeMatch) {
    meta.episode = episodeMatch[1];
  }

  // 날짜가 없으면 오늘 날짜
  if (!meta.date) {
    meta.date = new Date().toISOString().split('T')[0];
  }

  // 포커스 키워드를 키워드에 추가
  if (meta.focusKeyword && meta.keywords) {
    // 중복 제거
    const allKeywords = [meta.focusKeyword, ...meta.keywords.split(',').map(k => k.trim())];
    const uniqueKeywords = [...new Set(allKeywords)];
    meta.keywords = uniqueKeywords.join(', ');
  } else if (meta.focusKeyword) {
    meta.keywords = meta.focusKeyword;
  }

  return { meta, content: bodyContent };
}

// 마크다운을 HTML로 변환 (개선된 버전)
function markdownToHtml(md) {
  let html = md;

  // 코드블록 변환 (``` 또는 ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const langClass = lang ? ` data-lang="${lang}"` : '';
    const escapedCode = code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"${langClass}><code>${escapedCode}</code></pre>`;
  });

  // 인라인 코드 변환
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // 테이블 변환
  html = html.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter(h => h.trim());
    const rowLines = rows.trim().split('\n');

    let table = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm">';
    table += '<thead><tr class="bg-primary text-white">';
    headers.forEach(h => {
      table += `<th class="p-3 border border-primary/30 text-left font-semibold">${h.trim()}</th>`;
    });
    table += '</tr></thead><tbody>';

    rowLines.forEach((row, i) => {
      const cells = row.split('|').filter(c => c.trim());
      const bgClass = i % 2 === 0 ? 'bg-gray-50' : 'bg-white';
      table += `<tr class="${bgClass}">`;
      cells.forEach(cell => {
        table += `<td class="p-3 border border-gray-200">${cell.trim()}</td>`;
      });
      table += '</tr>';
    });

    table += '</tbody></table></div>';
    return table;
  });

  // 이미지 변환 ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    return `<figure class="my-6"><img src="${url}" alt="${alt}" class="rounded-lg shadow-md w-full" loading="lazy"><figcaption class="text-center text-gray-500 text-sm mt-2">${alt}</figcaption></figure>`;
  });

  // 링크 변환 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener">$1</a>');

  // 제목 변환
  html = html.replace(/^#### (.+)$/gm, '<h4 class="font-heading text-lg font-bold text-gray-800 mt-6 mb-3">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl font-bold text-primary mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mt-10 mb-4">$1</h2>');

  // 볼드 텍스트
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 이탤릭 텍스트
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 취소선
  html = html.replace(/~~(.+?)~~/g, '<del class="text-gray-400">$1</del>');

  // 인용구 (팁 박스, 경고 박스, 일반 인용구)
  html = html.replace(/^> 💡 (.+)$/gm, '<div class="tip-box"><strong>💡 $1</strong></div>');
  html = html.replace(/^> ⚠️ (.+)$/gm, '<div class="warning-box"><strong>⚠️ $1</strong></div>');
  html = html.replace(/^> ℹ️ (.+)$/gm, '<div class="info-box"><strong>ℹ️ $1</strong></div>');
  html = html.replace(/^> ✅ (.+)$/gm, '<div class="success-box"><strong>✅ $1</strong></div>');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-gray-600 my-4">$1</blockquote>');

  // 번호 있는 리스트 변환
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2" value="$1">$2</li>');
  html = html.replace(/(<li[^>]*value[^>]*>.*<\/li>\n?)+/g, '<ol class="list-decimal list-inside space-y-1 text-gray-700 my-4 pl-4">$&</ol>');

  // 리스트 변환 (- 또는 *)
  html = html.replace(/^[-*] (.+)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-2 text-gray-600 my-4">$&</ul>');

  // 수평선
  html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-200">');
  html = html.replace(/^\*\*\*$/gm, '<hr class="my-8 border-gray-200">');

  // 단락 (빈 줄로 구분)
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (para.startsWith('<') || para === '') return para;
    return `<p class="mb-4 text-gray-700 leading-relaxed">${para}</p>`;
  }).join('\n\n');

  // 줄바꿈 처리 (단락 내 줄바꿈)
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

  return html;
}

// 본문이 HTML인지 마크다운인지 감지
function isHtmlContent(content) {
  const trimmed = content.trim();
  // HTML 태그로 시작하면 HTML로 판단
  return trimmed.startsWith('<') && (
    trimmed.startsWith('<div') ||
    trimmed.startsWith('<p') ||
    trimmed.startsWith('<section') ||
    trimmed.startsWith('<article') ||
    trimmed.startsWith('<!--')
  );
}

// HTML 본문에서 제목 추출
function extractTitleFromHtml(content) {
  // h1 태그에서 제목 추출
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();

  // h2 태그에서 첫 번째 제목 추출 (섹션 제목은 제외)
  const h2Matches = content.match(/<h2[^>]*>([^<0-9]+[^<]*)<\/h2>/gi);
  if (h2Matches) {
    for (const match of h2Matches) {
      const textMatch = match.match(/<h2[^>]*>([^<]+)<\/h2>/i);
      if (textMatch) {
        const text = textMatch[1].trim();
        // 숫자로 시작하는 섹션 제목 제외, FAQ 제외
        if (!text.match(/^\d+\./) && !text.includes('FAQ')) {
          return text;
        }
      }
    }
  }

  return null;
}

// HTML 템플릿 생성
function generatePostHtml(meta, content) {
  // HTML인지 마크다운인지 감지하여 처리
  let htmlContent;
  if (isHtmlContent(content)) {
    htmlContent = content; // HTML은 그대로 사용
    // HTML에서 제목 추출 시도 (meta.title이 없는 경우)
    if (!meta.title) {
      meta.title = extractTitleFromHtml(content) || 'Untitled Post';
    }
  } else {
    htmlContent = markdownToHtml(content); // 마크다운은 변환
  }
  // 에피소드 번호에 따라 자동으로 색상 선택
  const colors = meta.color ? (COLOR_MAP[meta.color] || getColorForEpisode(meta.episode)) : getColorForEpisode(meta.episode);

  return `<!DOCTYPE html>
<html lang="${meta.lang || 'ko'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary SEO Meta Tags -->
    <title>${meta.title} | AI Life Summary Blog</title>
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords}">
    <meta name="author" content="AI Life Summary">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${DOMAIN}/blog/post-${meta.episode}.html">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${DOMAIN}/blog/post-${meta.episode}.html">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="${DOMAIN}/assets/images/blog/post-${meta.episode}.png">
    <meta property="og:locale" content="${meta.lang === 'ko' ? 'ko_KR' : 'en_US'}">
    <meta property="og:site_name" content="AI Life Summary">
    <meta property="article:published_time" content="${meta.date}">
    <meta property="article:author" content="AI Life Summary">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="${DOMAIN}/assets/images/blog/post-${meta.episode}.png">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#6366f1',
                        secondary: '#ec4899'
                    },
                    fontFamily: {
                        heading: ['Poppins', 'sans-serif'],
                        body: ['Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Inter', 'Noto Sans KR', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', 'Noto Sans KR', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); }
        .gradient-text {
            background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .tip-box { background-color: #e8f4fd; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .warning-box { background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .info-box { background-color: #f3f4f6; border-left: 4px solid #6b7280; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .success-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        pre code { font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.875rem; line-height: 1.5; }
    </style>

    <!-- AdSense/GA/Clarity via consent-manager.js (Consent Mode v2 gate) -->
    <script src="/js/consent-manager.js"></script>
</head>
<body class="bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <nav class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="flex items-center space-x-2">
                    <span class="text-2xl">&#10024;</span>
                    <span class="font-heading font-bold text-xl gradient-text">AI Life Summary</span>
                </a>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/about.html" class="text-gray-600 hover:text-primary transition">About</a>
                    <a href="/blog.html" class="text-primary font-medium">Blog</a>
                    <a href="/archive.html" class="text-gray-600 hover:text-primary transition">Archive</a>
                    <a href="/contact.html" class="text-gray-600 hover:text-primary transition">Contact</a>
                </div>
                <button id="mobile-menu-btn" class="md:hidden p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col space-y-3">
                    <a href="/about.html" class="text-gray-600 hover:text-primary transition">About</a>
                    <a href="/blog.html" class="text-primary font-medium">Blog</a>
                    <a href="/archive.html" class="text-gray-600 hover:text-primary transition">Archive</a>
                    <a href="/contact.html" class="text-gray-600 hover:text-primary transition">Contact</a>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <!-- Article Header -->
        <article>
            <header class="gradient-bg py-16">
                <div class="max-w-3xl mx-auto px-4 text-center">
                    <div class="flex items-center justify-center space-x-2 mb-4">
                        <span class="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">Episode ${meta.episode}</span>
                        <span class="text-white/70 text-sm">${meta.date}</span>
                    </div>
                    <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        ${meta.title}
                    </h1>
                    <p class="text-white/80 text-lg max-w-2xl mx-auto">
                        ${meta.description}
                    </p>
                </div>
            </header>

            <!-- Article Content -->
            <div class="max-w-3xl mx-auto px-4 py-12">
                <div class="prose prose-lg max-w-none">
                    ${htmlContent}
                </div>

                <!-- Share Buttons -->
                <div class="mt-12 pt-8 border-t border-gray-200">
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div class="flex items-center space-x-3">
                            <span class="text-gray-500 text-sm">Share:</span>
                            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(DOMAIN + '/blog/post-' + meta.episode + '.html')}&text=${encodeURIComponent(meta.title)}" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-400 transition">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(DOMAIN + '/blog/post-' + meta.episode + '.html')}" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-600 transition">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                        </div>
                        <a href="/blog.html" class="text-primary font-medium hover:underline flex items-center space-x-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                            <span>Back to Blog</span>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p class="text-sm">&copy; 2025 AI Life Summary. All rights reserved.</p>
        </div>
    </footer>

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${meta.title}",
      "description": "${meta.description}",
      "author": { "@type": "Person", "name": "AI Life Summary" },
      "datePublished": "${meta.date}",
      "dateModified": "${meta.date}",
      "publisher": {
        "@type": "Organization",
        "name": "AI Life Summary",
        "logo": { "@type": "ImageObject", "url": "${DOMAIN}/assets/images/logo.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "${DOMAIN}/blog/post-${meta.episode}.html" },
      "image": "${DOMAIN}/assets/images/blog/post-${meta.episode}.png",
      "keywords": "${meta.keywords}"
    }
    </script>

    <script>
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    </script>
</body>
</html>`;
}

// 블로그 카드 HTML 생성
function generatePostCard(meta, isPublished = true) {
  // 에피소드 번호에 따라 자동으로 색상과 이모지 선택
  const colors = meta.color ? (COLOR_MAP[meta.color] || getColorForEpisode(meta.episode)) : getColorForEpisode(meta.episode);
  const emoji = meta.emoji || getEmojiForEpisode(meta.episode);
  const statusBadge = isPublished
    ? `<span class="text-xs text-gray-400">${meta.date}</span>`
    : `<span class="text-xs text-gray-400">Coming Soon</span>`;

  return `
                    <!-- Post ${meta.episode} -->
                    <article class="card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div class="h-48 bg-gradient-to-br ${colors.gradient} flex items-center justify-center">
                            <span class="text-6xl">${emoji}</span>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center space-x-2 mb-3">
                                <span class="text-xs text-primary font-medium bg-indigo-50 px-2 py-1 rounded">Episode ${meta.episode}</span>
                                ${statusBadge}
                            </div>
                            <h3 class="font-heading font-semibold text-lg mb-2 line-clamp-2">${meta.title}</h3>
                            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${meta.description}</p>
                            <a href="/blog/post-${meta.episode}.html" class="text-primary text-sm font-medium hover:underline inline-flex items-center space-x-1">
                                <span>Read More</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </div>
                    </article>`;
}

// blog.html 업데이트
function updateBlogHtml(posts) {
  if (!fs.existsSync(BLOG_HTML)) {
    console.log('⚠️  blog.html 파일을 찾을 수 없습니다.');
    return;
  }

  let blogContent = fs.readFileSync(BLOG_HTML, 'utf-8');

  // 에피소드 번호 순으로 정렬 (1, 2, 3, ... 10)
  const sortedPosts = [...posts].sort((a, b) => {
    const episodeA = parseInt(a.episode) || 0;
    const episodeB = parseInt(b.episode) || 0;
    return episodeA - episodeB;
  });

  // 포스트 카드 HTML 생성
  const postsHtml = sortedPosts.map(meta => generatePostCard(meta, true)).join('\n');

  // AUTO-GENERATED 마커 사이의 내용 교체
  const postsRegex = /(<!-- AUTO-GENERATED POSTS START -->)([\s\S]*?)(<!-- AUTO-GENERATED POSTS END -->)/;
  if (postsRegex.test(blogContent)) {
    blogContent = blogContent.replace(postsRegex, `$1\n${postsHtml}\n                    $3`);
    fs.writeFileSync(BLOG_HTML, blogContent);
    console.log('📄 blog.html 업데이트 완료');
  } else {
    console.log('⚠️  blog.html에서 AUTO-GENERATED 마커를 찾을 수 없습니다.');
    console.log('   blog.html에 <!-- AUTO-GENERATED POSTS START --> 와 <!-- AUTO-GENERATED POSTS END --> 마커를 추가하세요.');
  }
}

// The canonical generator owns both sitemap.xml and sitemap-blog.xml.
// Keeping this delegation prevents the legacy markdown builder from restoring
// stale URLs such as blog.html after a blog rebuild.
function updateSitemap() {
  const { execFileSync } = require('child_process');
  execFileSync(process.execPath, [path.join(__dirname, 'generate-sitemap.js')], {
    stdio: 'inherit'
  });
}

// 메인 빌드 함수
function build() {
  console.log('\n🚀 블로그 빌드 시작...\n');

  // posts 디렉토리 확인
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('📁 posts 디렉토리 생성');
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  // blog 디렉토리 확인
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('📁 blog 디렉토리 생성');
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  // 마크다운 파일 목록 가져오기
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('📝 posts/ 폴더에 마크다운 파일이 없습니다.');
    console.log('   npm run new:post 명령어로 새 포스트를 생성하세요.\n');
    return;
  }

  const posts = [];

  files.forEach(file => {
    console.log(`📝 처리 중: ${file}`);
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { meta, content: mdContent } = parsePostContent(content, file);

    if (!meta.title || !meta.episode) {
      console.log(`   ⚠️ 메타데이터 누락: ${file}`);
      console.log('      - 본문에 # 제목이 필요합니다');
      console.log('      - 파일명이 post-{번호}.md 형식이어야 합니다');
      return;
    }

    if (!meta.description) {
      console.log(`   ⚠️ 메타디스크립션이 없습니다: ${file}`);
    }

    // HTML 생성
    const html = generatePostHtml(meta, mdContent);
    const outputPath = path.join(BLOG_DIR, `post-${meta.episode}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`   ✅ 생성됨: blog/post-${meta.episode}.html`);

    posts.push(meta);
  });

  // blog.html 업데이트
  updateBlogHtml(posts);

  // sitemap.xml 업데이트
  updateSitemap();

  console.log(`\n✨ 빌드 완료! ${posts.length}개의 포스트가 생성되었습니다.\n`);
}

// 실행
build();
