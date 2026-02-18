/**
 * Affiliate Link Injection Script
 * Analyzes post content and injects matching affiliate links
 *
 * Usage: node scripts/inject-affiliates.js <html-file>
 */

const fs = require('fs');
const path = require('path');

// Load affiliate configuration
const affiliatesConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/affiliates-multilingual.json'), 'utf8')
);

/**
 * Detect language from HTML content
 */
function detectLanguage(html) {
    const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/);
    if (langMatch) {
        return langMatch[1].split('-')[0]; // 'ko-KR' -> 'ko'
    }
    // Fallback: check for Korean characters
    if (/[\uAC00-\uD7AF]/.test(html)) {
        return 'ko';
    }
    return 'en';
}

/**
 * Extract keywords from HTML content
 */
function extractKeywords(html) {
    const keywords = [];

    // Extract from title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        keywords.push(...titleMatch[1].split(/[\s\-:,|]+/));
    }

    // Extract from h1, h2 headings
    const headingMatches = html.matchAll(/<h[12][^>]*>([^<]+)<\/h[12]>/gi);
    for (const match of headingMatches) {
        keywords.push(...match[1].split(/[\s\-:,]+/));
    }

    // Extract from meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (descMatch) {
        keywords.push(...descMatch[1].split(/[\s\-:,]+/));
    }

    // Clean and filter keywords
    return keywords
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 2)
        .filter((k, i, arr) => arr.indexOf(k) === i); // unique
}

/**
 * Find best matching affiliate course
 */
function findMatchingCourse(keywords, lang) {
    const langConfig = affiliatesConfig.affiliates[lang] || affiliatesConfig.affiliates['en'];
    let bestMatch = null;
    let bestScore = 0;

    for (const course of langConfig.courses) {
        let score = 0;
        for (const keyword of keywords) {
            for (const courseKeyword of course.keywords) {
                if (courseKeyword.toLowerCase().includes(keyword) ||
                    keyword.includes(courseKeyword.toLowerCase())) {
                    score++;
                }
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = course;
        }
    }

    // If no match, return random course
    if (!bestMatch) {
        bestMatch = langConfig.courses[Math.floor(Math.random() * langConfig.courses.length)];
    }

    return { course: bestMatch, disclaimer: langConfig.disclaimer };
}

/**
 * Generate affiliate box HTML
 */
function generateAffiliateBox(course, disclaimer, lang) {
    const title = lang === 'ko' ? '추천 강좌' : 'Recommended Course';

    return `
            <div class="affiliate-box">
                <h4>${title}</h4>
                <p><a href="${course.url}" target="_blank" rel="noopener noreferrer">${course.title}</a></p>
                <p>${course.description}</p>
                <p class="affiliate-disclaimer">${disclaimer}</p>
            </div>
`;
}

/**
 * Inject affiliate box into HTML
 */
function injectAffiliate(html) {
    // Skip if affiliate box already exists
    if (html.includes('class="affiliate-box"')) {
        console.log('Affiliate box already exists, skipping...');
        return html;
    }

    const lang = detectLanguage(html);
    const keywords = extractKeywords(html);
    const { course, disclaimer } = findMatchingCourse(keywords, lang);

    console.log(`Language: ${lang}`);
    console.log(`Keywords: ${keywords.slice(0, 10).join(', ')}...`);
    console.log(`Matched course: ${course.title}`);

    const affiliateBox = generateAffiliateBox(course, disclaimer, lang);

    // Try to insert after </article> content or before </article>
    if (html.includes('{{AFFILIATE_BOX}}')) {
        return html.replace('{{AFFILIATE_BOX}}', affiliateBox);
    }

    // Insert before closing </article> tag
    if (html.includes('</article>')) {
        return html.replace('</article>', affiliateBox + '\n        </article>');
    }

    // Insert before closing </body> tag
    return html.replace('</body>', affiliateBox + '\n</body>');
}

/**
 * Process single file
 */
function processFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    console.log(`Processing: ${filePath}`);
    const html = fs.readFileSync(filePath, 'utf8');
    const updatedHtml = injectAffiliate(html);

    fs.writeFileSync(filePath, updatedHtml);
    console.log(`Updated: ${filePath}\n`);
}

/**
 * Process all files in directory
 */
function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(dirPath, f));

    console.log(`Found ${files.length} HTML files\n`);

    files.forEach(processFile);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    // Process all drafts
    const draftsDir = path.join(__dirname, '../drafts');
    if (fs.existsSync(draftsDir)) {
        processDirectory(draftsDir);
    } else {
        console.log('No drafts directory found');
    }
} else if (args[0] === '--help') {
    console.log(`
Affiliate Link Injection Script

Usage:
  node inject-affiliates.js              Process all drafts
  node inject-affiliates.js <file>       Process single file
  node inject-affiliates.js <directory>  Process all HTML files in directory
`);
} else {
    const target = args[0];
    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
        processDirectory(target);
    } else {
        processFile(target);
    }
}

console.log('Done!');
