#!/usr/bin/env node
/**
 * Script to split i18n.js into separate language JSON files
 * Run: node scripts/split-i18n.js
 */

const fs = require('fs');
const path = require('path');

// Read the original i18n.js file
const i18nPath = path.join(__dirname, '../js/i18n.js');
const lines = fs.readFileSync(i18nPath, 'utf8').split('\n');

// Create output directory
const outputDir = path.join(__dirname, '../js/i18n');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Language section line numbers (0-indexed)
const langStarts = {
    en: 6,    // Line 7: "    en: {"
    ko: 600,  // Line 601
    ja: 1273, // Line 1274
    zh: 1742, // Line 1743
    es: 2211  // Line 2212
};

const langEnds = {
    en: 599,  // Before ko starts
    ko: 1272, // Before ja starts
    ja: 1741, // Before zh starts
    zh: 2210, // Before es starts
    es: 2679  // Before "const languageNames"
};

Object.entries(langStarts).forEach(([lang, startLine]) => {
    const endLine = langEnds[lang];
    const pairs = {};

    for (let i = startLine + 1; i < endLine; i++) {
        const line = lines[i];
        if (!line) continue;

        const trimmed = line.trim();
        if (!trimmed.startsWith('"')) continue;

        // Parse "key": "value" format
        const match = trimmed.match(/^"([^"]+)":\s*"(.*)"/);
        if (match) {
            let [, key, value] = match;
            // Handle values that end with trailing comma
            if (value.endsWith('",')) {
                value = value.slice(0, -2);
            } else if (value.endsWith('"')) {
                value = value.slice(0, -1);
            }
            // Unescape
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\"/g, '"');
            value = value.replace(/\\\\/g, '\\');
            pairs[key] = value;
        }
    }

    // Write JSON file
    const jsonPath = path.join(outputDir, `${lang}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(pairs, null, 2), 'utf8');

    const size = fs.statSync(jsonPath).size;
    console.log(`Created ${lang}.json (${(size / 1024).toFixed(1)}KB) with ${Object.keys(pairs).length} keys`);
});

console.log('\nDone! Language files created in js/i18n/');
