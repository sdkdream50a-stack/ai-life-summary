/**
 * AI Life Summary - Image Generator
 * Uses Canvas API to generate shareable images
 *
 * Performance optimizations applied:
 * - Map-based lookups for O(1) access
 * - Pre-computed dimension and size configurations
 * - Hash result caching
 */

// Gradient color palettes - 3-color gradients for beautiful results
const gradientPalettes = [
    { start: '#667eea', mid: '#764ba2', end: '#f093fb' },  // Purple Dream (matches website)
    { start: '#6366f1', mid: '#a855f7', end: '#ec4899' },  // Indigo to Pink
    { start: '#8b5cf6', mid: '#06b6d4', end: '#10b981' },  // Violet to Teal
    { start: '#f59e0b', mid: '#ef4444', end: '#ec4899' },  // Warm Sunset
    { start: '#10b981', mid: '#3b82f6', end: '#8b5cf6' },  // Ocean Depths
    { start: '#ec4899', mid: '#f59e0b', end: '#fbbf24' },  // Pink Sunrise
    { start: '#14b8a6', mid: '#6366f1', end: '#a855f7' },  // Teal Dream
    { start: '#f43f5e', mid: '#fb7185', end: '#fda4af' },  // Rose Bloom
    { start: '#0ea5e9', mid: '#a855f7', end: '#ec4899' },  // Northern Lights
    { start: '#84cc16', mid: '#06b6d4', end: '#3b82f6' }   // Nature Vibes
];

// ===== Performance: Map for O(1) title lookup =====
const imageTitles = new Map([
    ['en', 'AI Life Summary'],
    ['ko', 'AI 인생 한 줄'],
    ['ja', 'AI人生サマリー'],
    ['zh', 'AI人生总结'],
    ['es', 'Resumen de Vida IA']
]);

// ===== Performance: Map for O(1) dimension lookup (instead of switch) =====
const imageDimensions = new Map([
    ['story', { width: 1080, height: 1920 }],
    ['square', { width: 1080, height: 1080 }],
    ['landscape', { width: 1200, height: 630 }]
]);

// ===== Performance: Map for O(1) text size lookup (instead of switch) =====
const textSizesMap = new Map([
    ['story', { title: 64, emoji: 80, quote: 48, watermark: 28, decoration: 36 }],
    ['square', { title: 56, emoji: 70, quote: 40, watermark: 24, decoration: 32 }],
    ['landscape', { title: 40, emoji: 50, quote: 32, watermark: 20, decoration: 24 }]
]);

// ===== Performance: Hash cache to avoid recomputation =====
const hashCache = new Map();

/**
 * Generate a shareable image with the life summary
 * @param {string} sentence - The life summary sentence
 * @param {string} format - Image format ('story' for 1080x1920, 'square' for 1080x1080, 'landscape' for 1200x630)
 * @param {string} lang - Language code (en, ko, ja, zh, es)
 */
function generateShareImage(sentence, format = 'story', lang = 'en') {
    const dimensions = getImageDimensions(format);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');

    // Select gradient based on sentence hash
    const paletteIndex = simpleHash(sentence) % gradientPalettes.length;
    const palette = gradientPalettes[paletteIndex];

    // Draw gradient background
    drawGradientBackground(ctx, canvas.width, canvas.height, palette);

    // Add decorative elements
    drawDecorativeElements(ctx, canvas.width, canvas.height);

    // Draw main content with language support
    drawContent(ctx, canvas, sentence, format, lang);

    // Download the image
    downloadImage(canvas, `ai-life-summary-${format}.png`);
}

/**
 * Get image dimensions based on format
 * Uses Map for O(1) lookup instead of switch statement
 * @param {string} format - Image format
 * @returns {object} - Width and height
 */
function getImageDimensions(format) {
    return imageDimensions.get(format) || imageDimensions.get('story');
}

/**
 * Simple hash function for string with caching
 * @param {string} str - String to hash
 * @returns {number} - Hash value
 */
