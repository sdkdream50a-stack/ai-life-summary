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

// Calculate relative path
function getRelativePath(htmlPath, rootDir) {
    const relativePath = path.relative(path.dirname(htmlPath), rootDir);
    return relativePath ? relativePath + '/' : './';
}

// Old favicon pattern to replace
const oldFaviconPattern = /<!-- Favicon -->\s*\n\s*<link rel="icon" type="image\/svg\+xml" href="[^"]*favicon\.svg">\s*\n\s*<link rel="apple-touch-icon" href="[^"]*favicon\.svg">/g;

// Process a single HTML file
function processHtmlFile(filePath, rootDir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    const relativePath = getRelativePath(filePath, rootDir);

    // New favicon links
    const newFaviconLinks = `<!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="${relativePath}favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="${relativePath}favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="${relativePath}favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="${relativePath}apple-touch-icon.png">
    <link rel="manifest" href="${relativePath}site.webmanifest">`;

    // Replace old favicon links
    if (oldFaviconPattern.test(content)) {
        content = content.replace(oldFaviconPattern, newFaviconLinks);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        return true;
    }
    return false;
}

// Main
const rootDir = path.resolve(__dirname, '..');
const htmlFiles = findHtmlFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files`);

let updated = 0;
for (const file of htmlFiles) {
    if (processHtmlFile(file, rootDir)) {
        console.log(`Updated: ${path.relative(rootDir, file)}`);
        updated++;
    }
}

console.log(`\nTotal updated: ${updated} files`);
