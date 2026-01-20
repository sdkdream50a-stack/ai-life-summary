/**
 * AI Compatibility Test - Image Generator
 * Creates shareable images using Canvas API
 */

// ============================================
// IMAGE CONFIGURATION
// ============================================

const COMPAT_IMAGE_CONFIGS = {
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

// Color schemes based on compatibility score
const COMPAT_COLOR_SCHEMES = {
    perfect: {
        gradient: ['#ec4899', '#f43f5e'],  // Pink to Rose
        accent: '#fda4af',
        text: '#ffffff'
    },
    destined: {
        gradient: ['#f43f5e', '#fb7185'],  // Rose shades
        accent: '#fecdd3',
        text: '#ffffff'
    },
    great: {
        gradient: ['#f97316', '#fb923c'],  // Orange shades
        accent: '#fed7aa',
        text: '#ffffff'
    },
    good: {
        gradient: ['#eab308', '#facc15'],  // Yellow shades
        accent: '#fef08a',
        text: '#ffffff'
    },
    average: {
        gradient: ['#84cc16', '#a3e635'],  // Lime shades
        accent: '#d9f99d',
        text: '#ffffff'
    },
    low: {
        gradient: ['#6b7280', '#9ca3af'],  // Gray shades
        accent: '#d1d5db',
        text: '#ffffff'
    }
};

// ============================================
// MAIN IMAGE GENERATION FUNCTIONS
// ============================================

/**
 * Generate result image in specified format
 * @param {string} format - 'story' or 'square'
 * @returns {Promise<string>} - Data URL of generated image
 */
async function generateCompatibilityImage(format = 'story') {
    const results = window.compatibilityResults;
    if (!results) {
        throw new Error('No compatibility results available');
    }

    const config = COMPAT_IMAGE_CONFIGS[format] || COMPAT_IMAGE_CONFIGS.story;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = config.width;
    canvas.height = config.height;

    // Determine color scheme based on score
    const colorScheme = getCompatColorScheme(results.overallScore);

    // Draw background
    drawCompatGradientBackground(ctx, config, colorScheme);

    // Draw decorative hearts
    drawHeartDecorations(ctx, config, colorScheme);

    // Draw content based on format
    if (format === 'story') {
        await drawCompatStoryContent(ctx, config, results, colorScheme);
    } else {
        await drawCompatSquareContent(ctx, config, results, colorScheme);
    }

    // Draw watermark
    drawCompatWatermark(ctx, config);

    return canvas.toDataURL('image/png');
}

/**
 * Generate and download image
 */
async function downloadImage(format = 'story') {
    try {
        const dataUrl = await generateCompatibilityImage(format);
        const link = document.createElement('a');
        link.download = `compatibility-${format}-${Date.now()}.png`;
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
function drawCompatGradientBackground(ctx, config, colorScheme) {
    const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
    gradient.addColorStop(0, colorScheme.gradient[0]);
    gradient.addColorStop(1, colorScheme.gradient[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
}

/**
 * Draw decorative heart elements
 */
function drawHeartDecorations(ctx, config, colorScheme) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    ctx.font = '120px sans-serif';
    ctx.textAlign = 'center';

    // Random hearts
    const hearts = ['❤️', '💕', '💖', '💗', '💓'];
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * config.width;
        const y = Math.random() * config.height;
        const heart = hearts[Math.floor(Math.random() * hearts.length)];
        ctx.fillText(heart, x, y);
    }

    ctx.globalAlpha = 1;
}

/**
 * Draw content for Story format (1080x1920)
 */
async function drawCompatStoryContent(ctx, config, results, colorScheme) {
    const centerX = config.width / 2;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = 'bold 64px Poppins, sans-serif';
    ctx.fillText('Our Compatibility', centerX, 180);

    ctx.font = '32px Inter, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('AI Test Lab', centerX, 230);
    ctx.globalAlpha = 1;

    // Main result card
    const cardY = 300;
    const cardWidth = 900;
    const cardHeight = 1250;
    const cardX = (config.width - cardWidth) / 2;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRectCompat(ctx, cardX, cardY, cardWidth, cardHeight, 40);
    ctx.fill();

    // Names section
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 40px Poppins, sans-serif';
    ctx.fillText(results.personA.name || 'Person A', centerX, cardY + 70);

    ctx.font = '60px sans-serif';
    ctx.fillText('💕', centerX, cardY + 140);

    ctx.font = 'bold 40px Poppins, sans-serif';
    ctx.fillText(results.personB.name || 'Person B', centerX, cardY + 200);

    // Zodiac signs
    ctx.font = '24px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`${results.personA.zodiac} & ${results.personB.zodiac}`, centerX, cardY + 245);

    // Animal Couple Section
    if (results.animalCouple) {
        // Divider
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + 50, cardY + 280);
        ctx.lineTo(cardX + cardWidth - 50, cardY + 280);
        ctx.stroke();

        // Animal couple title
        ctx.fillStyle = colorScheme.gradient[0];
        ctx.font = 'bold 28px Poppins, sans-serif';
        ctx.fillText('🐾 Animal Couple Type', centerX, cardY + 330);

        // Animal emojis
        ctx.font = '80px sans-serif';
        const animalA = results.animalCouple.animalA?.emoji || '🦁';
        const animalB = results.animalCouple.animalB?.emoji || '🐱';
        const chemistry = results.animalCouple.chemistry || '💕';

        ctx.fillText(animalA, centerX - 120, cardY + 430);
        ctx.font = '50px sans-serif';
        ctx.fillText(chemistry, centerX, cardY + 420);
        ctx.font = '80px sans-serif';
        ctx.fillText(animalB, centerX + 120, cardY + 430);

        // Animal couple name
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 32px Poppins, sans-serif';
        const coupleTitle = results.animalCouple.title?.en || 'Unique Duo';
        ctx.fillText(coupleTitle, centerX, cardY + 500);

        // Animal couple description
        ctx.font = '22px Inter, sans-serif';
        ctx.fillStyle = '#6b7280';
        const coupleDesc = results.animalCouple.desc?.en || '';
        // Wrap text if too long
        wrapTextCompat(ctx, coupleDesc, centerX, cardY + 540, 700, 28);
    }

    // Divider before score
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 50, cardY + 590);
    ctx.lineTo(cardX + cardWidth - 50, cardY + 590);
    ctx.stroke();

    // Score circle
    const scoreY = cardY + 750;
    drawScoreCircle(ctx, centerX, scoreY, 110, results.overallScore, colorScheme);

    // Relationship type (use creative label if available)
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 32px Poppins, sans-serif';
    const relLabel = results.relationshipType.creativeLabels?.en || results.relationshipType.labels.en;
    ctx.fillText(`${results.relationshipType.emoji} ${relLabel}`, centerX, cardY + 890);

    // Category bars
    const barStartY = cardY + 950;
    const barWidth = 700;
    const barHeight = 20;
    const barSpacing = 55;

    const categories = ['communication', 'values', 'energy', 'emotional', 'growth'];
    const categoryLabels = ['Communication', 'Values', 'Energy', 'Emotional', 'Growth'];
    const categoryIcons = ['💬', '⚖️', '⚡', '💗', '🌱'];

    categories.forEach((cat, index) => {
        const y = barStartY + index * barSpacing;
        const score = results.categories[cat];

        // Label and icon
        ctx.fillStyle = '#374151';
        ctx.font = '24px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${categoryIcons[index]} ${categoryLabels[index]}`, cardX + 100, y);

        // Score
        ctx.textAlign = 'right';
        ctx.fillStyle = colorScheme.gradient[0];
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(`${score}%`, cardX + cardWidth - 100, y);

        // Bar background
        ctx.fillStyle = '#e5e7eb';
        roundRectCompat(ctx, cardX + 100, y + 10, barWidth, barHeight, 12);
        ctx.fill();

        // Bar fill
        const gradient = ctx.createLinearGradient(cardX + 100, 0, cardX + 100 + barWidth, 0);
        gradient.addColorStop(0, colorScheme.gradient[0]);
        gradient.addColorStop(1, colorScheme.gradient[1]);
        ctx.fillStyle = gradient;
        roundRectCompat(ctx, cardX + 100, y + 10, barWidth * (score / 100), barHeight, 12);
        ctx.fill();

        ctx.textAlign = 'center';
    });

    // Movie Genre Section (after category bars)
    if (results.movieGenre) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + 50, cardY + 1230);
        ctx.lineTo(cardX + cardWidth - 50, cardY + 1230);
        ctx.stroke();

        ctx.fillStyle = colorScheme.gradient[0];
        ctx.font = 'bold 24px Poppins, sans-serif';
        ctx.fillText(`${results.movieGenre.emoji} Your Love Movie: ${results.movieGenre.title.en}`, centerX, cardY + 1280);
    }

    // Hashtags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText('#AICompatibility  #AnimalCouple', centerX, 1720);

    // URL
    ctx.font = '22px Inter, sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('smartaitest.com/compatibility', centerX, 1770);
    ctx.globalAlpha = 1;
}

