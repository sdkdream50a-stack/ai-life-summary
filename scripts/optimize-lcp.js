const fs = require('fs');
const path = require('path');

// Find all HTML files
function findHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Process a single HTML file
function processHtmlFile(filePath, rootDir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = [];

    // 1. Add display=swap to Google Fonts URLs if missing
    const fontUrlRegex = /(fonts\.googleapis\.com\/css2\?[^"']*?)(?:&display=swap)?(['"])/g;
    content = content.replace(fontUrlRegex, (match, url, quote) => {
        if (!url.includes('display=swap')) {
            changes.push('Added display=swap to Google Fonts');
            return url + '&display=swap' + quote;
        }
        return match;
    });

    // 2. Reduce body opacity fallback from 1s to 0.3s for faster LCP
    if (content.includes('animation: showBody 0s 1s forwards')) {
        content = content.replace(
            /animation:\s*showBody\s+0s\s+1s\s+forwards/g,
            'animation: showBody 0s 0.3s forwards'
        );
        changes.push('Reduced opacity fallback from 1s to 0.3s');
    }

    // 3. Add fetchpriority="high" hint for critical CSS if not present
    // (Tailwind CSS should load with high priority)
    if (content.includes('tailwind.css') && !content.includes('fetchpriority')) {
        content = content.replace(
            /<link rel="stylesheet" href="([^"]*tailwind\.css[^"]*)"/g,
            '<link rel="stylesheet" href="$1" fetchpriority="high"'
        );
        changes.push('Added fetchpriority="high" to Tailwind CSS');
    }

    // 4. Add font-display: swap fallback in inline styles
    if (content.includes("font-family: 'Inter'") && !content.includes('font-display')) {
        // This is handled by Google Fonts display=swap parameter
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        return changes;
    }
    return null;
}

// Main
const rootDir = path.resolve(__dirname, '..');
const htmlFiles = findHtmlFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files`);
console.log('---');

let updated = 0;
for (const file of htmlFiles) {
    const changes = processHtmlFile(file, rootDir);
    if (changes && changes.length > 0) {
        console.log(`Updated: ${path.relative(rootDir, file)}`);
        changes.forEach(c => console.log(`  - ${c}`));
        updated++;
    }
}

console.log('---');
console.log(`Total updated: ${updated} files`);
