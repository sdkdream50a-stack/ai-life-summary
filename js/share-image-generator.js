/**
 * Share Image Generator - 4 Templates
 * SmartAITest.com Stage 2
 *
 * Templates:
 * A - Teaser Image (curiosity inducing)
 * B - Full Result Image (bragging)
 * C - Couple Compatibility Image
 * D - Daily Test Image
 *
 * Sizes:
 * - Story: 1080x1920 (9:16)
 * - Feed/Square: 1080x1080 (1:1)
 */

// Image size configurations
const IMAGE_SIZES = {
  story: { width: 1080, height: 1920, ratio: '9:16' },
  square: { width: 1080, height: 1080, ratio: '1:1' }
};

// Gradient presets for different soul types
const GRADIENTS = {
  'flame-fox': ['#FF6B35', '#FF4500'],
  'diamond-lion': ['#FFD700', '#FFA500'],
  'ocean-bear': ['#4A90D9', '#00CED1'],
  'crystal-butterfly': ['#E066FF', '#FF69B4'],
  'storm-eagle': ['#4169E1', '#1E90FF'],
  'moonlit-wolf': ['#7B68EE', '#4B0082'],
  'golden-phoenix': ['#FF4500', '#FFD700'],
  'jade-turtle': ['#50C878', '#2E8B57'],
  'silver-swan': ['#C0C0C0', '#708090'],
  'cosmic-owl': ['#191970', '#4B0082'],
  'rainbow-dolphin': ['#00CED1', '#20B2AA'],
  'shadow-panther': ['#2F2F2F', '#1a1a1a']
};

// Multi-language text
const IMAGE_TEXTS = {
  ko: {
    teaser: {
      title: '나의 AI 소울 타입은...',
      cta: '너도 테스트해봐!',
      site: 'smartaitest.com'
    },
    full: {
      topPercent: '상위',
      type: '타입',
      hashtags: '#AITest #소울타입'
    },
    couple: {
      title: '우리의 궁합',
      compatibility: '궁합',
      categories: {
        passion: '열정',
        communication: '소통',
        trust: '신뢰',
        creativity: '창의력',
        intuition: '직관력'
      }
    },
    daily: {
      today: '오늘의 타입',
      rank: '명 중',
      position: '위 타입!'
    }
  },
  en: {
    teaser: {
      title: 'My AI Soul Type is...',
      cta: 'Try the test too!',
      site: 'smartaitest.com'
    },
    full: {
      topPercent: 'Top',
      type: 'Type',
      hashtags: '#AITest #SoulType'
    },
    couple: {
      title: 'Our Compatibility',
      compatibility: 'Match',
      categories: {
        passion: 'Passion',
        communication: 'Communication',
        trust: 'Trust',
        creativity: 'Creativity',
        intuition: 'Intuition'
      }
    },
    daily: {
      today: "Today's Type",
      rank: 'out of',
      position: 'ranked!'
    }
  },
  ja: {
    teaser: {
      title: '私のAIソウルタイプは...',
      cta: 'あなたもテストしてみて!',
      site: 'smartaitest.com'
    },
    full: {
      topPercent: '上位',
      type: 'タイプ',
      hashtags: '#AITest #ソウルタイプ'
    },
    couple: {
      title: '私たちの相性',
      compatibility: '相性',
      categories: {
        passion: '情熱',
        communication: 'コミュニケーション',
        trust: '信頼',
        creativity: '創造力',
        intuition: '直感力'
      }
    },
    daily: {
      today: '今日のタイプ',
      rank: '人中',
      position: '位タイプ!'
    }
  },
  zh: {
    teaser: {
      title: '我的AI灵魂类型是...',
      cta: '你也来测试吧!',
      site: 'smartaitest.com'
    },
    full: {
      topPercent: '前',
      type: '类型',
      hashtags: '#AI测试 #灵魂类型'
    },
    couple: {
      title: '我们的契合度',
      compatibility: '契合',
      categories: {
        passion: '热情',
        communication: '沟通',
        trust: '信任',
        creativity: '创造力',
        intuition: '直觉力'
      }
    },
    daily: {
      today: '今日类型',
      rank: '人中第',
      position: '位类型!'
    }
  },
  es: {
    teaser: {
      title: 'Mi tipo de alma AI es...',
      cta: '¡Prueba el test tú también!',
      site: 'smartaitest.com'
    },
    full: {
      topPercent: 'Top',
      type: 'Tipo',
      hashtags: '#AITest #TipoDeAlma'
    },
    couple: {
      title: 'Nuestra Compatibilidad',
      compatibility: 'Compatibilidad',
      categories: {
        passion: 'Pasión',
        communication: 'Comunicación',
        trust: 'Confianza',
        creativity: 'Creatividad',
        intuition: 'Intuición'
      }
    },
    daily: {
      today: 'Tipo de Hoy',
      rank: 'de',
      position: '¡posición!'
    }
  }
};

