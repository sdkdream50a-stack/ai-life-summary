/**
 * Radar Chart Visualization
 * SmartAITest.com - Stage 2 Viral Engine
 *
 * Features:
 * - Hexagon radar chart for 6 traits
 * - Animated entry
 * - Multi-language support
 * - Canvas export for share images
 */

// Trait configuration
const RADAR_TRAITS = {
  ko: {
    intelligence: '지성',
    emotion: '감성',
    energy: '에너지',
    humor: '유머',
    sociability: '사회성',
    intuition: '직관력'
  },
  en: {
    intelligence: 'Intelligence',
    emotion: 'Emotion',
    energy: 'Energy',
    humor: 'Humor',
    sociability: 'Sociability',
    intuition: 'Intuition'
  },
  ja: {
    intelligence: '知性',
    emotion: '感性',
    energy: 'エネルギー',
    humor: 'ユーモア',
    sociability: '社会性',
    intuition: '直感力'
  },
  zh: {
    intelligence: '智力',
    emotion: '感性',
    energy: '能量',
    humor: '幽默',
    sociability: '社交性',
    intuition: '直觉力'
  },
  es: {
    intelligence: 'Inteligencia',
    emotion: 'Emoción',
    energy: 'Energía',
    humor: 'Humor',
    sociability: 'Sociabilidad',
    intuition: 'Intuición'
  }
};

// Provocative viral copy templates
const VIRAL_COPY = {
  ko: [
    { text: '재미용 정신 나이 점수 상위 {percent}%?', emoji: '🧠' },
    { text: '이 유형은 100명 중 {count}명뿐!', emoji: '💎' },
    { text: '당신의 숨겨진 잠재력 발견!', emoji: '✨' },
    { text: '이 조합은 전 세계 {percent}% 미만!', emoji: '🌍' },
    { text: '나만의 특별한 소울 DNA 공개!', emoji: '🔬' },
    { text: '답변으로 만든 나의 오락용 프로필', emoji: '🧩' },
    { text: '이런 유형 처음 봤다고요?', emoji: '😱' },
    { text: '감성 지수 {score}점 달성!', emoji: '💕' }
  ],
  en: [
    { text: 'My playful mental-age score is in the top {percent}%?', emoji: '🧠' },
    { text: 'Only {count} out of 100 have this type!', emoji: '💎' },
    { text: 'Your hidden potential revealed!', emoji: '✨' },
    { text: 'This combo is less than {percent}% worldwide!', emoji: '🌍' },
    { text: 'My unique Soul DNA revealed!', emoji: '🔬' },
    { text: 'My entertainment profile from my answers', emoji: '🧩' },
    { text: "Never seen this type before?", emoji: '😱' },
    { text: 'Emotion score: {score} achieved!', emoji: '💕' }
  ],
  ja: [
    { text: '娯楽用メンタル年齢スコアは上位{percent}%?', emoji: '🧠' },
    { text: 'このタイプは100人中{count}人だけ!', emoji: '💎' },
    { text: 'あなたの隠れた可能性を発見!', emoji: '✨' },
    { text: 'この組み合わせは世界の{percent}%未満!', emoji: '🌍' },
    { text: '私だけの特別なソウルDNA公開!', emoji: '🔬' },
    { text: '回答から作った娯楽用プロフィール', emoji: '🧩' },
    { text: 'こんなタイプ初めて見た?', emoji: '😱' },
    { text: '感性指数{score}点達成!', emoji: '💕' }
  ],
  zh: [
    { text: '我的娱乐心理年龄分数进入前{percent}%?', emoji: '🧠' },
    { text: '100人中只有{count}人是这个类型!', emoji: '💎' },
    { text: '发现你隐藏的潜力!', emoji: '✨' },
    { text: '这个组合全球不到{percent}%!', emoji: '🌍' },
    { text: '我独特的灵魂DNA公开!', emoji: '🔬' },
    { text: '根据回答生成的娱乐性个人档案', emoji: '🧩' },
    { text: '第一次见到这种类型?', emoji: '😱' },
    { text: '感性指数达到{score}分!', emoji: '💕' }
  ],
  es: [
    { text: '¿Mi puntuación lúdica de edad mental está en el top {percent}%?', emoji: '🧠' },
    { text: '¡Solo {count} de 100 tienen este tipo!', emoji: '💎' },
    { text: '¡Tu potencial oculto revelado!', emoji: '✨' },
    { text: '¡Esta combo es menos del {percent}% mundial!', emoji: '🌍' },
    { text: '¡Mi ADN de Alma único revelado!', emoji: '🔬' },
    { text: 'Mi perfil lúdico creado a partir de mis respuestas', emoji: '🧩' },
    { text: '¿Nunca viste este tipo antes?', emoji: '😱' },
    { text: '¡Puntuación emocional: {score} lograda!', emoji: '💕' }
  ]
};

