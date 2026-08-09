#!/usr/bin/env node

/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml plus a blog-only sitemap for indexable pages only.
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

const LANGUAGES = ['en', 'ko', 'ja', 'zh', 'es'];

// Indexable page paths. Which locales each path covers is derived from the
// filesystem (see availableLangs) rather than hardcoded — a hardcoded list
// silently goes stale when locale files are added, which is exactly how
// /ja/compatibility/ (the top-converting market) sat outside the sitemap.
// Localized legal pages (/{lang}/privacy-policy/ etc.) are noindex with
// canonical to the root .html versions, so they are skipped by the guard.
// Result pages are noindex and must never be listed.
const LOCALIZED_PAGES = [
    { path: '',                        priority: 1.0, changefreq: 'weekly' },
    { path: 'compatibility/',          priority: 0.9, changefreq: 'weekly' },
    { path: 'age-calculator/',         priority: 0.9, changefreq: 'weekly' },
    { path: 'personality-type/',       priority: 0.9, changefreq: 'weekly' },
    { path: 'about/',                  priority: 0.5, changefreq: 'monthly' },
    { path: 'mood-report/',            priority: 0.8, changefreq: 'monthly' },
    { path: 'holiday-position/',       priority: 0.8, changefreq: 'monthly' },
    { path: 'friend-compatibility/',   priority: 0.8, changefreq: 'weekly' },
    { path: 'marriage-compatibility/', priority: 0.8, changefreq: 'weekly' },
    { path: 'love-type/',              priority: 0.8, changefreq: 'monthly' },
    { path: 'communication-style/',    priority: 0.8, changefreq: 'monthly' },
    { path: 'work-style/',             priority: 0.8, changefreq: 'monthly' },
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
 * Locales whose file for this path exists and is indexable. Drives both the
 * <loc> entries and the hreflang cluster, so the sitemap can never advertise
 * an alternate that isn't there.
 */
function availableLangs(rootDir, pagePath) {
    return LANGUAGES.filter(lang =>
        isNoindex(path.join(rootDir, lang, pagePath, 'index.html')) === false
    );
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

function generateUrlEntry(lang, page, langs, lastmod) {
    return `  <url>
    <loc>${BASE_URL}/${lang}/${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${generateHreflangLinks(page.path, langs)}
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

    // Locale subdirectories are discovered, not hardcoded — the previous
    // hardcoded ['ko','en'] pointed at two empty dirs while blog/ja and
    // blog/es (6 posts each) were never scanned.
    const localeDirs = fs.readdirSync(blogDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    for (const sub of localeDirs) {
        const dir = path.join(blogDir, sub);
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

function renderSitemap(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function generateSitemap() {
    const rootDir = path.join(__dirname, '..');
    const urls = [];
    let skipped = 0;

    console.log('Generating sitemap.xml...\n');

    for (const page of LOCALIZED_PAGES) {
        const langs = availableLangs(rootDir, page.path);
        for (const lang of LANGUAGES) {
            if (langs.includes(lang)) continue;
            const state = isNoindex(path.join(rootDir, lang, page.path, 'index.html'));
            console.warn(`  ! skip (${state === null ? 'missing file' : 'noindex'}): /${lang}/${page.path}`);
            skipped++;
        }
        for (const lang of langs) {
            const filePath = path.join(rootDir, lang, page.path, 'index.html');
            urls.push(generateUrlEntry(lang, page, langs, fileMtime(filePath)));
        }
    }

    const blogPosts = discoverBlogPosts(rootDir);
    for (const post of blogPosts) {
        urls.push(generateStaticUrlEntry(post, post.lastmod));
    }

    const sitemap = renderSitemap(urls);
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
    fs.writeFileSync(
        path.join(rootDir, 'sitemap-blog.xml'),
        renderSitemap(blogPosts.map(post => generateStaticUrlEntry(post, post.lastmod))),
        'utf-8'
    );

    console.log(`\n✓ Generated sitemap.xml with ${urls.length} URLs (${skipped} skipped)`);
    console.log(`  - ${urls.length - blogPosts.length} localized page URLs`);
    console.log(`  - ${blogPosts.length} blog post URLs`);
    console.log('  - sitemap-blog.xml contains blog URLs only');

    return sitemap;
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap, generateHreflangLinks };