function simpleHash(str) {
    // Check cache first
    if (hashCache.has(str)) {
        return hashCache.get(str);
    }

    let hash = 0;
    const len = str.length; // Cache length for loop optimization
    for (let i = 0; i < len; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const result = Math.abs(hash);

    // Cache result (limit cache size to prevent memory issues)
    if (hashCache.size < 1000) {
        hashCache.set(str, result);
    }

    return result;
}

/**
 * Draw gradient background with 3-color gradient
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {object} palette - Color palette
 */
function drawGradientBackground(ctx, width, height, palette) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette.start);
    gradient.addColorStop(0.5, palette.mid);
    gradient.addColorStop(1, palette.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Draw decorative elements
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function drawDecorativeElements(ctx, width, height) {
    ctx.save();

    // Add subtle circles with varying opacity
    ctx.fillStyle = '#ffffff';

    // Top right large circle
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.08, width * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Bottom left large circle
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.88, width * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Middle left small circle
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.arc(width * 0.08, height * 0.45, width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Middle right small circle
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.arc(width * 0.92, height * 0.55, width * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Draw large decorative quote marks
    ctx.globalAlpha = 0.12;
    ctx.font = `bold ${width * 0.12}px Georgia, serif`;
    ctx.fillText('"', width * 0.12, height * 0.22);
    ctx.fillText('"', width * 0.88, height * 0.82);

    // Add sparkle/star effects
    ctx.globalAlpha = 0.35;
    drawSparkles(ctx, width, height);

    ctx.restore();
}

/**
 * Draw sparkle decorations
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function drawSparkles(ctx, width, height) {
    const sparklePositions = [
        { x: width * 0.18, y: height * 0.15, size: 18 },
        { x: width * 0.82, y: height * 0.12, size: 15 },
        { x: width * 0.08, y: height * 0.35, size: 12 },
        { x: width * 0.92, y: height * 0.38, size: 14 },
        { x: width * 0.12, y: height * 0.65, size: 16 },
        { x: width * 0.88, y: height * 0.68, size: 13 },
        { x: width * 0.25, y: height * 0.88, size: 11 },
        { x: width * 0.75, y: height * 0.85, size: 17 }
    ];

    ctx.fillStyle = '#ffffff';

    sparklePositions.forEach(pos => {
        drawStar(ctx, pos.x, pos.y, 4, pos.size, pos.size * 0.45);
    });
}

/**
 * Draw a star shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} spikes - Number of spikes
 * @param {number} outerRadius - Outer radius
 * @param {number} innerRadius - Inner radius
 */
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

/**
 * Draw main content on canvas with beautiful typography
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} sentence - The sentence to display
 * @param {string} format - Image format
 * @param {string} lang - Language code
 */
function drawContent(ctx, canvas, sentence, format, lang = 'en') {
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.textAlign = 'center';

    // Calculate text sizes based on format - O(1) Map lookup
    const sizes = getTextSizes(format);

    // Add text shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Draw title sparkle emoji
    ctx.fillStyle = '#ffffff';
    ctx.font = `${sizes.emoji}px Arial`;
    const titleY = format === 'story' ? height * 0.15 : height * 0.2;
    ctx.fillText('\u2728', width / 2, titleY - sizes.title - 25);

    // Draw title in the appropriate language - O(1) Map lookup
    const title = imageTitles.get(lang) || imageTitles.get('en');
    ctx.font = `bold ${sizes.title}px "Poppins", sans-serif`;
    ctx.fillText(title, width / 2, titleY);

    // Increase shadow for quote
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    // Draw quote with beautiful font
    ctx.font = `${sizes.quote}px "Merriweather", serif`;
    const quoteY = format === 'story' ? height * 0.48 : height * 0.52;
    const maxWidth = width * 0.78;

    // Wrap text - remove outer quotes since we have decorative quote marks
    const lines = wrapText(ctx, sentence, maxWidth);
    const lineHeight = sizes.quote * 1.6;
    const totalTextHeight = lines.length * lineHeight;
    let startY = quoteY - totalTextHeight / 2;

    lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // Reset shadow for watermark
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    // Draw watermark
    ctx.globalAlpha = 0.75;
    ctx.font = `500 ${sizes.watermark}px "Inter", sans-serif`;
    const watermarkY = format === 'story' ? height * 0.91 : height * 0.88;
    ctx.fillText('ailifesummary.com', width / 2, watermarkY);

    // Draw bottom decoration
    ctx.globalAlpha = 0.6;
    ctx.font = `${sizes.decoration}px Arial`;
    ctx.fillText('\u2728  \u2B50  \u2728', width / 2, watermarkY + sizes.watermark + 15);

    ctx.restore();
}

/**
 * Get text sizes based on format
 * Uses Map for O(1) lookup instead of switch statement
 * @param {string} format - Image format
 * @returns {object} - Text sizes
 */
function getTextSizes(format) {
    return textSizesMap.get(format) || textSizesMap.get('story');
}

/**
 * Wrap text to fit within max width
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width
 * @returns {array} - Array of text lines
 */
function wrapText(ctx, text, maxWidth) {
    // First, split by explicit line breaks
    const paragraphs = text.split('\n');
    const lines = [];

    paragraphs.forEach(paragraph => {
        if (!paragraph.trim()) return;

        const words = paragraph.split(' ');
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }
    });

    return lines;
}

/**
 * Download the generated image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} filename - Filename for download
 */
function downloadImage(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/**
 * Generate image preview without downloading
 * @param {string} sentence - The sentence to display
 * @param {string} format - Image format
 * @param {string} lang - Language code
 * @returns {string} - Data URL of the image
 */
function generateImagePreview(sentence, format = 'story', lang = 'en') {
    const dimensions = getImageDimensions(format);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');

    const paletteIndex = simpleHash(sentence) % gradientPalettes.length;
    const palette = gradientPalettes[paletteIndex];

    drawGradientBackground(ctx, canvas.width, canvas.height, palette);
    drawDecorativeElements(ctx, canvas.width, canvas.height);
    drawContent(ctx, canvas, sentence, format, lang);

    return canvas.toDataURL('image/png');
}

/**
 * Create image blob for sharing
 * @param {string} sentence - The sentence to display
 * @param {string} format - Image format
 * @param {string} lang - Language code
 * @returns {Promise<Blob>} - Image blob
 */
async function createImageBlob(sentence, format = 'story', lang = 'en') {
    const dimensions = getImageDimensions(format);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');

    const paletteIndex = simpleHash(sentence) % gradientPalettes.length;
    const palette = gradientPalettes[paletteIndex];

    drawGradientBackground(ctx, canvas.width, canvas.height, palette);
    drawDecorativeElements(ctx, canvas.width, canvas.height);
    drawContent(ctx, canvas, sentence, format, lang);

    return new Promise(resolve => {
        canvas.toBlob(blob => {
            resolve(blob);
        }, 'image/png');
    });
}

/**
 * Share image using Web Share API (if available)
 * @param {string} sentence - The sentence to share
 */
async function shareImageNative(sentence) {
    if (!navigator.share || !navigator.canShare) {
        console.log('Native sharing not supported');
        generateShareImage(sentence);
        return;
    }

    try {
        const blob = await createImageBlob(sentence);
        const file = new File([blob], 'ai-life-summary.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'My AI Life Summary',
                text: sentence,
                files: [file]
            });
        } else {
            generateShareImage(sentence);
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
            generateShareImage(sentence);
        }
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateShareImage,
        generateImagePreview,
        createImageBlob,
        shareImageNative
    };
}
