/**
 * Widget Embed Manager
 * Handles widget rendering based on URL parameters
 */

class WidgetEmbedManager {
  constructor() {
    this.params = {};
    this.soulTypes = null;
  }

  /**
   * Initialize
   */
  initialize() {
    // Parse URL parameters
    this.parseParams();

    // Load soul types if available
    if (typeof SOUL_TYPES !== 'undefined') {
      this.soulTypes = SOUL_TYPES;
    }

    // Render widget
    this.render();
  }

  /**
   * Parse URL parameters
   */
  parseParams() {
    const urlParams = new URLSearchParams(window.location.search);

    this.params = {
      type: urlParams.get('type') || 'flame-fox',
      style: urlParams.get('style') || 'card',
      lang: urlParams.get('lang') || 'ko',
      level: parseInt(urlParams.get('level')) || 1,
      streak: parseInt(urlParams.get('streak')) || 0,
      name: urlParams.get('name') || ''
    };
  }

  /**
   * Get soul type data
   */
  getSoulType(typeId) {
    if (!this.soulTypes) return null;
    return this.soulTypes.find(t => t.id === typeId) || this.soulTypes[0];
  }

  /**
   * Get translation
   */
  t(key) {
    const translations = {
      ko: {
        level: '레벨',
        streak: '스트릭',
        days: '일',
        findYourType: '나의 타입 찾기'
      },
      en: {
        level: 'Level',
        streak: 'Streak',
        days: 'd',
        findYourType: 'Find Your Type'
      },
      ja: {
        level: 'レベル',
        streak: 'ストリーク',
        days: '日',
        findYourType: 'タイプを見つける'
      },
      zh: {
        level: '等级',
        streak: '连续',
        days: '天',
        findYourType: '找到你的类型'
      },
      es: {
        level: 'Nivel',
        streak: 'Racha',
        days: 'd',
        findYourType: 'Encuentra tu tipo'
      }
    };

    const lang = this.params.lang;
    return translations[lang]?.[key] || translations.en[key] || key;
  }

  /**
   * Render widget
   */
  render() {
    const container = document.getElementById('widget-container');
    if (!container) return;

    const soulType = this.getSoulType(this.params.type);
    if (!soulType) {
      container.innerHTML = '<p>Invalid type</p>';
      return;
    }

    const typeName = this.params.lang === 'ko' ? soulType.nameKo : soulType.nameEn;
    const gradientClass = `gradient-${soulType.id}`;
    const siteUrl = 'https://smartaitest.com';

    switch (this.params.style) {
      case 'badge':
        this.renderBadge(container, soulType, typeName, gradientClass, siteUrl);
        break;
      case 'mini':
        this.renderMini(container, soulType, typeName, gradientClass, siteUrl);
        break;
      case 'card':
      default:
        this.renderCard(container, soulType, typeName, gradientClass, siteUrl);
        break;
    }
  }

  /**
   * Render card widget
   */
  renderCard(container, soulType, typeName, gradientClass, siteUrl) {
    const displayName = this.params.name || 'AI Soul';

    container.innerHTML = `
      <div class="widget-card ${gradientClass}">
        <div class="widget-card-header">
          <span class="widget-card-emoji">${soulType.emoji}</span>
          <div class="widget-card-info">
            <div class="widget-card-name">${this.escapeHtml(displayName)}</div>
            <div class="widget-card-type">${typeName}</div>
          </div>
        </div>
        <div class="widget-card-stats">
          <div class="widget-card-stat">
            <div class="widget-card-stat-value">Lv.${this.params.level}</div>
            <div class="widget-card-stat-label">${this.t('level')}</div>
          </div>
          <div class="widget-card-stat">
            <div class="widget-card-stat-value">${this.params.streak}${this.t('days')}</div>
            <div class="widget-card-stat-label">${this.t('streak')}</div>
          </div>
        </div>
        <a href="${siteUrl}" target="_blank" class="widget-card-cta">
          <span>✨</span>
          <span>${this.t('findYourType')}</span>
        </a>
      </div>
    `;
  }

  /**
   * Render badge widget
   */
  renderBadge(container, soulType, typeName, gradientClass, siteUrl) {
    const displayName = this.params.name || typeName;

    container.innerHTML = `
      <a href="${siteUrl}" target="_blank" class="widget-badge ${gradientClass}">
        <span class="widget-badge-emoji">${soulType.emoji}</span>
        <div class="widget-badge-info">
          <div class="widget-badge-name">${this.escapeHtml(displayName)}</div>
          <div class="widget-badge-type">${typeName}</div>
        </div>
        <span class="widget-badge-arrow">→</span>
      </a>
    `;
  }

  /**
   * Render mini widget
   */
  renderMini(container, soulType, typeName, gradientClass, siteUrl) {
    container.innerHTML = `
      <a href="${siteUrl}" target="_blank" class="widget-mini ${gradientClass}">
        <span class="widget-mini-emoji">${soulType.emoji}</span>
        <span class="widget-mini-name">${typeName}</span>
      </a>
    `;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * Widget Generator (for generator page)
 */
class WidgetGenerator {
  constructor() {
    this.selectedStyle = 'card';
    this.selectedType = 'flame-fox';
    this.lang = 'ko';
    this.soulTypes = null;
  }

  /**
   * Initialize generator
   */
  initialize(lang = 'ko') {
    this.lang = lang;

    if (typeof SOUL_TYPES !== 'undefined') {
      this.soulTypes = SOUL_TYPES;
    }

    this.setupEventListeners();
    this.renderTypeSelector();
    this.updatePreview();
    this.updateCode();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Style selector
    document.querySelectorAll('.style-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectStyle(option.dataset.style);
      });
    });