/**
 * Draw content for Square format (1080x1080)
 */
async function drawCompatSquareContent(ctx, config, results, colorScheme) {
    const centerX = config.width / 2;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.fillText('Our Compatibility', centerX, 80);

    // Main card
    const cardWidth = 950;
    const cardHeight = 880;
    const cardX = (config.width - cardWidth) / 2;
    const cardY = 100;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRectCompat(ctx, cardX, cardY, cardWidth, cardHeight, 30);
    ctx.fill();

    // Animal couple at top (prominent feature)
    if (results.animalCouple) {
        ctx.font = '60px sans-serif';
        const animalA = results.animalCouple.animalA?.emoji || '🦁';
        const animalB = results.animalCouple.animalB?.emoji || '🐱';
        const chemistry = results.animalCouple.chemistry || '💕';

        ctx.fillText(animalA, centerX - 100, cardY + 80);
        ctx.font = '40px sans-serif';
        ctx.fillText(chemistry, centerX, cardY + 75);
        ctx.font = '60px sans-serif';
        ctx.fillText(animalB, centerX + 100, cardY + 80);

        // Animal couple title
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 24px Poppins, sans-serif';
        const coupleTitle = results.animalCouple.title?.en || 'Unique Duo';
        ctx.fillText(coupleTitle, centerX, cardY + 125);
    }

    // Names with score in center
    ctx.fillStyle = '#6b7280';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText(results.personA.name || 'A', cardX + 140, cardY + 210);
    ctx.fillText(results.personB.name || 'B', cardX + cardWidth - 140, cardY + 210);

    // Central score circle
    drawScoreCircle(ctx, centerX, cardY + 210, 80, results.overallScore, colorScheme);

    // Zodiac
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(results.personA.zodiac, cardX + 140, cardY + 240);
    ctx.fillText(results.personB.zodiac, cardX + cardWidth - 140, cardY + 240);

    // Relationship type (use creative label)
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Poppins, sans-serif';
    const relLabel = results.relationshipType.creativeLabels?.en || results.relationshipType.labels.en;
    ctx.fillText(`${results.relationshipType.emoji} ${relLabel}`, centerX, cardY + 320);

    // Category bars (compact)
    const barStartY = cardY + 380;
    const barWidth = 580;
    const barHeight = 16;
    const barSpacing = 50;

    const categories = ['communication', 'values', 'energy', 'emotional', 'growth'];
    const categoryIcons = ['💬', '⚖️', '⚡', '💗', '🌱'];

    categories.forEach((cat, index) => {
        const y = barStartY + index * barSpacing;
        const score = results.categories[cat];

        // Icon and score
        ctx.fillStyle = '#374151';
        ctx.font = '18px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(categoryIcons[index], cardX + 180, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = colorScheme.gradient[0];
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(`${score}%`, cardX + cardWidth - 180, y);

        // Bar background
        ctx.fillStyle = '#e5e7eb';
        roundRectCompat(ctx, cardX + 215, y - 10, barWidth, barHeight, 8);
        ctx.fill();

        // Bar fill
        const gradient = ctx.createLinearGradient(cardX + 215, 0, cardX + 215 + barWidth, 0);
        gradient.addColorStop(0, colorScheme.gradient[0]);
        gradient.addColorStop(1, colorScheme.gradient[1]);
        ctx.fillStyle = gradient;
        roundRectCompat(ctx, cardX + 215, y - 10, barWidth * (score / 100), barHeight, 8);
        ctx.fill();

        ctx.textAlign = 'center';
    });

    // Animal couple description at bottom of card
    if (results.animalCouple && results.animalCouple.desc) {
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = '#6b7280';
        const desc = results.animalCouple.desc.en || '';
        ctx.fillText(desc.substring(0, 60) + (desc.length > 60 ? '...' : ''), centerX, cardY + 680);
    }

    // Movie Genre at bottom of card
    if (results.movieGenre) {
        ctx.fillStyle = colorScheme.gradient[0];
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.fillText(`${results.movieGenre.emoji} Love Movie: ${results.movieGenre.title.en}`, centerX, cardY + 730);
    }

    // Lucky Date
    if (results.luckyDate) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(`${results.luckyDate.emoji} Lucky Date: ${results.luckyDate.dateFormatted.en}`, centerX, cardY + 770);
    }

    // Bottom info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('#AICompatibility  #AnimalCouple', centerX, 1010);

    ctx.font = '16px Inter, sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('smartaitest.com/compatibility', centerX, 1045);
    ctx.globalAlpha = 1;
}

