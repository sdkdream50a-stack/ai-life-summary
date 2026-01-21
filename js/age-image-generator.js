/**
 * AI Age Calculator - Image Generator
 * Creates shareable images using Canvas API
 */

// ============================================
// IMAGE CONFIGURATION
// ============================================

const IMAGE_CONFIGS = {
    story: {
        width: 1080,
        height: 1920,
        name: 'story'
    },
    square: {
        width: 1080,
        height: 1080,
        name: 'square'
    }
};

// Color schemes based on age gap
const COLOR_SCHEMES = {
    veryYoung: {
        gradient: ['#10b981', '#06b6d4'],  // Emerald to Cyan
        accent: '#34d399',
        text: '#ffffff'
    },
    young: {
        gradient: ['#3b82f6', '#8b5cf6'],  // Blue to Purple
        accent: '#60a5fa',
        text: '#ffffff'
    },
    balanced: {
        gradient: ['#f59e0b', '#f97316'],  // Amber to Orange
        accent: '#fbbf24',
        text: '#ffffff'
    },
    older: {
        gradient: ['#8b5cf6', '#ec4899'],  // Purple to Pink
        accent: '#a78bfa',
        text: '#ffffff'
    },
    veryOld: {
        gradient: ['#6366f1', '#8b5cf6'],  // Indigo to Purple
        accent: '#818cf8',
        text: '#ffffff'
    }
};

// ============================================
// MAIN IMAGE GENERATION FUNCTIONS
// ============================================

/**
 * Generate result image in specified format
 * @param {Object} results - Age calculation results
 * @param {string} format - 'story' or 'square'
 * @returns {Promise<string>} - Data URL of generated image
 */
async function generateAgeImage(results, format = 'story') {
    const config = IMAGE_CONFIGS[format] || IMAGE_CONFIGS.story;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = config.width;
    canvas.height = config.height;

    // Determine color scheme based on average gap
    const avgGap = ((results.mentalAge - results.realAge) + (results.energyAge - results.realAge)) / 2;
    const colorScheme = getColorScheme(avgGap);

    // Draw background
    drawGradientBackground(ctx, config, colorScheme);

    // Draw decorative elements
    drawDecorations(ctx, config, colorScheme);

    // Draw content based on format
    if (format === 'story') {
        await drawStoryContent(ctx, config, results, colorScheme);
    } else {
        await drawSquareContent(ctx, config, results, colorScheme);
    }

    // Draw watermark
    drawWatermark(ctx, config);

    return canvas.toDataURL('image/png');
}

/**
 * Generate and download image
 */
