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

// Calculate relative path to CSS
function getRelativeCssPath(htmlPath, rootDir) {
    const relativePath = path.relative(path.dirname(htmlPath), rootDir);
    const cssPath = path.join(relativePath, 'css', 'tailwind.css').replace(/\\/g, '/');
    return cssPath.startsWith('.') ? cssPath : './' + cssPath;
}

// Process a single HTML file
function processHtmlFile(filePath, rootDir) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if file uses Tailwind CDN
    if (!content.includes('cdn.tailwindcss.com')) {
        return false;
    }

    // Remove Tailwind CDN script
    content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '');

    // Remove inline tailwind.config script block
    content = content.replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*<\/script>\s*/g, '');

    // Calculate the path to CSS based on file location
    const cssPath = getRelativeCssPath(filePath, rootDir);

    // Add local CSS link after Google Fonts link or before </head>
    if (!content.includes('tailwind.css')) {
        // Try to add after the last Google Fonts link
        const googleFontsMatch = content.match(/(<link[^>]*fonts\.googleapis\.com[^>]*>)\s*/g);
        if (googleFontsMatch) {
            const lastGoogleFonts = googleFontsMatch[googleFontsMatch.length - 1];
            content = content.replace(
                lastGoogleFonts,
                lastGoogleFonts + `\n    <!-- Tailwind CSS (Local Build) -->\n    <link rel="stylesheet" href="${cssPath}">\n`
            );
        } else {
            // Fallback: add before </head>
            content = content.replace(
                '</head>',
                `    <!-- Tailwind CSS (Local Build) -->\n    <link rel="stylesheet" href="${cssPath}">\n</head>`
            );
        }
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
