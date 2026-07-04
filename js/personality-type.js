// personality-type.js
// Quiz page logic — renders questions, tracks answers, calculates 16-type result

(function() {
  const LANG = document.documentElement.lang || 'en';
  const L = PT_LABELS[LANG] || PT_LABELS['en'];
  const QS = PT_QUESTIONS;
  const QUESTIONS_PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(QS.length / QUESTIONS_PER_PAGE);

  let currentPage = 0;
  const answers = {}; // { questionId: 1..5 }

  // ── DOM refs ──────────────────────────────────────────────────
  const container   = document.getElementById('pt-container');
  const progressBar = document.getElementById('pt-progress-bar');
  const progressTxt = document.getElementById('pt-progress-text');
  const prevBtn     = document.getElementById('pt-prev');
  const nextBtn     = document.getElementById('pt-next');
  const submitBtn   = document.getElementById('pt-submit');
  const errorMsg    = document.getElementById('pt-error');
  const disclaimerEl = document.getElementById('pt-disclaimer');

  if (disclaimerEl) disclaimerEl.textContent = L.disclaimer;

  injectQuizStyles();

  // ── Self-contained quiz styles (shared JS → inject so all locales match) ──
  function injectQuizStyles() {
    if (document.getElementById('pt-quiz-styles')) return;
    var s = document.createElement('style');
    s.id = 'pt-quiz-styles';
    s.textContent = [
      '.pt-question-card{padding:22px 18px;margin-bottom:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:18px;transition:border-color .3s ease;}',
      '.pt-question-card.pt-current{border-color:rgba(217,200,240,0.40);}',
      '.pt-question-num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.42);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}',
      '.pt-question-text{font-size:16px;font-weight:600;color:#F4F1F8;line-height:1.5;margin-bottom:18px;}',
      '.pt-likert{display:flex;align-items:center;justify-content:center;gap:clamp(3px,1.5vw,11px);flex-wrap:nowrap;}',
      '.pt-likert .pt-end{font-size:11px;font-weight:700;width:28px;text-align:center;flex:0 0 auto;line-height:1.2;}',
      '.pt-likert .pt-end.agree{color:#B8E0D2;}',
      '.pt-likert .pt-end.disagree{color:#D9C8F0;}',
      '.pt-likert .pt-likert-btn{position:relative;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,255,255,0.55);background:rgba(255,255,255,0.09);cursor:pointer;flex:0 0 auto;min-width:0;padding:0;box-sizing:border-box;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,background .15s;}',
      '.pt-likert .pt-likert-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0;}',
      '.pt-likert .pt-likert-btn:hover{transform:scale(1.12);}',
      '.pt-likert .pt-likert-btn .pt-ck{opacity:0;color:#16130F;font-weight:900;font-size:13px;pointer-events:none;transition:opacity .15s;}',
      '.pt-likert .pt-likert-btn.active .pt-ck{opacity:1;}',
      '.pt-likert .pt-likert-btn.s0,.pt-likert .pt-likert-btn.s4{width:38px;height:38px;}',
      '.pt-likert .pt-likert-btn.s1,.pt-likert .pt-likert-btn.s3{width:30px;height:30px;}',
      '.pt-likert .pt-likert-btn.s2{width:24px;height:24px;}',
      '.pt-likert .pt-likert-btn.agree.active{background:#B8E0D2;border-color:#B8E0D2;}',
      '.pt-likert .pt-likert-btn.neutral.active{background:rgba(255,255,255,0.60);border-color:rgba(255,255,255,0.60);}',
      '.pt-likert .pt-likert-btn.disagree.active{background:#D9C8F0;border-color:#D9C8F0;}',
      '@media (prefers-reduced-motion: reduce){.pt-likert .pt-likert-btn,.pt-question-card{transition:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  // Momentum: after answering, scroll to next unanswered question on the page,
  // or to the Next/Submit button when the page is complete.
  function advanceAfterAnswer() {
    var cards = Array.prototype.slice.call(container.querySelectorAll('.pt-question-card'));
    cards.forEach(function(c){ c.classList.remove('pt-current'); });
    var next = cards.filter(function(c){ return !c.classList.contains('pt-answered'); })[0];
    if (next) {
      next.classList.add('pt-current');
      setTimeout(function(){ next.scrollIntoView({behavior:'smooth', block:'center'}); }, 150);
    } else {
      var btn = (currentPage < TOTAL_PAGES - 1) ? nextBtn : submitBtn;
      if (btn) setTimeout(function(){ btn.scrollIntoView({behavior:'smooth', block:'center'}); }, 150);
    }
  }

  // ── Render page of questions ──────────────────────────────────
  function renderPage(page) {
    const start = page * QUESTIONS_PER_PAGE;
    const pageQs = QS.slice(start, start + QUESTIONS_PER_PAGE);
    const globalOffset = start;

    container.innerHTML = '';
    pageQs.forEach(function(q, i) {
      const globalIdx = globalOffset + i + 1;
      const qText = q[LANG] || q['en'];
      const savedVal = answers[q.id] || 0;

      const card = document.createElement('div');
      card.className = 'pt-question-card' + (savedVal ? ' pt-answered' : '');
      card.innerHTML = `
        <p class="pt-question-num">${L.question} ${globalIdx} / ${QS.length}</p>
        <p class="pt-question-text">${qText}</p>
        <div class="pt-likert" role="radiogroup" aria-label="${qText}">
          <span class="pt-end agree">${L.likert[1]}</span>
          ${L.likert.map(function(label, li) {
            const val = 5 - li; // 5=strongly agree .. 1=strongly disagree
            const checked = savedVal === val ? 'checked' : '';
            const activeClass = savedVal === val ? ' active' : '';
            const pole = li < 2 ? 'agree' : (li === 2 ? 'neutral' : 'disagree');
            return `<label class="pt-likert-btn s${li} ${pole}${activeClass}" title="${label}" aria-label="${label}">
              <input type="radio" name="q${q.id}" value="${val}" ${checked}>
              <span class="pt-ck">&#10003;</span>
            </label>`;
          }).join('')}
          <span class="pt-end disagree">${L.likert[3]}</span>
        </div>`;
      container.appendChild(card);
    });

    // mark first unanswered question as current
    const firstUnanswered = container.querySelector('.pt-question-card:not(.pt-answered)');
    if (firstUnanswered) firstUnanswered.classList.add('pt-current');

    // Radio change events
    container.querySelectorAll('input[type=radio]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        const qId = parseInt(this.name.replace('q', ''));
        answers[qId] = parseInt(this.value);
        // Update active class
        const group = this.closest('.pt-likert');
        group.querySelectorAll('.pt-likert-btn').forEach(function(btn) {
          btn.classList.remove('active');
        });
        this.closest('.pt-likert-btn').classList.add('active');
        this.closest('.pt-question-card').classList.add('pt-answered');
        // Clear error
        if (errorMsg) errorMsg.style.display = 'none';
        updateProgress();
        advanceAfterAnswer();
      });
    });

    updateControls();
    updateProgress();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function updateProgress() {
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / QS.length) * 100);
    if (progressBar) progressBar.style.width = Math.max(pct, 3) + '%';
    if (progressTxt) progressTxt.textContent = `${answered} / ${QS.length}`;
  }

  function updateControls() {
    if (prevBtn) prevBtn.style.display = currentPage === 0 ? 'none' : 'inline-flex';
    const isLast = currentPage === TOTAL_PAGES - 1;
    if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = isLast ? 'inline-flex' : 'none';
  }

  function pageAnswered() {
    const start = currentPage * QUESTIONS_PER_PAGE;
    const pageQs = QS.slice(start, start + QUESTIONS_PER_PAGE);
    return pageQs.every(function(q) { return answers[q.id]; });
  }

  // ── Navigation ────────────────────────────────────────────────
  if (prevBtn) prevBtn.addEventListener('click', function() {
    if (currentPage > 0) { currentPage--; renderPage(currentPage); }
  });

  if (nextBtn) nextBtn.addEventListener('click', function() {
    if (!pageAnswered()) {
      if (errorMsg) { errorMsg.style.display = 'block'; }
      return;
    }
    if (currentPage < TOTAL_PAGES - 1) { currentPage++; renderPage(currentPage); }
  });

  if (submitBtn) submitBtn.addEventListener('click', function() {
    if (!pageAnswered()) {
      if (errorMsg) { errorMsg.style.display = 'block'; }
      return;
    }
    const type = calculateType();
    sessionStorage.setItem('pt-result', type);
    sessionStorage.setItem('pt-answers', JSON.stringify(answers));
    window.location.href = 'result/';
  });

  // ── Type Calculation ──────────────────────────────────────────
  function calculateType() {
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    QS.forEach(function(q) {
      const val = answers[q.id] || 3; // default neutral
      const axis = q.axis; // 'EI','SN','TF','JP'
      const pole = q.pole; // first letter = forward (high score → this pole)
      const oppPole = axis.replace(pole, '');

      // Forward question: high score (5) → stronger in pole
      // Reverse question: high score (5) → stronger in oppPole
      // We always stored pole = first letter of axis as the "agree = this pole" direction
      // But actually some questions have pole = second letter (I, N, F, P)
      // Those are "reverse": high score → second letter pole

      const firstLetter = axis[0];
      const secondLetter = axis[1];

      if (pole === firstLetter) {
        // Forward: val 5→5pts for first, 1→1pt for first
        scores[firstLetter]  += val;
        scores[secondLetter] += (6 - val);
      } else {
        // Reverse: val 5→5pts for second, 1→1pt for second
        scores[secondLetter] += val;
        scores[firstLetter]  += (6 - val);
      }
    });

    const type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    return type;
  }

  // ── Init ─────────────────────────────────────────────────────
  renderPage(0);

  // Lang switcher (matches existing site pattern)
  window.switchLang = function(lang, event) {
    if (event) event.stopPropagation();
    localStorage.setItem('ai-life-summary-lang', lang);
    const langMap = {en:'en',ko:'ko',ja:'ja',zh:'zh',es:'es'};
    const paths = {
      en: '/en/personality-type/',
      ko: '/ko/personality-type/',
      ja: '/ja/personality-type/',
      zh: '/zh/personality-type/',
      es: '/es/personality-type/'
    };
    window.location.href = paths[lang] || '/en/personality-type/';
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

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
})();