    // Copy button
    document.querySelector('.copy-btn')?.addEventListener('click', () => {
      this.copyCode();
    });
  }

  /**
   * Render type selector
   */
  renderTypeSelector() {
    const container = document.querySelector('.type-selector');
    if (!container || !this.soulTypes) return;

    container.innerHTML = this.soulTypes.map(type => `
      <button class="type-option ${type.id === this.selectedType ? 'active' : ''}"
              data-type="${type.id}"
              onclick="widgetGenerator.selectType('${type.id}')">
        <div class="type-option-emoji">${type.emoji}</div>
        <div class="type-option-name">${this.lang === 'ko' ? type.nameKo : type.nameEn}</div>
      </button>
    `).join('');
  }

  /**
   * Select style
   */
  selectStyle(style) {
    this.selectedStyle = style;

    // Update UI
    document.querySelectorAll('.style-option').forEach(option => {
      option.classList.toggle('active', option.dataset.style === style);
    });

    this.updatePreview();
    this.updateCode();
  }

  /**
   * Select type
   */
  selectType(typeId) {
    this.selectedType = typeId;

    // Update UI
    document.querySelectorAll('.type-option').forEach(option => {
      option.classList.toggle('active', option.dataset.type === typeId);
    });

    this.updatePreview();
    this.updateCode();
  }

  /**
   * Update preview
   */
  updatePreview() {
    const preview = document.querySelector('.preview-area');
    if (!preview) return;

    const soulType = this.soulTypes?.find(t => t.id === this.selectedType);
    if (!soulType) return;

    const typeName = this.lang === 'ko' ? soulType.nameKo : soulType.nameEn;
    const gradientClass = `gradient-${soulType.id}`;

    let html = '';

    switch (this.selectedStyle) {
      case 'badge':
        html = `
          <div class="widget-badge ${gradientClass}" style="pointer-events: none;">
            <span class="widget-badge-emoji">${soulType.emoji}</span>
            <div class="widget-badge-info">
              <div class="widget-badge-name">${typeName}</div>
              <div class="widget-badge-type">${typeName}</div>
            </div>
            <span class="widget-badge-arrow">→</span>
          </div>
        `;
        break;
      case 'mini':
        html = `
          <div class="widget-mini ${gradientClass}" style="pointer-events: none;">
            <span class="widget-mini-emoji">${soulType.emoji}</span>
            <span class="widget-mini-name">${typeName}</span>
          </div>
        `;
        break;
      case 'card':
      default:
        html = `
          <div class="widget-card ${gradientClass}" style="pointer-events: none;">
            <div class="widget-card-header">
              <span class="widget-card-emoji">${soulType.emoji}</span>
              <div class="widget-card-info">
                <div class="widget-card-name">AI Soul</div>
                <div class="widget-card-type">${typeName}</div>
              </div>
            </div>
            <div class="widget-card-stats">
              <div class="widget-card-stat">
                <div class="widget-card-stat-value">Lv.5</div>
                <div class="widget-card-stat-label">${this.lang === 'ko' ? '레벨' : 'Level'}</div>
              </div>
              <div class="widget-card-stat">
                <div class="widget-card-stat-value">7${this.lang === 'ko' ? '일' : 'd'}</div>
                <div class="widget-card-stat-label">${this.lang === 'ko' ? '스트릭' : 'Streak'}</div>
              </div>
            </div>
            <div class="widget-card-cta">
              <span>✨</span>
              <span>${this.lang === 'ko' ? '나의 타입 찾기' : 'Find Your Type'}</span>
            </div>
          </div>
        `;
        break;
    }

    preview.innerHTML = html;
  }

  /**
   * Update embed code
   */
  updateCode() {
    const codeEl = document.querySelector('.code-output code');
    if (!codeEl) return;

    const dimensions = {
      card: { width: 300, height: 200 },
      badge: { width: 200, height: 60 },
      mini: { width: 100, height: 100 }
    };

    const dim = dimensions[this.selectedStyle];
    const embedUrl = `https://smartaitest.com/widget/embed.html?type=${this.selectedType}&style=${this.selectedStyle}&lang=${this.lang}`;

    const code = `<iframe
  src="${embedUrl}"
  width="${dim.width}"
  height="${dim.height}"
  frameborder="0"
  scrolling="no"
  style="border: none; overflow: hidden;"
></iframe>`;

    codeEl.textContent = code;
  }

  /**
   * Copy code to clipboard
   */
  async copyCode() {
    const codeEl = document.querySelector('.code-output code');
    const copyBtn = document.querySelector('.copy-btn');
    if (!codeEl || !copyBtn) return;

    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      copyBtn.textContent = this.lang === 'ko' ? '복사됨!' : 'Copied!';
      copyBtn.classList.add('copied');

      setTimeout(() => {
        copyBtn.textContent = this.lang === 'ko' ? '복사' : 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}

// Global instances
const widgetEmbed = new WidgetEmbedManager();
const widgetGenerator = new WidgetGenerator();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WidgetEmbedManager, widgetEmbed, WidgetGenerator, widgetGenerator };
}
