import os
from datetime import datetime

# 제외할 경로 및 파일
exclude_paths = ['node_modules', '.git', 'drafts', 'templates']
exclude_files = ['404.html', 'google0ce5b5ec68f3c712.html', 'yandex_25414c364f8a090f.html', 'generate.html']
result_pages = ['result.html', 'result/index.html', 'compare.html']

# 우선순위 및 변경 빈도 설정
priority_map = {
    '/': 1.0,
    'index.html': 1.0,
    'life-summary': 0.9,
    'age-calculator': 0.8,
    'compatibility': 0.8,
    'blog': 0.7,
    'about': 0.5,
    'default': 0.6
}

changefreq_map = {
    'blog': 'weekly',
    'index': 'weekly',
    'default': 'monthly'
}

def get_priority(path):
    if path == '/':
        return 1.0
    for key, priority in priority_map.items():
        if key in path:
            return priority
    return priority_map['default']

def get_changefreq(path):
    for key, freq in changefreq_map.items():
        if key in path:
            return freq
    return changefreq_map['default']

def path_to_url(path):
    """Convert file path to URL"""
    # index.html을 처리
    if path == 'index.html':
        return 'https://smartaitest.com/'
    
    url = path.replace('index.html', '')
    if url == '':
        url = '/'
    elif not url.endswith('/') and not url.endswith('.html'):
        url += '/'
    return 'https://smartaitest.com/' + url

# 페이지 수집
pages = []
hreflang_groups = {}

# 루트 페이지 명시적 추가
pages.append({
    'url': 'https://smartaitest.com/',
    'priority': 1.0,
    'changefreq': 'weekly',
    'lastmod': '2026-02-16',
    'lang': None,
    'base_path': ''
})

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in exclude_paths and not d.startswith('.')]
    
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            url_path = filepath[2:]  # './' 제거
            
            # index.html은 이미 루트로 추가했으므로 스킵
            if url_path == 'index.html':
                continue
            
            # 제외 파일 체크
            if any(ef in url_path for ef in exclude_files):
                continue
            
            # 결과 페이지는 noindex이므로 사이트맵에서 제외
            if any(rp in url_path for rp in result_pages):
                continue
                
            url = path_to_url(url_path)
            priority = get_priority(url_path)
            changefreq = get_changefreq(url_path)
            
            # 다국어 그룹 생성
            lang = None
            base_path = url_path
            if url_path.startswith('ko/'):
                lang = 'ko'
                base_path = url_path[3:]
            elif url_path.startswith('en/'):
                lang = 'en'
                base_path = url_path[3:]
            elif url_path.startswith('ja/'):
                lang = 'ja'
                base_path = url_path[3:]
            elif url_path.startswith('zh/'):
                lang = 'zh'
                base_path = url_path[3:]
            elif url_path.startswith('es/'):
                lang = 'es'
                base_path = url_path[3:]
            
            page_info = {
                'url': url,
                'priority': priority,
                'changefreq': changefreq,
                'lastmod': '2026-02-16',
                'lang': lang,
                'base_path': base_path
            }
            
            pages.append(page_info)
            
            # hreflang 그룹핑
            if lang:
                if base_path not in hreflang_groups:
                    hreflang_groups[base_path] = {}
                hreflang_groups[base_path][lang] = url

# 사이트맵 XML 생성
xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
]

# 우선순위로 정렬
pages.sort(key=lambda x: (-x['priority'], x['url']))

for page in pages:
    xml_lines.append('  <url>')
    xml_lines.append(f'    <loc>{page["url"]}</loc>')
    xml_lines.append(f'    <lastmod>{page["lastmod"]}</lastmod>')
    xml_lines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
    xml_lines.append(f'    <priority>{page["priority"]}</priority>')
    
    # hreflang 추가
    if page['lang'] and page['base_path'] in hreflang_groups:
        alternates = hreflang_groups[page['base_path']]
        for lang, alt_url in sorted(alternates.items()):
            xml_lines.append(f'      <xhtml:link rel="alternate" hreflang="{lang}" href="{alt_url}"/>')
        # x-default 추가 (영어 우선)
        if 'en' in alternates:
            xml_lines.append(f'      <xhtml:link rel="alternate" hreflang="x-default" href="{alternates["en"]}"/>')
    
    xml_lines.append('  </url>')

xml_lines.append('</urlset>')

print('\n'.join(xml_lines))
print(f'\n<!-- Total URLs: {len(pages)} -->', file=__import__('sys').stderr)
