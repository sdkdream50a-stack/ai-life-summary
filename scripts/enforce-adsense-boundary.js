#!/usr/bin/env node

/**
 * Enforce SmartAITest's final AdSense review boundary.
 *
 * Default deny:
 *   - AdSense may execute only on indexable, sitemap-listed blog articles
 *     and the three substantive localized tools.
 *   - Result, navigation, legal, verification, widget, redirect and noindex
 *     pages must never load or embed AdSense.
 *   - Source templates never carry AdSense. The final build step injects one
 *     loader only where this policy allows it.
 *
 * Usage:
 *   node scripts/enforce-adsense-boundary.js
 *   node scripts/enforce-adsense-boundary.js --check
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHECK_ONLY = process.argv.includes('--check');
const PUBLISHER_ID = 'ca-pub-6241798439911569';
const LOADER = `    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}" crossorigin="anonymous"></script>`;

const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.wrangler',
  '.claude',
  '.omc',
  'node_modules',
  'scripts',
  'drafts',
  'templates'
]);

const DIRECT_LOADER_RE = /[ \t]*<script\b[^>]*\bsrc=(["'])[^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*\1[^>]*>\s*<\/script>[ \t]*(?:\r?\n)?/gi;
const ACCOUNT_META_RE = /[ \t]*<meta\b(?=[^>]*\bname=(["'])google-adsense-account\1)[^>]*>[ \t]*(?:\r?\n)?/gi;
const ADS_INS_RE = /<ins\b(?=[^>]*\bclass=(["'])[^"']*\badsbygoogle\b[^"']*\1)[^>]*>[\s\S]*?<\/ins>/gi;
const SCRIPT_BLOCK_RE = /[ \t]*<script\b([^>]*)>([\s\S]*?)<\/script>[ \t]*(?:\r?\n)?/gi;
const NOINDEX_RE = /<meta\b[^>]*\bname=(["'])robots\1[^>]*\bcontent=(["'])[^"']*\bnoindex\b[^"']*\2[^>]*>|<meta\b[^>]*\bcontent=(["'])[^"']*\bnoindex\b[^"']*\3[^>]*\bname=(["'])robots\4[^>]*>/i;
const REFRESH_RE = /<meta\b[^>]*\bhttp-equiv=(["'])refresh\1[^>]*>/i;
const ADS_MANAGER_REFERENCE_RE = /<script\b[^>]*\bsrc=(["'])[^"']*\/?js\/ads-manager\.js[^"']*\1[^>]*>/i;

function walkHtml(dir, excludedDirs = EXCLUDED_DIRS) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtml(fullPath, excludedDirs));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function sitemapPaths() {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return new Set(
    [...sitemap.matchAll(/<loc>https:\/\/smartaitest\.com(\/[^<]*)<\/loc>/g)]
      .map(match => match[1])
  );
}

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function publicPathForFile(relativePath) {
  const localizedTool = relativePath.match(/^(en|ko|ja|zh|es)\/(compatibility|age-calculator|personality-type)\/index\.html$/);
  if (localizedTool) return `/${localizedTool[1]}/${localizedTool[2]}/`;

  const blogArticle = relativePath.match(/^blog\/(.+)\.html$/);
  if (blogArticle && blogArticle[1] !== 'index') return `/blog/${blogArticle[1]}`;

  return null;
}

function isAllowed(relativePath, html, indexedPaths) {
  const publicPath = publicPathForFile(relativePath);
  return Boolean(
    publicPath &&
    indexedPaths.has(publicPath) &&
    !NOINDEX_RE.test(html) &&
    !REFRESH_RE.test(html)
  );
}

function loaderCount(html) {
  return (html.match(DIRECT_LOADER_RE) || []).length;
}

function hasCorrectPublisherLoader(html) {
  return html.includes(`adsbygoogle.js?client=${PUBLISHER_ID}`);
}

function hasInlineAdScript(html) {
  return [...html.matchAll(SCRIPT_BLOCK_RE)].some(match =>
    !/\bsrc\s*=/.test(match[1]) &&
    /adsbygoogle|google_ad_client|data-ad-client|data-ad-slot/i.test(match[2])
  );
}

function executionProblems(html) {
  const problems = [];
  if (loaderCount(html) > 0) problems.push('direct loader');
  if ((html.match(ACCOUNT_META_RE) || []).length) problems.push('AdSense account meta');
  if ((html.match(ADS_INS_RE) || []).length) problems.push('adsbygoogle element');
  if (hasInlineAdScript(html)) problems.push('inline AdSense script');
  if (ADS_MANAGER_REFERENCE_RE.test(html)) problems.push('legacy ads-manager.js reference');
  return problems;
}

function cleanObsoleteComments(html) {
  return html
    .replace(/<!--\s*AdSense loaded via consent manager\s*-->/gi, '')
    .replace(/;\s*AdSense script loaded directly below/gi, '');
}

function stripExecution(html) {
  return cleanObsoleteComments(html)
    .replace(DIRECT_LOADER_RE, '')
    .replace(ACCOUNT_META_RE, '')
    .replace(ADS_INS_RE, '')
    .replace(SCRIPT_BLOCK_RE, (block, attributes, body) => {
      const isInline = !/\bsrc\s*=/.test(attributes);
      const isAdSense = /adsbygoogle|google_ad_client|data-ad-client|data-ad-slot/i.test(body);
      return isInline && isAdSense ? '' : block;
    });
}

function injectLoader(html, relativePath) {
  if (!/<\/head>/i.test(html)) {
    throw new Error(`${relativePath}: cannot inject AdSense loader without </head>`);
  }
  return html.replace(/<\/head>/i, `${LOADER}\n</head>`);
}

function assertRuntimeSourceBoundary() {
  const monetizationPath = path.join(ROOT, 'js', 'monetization.js');
  const monetization = fs.readFileSync(monetizationPath, 'utf8');
  const forbidden = [
    'adsbygoogle',
    'ADSENSE_CONFIG',
    'InterstitialAdManager',
    'data-ad-client',
    'data-ad-slot'
  ].filter(token => monetization.includes(token));

  if (forbidden.length) {
    throw new Error(`js/monetization.js still contains dynamic AdSense code: ${forbidden.join(', ')}`);
  }
}

function enforce() {
  const indexedPaths = sitemapPaths();
  const deployableFiles = walkHtml(ROOT);
  const templateFiles = [
    path.join(ROOT, 'scripts', 'templates'),
    path.join(ROOT, 'templates')
  ].flatMap(templateDir =>
    fs.existsSync(templateDir) ? walkHtml(templateDir, new Set()) : []
  );

  let allowed = 0;
  let blocked = 0;
  let changed = 0;
  const failures = [];

  for (const filePath of deployableFiles) {
    const rel = relative(filePath);
    const before = fs.readFileSync(filePath, 'utf8');
    const allow = isAllowed(rel, before, indexedPaths);
    let after = cleanObsoleteComments(before);

    if (allow) {
      allowed++;
      if (loaderCount(after) !== 1 || !hasCorrectPublisherLoader(after)) {
        after = stripExecution(after);
        after = injectLoader(after, rel);
      }
    } else {
      blocked++;
      after = stripExecution(after);
    }

    if (!CHECK_ONLY && after !== before) {
      fs.writeFileSync(filePath, after);
      changed++;
    }

    const inspected = CHECK_ONLY ? before : after;
    const count = loaderCount(inspected);
    if (allow && (count !== 1 || !hasCorrectPublisherLoader(inspected))) {
      failures.push(`${rel}: allowed page must have exactly one loader for ${PUBLISHER_ID}`);
    }
    if (allow && ADS_MANAGER_REFERENCE_RE.test(inspected)) {
      failures.push(`${rel}: allowed page references legacy ads-manager.js`);
    }
    if (!allow) {
      const problems = executionProblems(inspected);
      if (problems.length) failures.push(`${rel}: blocked page has ${problems.join(', ')}`);
    }
  }

  for (const filePath of templateFiles) {
    const rel = relative(filePath);
    const before = fs.readFileSync(filePath, 'utf8');
    const after = stripExecution(before);

    if (!CHECK_ONLY && after !== before) {
      fs.writeFileSync(filePath, after);
      changed++;
    }

    const inspected = CHECK_ONLY ? before : after;
    const problems = executionProblems(inspected);
    if (problems.length) failures.push(`${rel}: source template has ${problems.join(', ')}`);
  }

  assertRuntimeSourceBoundary();

  if (failures.length) {
    console.error(`AdSense boundary FAILED (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
    failures.forEach(failure => console.error(`  - ${failure}`));
    process.exitCode = 1;
    return;
  }

  const mode = CHECK_ONLY ? 'verified' : 'enforced';
  console.log(`AdSense boundary ${mode}: ${allowed} allowed, ${blocked} blocked deployable HTML files, ${templateFiles.length} source templates, ${changed} changed.`);
}

enforce();
