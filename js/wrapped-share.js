/**
 * Wrapped Share Image Generator
 * Creates shareable images using canvas
 */

class WrappedShareManager {
  constructor() {
    this.stats = null;
    this.lang = 'ko';
  }

  /**
   * Initialize
   */
  initialize(stats, lang = 'ko') {
    this.stats = stats;
    this.lang = lang;
  }

  /**
   * Get translation
   */
  t(key) {
    const translations = {
      ko: {
        yearWrapped: '연말결산',
        tests: '테스트',
        streak: '스트릭',
        level: '레벨',
        badges: '배지',
        days: '일',
        myResult: '나의 소울 타입은',
        tagline: 'smartaitest.com에서 확인하세요'
      },
      en: {
        yearWrapped: 'Year Wrapped',
        tests: 'Tests',
        streak: 'Streak',
        level: 'Level',
        badges: 'Badges',
        days: 'd',
        myResult: 'My Soul Type is',
        tagline: 'Check yours at smartaitest.com'
      },
      ja: {
        yearWrapped: '年末まとめ',
        tests: 'テスト',
        streak: 'ストリーク',
        level: 'レベル',
        badges: 'バッジ',
        days: '日',
        myResult: '私のソウルタイプは',
        tagline: 'smartaitest.comで確認しよう'
      },
      zh: {
        yearWrapped: '年终总结',
        tests: '测试',
        streak: '连续',
        level: '等级',
        badges: '徽章',
        days: '天',
        myResult: '我的灵魂类型是',
        tagline: '在smartaitest.com查看你的'
      },
      es: {
        yearWrapped: 'Resumen del Año',
        tests: 'Tests',
        streak: 'Racha',
        level: 'Nivel',
        badges: 'Insignias',
        days: 'd',
        myResult: 'Mi Tipo de Alma es',
        tagline: 'Descubre el tuyo en smartaitest.com'
      }
    };

    return translations[this.lang]?.[key] || translations.en[key] || key;
  }