/**
 * RadarChartManager class
 */
class RadarChartManager {
  constructor(options = {}) {
    this.lang = options.lang || 'ko';
    this.chart = null;
    this.canvas = null;
  }

  /**
   * Get trait labels
   */
  getTraitLabels() {
    return RADAR_TRAITS[this.lang] || RADAR_TRAITS.en;
  }

  /**
   * Generate random provocative copy
   */
  getViralCopy(soulType) {
    const copies = VIRAL_COPY[this.lang] || VIRAL_COPY.en;
    const template = copies[Math.floor(Math.random() * copies.length)];

    // Generate dynamic values based on soul type
    const percent = soulType.rarity || Math.floor(Math.random() * 10) + 1;
    const count = Math.floor(100 / (percent || 5));
    const score = Math.floor(Math.random() * 20) + 80;

    let text = template.text
      .replace('{percent}', percent)
      .replace('{count}', count)
      .replace('{score}', score);

    return {
      emoji: template.emoji,
      text: text
    };
  }

  /**
   * Calculate 6-trait values from soul type
   */
  calculateTraitValues(soulType) {
    const traits = soulType.traits || {};

    // Map existing 5 traits + calculate 6th
    return {
      intelligence: traits.logic || Math.floor(Math.random() * 30) + 60,
      emotion: traits.empathy || Math.floor(Math.random() * 30) + 60,
      energy: traits.passion || Math.floor(Math.random() * 30) + 60,
      humor: Math.floor((traits.creativity || 70) * 0.9 + Math.random() * 10),
      sociability: Math.floor((traits.empathy || 70) * 0.8 + (traits.passion || 70) * 0.2),
      intuition: traits.intuition || Math.floor(Math.random() * 30) + 60
    };
  }

  /**
   * Create radar chart in container
   */
  createChart(containerId, soulType, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Radar chart container not found:', containerId);
      return null;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded');
      return null;
    }

    const traitValues = this.calculateTraitValues(soulType);
    const traitLabels = this.getTraitLabels();

    // Create canvas
    const canvasId = `radar-canvas-${Date.now()}`;
    container.innerHTML = `
      <div class="radar-chart-wrapper">
        <canvas id="${canvasId}" class="radar-chart-canvas"></canvas>
      </div>
    `;

    this.canvas = document.getElementById(canvasId);
    const ctx = this.canvas.getContext('2d');

    // Chart configuration
    const data = {
      labels: Object.values(traitLabels),
      datasets: [{
        label: getSoulTypeName ? getSoulTypeName(soulType, this.lang) : soulType.id,
        data: Object.values(traitValues),
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        borderColor: 'rgba(236, 72, 153, 0.8)',
        borderWidth: 3,
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };

    const config = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            ticks: {
              stepSize: 20,
              display: false
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              circular: true
            },
            angleLines: {
              color: 'rgba(255, 255, 255, 0.15)'
            },
            pointLabels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 14,
                weight: '500',
                family: "'Pretendard Variable', 'Poppins', sans-serif"
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        }
      }
    };

    // Destroy existing chart if any
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, config);

    // Add animation class
    container.classList.add('animate-in');

    return {
      chart: this.chart,
      traitValues: traitValues
    };
  }

  /**
   * Get chart as data URL
   */
  getChartDataURL() {
    if (!this.canvas) return null;
    return this.canvas.toDataURL('image/png');
  }

  /**
   * Destroy chart
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

/**
 * Enhanced Share Image Generator with Radar Chart
 */