async function downloadAgeImage(results, format = 'story') {
    try {
        const dataUrl = await generateAgeImage(results, format);
        const link = document.createElement('a');
        link.download = `my-ai-age-${format}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        return { success: true };
    } catch (error) {
        console.error('Image generation failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

/**
 * Draw gradient background
 */
function drawGradientBackground(ctx, config, colorScheme) {
    const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
    gradient.addColorStop(0, colorScheme.gradient[0]);
    gradient.addColorStop(1, colorScheme.gradient[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
}

/**
 * Draw decorative elements
 */
function drawDecorations(ctx, config, colorScheme) {
    ctx.globalAlpha = 0.1;

    // Draw circles
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * config.width;
        const y = Math.random() * config.height;
        const radius = 50 + Math.random() * 150;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

/**
 * Draw content for Story format (1080x1920)
 */
async function drawStoryContent(ctx, config, results, colorScheme) {
    const centerX = config.width / 2;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = 'bold 72px Poppins, sans-serif';
    ctx.fillText('My AI Age', centerX, 200);

    ctx.font = '36px Inter, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('AI Test Lab', centerX, 260);
    ctx.globalAlpha = 1;

    // Main result card
    const cardY = 350;
    const cardWidth = 900;
    const cardHeight = 1100;
    const cardX = (config.width - cardWidth) / 2;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 40);
    ctx.fill();

    // Real Age
    ctx.fillStyle = '#374151';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText('Real Age', centerX, cardY + 80);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 120px Poppins, sans-serif';
    ctx.fillText(results.realAge.toString(), centerX, cardY + 220);

    ctx.fillStyle = '#6b7280';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText('years old', centerX, cardY + 270);

    // Divider
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 50, cardY + 330);
    ctx.lineTo(cardX + cardWidth - 50, cardY + 330);
    ctx.stroke();

    // Mental Age
    const mentalGap = results.mentalAge - results.realAge;
    drawAgeBox(ctx, cardX + 50, cardY + 370, 380, 300,
        'Mental Age', results.mentalAge, mentalGap,
        ['#8b5cf6', '#6366f1'], '#8b5cf6');

    // Energy Age
    const energyGap = results.energyAge - results.realAge;
    drawAgeBox(ctx, cardX + cardWidth - 430, cardY + 370, 380, 300,
        'Energy Age', results.energyAge, energyGap,
        ['#10b981', '#06b6d4'], '#10b981');

    // Summary text
    const avgGap = (mentalGap + energyGap) / 2;
    let summaryText;
    if (avgGap <= -5) {
        summaryText = "Younger than my age!";
    } else if (avgGap <= 2) {
        summaryText = "Perfectly balanced!";
    } else {
        summaryText = "Wise soul energy!";
    }

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 40px Poppins, sans-serif';
    ctx.fillText(summaryText, centerX, cardY + 760);

    // Gap summary
    ctx.font = '28px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    const mentalText = mentalGap <= 0 ? `Mental: ${Math.abs(mentalGap)}y younger` : `Mental: ${mentalGap}y older`;
    const energyText = energyGap <= 0 ? `Energy: ${Math.abs(energyGap)}y younger` : `Energy: ${energyGap}y older`;
    ctx.fillText(`${mentalText}  |  ${energyText}`, centerX, cardY + 820);

    // Emoji decoration
    ctx.font = '80px sans-serif';
    ctx.fillText(getResultEmoji(avgGap), centerX, cardY + 980);

    // Rarity badge
    drawAgeRarityBadge(ctx, config, results, 1530);

    // Hashtags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText('#MyAIAge  #AgeCalculator', centerX, 1600);

    // URL
    ctx.font = '24px Inter, sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('smartaitest.com/age-calculator', centerX, 1660);
    ctx.globalAlpha = 1;
}

/**
 * Draw content for Square format (1080x1080)
 */
async function drawSquareContent(ctx, config, results, colorScheme) {
    const centerX = config.width / 2;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = 'bold 56px Poppins, sans-serif';
    ctx.fillText('My AI Age', centerX, 100);

    // Main card
    const cardWidth = 950;
    const cardHeight = 750;
    const cardX = (config.width - cardWidth) / 2;
    const cardY = 150;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 30);
    ctx.fill();

    // Real Age - compact
    ctx.fillStyle = '#374151';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText('Real Age', centerX, cardY + 50);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 80px Poppins, sans-serif';
    ctx.fillText(results.realAge.toString(), centerX, cardY + 140);

    ctx.fillStyle = '#6b7280';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText('years old', centerX, cardY + 175);

    // Divider
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 210);
    ctx.lineTo(cardX + cardWidth - 40, cardY + 210);
    ctx.stroke();

    // Mental Age - compact
    const mentalGap = results.mentalAge - results.realAge;
    drawAgeBoxCompact(ctx, cardX + 40, cardY + 240, 420, 220,
        'Mental Age', results.mentalAge, mentalGap,
        ['#8b5cf6', '#6366f1']);

    // Energy Age - compact
    const energyGap = results.energyAge - results.realAge;
    drawAgeBoxCompact(ctx, cardX + cardWidth - 460, cardY + 240, 420, 220,
        'Energy Age', results.energyAge, energyGap,
        ['#10b981', '#06b6d4']);

    // Summary
    const avgGap = (mentalGap + energyGap) / 2;
    let summaryText = avgGap <= -5 ? "Younger than my age!" :
                      avgGap <= 2 ? "Perfectly balanced!" : "Wise soul energy!";

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 32px Poppins, sans-serif';
    ctx.fillText(summaryText, centerX, cardY + 540);

    // Emoji
    ctx.font = '60px sans-serif';
    ctx.fillText(getResultEmoji(avgGap), centerX, cardY + 650);

    // Rarity badge (smaller for square)
    ctx.font = 'bold 20px Inter, sans-serif';
    const lang = document.documentElement.lang || 'en';
    const rarityPercent = calculateAgeRarity(results);
    const rarityLabel = '\u2B50 ' + getAgeRarityLabel(rarityPercent, lang);
    const badgeWidth = ctx.measureText(rarityLabel).width + 40;
    const badgeHeight = 32;
    const badgeX = (config.width - badgeWidth) / 2;
    const badgeY = 915;

    const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
    badgeGradient.addColorStop(0, '#fbbf24');
    badgeGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = badgeGradient;

    ctx.beginPath();
    const badgeRadius = badgeHeight / 2;
    ctx.moveTo(badgeX + badgeRadius, badgeY);
    ctx.lineTo(badgeX + badgeWidth - badgeRadius, badgeY);
    ctx.arc(badgeX + badgeWidth - badgeRadius, badgeY + badgeRadius, badgeRadius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(badgeX + badgeRadius, badgeY + badgeHeight);
    ctx.arc(badgeX + badgeRadius, badgeY + badgeRadius, badgeRadius, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(rarityLabel, centerX, badgeY + 22);

    // Bottom info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('#MyAIAge  #AgeCalculator', centerX, 980);

    ctx.font = '20px Inter, sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('smartaitest.com/age-calculator', centerX, 1020);
    ctx.globalAlpha = 1;
}

/**
 * Draw age box for Story format
 */
function drawAgeBox(ctx, x, y, width, height, label, age, gap, gradientColors, accentColor) {
    // Box background with gradient
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, width, height, 20);
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '26px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + 45);

    // Age number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Poppins, sans-serif';
    ctx.fillText(age.toString(), x + width / 2, y + 150);

    // Gap label
    ctx.font = '24px Inter, sans-serif';
    ctx.globalAlpha = 0.9;
    const gapText = gap <= 0 ? `${Math.abs(gap)}y younger` : `${gap}y older`;
    ctx.fillText(gapText, x + width / 2, y + 200);
    ctx.globalAlpha = 1;

    // Gap indicator
    ctx.font = '40px sans-serif';
    const indicator = gap <= -5 ? '⬇️' : gap >= 5 ? '⬆️' : '➡️';
    ctx.fillText(indicator, x + width / 2, y + 265);
}

/**
 * Draw compact age box for Square format
 */
function drawAgeBoxCompact(ctx, x, y, width, height, label, age, gap, gradientColors) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, width, height, 16);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Poppins, sans-serif';
    ctx.fillText(age.toString(), x + width / 2, y + 110);

    ctx.font = '20px Inter, sans-serif';
    ctx.globalAlpha = 0.9;
    const gapText = gap <= 0 ? `${Math.abs(gap)}y younger` : `${gap}y older`;
    ctx.fillText(gapText, x + width / 2, y + 150);
    ctx.globalAlpha = 1;

    const indicator = gap <= -5 ? '⬇️' : gap >= 5 ? '⬆️' : '➡️';
    ctx.font = '30px sans-serif';
    ctx.fillText(indicator, x + width / 2, y + 195);
}

/**
 * Draw watermark
 */
function drawWatermark(ctx, config) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AI Test Lab', config.width / 2, config.height - 30);
    ctx.globalAlpha = 1;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Get color scheme based on age gap
 */
function getColorScheme(avgGap) {
    if (avgGap <= -7) return COLOR_SCHEMES.veryYoung;
    if (avgGap <= -3) return COLOR_SCHEMES.young;
    if (avgGap <= 3) return COLOR_SCHEMES.balanced;
    if (avgGap <= 7) return COLOR_SCHEMES.older;
    return COLOR_SCHEMES.veryOld;
}

/**
 * Get result emoji based on gap
 */
function getResultEmoji(avgGap) {
    if (avgGap <= -7) return '🌟';
    if (avgGap <= -3) return '✨';
    if (avgGap <= 3) return '⚖️';
    if (avgGap <= 7) return '🧘';
    return '📚';
}

/**
 * Calculate rarity for age result
 */
function calculateAgeRarity(results) {
    const str = String(results.realAge) + String(results.mentalAge) + String(results.energyAge);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    const normalized = Math.abs(hash % 100);
    if (normalized < 10) return 5;
    if (normalized < 25) return 8;
    if (normalized < 45) return 12;
    if (normalized < 65) return 18;
    if (normalized < 85) return 23;
    return 30;
}

/**
 * Get rarity label for age
 */
function getAgeRarityLabel(percent, lang = 'en') {
    const labels = {
        en: `Top ${percent}% Profile`,
        ko: `\uC0C1\uC704 ${percent}% \uD504\uB85C\uD544`,
        ja: `\u4E0A\u4F4D ${percent}% \u30D7\u30ED\u30D5\u30A3\u30FC\u30EB`,
        zh: `\u524D ${percent}% \u6863\u6848`,
        es: `Top ${percent}% Perfil`
    };
    return labels[lang] || labels.en;
}

/**
 * Draw rarity badge for age images
 */
function drawAgeRarityBadge(ctx, config, results, y) {
    const centerX = config.width / 2;
    const lang = document.documentElement.lang || 'en';
    const rarityPercent = calculateAgeRarity(results);
    const rarityLabel = '\u2B50 ' + getAgeRarityLabel(rarityPercent, lang);

    ctx.font = 'bold 24px Inter, sans-serif';
    const badgeWidth = ctx.measureText(rarityLabel).width + 50;
    const badgeHeight = 40;
    const badgeX = (config.width - badgeWidth) / 2;
    const badgeY = y - 25;

    // Golden gradient
    const gradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;

    // Pill shape
    ctx.beginPath();
    const radius = badgeHeight / 2;
    ctx.moveTo(badgeX + radius, badgeY);
    ctx.lineTo(badgeX + badgeWidth - radius, badgeY);
    ctx.arc(badgeX + badgeWidth - radius, badgeY + radius, radius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(badgeX + radius, badgeY + badgeHeight);
    ctx.arc(badgeX + radius, badgeY + radius, radius, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(rarityLabel, centerX, y);
}

// ============================================
// COMPARISON IMAGE GENERATION
// ============================================

/**
 * Generate comparison image with two people's results
 */
async function generateComparisonImage(myResults, friendResults, format = 'story') {
    const config = IMAGE_CONFIGS[format] || IMAGE_CONFIGS.story;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = config.width;
    canvas.height = config.height;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);

    // Decorations
    drawDecorations(ctx, config, COLOR_SCHEMES.balanced);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 64px Poppins, sans-serif';
    ctx.fillText('Age Comparison', config.width / 2, 150);

    // Draw two columns
    const colWidth = 450;
    const startY = format === 'story' ? 250 : 200;

    // My results (left)
    drawComparisonColumn(ctx, 60, startY, colWidth, myResults, 'You', format);

    // VS
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.fillText('VS', config.width / 2, startY + 300);

    // Friend results (right)
    drawComparisonColumn(ctx, config.width - colWidth - 60, startY, colWidth, friendResults, 'Friend', format);

    // Watermark
    drawWatermark(ctx, config);

    return canvas.toDataURL('image/png');
}

/**
 * Draw comparison column
 */
function drawComparisonColumn(ctx, x, y, width, results, label, format) {
    const height = format === 'story' ? 600 : 400;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, x, y, width, height, 20);
    ctx.fill();

    // Label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 32px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + 50);

    // Real Age
    ctx.font = '24px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Real', x + width / 2, y + 100);
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText(results.realAge.toString(), x + width / 2, y + 160);

    // Mental Age
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('Mental', x + width / 2, y + 220);
    ctx.font = 'bold 36px Poppins, sans-serif';
    ctx.fillText(results.mentalAge.toString(), x + width / 2, y + 265);

    // Energy Age
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('Energy', x + width / 2, y + 320);
    ctx.font = 'bold 36px Poppins, sans-serif';
    ctx.fillText(results.energyAge.toString(), x + width / 2, y + 365);
}
