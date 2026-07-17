#!/usr/bin/env node

/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml with hreflang tags for indexable pages only.
 * Guard: any URL whose local file is missing or carries a noindex robots
 * meta is skipped — the sitemap must never advertise pages that opt out
 * of indexing (GSC "Submitted URL marked noindex").
 *
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://smartaitest.com';

// Curated indexable pages. langs = locales that actually have real content
// (partial locale coverage is intentional — do not blanket-expand to 5 langs).
// Localized legal pages (/{lang}/privacy-policy/ etc.) are noindex with
// canonical to the root .html versions, so they are intentionally absent.
// Result pages are noindex and must never be listed.
const LOCALIZED_PAGES = [
    { path: '',                        langs: ['en', 'ko'],                   priority: 1.0, changefreq: 'weekly' },
    { path: 'compatibility/',          langs: ['en', 'ko'],                   priority: 0.9, changefreq: 'weekly' },
    { path: 'age-calculator/',         langs: ['en', 'ko'],                   priority: 0.9, changefreq: 'weekly' },
    { path: 'personality-type/',       langs: ['en', 'ko'],                   priority: 0.9, changefreq: 'weekly' },
    { path: 'about/',                  langs: ['en', 'ko'],                   priority: 0.5, changefreq: 'monthly' },
    { path: 'mood-report/',            langs: ['ko'],                         priority: 0.8, changefreq: 'monthly' },
    { path: 'holiday-position/',       langs: ['ko'],                         priority: 0.8, changefreq: 'monthly' },
    { path: 'friend-compatibility/',   langs: ['en', 'ko', 'ja'],             priority: 0.8, changefreq: 'weekly' },
    { path: 'marriage-compatibility/', langs: ['en', 'ko', 'ja'],             priority: 0.8, changefreq: 'weekly' },
    { path: 'love-type/',              langs: ['en', 'ko', 'ja', 'zh', 'es'], priority: 0.8, changefreq: 'monthly' },
    { path: 'communication-style/',    langs: ['en', 'ko', 'ja', 'zh', 'es'], priority: 0.8, changefreq: 'monthly' },
    { path: 'work-style/',             langs: ['en', 'ko', 'ja', 'zh', 'es'], priority: 0.8, changefreq: 'monthly' },
];

// Root-level static pages (no hreflang)
const STATIC_PAGES = [
    { path: 'blog.html', priority: 0.8, changefreq: 'weekly' },
];

/**
 * Returns true if the file opts out of indexing, false if indexable,
 * null if the file does not exist.
 */
function isNoindex(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const html = fs.readFileSync(filePath, 'utf8');
    return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) ||
           /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
}

/**
 * lastmod = last git commit date of the file (content change), falling back
 * to filesystem mtime for untracked files. Build scripts rewrite files with
 * identical content, so raw mtime would churn lastmod on every build.
 */
function fileMtime(filePath) {
    try {
        const out = execSync(`git log -1 --format=%as -- "${filePath}"`, {
            cwd: path.dirname(filePath),
            stdio: ['ignore', 'pipe', 'ignore']
        }).toString().trim();
        if (out) return out;
    } catch (e) { /* not a git repo or git unavailable — fall through */ }
    return fs.statSync(filePath).mtime.toISOString().split('T')[0];
}

/**
 * Generate hreflang links for a multi-locale page (omitted for single-locale)
 */
function generateHreflangLinks(pagePath, langs) {
    if (langs.length < 2) return '';
    const links = langs.map(lang =>
        `      <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${lang}/${pagePath}"/>`
    );
    const xDefaultLang = langs.includes('en') ? 'en' : langs[0];
    links.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${xDefaultLang}/${pagePath}"/>`);
    return '\n' + links.join('\n');
}

function generateUrlEntry(lang, page, lastmod) {
    return `  <url>
    <loc>${BASE_URL}/${lang}/${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${generateHreflangLinks(page.path, page.langs)}
  </url>`;
}

function generateStaticUrlEntry(config, lastmod) {
    return `  <url>
    <loc>${BASE_URL}/${config.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
}

/**
 * Discover blog posts — skip noindex/redirect stubs (legacy archived posts).
 */
function discoverBlogPosts(rootDir) {
    const blogDir = path.join(rootDir, 'blog');
    const posts = [];

    if (!fs.existsSync(blogDir)) {
        return posts;
    }

    for (const sub of ['ko', 'en']) {
        const dir = path.join(blogDir, sub);
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (isNoindex(fullPath)) return;
            posts.push({
                path: `blog/${sub}/${file.replace(/\.html$/, '')}`,
                lastmod: fileMtime(fullPath),
                priority: 0.7,
                changefreq: 'monthly'
            });
        });
    }

    // Post URLs are extensionless clean URLs — must match each post's
    // self-canonical (…/blog/<slug> without .html). The hub is the root
    // blog.html static entry, so blog/index.html is skipped here.
    const defaultFiles = fs.readdirSync(blogDir)
        .filter(f => f.endsWith('.html') && f !== 'index.html' &&
                     !fs.statSync(path.join(blogDir, f)).isDirectory());
    defaultFiles.forEach(file => {
        const fullPath = path.join(blogDir, file);
        const html = fs.readFileSync(fullPath, 'utf8');
        if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html) ||
            /<meta\s+http-equiv=["']refresh["']/i.test(html)) {
            return; // skip retired/redirect stubs
        }
        posts.push({
            path: `blog/${file.replace(/\.html$/, '')}`,
            lastmod: fileMtime(fullPath),
            priority: 0.7,
            changefreq: 'monthly'
        });
    });

    return posts;
}

function generateSitemap() {
    const rootDir = path.join(__dirname, '..');
    const urls = [];
    let skipped = 0;

    console.log('Generating sitemap.xml...\n');

    for (const page of LOCALIZED_PAGES) {
        for (const lang of page.langs) {
            const filePath = path.join(rootDir, lang, page.path, 'index.html');
            const noindex = isNoindex(filePath);
            if (noindex === null) {
                console.warn(`  ! skip (missing file): /${lang}/${page.path}`);
                skipped++;
                continue;
            }
            if (noindex) {
                console.warn(`  ! skip (noindex): /${lang}/${page.path}`);
                skipped++;
                continue;
            }
            urls.push(generateUrlEntry(lang, page, fileMtime(filePath)));
        }
    }

    for (const page of STATIC_PAGES) {
        const filePath = path.join(rootDir, page.path);
        const noindex = isNoindex(filePath);
        if (noindex === null || noindex) {
            console.warn(`  ! skip (${noindex === null ? 'missing file' : 'noindex'}): /${page.path}`);
            skipped++;
            continue;
        }
        urls.push(generateStaticUrlEntry(page, fileMtime(filePath)));
    }

    const blogPosts = discoverBlogPosts(rootDir);
    for (const post of blogPosts) {
        urls.push(generateStaticUrlEntry(post, post.lastmod));
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

    console.log(`\n✓ Generated sitemap.xml with ${urls.length} URLs (${skipped} skipped)`);
    console.log(`  - ${urls.length - blogPosts.length - STATIC_PAGES.length} localized page URLs`);
    console.log(`  - ${blogPosts.length} blog post URLs`);

    return sitemap;
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap, generateHreflangLinks };