class ViralImageGenerator {
  constructor(options = {}) {
    this.lang = options.lang || 'ko';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.radarManager = new RadarChartManager({ lang: this.lang });
  }

  /**
   * Draw hexagon radar chart on canvas
   */
  drawRadarChart(centerX, centerY, radius, values, colors) {
    const ctx = this.ctx;
    const sides = 6;
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2; // Start from top

    // Draw grid lines
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius / 5) * level;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= sides; i++) {
        const angle = startAngle + i * angleStep;
        const x = centerX + Math.cos(angle) * levelRadius;
        const y = centerY + Math.sin(angle) * levelRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      ctx.stroke();
    }

    // Draw data area
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.3)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    values.forEach((value, i) => {
      const angle = startAngle + i * angleStep;
      const dataRadius = (value / 100) * radius;
      const x = centerX + Math.cos(angle) * dataRadius;
      const y = centerY + Math.sin(angle) * dataRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();

    // Draw data line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.9)';
    ctx.lineWidth = 3;
    values.forEach((value, i) => {
      const angle = startAngle + i * angleStep;
      const dataRadius = (value / 100) * radius;
      const x = centerX + Math.cos(angle) * dataRadius;
      const y = centerY + Math.sin(angle) * dataRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw data points
    values.forEach((value, i) => {
      const angle = startAngle + i * angleStep;
      const dataRadius = (value / 100) * radius;
      const x = centerX + Math.cos(angle) * dataRadius;
      const y = centerY + Math.sin(angle) * dataRadius;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw labels
    const labels = Object.values(RADAR_TRAITS[this.lang] || RADAR_TRAITS.en);
    ctx.font = 'bold 24px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    labels.forEach((label, i) => {
      const angle = startAngle + i * angleStep;
      const labelRadius = radius + 50;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      // Adjust alignment based on position
      if (Math.abs(Math.cos(angle)) < 0.1) {
        ctx.textAlign = 'center';
      } else if (Math.cos(angle) > 0) {
        ctx.textAlign = 'left';
      } else {
        ctx.textAlign = 'right';
      }

      ctx.fillText(label, x, y);
    });

    ctx.textAlign = 'center'; // Reset
  }

  /**
   * Generate Instagram Story Image (9:16, 1080x1920)
   */
  async generateStoryImage(soulType, options = {}) {
    const width = 1080;
    const height = 1920;

    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(0.5, '#16213e');
    bgGradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative elements
    this.drawDecorations();

    // Get viral copy
    const viralCopy = this.radarManager.getViralCopy(soulType);

    // === PROVOCATIVE HEADER ===
    const headerY = 180;

    // Header background
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    this.roundRect(100, headerY - 50, width - 200, 100, 20);
    ctx.fill();

    // Header border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    this.roundRect(100, headerY - 50, width - 200, 100, 20);
    ctx.stroke();

    // Viral text
    ctx.font = 'bold 42px "Pretendard Variable", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText(`${viralCopy.emoji} ${viralCopy.text}`, width / 2, headerY + 10);
    ctx.shadowBlur = 0;

    // === SOUL TYPE INFO ===
    const typeY = 420;

    // Emoji
    ctx.font = '160px sans-serif';
    ctx.fillText(soulType.emoji, width / 2, typeY);

    // Type name
    const typeName = typeof getSoulTypeName === 'function'
      ? getSoulTypeName(soulType, this.lang)
      : soulType.id;

    ctx.font = 'bold 56px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(typeName, width / 2, typeY + 100);

    // === RADAR CHART ===
    const chartCenterY = 850;
    const chartRadius = 220;
    const traitValues = this.radarManager.calculateTraitValues(soulType);
    this.drawRadarChart(width / 2, chartCenterY, chartRadius, Object.values(traitValues));

    // === TRAIT VALUES ===
    const traitsY = 1180;
    const traitLabels = RADAR_TRAITS[this.lang] || RADAR_TRAITS.en;
    const traitKeys = Object.keys(traitLabels);
    const traitColors = ['#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];

    ctx.font = '24px "Pretendard Variable", sans-serif';

    traitKeys.forEach((key, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 180 + col * 280;
      const y = traitsY + row * 80;

      // Background pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.roundRect(x - 80, y - 25, 220, 50, 25);
      ctx.fill();

      // Color dot
      ctx.beginPath();
      ctx.arc(x - 55, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = traitColors[i];
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'left';
      ctx.fillText(traitLabels[key], x - 35, y + 8);

      // Value
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.font = 'bold 24px "Pretendard Variable", sans-serif';
      ctx.fillText(`${traitValues[key]}%`, x + 120, y + 8);
      ctx.font = '24px "Pretendard Variable", sans-serif';
    });

    // === RARITY BADGE ===
    const badgeY = 1450;

    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    this.roundRect(width / 2 - 200, badgeY - 35, 400, 70, 35);
    ctx.fill();

    ctx.font = 'bold 36px "Pretendard Variable", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    const rarityText = this.lang === 'ko'
      ? `🏆 상위 ${soulType.rarity || 5}% 유형`
      : `🏆 Top ${soulType.rarity || 5}% Type`;
    ctx.fillText(rarityText, width / 2, badgeY + 10);

    // === HASHTAGS ===
    const hashtagY = 1580;
    ctx.font = '28px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const hashtags = this.lang === 'ko'
      ? `#AI소울테스트 #${typeName.replace(/\s/g, '')} #성격테스트`
      : `#AISoulTest #${typeName.replace(/\s/g, '')} #PersonalityTest`;
    ctx.fillText(hashtags, width / 2, hashtagY);

    // === CTA ===
    const ctaY = 1700;
    ctx.fillStyle = 'linear-gradient(135deg, #6366f1, #ec4899)';

    // CTA button background
    const ctaGradient = ctx.createLinearGradient(width / 2 - 200, ctaY - 35, width / 2 + 200, ctaY + 35);
    ctaGradient.addColorStop(0, '#6366f1');
    ctaGradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = ctaGradient;
    this.roundRect(width / 2 - 200, ctaY - 35, 400, 70, 35);
    ctx.fill();

    ctx.font = 'bold 32px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'white';
    const ctaText = this.lang === 'ko' ? '나도 테스트하기 →' : 'Take the test →';
    ctx.fillText(ctaText, width / 2, ctaY + 10);

    // === WATERMARK ===
    ctx.font = '24px "Pretendard Variable", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('smartaitest.com', width / 2, height - 60);

    return this.canvas.toDataURL('image/png');
  }

  /**
   * Draw decorative elements
   */
  drawDecorations() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    // Gradient circles
    ctx.globalAlpha = 0.1;

    ctx.beginPath();
    ctx.arc(width * 0.1, height * 0.1, 150, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.9, height * 0.3, 100, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.9, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#8B5CF6';
    ctx.fill();

    // Sparkles
    ctx.fillStyle = 'white';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      ctx.globalAlpha = Math.random() * 0.3 + 0.1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Helper: Draw rounded rectangle
   */
  roundRect(x, y, width, height, radius) {
    const ctx = this.ctx;
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
   * Download the generated image
   */
  downloadImage(dataUrl, filename = 'soul-type-story') {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  }
}

// Global instances
const radarChart = new RadarChartManager();
const viralImageGenerator = new ViralImageGenerator();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RadarChartManager,
    ViralImageGenerator,
    RADAR_TRAITS,
    VIRAL_COPY,
    radarChart,
    viralImageGenerator
  };
}
