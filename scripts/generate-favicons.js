const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'favicon.svg');
const outputDir = path.join(__dirname, '..');

// Read SVG
const svgBuffer = fs.readFileSync(svgPath);

// Generate different sizes
const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
    console.log('Generating favicons from SVG...');

    for (const { name, size } of sizes) {
        const outputPath = path.join(outputDir, name);
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Created: ${name} (${size}x${size})`);
    }

    // Also create favicon.ico (16x16 and 32x32 combined would need different approach)
    // For simplicity, we'll just use 32x32 PNG renamed

    console.log('\nDone! Update HTML with:');
    console.log(`
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    `);
}

generateFavicons().catch(console.error);
