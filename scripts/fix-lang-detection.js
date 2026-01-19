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

// Old language detection pattern (multiple variations)
const oldPatterns = [
    // Pattern 1: Standard format
    /\/\/ Check browser languages\s*\n\s*var browserLangs = navigator\.languages \|\| \[navigator\.language\];\s*\n\s*for \(var i = 0; i < browserLangs\.length; i\+\+\) \{\s*\n\s*var code = browserLangs\[i\]\.split\('-'\)\[0\]\.toLowerCase\(\);\s*\n\s*if \(supportedLangs\.indexOf\(code\) !== -1\) \{ lang = code; break; \}\s*\n\s*\}/g,

    // Pattern 2: With extra whitespace
    /\/\/ Check browser languages\s*\n\s*var browserLangs = navigator\.languages \|\| \[navigator\.language\];\s*\n\s*for \(var i = 0; i < browserLangs\.length; i\+\+\) \{\s*\n\s*var code = browserLangs\[i\]\.split\('-'\)\[0\]\.toLowerCase\(\);\s*\n\s*if \(supportedLangs\.indexOf\(code\) !== -1\) \{\s*\n?\s*lang = code;\s*\n?\s*break;\s*\n?\s*\}\s*\n?\s*\}/g
];

// New improved language detection
const newLangDetection = `// Check browser languages (prioritize Korean for Korean users)
                var browserLangs = navigator.languages || [navigator.language];
                var langCodes = browserLangs.map(function(l) { return l.split('-')[0].toLowerCase(); });

                // If Korean is anywhere in user's languages, use Korean (for Korean mobile users)
                if (langCodes.indexOf('ko') !== -1) {
                    lang = 'ko';
                } else {
                    // Otherwise use first matching supported language
                    for (var i = 0; i < langCodes.length; i++) {
                        if (supportedLangs.indexOf(langCodes[i]) !== -1) {
                            lang = langCodes[i];
                            break;
                        }
                    }
                }`;

// Process a single HTML file
function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Try to replace the old pattern with the new one
    // Look for the browser language detection block
    const searchPattern = /\/\/ Check browser languages[\s\S]*?for \(var i = 0; i < browserLangs\.length; i\+\+\)[\s\S]*?break;[\s\S]*?\}\s*\n\s*\}/;

    if (searchPattern.test(content)) {
        content = content.replace(searchPattern, newLangDetection);
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
    if (processHtmlFile(file)) {
        console.log(`Updated: ${path.relative(rootDir, file)}`);
        updated++;
    }
}

console.log(`\nTotal updated: ${updated} files`);
