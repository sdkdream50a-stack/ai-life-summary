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

  // ── Shareable result card (canvas PNG) — 바이럴 루프 ─────────────
  function ptWrapText(ctx, text, maxW) {
    var words = String(text).split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
      else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
  }
  function ptDimSummary() {
    var saved = JSON.parse(sessionStorage.getItem('pt-answers') || '{}');
    var axes = [['E','I'],['S','N'],['T','F'],['J','P']];
    return axes.map(function(pair) {
      var akey = pair[0] + pair[1], s0 = 0, s1 = 0;
      PT_QUESTIONS.forEach(function(q) {
        if (q.axis !== akey) return;
        var val = parseInt(saved[q.id]) || 3;
        if (q.pole === pair[0]) { s0 += val; s1 += (6 - val); } else { s1 += val; s0 += (6 - val); }
      });
      var t = s0 + s1 || 1, p0 = Math.round(s0 / t * 100);
      var dom = typeCode.indexOf(pair[0]) >= 0 ? 0 : 1;
      return { letter: pair[dom], pct: dom === 0 ? p0 : 100 - p0 };
    });
  }
  function ptRenderCard(cb) {
    if (!typeData || !langData) { cb(null); return; }
    var W = 1080, H = 1920, Pd = 88, ink = '#16130F';
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var font = function(w, px) { return w + ' ' + px + 'px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif'; };
    var g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, '#EFE6FA'); g.addColorStop(0.55, '#D9C8F0'); g.addColorStop(1, '#BBA8DA');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // dot-grid texture
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (var gx = 0; gx < W; gx += 8) for (var gy = 0; gy < H; gy += 8) ctx.fillRect(gx, gy, 1, 1);
    ctx.fillStyle = ink;
    // header
    ctx.font = font(800, 44); ctx.fillText(L.yourType, Pd, Pd + 48);
    ctx.globalAlpha = 0.6; ctx.font = font(600, 30); ctx.textAlign = 'right';
    ctx.fillText('smartaitest.com', W - Pd, Pd + 44); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    // emoji + name + code
    ctx.font = '150px -apple-system,"Apple Color Emoji",sans-serif'; ctx.fillText(typeData.emoji, Pd, 780);
    ctx.font = font(800, 108);
    var nameLines = ptWrapText(ctx, langData.name, W - Pd * 2), y = 930;
    nameLines.forEach(function(ln) { ctx.fillText(ln, Pd, y); y += 118; });
    ctx.globalAlpha = 0.55; ctx.font = font(800, 52); ctx.fillText(typeCode, Pd, y + 6); ctx.globalAlpha = 1;
    y += 90;
    // tagline
    ctx.globalAlpha = 0.82; ctx.font = font(500, 44);
    ptWrapText(ctx, langData.tagline, W - Pd * 2).forEach(function(ln) { y += 64; ctx.fillText(ln, Pd, y); });
    ctx.globalAlpha = 1;
    // dimension chips
    y += 96; var chipX = Pd;
    ptDimSummary().forEach(function(d) {
      var label = d.letter + ' ' + d.pct + '%';
      ctx.font = font(700, 40); var w = ctx.measureText(label).width + 48;
      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(chipX, y - 44, w, 68, 34); ctx.fill(); }
      else ctx.fillRect(chipX, y - 44, w, 68);
      ctx.fillStyle = ink; ctx.fillText(label, chipX + 24, y);
      chipX += w + 16;
    });
    // footer watermark
    ctx.globalAlpha = 0.55; ctx.font = font(600, 28);
    ctx.fillText('PERSONALITY', Pd, H - 74);
    ctx.textAlign = 'right'; ctx.fillText('@smartaitest', W - Pd, H - 74); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    cv.toBlob(cb, 'image/png');
  }
  window.ptShareCard = function() {
    ptRenderCard(function(blob) {
      var file = null;
      if (blob && typeof File === 'function') {
        try { file = new File([blob], 'my-type-' + typeCode + '.png', { type: 'image/png' }); } catch (e) {}
      }
      var data = { title: L.title, text: shareText, url: shareUrl };
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
      if (navigator.share) { navigator.share(data).catch(function(){}); }
      else if (blob) { ptDownload(blob); }
      else { window.ptShare && window.ptShare('copy'); }
    });
  };
  window.ptSaveCard = function() {
    ptRenderCard(function(blob) { if (blob) ptDownload(blob); });
  };
  function ptDownload(blob) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'my-type-' + typeCode + '.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 4000);
  }
  // inject card share/save buttons next to existing share buttons (shared JS → all locales)
  (function() {
    var host = document.getElementById('pt-share-btn');
    if (!host || !host.parentElement) return;
    var labels = {
      en: ['🖼️ Share Result Card', '💾 Save Image'], ko: ['🖼️ 결과 카드 공유', '💾 이미지 저장'],
      ja: ['🖼️ 結果カードを共有', '💾 画像を保存'], zh: ['🖼️ 分享结果卡片', '💾 保存图片'],
      es: ['🖼️ Compartir tarjeta', '💾 Guardar imagen']
    };
    var lb = labels[LANG] || labels.en, wrap = host.parentElement;
    var b1 = document.createElement('button');
    b1.type = 'button'; b1.className = 'pt-btn pt-btn-primary'; b1.textContent = lb[0];
    b1.addEventListener('click', window.ptShareCard);
    var b2 = document.createElement('button');
    b2.type = 'button'; b2.className = 'pt-btn pt-btn-secondary'; b2.textContent = lb[1];
    b2.addEventListener('click', window.ptSaveCard);
    wrap.insertBefore(b1, host); wrap.insertBefore(b2, host.nextSibling);
  })();

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