/**
 * ShareImageGenerator class
 */
class ShareImageGenerator {
  constructor(options = {}) {
    this.lang = options.lang || 'ko';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Set canvas size
   */
  setSize(format = 'square') {
    const size = IMAGE_SIZES[format] || IMAGE_SIZES.square;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    return size;
  }

  /**
   * Draw gradient background
   */
  drawGradientBackground(colors, angle = 135) {
    const { width, height } = this.canvas;
    const radians = (angle * Math.PI) / 180;
    const x1 = width / 2 - (Math.cos(radians) * width) / 2;
    const y1 = height / 2 - (Math.sin(radians) * height) / 2;
    const x2 = width / 2 + (Math.cos(radians) * width) / 2;
    const y2 = height / 2 + (Math.sin(radians) * height) / 2;

    const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }

  /**
   * Draw decorative circles
   */
  drawDecorations() {
    const { width, height } = this.canvas;

    // Semi-transparent circles
    this.ctx.globalAlpha = 0.1;

    this.ctx.beginPath();
    this.ctx.arc(width * 0.1, height * 0.15, width * 0.2, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(width * 0.9, height * 0.85, width * 0.25, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(width * 0.8, height * 0.2, width * 0.1, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw sparkles
   */
  drawSparkles(count = 15) {
    const { width, height } = this.canvas;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 2;
      const opacity = Math.random() * 0.5 + 0.3;

      this.ctx.globalAlpha = opacity;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw text with shadow
   */
  drawText(text, x, y, options = {}) {
    const {
      fontSize = 40,
      fontWeight = 'bold',
      fontFamily = 'Poppins, sans-serif',
      color = 'white',
      align = 'center',
      shadow = true,
      maxWidth = null
    } = options;

    this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = align;
    this.ctx.fillStyle = color;

    if (shadow) {
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
    }

    if (maxWidth) {
      this.ctx.fillText(text, x, y, maxWidth);
    } else {
      this.ctx.fillText(text, x, y);
    }

    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  /**
   * Draw mini gauge bar
   */
  drawMiniGauge(x, y, width, height, value, color) {
    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, height / 2);
    this.ctx.fill();

    // Fill
    const fillWidth = (value / 100) * width;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, fillWidth, height, height / 2);
    this.ctx.fill();
  }

  /**
   * Draw watermark
   */
  drawWatermark() {
    const { width, height } = this.canvas;
    const texts = IMAGE_TEXTS[this.lang] || IMAGE_TEXTS.en;

    this.drawText(texts.teaser.site, width / 2, height - 40, {
      fontSize: 24,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.7)'
    });
  }

  /**
   * Template A: Teaser Image
   * Shows emoji only, name hidden with "???"
   */
  async generateTeaserImage(soulType, format = 'square') {
    const size = this.setSize(format);
    const colors = GRADIENTS[soulType.id] || ['#6366f1', '#ec4899'];
    const texts = IMAGE_TEXTS[this.lang] || IMAGE_TEXTS.en;

    // Background
    this.drawGradientBackground(colors);
    this.drawDecorations();
    this.drawSparkles(20);

    const centerY = size.height / 2;

    // Title
    this.drawText(texts.teaser.title, size.width / 2, centerY - 150, {
      fontSize: format === 'story' ? 56 : 48,
      fontWeight: '600'
    });

    // Emoji
    this.drawText(soulType.emoji, size.width / 2, centerY + 30, {
      fontSize: format === 'story' ? 180 : 150
    });

    // Mystery text
    this.drawText('???', size.width / 2, centerY + 180, {
      fontSize: format === 'story' ? 72 : 60,
      fontWeight: '700'
    });

    // CTA
    this.drawText(texts.teaser.cta, size.width / 2, centerY + 280, {
      fontSize: format === 'story' ? 36 : 32,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)'
    });

    // Watermark
    this.drawWatermark();

    return this.canvas.toDataURL('image/png');
  }

  /**
   * Template B: Full Result Image
   * Shows full type info with traits
   */
  async generateFullResultImage(soulType, format = 'square') {
    const size = this.setSize(format);
    const colors = GRADIENTS[soulType.id] || ['#6366f1', '#ec4899'];
    const texts = IMAGE_TEXTS[this.lang] || IMAGE_TEXTS.en;

    // Background
    this.drawGradientBackground(colors);
    this.drawDecorations();
    this.drawSparkles(15);

    const isStory = format === 'story';
    const startY = isStory ? 350 : 150;

    // Emoji
    this.drawText(soulType.emoji, size.width / 2, startY, {
      fontSize: isStory ? 160 : 120
    });

    // Type name
    const typeName = getSoulTypeName(soulType, this.lang);
    this.drawText(typeName, size.width / 2, startY + (isStory ? 140 : 100), {
      fontSize: isStory ? 64 : 52,
      fontWeight: '700'
    });

    // Slogan
    const slogan = getSoulTypeSlogan(soulType, this.lang);
    this.drawText(slogan, size.width / 2, startY + (isStory ? 220 : 170), {
      fontSize: isStory ? 32 : 26,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: size.width - 100
    });

    // Trait gauges
    const traitLabels = {
      intuition: getTraitLabel('intuition', this.lang),
      passion: getTraitLabel('passion', this.lang),
      empathy: getTraitLabel('empathy', this.lang),
      logic: getTraitLabel('logic', this.lang),
      creativity: getTraitLabel('creativity', this.lang)
    };

    const traitColors = {
      intuition: '#8B5CF6',
      passion: '#EF4444',
      empathy: '#EC4899',
      logic: '#3B82F6',
      creativity: '#10B981'
    };

    const gaugeWidth = isStory ? 600 : 500;
    const gaugeHeight = isStory ? 20 : 16;
    const gaugeStartX = (size.width - gaugeWidth) / 2;
    let gaugeY = startY + (isStory ? 320 : 250);

    Object.entries(soulType.traits).forEach(([trait, value]) => {
      // Label
      this.drawText(traitLabels[trait], gaugeStartX, gaugeY, {
        fontSize: isStory ? 24 : 20,
        fontWeight: '500',
        align: 'left'
      });

      // Value
      this.drawText(`${value}%`, gaugeStartX + gaugeWidth, gaugeY, {
        fontSize: isStory ? 24 : 20,
        fontWeight: '500',
        align: 'right'
      });

      // Gauge
      this.drawMiniGauge(
        gaugeStartX,
        gaugeY + 10,
        gaugeWidth,
        gaugeHeight,
        value,
        traitColors[trait]
      );

      gaugeY += isStory ? 70 : 55;
    });

    // Hashtags
    const hashtagY = gaugeY + (isStory ? 120 : 90);
    const hashtag = `${texts.full.hashtags} #${typeName.replace(/\s/g, '')}`;
    this.drawText(hashtag, size.width / 2, hashtagY, {
      fontSize: isStory ? 28 : 24,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.8)'
    });

    // Watermark
    this.drawWatermark();

    return this.canvas.toDataURL('image/png');
  }

  /**
   * Template C: Couple Compatibility Image
   */
  async generateCoupleImage(type1, type2, compatibility, format = 'square') {
    const size = this.setSize(format);
    const texts = IMAGE_TEXTS[this.lang] || IMAGE_TEXTS.en;

    // Blend gradients from both types
    const colors1 = GRADIENTS[type1.id] || ['#6366f1', '#ec4899'];
    const colors2 = GRADIENTS[type2.id] || ['#ec4899', '#6366f1'];

    // Create blended gradient
    this.drawGradientBackground([colors1[0], colors2[1]]);
    this.drawDecorations();
    this.drawSparkles(20);

    const isStory = format === 'story';
    const startY = isStory ? 350 : 180;

    // Title
    this.drawText(texts.couple.title, size.width / 2, startY - (isStory ? 200 : 100), {
      fontSize: isStory ? 56 : 44,
      fontWeight: '600'
    });

    // Two emojis with heart
    const emojiY = startY + (isStory ? 50 : 30);
    this.drawText(type1.emoji, size.width / 2 - 150, emojiY, {
      fontSize: isStory ? 100 : 80
    });

    this.drawText('💕', size.width / 2, emojiY, {
      fontSize: isStory ? 60 : 50
    });

    this.drawText(type2.emoji, size.width / 2 + 150, emojiY, {
      fontSize: isStory ? 100 : 80
    });

    // Compatibility percentage
    const percentY = emojiY + (isStory ? 180 : 140);
    this.drawText(`${compatibility.overall}%`, size.width / 2, percentY, {
      fontSize: isStory ? 120 : 100,
      fontWeight: '700'
    });

    this.drawText(texts.couple.compatibility, size.width / 2, percentY + (isStory ? 80 : 60), {
      fontSize: isStory ? 36 : 30,
      fontWeight: '500'
    });

    // Category gauges
    const categories = texts.couple.categories;
    const gaugeWidth = isStory ? 500 : 420;
    const gaugeHeight = isStory ? 16 : 14;
    const gaugeStartX = (size.width - gaugeWidth) / 2;
    let gaugeY = percentY + (isStory ? 180 : 140);

    const categoryColors = ['#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
    const categoryKeys = ['passion', 'communication', 'trust', 'creativity', 'intuition'];

    categoryKeys.forEach((key, i) => {
      const value = compatibility.categories[key] || 50;

      this.drawText(categories[key], gaugeStartX, gaugeY, {
        fontSize: isStory ? 22 : 18,
        fontWeight: '500',
        align: 'left'
      });

      this.drawText(`${value}%`, gaugeStartX + gaugeWidth, gaugeY, {
        fontSize: isStory ? 22 : 18,
        fontWeight: '500',
        align: 'right'
      });

      this.drawMiniGauge(gaugeStartX, gaugeY + 8, gaugeWidth, gaugeHeight, value, categoryColors[i]);

      gaugeY += isStory ? 60 : 50;
    });

    // Watermark
    this.drawWatermark();

    return this.canvas.toDataURL('image/png');
  }

  /**
   * Template D: Daily Test Image
   */
  async generateDailyImage(soulType, stats, format = 'square') {
    const size = this.setSize(format);
    const colors = GRADIENTS[soulType.id] || ['#6366f1', '#ec4899'];
    const texts = IMAGE_TEXTS[this.lang] || IMAGE_TEXTS.en;

    // Background
    this.drawGradientBackground(colors);
    this.drawDecorations();
    this.drawSparkles(15);

    const isStory = format === 'story';
    const startY = isStory ? 350 : 180;

    // Today's date
    const today = new Date();
    const dateStr = today.toLocaleDateString(this.lang === 'ko' ? 'ko-KR' : this.lang === 'ja' ? 'ja-JP' : this.lang === 'zh' ? 'zh-CN' : this.lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.drawText(dateStr, size.width / 2, startY - (isStory ? 180 : 100), {
      fontSize: isStory ? 36 : 28,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)'
    });

    // "Today's Type" label
    this.drawText(texts.daily.today, size.width / 2, startY - (isStory ? 100 : 50), {
      fontSize: isStory ? 48 : 38,
      fontWeight: '600'
    });

    // Emoji
    this.drawText(soulType.emoji, size.width / 2, startY + (isStory ? 60 : 40), {
      fontSize: isStory ? 150 : 120
    });

    // Type name
    const typeName = getSoulTypeName(soulType, this.lang);
    this.drawText(typeName, size.width / 2, startY + (isStory ? 180 : 140), {
      fontSize: isStory ? 56 : 44,
      fontWeight: '700'
    });

    // Stats bar
    const statsY = startY + (isStory ? 300 : 230);
    const totalUsers = stats.totalUsers || Math.floor(Math.random() * 10000) + 5000;
    const rank = stats.rank || Math.floor(Math.random() * 5) + 1;

    // Stats text based on language
    let statsText;
    if (this.lang === 'ko') {
      statsText = `오늘 ${totalUsers.toLocaleString()}${texts.daily.rank} ${rank}${texts.daily.position}`;
    } else if (this.lang === 'ja') {
      statsText = `今日 ${totalUsers.toLocaleString()}${texts.daily.rank}${rank}${texts.daily.position}`;
    } else if (this.lang === 'zh') {
      statsText = `今天 ${totalUsers.toLocaleString()}${texts.daily.rank}${rank}${texts.daily.position}`;
    } else {
      statsText = `Today: #${rank} ${texts.daily.rank} ${totalUsers.toLocaleString()} ${texts.daily.position}`;
    }

    this.drawText(statsText, size.width / 2, statsY, {
      fontSize: isStory ? 32 : 26,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.95)'
    });

    // Rank distribution bar
    const barY = statsY + (isStory ? 60 : 50);
    const barWidth = isStory ? 600 : 500;
    const barHeight = isStory ? 30 : 24;
    const barX = (size.width - barWidth) / 2;

    // Background bar
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, barY, barWidth, barHeight, barHeight / 2);
    this.ctx.fill();

    // Fill bar (percentage based on rank)
    const fillPercentage = Math.max(10, 100 - (rank - 1) * 15);
    const fillWidth = (fillPercentage / 100) * barWidth;

    const barGradient = this.ctx.createLinearGradient(barX, 0, barX + fillWidth, 0);
    barGradient.addColorStop(0, '#FFD700');
    barGradient.addColorStop(1, '#FFA500');

    this.ctx.fillStyle = barGradient;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, barY, fillWidth, barHeight, barHeight / 2);
    this.ctx.fill();

    // Watermark
    this.drawWatermark();

    return this.canvas.toDataURL('image/png');
  }

  /**
   * Download image
   */
  downloadImage(dataUrl, filename = 'soul-type') {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  }

  /**
   * Copy to clipboard (for sharing)
   */
  async copyToClipboard(dataUrl) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch (err) {
      console.error('Failed to copy image:', err);
      return false;
    }
  }
}

/**
 * Factory function to generate share images
 */
async function generateShareImage(template, options = {}) {
  const generator = new ShareImageGenerator({ lang: options.lang || 'ko' });

  switch (template) {
    case 'teaser':
      return generator.generateTeaserImage(options.soulType, options.format);

    case 'full':
      return generator.generateFullResultImage(options.soulType, options.format);

    case 'couple':
      return generator.generateCoupleImage(
        options.type1,
        options.type2,
        options.compatibility,
        options.format
      );

    case 'daily':
      return generator.generateDailyImage(
        options.soulType,
        options.stats || {},
        options.format
      );

    default:
      throw new Error(`Unknown template: ${template}`);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ShareImageGenerator,
    generateShareImage,
    IMAGE_SIZES,
    GRADIENTS,
    IMAGE_TEXTS
  };
}
