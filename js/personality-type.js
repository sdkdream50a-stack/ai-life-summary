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
      card.className = 'pt-question-card';
      card.innerHTML = `
        <p class="pt-question-num">${L.question} ${globalIdx} / ${QS.length}</p>
        <p class="pt-question-text">${qText}</p>
        <div class="pt-likert" role="radiogroup" aria-label="${qText}">
          ${L.likert.map(function(label, li) {
            const val = 5 - li; // 5=strongly agree .. 1=strongly disagree
            const checked = savedVal === val ? 'checked' : '';
            const activeClass = savedVal === val ? ' active' : '';
            return `<label class="pt-likert-btn${activeClass}" title="${label}">
              <input type="radio" name="q${q.id}" value="${val}" ${checked} style="display:none">
              <span class="pt-likert-label">${label}</span>
            </label>`;
          }).join('')}
        </div>`;
      container.appendChild(card);
    });

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
        // Clear error
        if (errorMsg) errorMsg.style.display = 'none';
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
