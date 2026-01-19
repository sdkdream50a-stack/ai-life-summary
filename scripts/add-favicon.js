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

// Calculate relative path to favicon
function getRelativePath(htmlPath, rootDir) {
    const relativePath = path.relative(path.dirname(htmlPath), rootDir);
    return relativePath ? relativePath + '/' : './';
}

// Process a single HTML file
function processHtmlFile(filePath, rootDir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Skip if favicon already exists
    if (content.includes('rel="icon"') || content.includes("rel='icon'")) {
        return false;
    }

    const relativePath = getRelativePath(filePath, rootDir);

    // Favicon links to add
    const faviconLinks = `
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="${relativePath}favicon.svg">
    <link rel="apple-touch-icon" href="${relativePath}favicon.svg">`;

    // Add after <meta charset="UTF-8"> or at the beginning of <head>
    if (content.includes('<meta charset="UTF-8">')) {
        content = content.replace(
            '<meta charset="UTF-8">',
            '<meta charset="UTF-8">' + faviconLinks
        );
    } else if (content.includes('<head>')) {
        content = content.replace(
            '<head>',
            '<head>' + faviconLinks
        );
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
