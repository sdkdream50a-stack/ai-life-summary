#!/usr/bin/env node

/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml with hreflang tags for all language variants.
 * Follows Google's guidelines for multilingual sitemaps.
 *
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://smartaitest.com';
const LANGUAGES = ['en', 'ko', 'ja', 'zh', 'es'];
const TODAY = new Date().toISOString().split('T')[0];

// Page configurations with priorities and change frequencies
const PAGES = [
    // Main pages (high priority)
    { path: '', priority: 1.0, changefreq: 'weekly', lastmod: TODAY },
    { path: 'life-summary/', priority: 0.9, changefreq: 'weekly', lastmod: TODAY },
    { path: 'compatibility/', priority: 0.9, changefreq: 'weekly', lastmod: TODAY },
    { path: 'age-calculator/', priority: 0.9, changefreq: 'weekly', lastmod: TODAY },
    { path: 'vibe-check/', priority: 0.9, changefreq: 'weekly', lastmod: TODAY },
    { path: 'kpop-match/', priority: 0.9, changefreq: 'weekly', lastmod: TODAY },

    // Result pages (medium priority, noindex but include for completeness)
    { path: 'life-summary/result/', priority: 0.6, changefreq: 'monthly', lastmod: TODAY },
    { path: 'compatibility/result/', priority: 0.6, changefreq: 'monthly', lastmod: TODAY },
    { path: 'age-calculator/result/', priority: 0.6, changefreq: 'monthly', lastmod: TODAY },

    // Legal pages — localized via /{lang}/{slug}/index.html (5 langs x 4 pages = 20 URLs)
    { path: 'privacy-policy/',   priority: 0.4, changefreq: 'yearly', lastmod: TODAY },
    { path: 'disclaimer/',       priority: 0.4, changefreq: 'yearly', lastmod: TODAY },
    { path: 'contact/',          priority: 0.5, changefreq: 'monthly', lastmod: TODAY },
    { path: 'terms-of-service/', priority: 0.4, changefreq: 'yearly', lastmod: TODAY },
];

// Static pages (non-localized for now)
const STATIC_PAGES = [
    { path: 'blog.html', priority: 0.8, changefreq: 'weekly', lastmod: TODAY },
    { path: 'about.html', priority: 0.7, changefreq: 'monthly', lastmod: TODAY },
    { path: 'contact.html', priority: 0.5, changefreq: 'monthly', lastmod: TODAY },
    { path: 'privacy-policy.html', priority: 0.3, changefreq: 'yearly', lastmod: TODAY },
    { path: 'terms-of-service.html', priority: 0.3, changefreq: 'yearly', lastmod: TODAY },
];

/**
 * Generate hreflang links for a page
 */
function generateHreflangLinks(pagePath) {
    const links = LANGUAGES.map(lang => {
        const url = pagePath
            ? `${BASE_URL}/${lang}/${pagePath}`
            : `${BASE_URL}/${lang}/`;
        return `      <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`;
    });

    // Add x-default pointing to English
    const xDefaultUrl = pagePath
        ? `${BASE_URL}/en/${pagePath}`
        : `${BASE_URL}/en/`;
    links.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}"/>`);

    return links.join('\n');
}

/**
 * Generate a single URL entry with hreflang
 */
function generateUrlEntry(lang, pagePath, config) {
    const url = pagePath
        ? `${BASE_URL}/${lang}/${pagePath}`
        : `${BASE_URL}/${lang}/`;

    const hreflangLinks = generateHreflangLinks(pagePath);

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
${hreflangLinks}
  </url>`;
}

/**
 * Generate URL entry for static page (no hreflang)
 */
function generateStaticUrlEntry(config) {
    return `  <url>
    <loc>${BASE_URL}/${config.path}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
}

/**
 * Discover blog posts
 */
function discoverBlogPosts(rootDir) {
    const blogDir = path.join(rootDir, 'blog');
    const posts = [];

    if (!fs.existsSync(blogDir)) {
        return posts;
    }

    // Get Korean blog posts
    const koDir = path.join(blogDir, 'ko');
    if (fs.existsSync(koDir)) {
        const files = fs.readdirSync(koDir).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const stat = fs.statSync(path.join(koDir, file));
            posts.push({
                path: `blog/ko/${file}`,
                lastmod: stat.mtime.toISOString().split('T')[0],
                priority: 0.7,
                changefreq: 'monthly'
            });
        });
    }

    // Get English blog posts
    const enDir = path.join(blogDir, 'en');
    if (fs.existsSync(enDir)) {
        const files = fs.readdirSync(enDir).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const stat = fs.statSync(path.join(enDir, file));
            posts.push({
                path: `blog/en/${file}`,
                lastmod: stat.mtime.toISOString().split('T')[0],
                priority: 0.7,
                changefreq: 'monthly'
            });
        });
    }

    // Get default blog posts — skip noindex/redirect stubs (legacy archived posts).
    // Reason: including noindex/redirect URLs in sitemap signals "low-quality content
    // active promotion" to AdSense + wastes Google crawl budget on dead URLs.
    const defaultFiles = fs.readdirSync(blogDir)
        .filter(f => f.endsWith('.html') && !fs.statSync(path.join(blogDir, f)).isDirectory());
    defaultFiles.forEach(file => {
        const fullPath = path.join(blogDir, file);
        const html = fs.readFileSync(fullPath, 'utf8');
        if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html) ||
            /<meta\s+http-equiv=["']refresh["']/i.test(html)) {
            return; // skip retired/redirect stubs
        }
        const stat = fs.statSync(fullPath);
        posts.push({
            path: `blog/${file}`,
            lastmod: stat.mtime.toISOString().split('T')[0],
            priority: 0.7,
            changefreq: 'monthly'
        });
    });

    return posts;
}

/**
 * Main sitemap generation function
 */
function generateSitemap() {
    const rootDir = path.join(__dirname, '..');
    const urls = [];

    console.log('Generating sitemap.xml...\n');

    // Generate URLs for each language and page combination
    for (const page of PAGES) {
        for (const lang of LANGUAGES) {
            urls.push(generateUrlEntry(lang, page.path, page));
        }
    }

    // Add static pages
    for (const page of STATIC_PAGES) {
        urls.push(generateStaticUrlEntry(page));
    }

    // Add blog posts
    const blogPosts = discoverBlogPosts(rootDir);
    for (const post of blogPosts) {
        urls.push(generateStaticUrlEntry(post));
    }

    // Build complete sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

    // Write sitemap
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

    console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`);
    console.log(`  - ${PAGES.length * LANGUAGES.length} localized page URLs`);
    console.log(`  - ${STATIC_PAGES.length} static page URLs`);
    console.log(`  - ${blogPosts.length} blog post URLs`);

    return sitemap;
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap, generateHreflangLinks };
