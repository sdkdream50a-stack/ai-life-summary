// personality-type-result.js
// Result page logic — reads sessionStorage, renders type card, share, etc.

(function() {
  const LANG = document.documentElement.lang || 'en';
  const L = PT_LABELS[LANG] || PT_LABELS['en'];

  const typeCode = sessionStorage.getItem('pt-result') || 'INFP';
  const typeData = PT_TYPES[typeCode];

  // Fallback redirect if no result
  if (!sessionStorage.getItem('pt-result')) {
    window.location.href = '../';
    return;
  }

  const langData = typeData ? (typeData[LANG] || typeData['en']) : null;

  // ── Set type info ─────────────────────────────────────────────
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setHtml(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  }

  if (typeData && langData) {
    setText('pt-type-code', typeCode);
    setText('pt-type-emoji', typeData.emoji);
    setText('pt-type-name', langData.name);
    setText('pt-type-tagline', langData.tagline);
    setText('pt-type-desc', langData.desc);
    setText('pt-your-type-label', L.yourType);
    setText('pt-strengths-label', L.strengths);
    setText('pt-weaknesses-label', L.weaknesses);
    setText('pt-compatible-label', L.compatible);
    setText('pt-result-disclaimer', L.resultDisclaimer);
    setText('pt-retake-btn', L.retake);
    setText('pt-share-btn', L.shareBtn);

    // Strengths
    const strengthsEl = document.getElementById('pt-strengths-list');
    if (strengthsEl) {
      strengthsEl.innerHTML = langData.strengths.map(function(s) {
        return `<li>✅ ${s}</li>`;
      }).join('');
    }

    // Weaknesses
    const weaknessesEl = document.getElementById('pt-weaknesses-list');
    if (weaknessesEl) {
      weaknessesEl.innerHTML = langData.weaknesses.map(function(w) {
        return `<li>⚠️ ${w}</li>`;
      }).join('');
    }

    // Compatible types with links
    const compatEl = document.getElementById('pt-compatible-list');
    if (compatEl) {
      compatEl.innerHTML = langData.compatible.map(function(ct) {
        const ctData = PT_TYPES[ct];
        const ctLang = ctData ? (ctData[LANG] || ctData['en']) : null;
        const ctName = ctLang ? ctLang.name : ct;
        const ctEmoji = ctData ? ctData.emoji : '💫';
        return `<span class="pt-compatible-badge">${ctEmoji} ${ct} ${ctName}</span>`;
      }).join('');
    }

    // Apply gradient to header card
    const headerCard = document.getElementById('pt-type-header');
    if (headerCard && typeData.gradient) {
      headerCard.classList.add('bg-gradient-to-br', ...typeData.gradient.split(' '));
    }

    // Update page title & OG meta dynamically
    const shareText = L.shareText.replace('{type}', typeCode).replace('{name}', langData.name);
    document.title = `${typeCode} ${langData.name} — ${L.title} | AI Test Lab`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${typeData.emoji} ${typeCode} ${langData.name} — ${L.title}`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', shareText);
  }

  // ── Share functions ───────────────────────────────────────────
  const shareText = langData
    ? L.shareText.replace('{type}', typeCode).replace('{name}', langData.name)
    : `${typeCode} — AI Test Lab`;
  const shareUrl = window.location.origin + window.location.pathname.replace('result/', '') + '?type=' + typeCode;

  window.ptShare = function(platform) {
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl + '\n' + shareText).then(function() {
        const btn = document.getElementById('pt-share-btn');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = '✅ Copied!';
          setTimeout(function() { btn.textContent = orig; }, 2000);
        }
      });
    } else if (platform === 'twitter') {
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText + ' ' + shareUrl), '_blank');
    } else if (platform === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank');
    }
  };

  // ── Retake ────────────────────────────────────────────────────
  const retakeBtn = document.getElementById('pt-retake-btn');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', function() {
      sessionStorage.removeItem('pt-result');
      sessionStorage.removeItem('pt-answers');
      window.location.href = '../';
    });
  }

  // ── Cross-test CTA ────────────────────────────────────────────
  const otherTestsEl = document.getElementById('pt-other-tests-label');
  if (otherTestsEl) otherTestsEl.textContent = L.tryOther;

  // ── Show axes summary ─────────────────────────────────────────
  const axisBar = document.getElementById('pt-axis-bars');
  if (axisBar) {
    const savedAnswers = JSON.parse(sessionStorage.getItem('pt-answers') || '{}');
    const axes = [
      {key:'EI', labels:['E','I']},
      {key:'SN', labels:['S','N']},
      {key:'TF', labels:['T','F']},
      {key:'JP', labels:['J','P']}
    ];

    axisBar.innerHTML = axes.map(function(axis) {
      let s0=0, s1=0;
      PT_QUESTIONS.forEach(function(q) {
        if (q.axis !== axis.key) return;
        const val = parseInt(savedAnswers[q.id]) || 3;
        const first = axis.labels[0];
        if (q.pole === first) { s0 += val; s1 += (6-val); }
        else { s1 += val; s0 += (6-val); }
      });
      const total = s0 + s1;
      const pct0 = Math.round((s0/total)*100);
      const pct1 = 100 - pct0;
      const dominant = typeCode.includes(axis.labels[0]) ? 0 : 1;
      return `<div class="pt-axis-row">
        <span class="pt-axis-letter ${dominant===0?'pt-dominant':''}">${axis.labels[0]}</span>
        <div class="pt-axis-track">
          <div class="pt-axis-fill pt-axis-left" style="width:${pct0}%"></div>
          <div class="pt-axis-fill pt-axis-right" style="width:${pct1}%"></div>
        </div>
        <span class="pt-axis-letter ${dominant===1?'pt-dominant':''}">${axis.labels[1]}</span>
        <span class="pt-axis-pct">${dominant===0?pct0:pct1}%</span>
      </div>`;
    }).join('');
  }

  // ── Loading screen ────────────────────────────────────────────
  const loadingEl = document.getElementById('pt-loading');
  const resultEl = document.getElementById('pt-result-content');
  if (loadingEl && resultEl) {
    const loadTxt = document.getElementById('pt-loading-text');
    if (loadTxt) loadTxt.textContent = L.loading;
    setTimeout(function() {
      loadingEl.style.display = 'none';
      resultEl.style.display = 'block';
    }, 1500);
  }

  // Lang switcher
  window.switchLang = function(lang, event) {
    if (event) event.stopPropagation();
    localStorage.setItem('ai-life-summary-lang', lang);
    const paths = {
      en: '/en/personality-type/result/',
      ko: '/ko/personality-type/result/',
      ja: '/ja/personality-type/result/',
      zh: '/zh/personality-type/result/',
      es: '/es/personality-type/result/'
    };
    window.location.href = paths[lang] || '/en/personality-type/result/';
  };

  window.toggleLangDropdown = function() {
    const dd = document.getElementById('lang-dropdown');
    if (dd) dd.classList.toggle('hidden');
  };

  document.addEventListener('click', function(e) {
    const sel = document.getElementById('lang-selector');
    if (sel && !sel.contains(e.target)) {
      const dd = document.getElementById('lang-dropdown');
      if (dd) dd.classList.add('hidden');
    }
  });
})();
