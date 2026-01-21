/**
 * Daily Share Image Generator
 * Creates share images for daily test results
 */

class DailyShareGenerator {
  constructor() {
    this.sizes = {
      story: { width: 1080, height: 1920 },
      square: { width: 1080, height: 1080 }
    };
    this.colors = {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      success: '#10b981',
      background: '#0f172a',
      card: '#1e293b',
      text: '#f8fafc',
      subtext: '#94a3b8'
    };
  }

  /**
   * Create canvas with gradient background
   */
  createCanvas(format = 'story') {
    const size = this.sizes[format];
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size.width, size.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e1b4b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);

    // Add subtle pattern
    this.addPattern(ctx, size);

    return { canvas, ctx, size };
  }

  /**
   * Add decorative pattern
   */
  addPattern(ctx, size) {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;

    // Grid pattern
    for (let i = 0; i < size.width; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size.height);
      ctx.stroke();
    }
    for (let i = 0; i < size.height; i += 60) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size.width, i);
      ctx.stroke();
    }
  }

  /**
   * Draw rounded rectangle
   */
  roundRect(ctx, x, y, width, height, radius) {
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
   * Draw text with wrapping
   */
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n];
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + (index * lineHeight));
    });

    return lines.length;
  }

  /**
   * Generate daily result share image
   */
  async generateResultImage(question, selectedOption, resultType, stats, format = 'story', lang = 'ko') {
    const { canvas, ctx, size } = this.createCanvas(format);
    const isStory = format === 'story';
    const padding = isStory ? 60 : 50;
    const centerX = size.width / 2;

    // Header - Date and Title
    ctx.fillStyle = this.colors.subtext;
    ctx.font = '500 28px "Pretendard", sans-serif';
    ctx.textAlign = 'center';

    const dateText = {
      ko: '오늘의 질문',
      en: "Today's Question",
      ja: '今日の質問',
      zh: '今日问题',
      es: 'Pregunta del día'
    }[lang] || 'Today\'s Question';

    const y = isStory ? 150 : 80;
    ctx.fillText(dateText, centerX, y);

    // Date
    const today = dailyTest.getTodayKST();
    ctx.font = '400 24px "Pretendard", sans-serif';
    ctx.fillText(today, centerX, y + 40);

    // Question
    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 42px "Pretendard", sans-serif';
    const questionText = question.question[lang] || question.question.ko;
    const questionY = isStory ? y + 150 : y + 120;
    this.wrapText(ctx, questionText, centerX, questionY, size.width - padding * 2, 56);

    // Selected answer card
    const cardY = isStory ? questionY + 200 : questionY + 160;
    const cardHeight = isStory ? 180 : 140;

    // Card gradient
    const cardGradient = ctx.createLinearGradient(padding, cardY, size.width - padding, cardY + cardHeight);
    cardGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    cardGradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
    ctx.fillStyle = cardGradient;
    this.roundRect(ctx, padding, cardY, size.width - padding * 2, cardHeight, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, padding, cardY, size.width - padding * 2, cardHeight, 20);
    ctx.stroke();

    // My answer label
    const myAnswerText = {
      ko: '나의 답변',
      en: 'My Answer',
      ja: '私の回答',
      zh: '我的答案',
      es: 'Mi respuesta'
    }[lang] || 'My Answer';

    ctx.fillStyle = this.colors.accent;
    ctx.font = '500 24px "Pretendard", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(myAnswerText, padding + 30, cardY + 50);

    // Selected option text
    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 36px "Pretendard", sans-serif';
    const optionText = selectedOption.text[lang] || selectedOption.text.ko;
    ctx.fillText(optionText, padding + 30, cardY + 100);

    // Result type badge
    ctx.font = '500 28px "Pretendard", sans-serif';
    ctx.fillStyle = this.colors.success;
    const traitText = lang === 'en' ? resultType.traitEn : resultType.trait;
    ctx.fillText(`#${traitText}`, padding + 30, cardY + 145);

    // Stats section
    const statsY = cardY + cardHeight + (isStory ? 80 : 50);

    // Stats header
    const statsHeaderText = {
      ko: '실시간 통계',
      en: 'Live Statistics',
      ja: 'リアルタイム統計',
      zh: '实时统计',
      es: 'Estadísticas en vivo'
    }[lang] || 'Live Statistics';

    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 32px "Pretendard", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(statsHeaderText, centerX, statsY);

    // Participant count
    ctx.fillStyle = this.colors.subtext;
    ctx.font = '400 24px "Pretendard", sans-serif';
    const participantText = dailyStats.getStatsMessage(stats, lang).total;
    ctx.fillText(participantText, centerX, statsY + 40);

    // Distribution bars
    const barStartY = statsY + (isStory ? 100 : 80);
    const barHeight = isStory ? 50 : 40;
    const barSpacing = isStory ? 70 : 55;
    const barWidth = size.width - padding * 2;

    question.options.forEach((option, index) => {
      const y = barStartY + (index * barSpacing);
      const percentage = stats.distribution[option.id] || 0;
      const isSelected = option.id === selectedOption.id;

      // Background bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.roundRect(ctx, padding, y, barWidth, barHeight, 10);
      ctx.fill();

      // Progress bar
      const progressWidth = (percentage / 100) * barWidth;
      const barGradient = ctx.createLinearGradient(padding, y, padding + progressWidth, y);
      if (isSelected) {
        barGradient.addColorStop(0, '#6366f1');
        barGradient.addColorStop(1, '#8b5cf6');
      } else {
        barGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        barGradient.addColorStop(1, 'rgba(139, 92, 246, 0.4)');
      }
      ctx.fillStyle = barGradient;
      this.roundRect(ctx, padding, y, progressWidth, barHeight, 10);
      ctx.fill();

      // Option emoji and percentage
      ctx.fillStyle = this.colors.text;
      ctx.font = `${isSelected ? 'bold' : '500'} ${isStory ? 24 : 20}px "Pretendard", sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`${option.emoji}`, padding + 15, y + barHeight / 2 + 8);

      ctx.textAlign = 'right';
      ctx.fillText(`${percentage}%`, padding + barWidth - 15, y + barHeight / 2 + 8);

      // Highlight selected
      if (isSelected) {
        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 3;
        this.roundRect(ctx, padding, y, barWidth, barHeight, 10);
        ctx.stroke();
      }
    });

    // Footer
    const footerY = isStory ? size.height - 200 : size.height - 100;

    // CTA
    const ctaText = {
      ko: '나도 테스트하기',
      en: 'Take the test too',
      ja: '私もテストする',
      zh: '我也要测试',
      es: 'Hacer el test también'
    }[lang] || 'Take the test too';

    // CTA button
    const ctaWidth = 300;
    const ctaHeight = 60;
    const ctaX = centerX - ctaWidth / 2;

    const ctaGradient = ctx.createLinearGradient(ctaX, footerY, ctaX + ctaWidth, footerY);
    ctaGradient.addColorStop(0, '#6366f1');
    ctaGradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = ctaGradient;
    this.roundRect(ctx, ctaX, footerY, ctaWidth, ctaHeight, 30);
    ctx.fill();

    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 24px "Pretendard", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ctaText, centerX, footerY + 40);

    // Site URL
    ctx.fillStyle = this.colors.subtext;
    ctx.font = '400 20px "Pretendard", sans-serif';
    ctx.fillText('smartaitest.com/daily', centerX, footerY + ctaHeight + 40);

    // Logo/branding
    ctx.font = '600 24px "Pretendard", sans-serif';
    ctx.fillStyle = this.colors.primary;
    ctx.fillText('AI Test Lab', centerX, isStory ? size.height - 60 : size.height - 30);

    return canvas;
  }

  /**
   * Generate streak share image
   */
  async generateStreakImage(streak, format = 'story', lang = 'ko') {
    const { canvas, ctx, size } = this.createCanvas(format);
    const isStory = format === 'story';
    const centerX = size.width / 2;
    const centerY = size.height / 2;

    // Big streak number
    ctx.fillStyle = this.colors.accent;
    ctx.font = `bold ${isStory ? 200 : 150}px "Pretendard", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(streak.toString(), centerX, centerY - 50);

    // Fire emojis
    const fireY = centerY - (isStory ? 180 : 130);
    ctx.font = `${isStory ? 80 : 60}px sans-serif`;
    ctx.fillText('🔥', centerX - 100, fireY);
    ctx.fillText('🔥', centerX, fireY);
    ctx.fillText('🔥', centerX + 100, fireY);

    // Streak text
    const streakText = {
      ko: '일 연속 참여!',
      en: 'Day Streak!',
      ja: '日連続参加！',
      zh: '天连续参与！',
      es: '¡Días seguidos!'
    }[lang] || 'Day Streak!';

    ctx.fillStyle = this.colors.text;
    ctx.font = `bold ${isStory ? 48 : 36}px "Pretendard", sans-serif`;
    ctx.fillText(streakText, centerX, centerY + 50);

    // Motivation message
    const motivationText = {
      ko: '꾸준함이 당신의 힘입니다!',
      en: 'Consistency is your power!',
      ja: '継続があなたの力です！',
      zh: '坚持是你的力量！',
      es: '¡La constancia es tu poder!'
    }[lang] || 'Consistency is your power!';

    ctx.fillStyle = this.colors.subtext;
    ctx.font = `400 ${isStory ? 28 : 24}px "Pretendard", sans-serif`;
    ctx.fillText(motivationText, centerX, centerY + 110);

    // Footer
    ctx.fillStyle = this.colors.subtext;
    ctx.font = '400 20px "Pretendard", sans-serif';
    ctx.fillText('smartaitest.com/daily', centerX, size.height - (isStory ? 100 : 60));

    ctx.font = '600 24px "Pretendard", sans-serif';
    ctx.fillStyle = this.colors.primary;
    ctx.fillText('AI Test Lab', centerX, size.height - (isStory ? 60 : 30));

    return canvas;
  }

  /**
   * Convert canvas to blob
   */
  async canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });
  }

  /**
   * Download image
   */
  async downloadImage(canvas, filename = 'daily-result.png') {
    const blob = await this.canvasToBlob(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Share image (Web Share API)
   */
  async shareImage(canvas, title, text) {
    try {
      const blob = await this.canvasToBlob(canvas);
      const file = new File([blob], 'daily-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          files: [file]
        });
        return true;
      }
    } catch (e) {
      console.log('Share failed:', e);
    }
    return false;
  }
}

// Global instance
const dailyShareGenerator = new DailyShareGenerator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyShareGenerator, dailyShareGenerator };
}