  /**
   * Create gradient
   */
  createGradient(ctx, x, y, width, height, colors) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1] || colors[0]);
    gradient.addColorStop(1, colors[2] || colors[1] || colors[0]);
    return gradient;
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
   * Generate story image (1080x1920)
   */
  async generateStoryImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGradient = this.createGradient(ctx, 0, 0, 1080, 1920, ['#6366f1', '#8b5cf6', '#a855f7']);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Add pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1080;
      const y = Math.random() * 1920;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 20 + 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Year badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.roundRect(ctx, 440, 200, 200, 50, 25);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px "Pretendard Variable", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.stats.year} ${this.t('yearWrapped')}`, 540, 233);

    // Main emoji
    ctx.font = '180px sans-serif';
    ctx.fillText(this.stats.mostCommonType?.emoji || '✨', 540, 480);

    // Type name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px "Pretendard Variable", sans-serif';
    ctx.fillText(this.stats.mostCommonType?.name || 'AI Soul', 540, 600);

    // Subtitle
    ctx.font = '32px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(this.t('myResult'), 540, 530);

    // Stats card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.roundRect(ctx, 90, 720, 900, 400, 40);
    ctx.fill();

    // Stats grid (2x2)
    const stats = [
      { value: this.stats.totalTests, label: this.t('tests'), emoji: '📊' },
      { value: `${this.stats.bestStreak}${this.t('days')}`, label: this.t('streak'), emoji: '🔥' },
      { value: `Lv.${this.stats.levelProgress.end}`, label: this.t('level'), emoji: '⭐' },
      { value: this.stats.earnedBadges?.length || 0, label: this.t('badges'), emoji: '🏆' }
    ];

    const statWidth = 400;
    const statHeight = 150;
    const startX = 140;
    const startY = 780;

    stats.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (statWidth + 50);
      const y = startY + row * (statHeight + 30);

      // Stat background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      this.roundRect(ctx, x, y, statWidth, statHeight, 20);
      ctx.fill();

      // Emoji
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(stat.emoji, x + 30, y + 60);

      // Value
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px "Pretendard Variable", sans-serif';
      ctx.fillText(String(stat.value), x + 90, y + 65);

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '24px "Pretendard Variable", sans-serif';
      ctx.fillText(stat.label, x + 90, y + 110);
    });

    // Traits (if available)
    const traits = this.stats.mostCommonType?.traits?.slice(0, 3) || [];
    if (traits.length > 0) {
      const traitsY = 1200;
      let traitsX = 540 - (traits.length * 100) / 2;

      ctx.font = '24px "Pretendard Variable", sans-serif';
      traits.forEach((trait, i) => {
        const text = this.lang === 'ko' ? trait.ko : trait.en;
        const textWidth = ctx.measureText(text).width + 40;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.roundRect(ctx, traitsX, traitsY, textWidth, 44, 22);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(text, traitsX + textWidth / 2, traitsY + 30);

        traitsX += textWidth + 16;
      });
    }

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '28px "Pretendard Variable", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.t('tagline'), 540, 1800);

    // Logo
    ctx.font = 'bold 32px "Pretendard Variable", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('AI Test Lab', 540, 1850);

    return canvas;
  }

  /**
   * Generate square image (1080x1080)
   */
  async generateSquareImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGradient = this.createGradient(ctx, 0, 0, 1080, 1080, ['#6366f1', '#8b5cf6', '#a855f7']);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1080;
      const y = Math.random() * 1080;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 15 + 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Year badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.roundRect(ctx, 390, 80, 300, 50, 25);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px "Pretendard Variable", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.stats.year} ${this.t('yearWrapped')}`, 540, 113);

    // Main emoji
    ctx.font = '120px sans-serif';
    ctx.fillText(this.stats.mostCommonType?.emoji || '✨', 540, 280);

    // Type name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Pretendard Variable", sans-serif';
    ctx.fillText(this.stats.mostCommonType?.name || 'AI Soul', 540, 360);

    // Stats row
    const stats = [
      { value: this.stats.totalTests, label: this.t('tests') },
      { value: `${this.stats.bestStreak}${this.t('days')}`, label: this.t('streak') },
      { value: `Lv.${this.stats.levelProgress.end}`, label: this.t('level') },
      { value: this.stats.earnedBadges?.length || 0, label: this.t('badges') }
    ];

    const statWidth = 200;
    const startX = 140;
    const statsY = 450;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.roundRect(ctx, 90, statsY - 20, 900, 200, 30);
    ctx.fill();

    stats.forEach((stat, i) => {
      const x = startX + i * (statWidth + 30);

      // Value
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px "Pretendard Variable", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(stat.value), x + statWidth / 2, statsY + 60);

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '24px "Pretendard Variable", sans-serif';
      ctx.fillText(stat.label, x + statWidth / 2, statsY + 110);
    });

    // Badges preview
    const badges = this.stats.earnedBadges?.slice(0, 4) || [];
    if (badges.length > 0) {
      const badgesY = 720;
      const badgeSize = 80;
      const badgeGap = 20;
      const totalBadgesWidth = badges.length * badgeSize + (badges.length - 1) * badgeGap;
      let badgeX = 540 - totalBadgesWidth / 2;

      badges.forEach(badge => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.roundRect(ctx, badgeX, badgesY, badgeSize, badgeSize, 15);
        ctx.fill();

        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(badge.emoji, badgeX + badgeSize / 2, badgesY + 55);

        badgeX += badgeSize + badgeGap;
      });
    }

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '24px "Pretendard Variable", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.t('tagline'), 540, 980);

    // Logo
    ctx.font = 'bold 28px "Pretendard Variable", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('AI Test Lab', 540, 1020);

    return canvas;
  }

  /**
   * Download image
   */
  async downloadImage(format = 'story') {
    try {
      let canvas;
      if (format === 'square') {
        canvas = await this.generateSquareImage();
      } else {
        canvas = await this.generateStoryImage();
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `ai-soul-wrapped-${this.stats.year}-${format}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Show success toast
      if (typeof showToast === 'function') {
        showToast(this.lang === 'ko' ? '이미지가 저장되었습니다!' : 'Image saved!', 'success');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      if (typeof showToast === 'function') {
        showToast(this.lang === 'ko' ? '이미지 생성 중 오류가 발생했습니다' : 'Error generating image', 'error');
      }
    }
  }

  /**
   * Share to social media (if Web Share API available)
   */
  async shareImage(format = 'story') {
    if (!navigator.share) {
      // Fallback to download
      this.downloadImage(format);
      return;
    }

    try {
      let canvas;
      if (format === 'square') {
        canvas = await this.generateSquareImage();
      } else {
        canvas = await this.generateStoryImage();
      }

      // Convert to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `ai-soul-wrapped-${this.stats.year}.png`, { type: 'image/png' });

      await navigator.share({
        files: [file],
        title: `AI Soul ${this.t('yearWrapped')} ${this.stats.year}`,
        text: this.t('tagline')
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to download
        this.downloadImage(format);
      }
    }
  }
}

// Global instance
const wrappedShare = new WrappedShareManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WrappedShareManager, wrappedShare };
}