/**
 * Draw score circle
 */
function drawScoreCircle(ctx, centerX, centerY, radius, score, colorScheme) {
    // Background circle
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Score arc
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    gradient.addColorStop(0, colorScheme.gradient[0]);
    gradient.addColorStop(1, colorScheme.gradient[1]);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (score / 100) * Math.PI * 2);
    ctx.stroke();

    // Score text
    ctx.fillStyle = colorScheme.gradient[0];
    ctx.font = `bold ${radius * 0.6}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score}%`, centerX, centerY);
    ctx.textBaseline = 'alphabetic';
}

/**
 * Draw watermark
 */
function drawCompatWatermark(ctx, config) {
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
function roundRectCompat(ctx, x, y, width, height, radius) {
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
 * Wrap text to fit within maxWidth
 */
function wrapTextCompat(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

/**
 * Get color scheme based on score
 */
function getCompatColorScheme(score) {
    if (score >= 90) return COMPAT_COLOR_SCHEMES.perfect;
    if (score >= 80) return COMPAT_COLOR_SCHEMES.destined;
    if (score >= 70) return COMPAT_COLOR_SCHEMES.great;
    if (score >= 60) return COMPAT_COLOR_SCHEMES.good;
    if (score >= 50) return COMPAT_COLOR_SCHEMES.average;
    return COMPAT_COLOR_SCHEMES.low;
}
