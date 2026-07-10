// love-type.js
// Korean love type quiz: 15 Likert questions, 3 dimensions, 8 result types.

(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LoveTypeTest = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';

  var QUESTIONS = [
    {id:1, dim:'ER', reverse:false, ko:'좋아하는 마음은 표현해야 상대도 안다고 생각한다.'},
    {id:2, dim:'ER', reverse:false, ko:'애정 표현(연락·스킨십·칭찬)을 자주 하는 편이다.'},
    {id:3, dim:'ER', reverse:true, ko:'마음이 있어도 겉으로 잘 드러내지 않는 편이다.'},
    {id:4, dim:'ER', reverse:false, ko:'"사랑한다·보고 싶다" 같은 말을 자주 하는 편이다.'},
    {id:5, dim:'ER', reverse:true, ko:'감정 표현은 낯간지러워서 아끼게 된다.'},
    {id:6, dim:'PS', reverse:false, ko:'데이트는 미리 계획을 세워야 마음이 편하다.'},
    {id:7, dim:'PS', reverse:true, ko:'약속은 그날 기분에 따라 정하는 게 좋다.'},
    {id:8, dim:'PS', reverse:false, ko:'기념일·이벤트를 미리 챙기고 준비하는 편이다.'},
    {id:9, dim:'PS', reverse:true, ko:'여행이나 데이트도 즉흥적으로 떠나는 게 즐겁다.'},
    {id:10, dim:'PS', reverse:false, ko:'관계의 다음 단계를 구체적으로 그려보는 편이다.'},
    {id:11, dim:'CF', reverse:false, ko:'연인과는 되도록 자주, 오래 함께 있고 싶다.'},
    {id:12, dim:'CF', reverse:true, ko:'연애 중에도 나만의 시간·취미가 꼭 필요하다.'},
    {id:13, dim:'CF', reverse:false, ko:'하루 있었던 일을 시시콜콜 공유하는 게 좋다.'},
    {id:14, dim:'CF', reverse:true, ko:'서로 조금 떨어져 있는 시간이 관계에 도움이 된다고 본다.'},
    {id:15, dim:'CF', reverse:false, ko:'중요한 결정은 연인과 함께 상의해 내리고 싶다.'}
  ];

  var TYPES = {
    EPC: {emoji:'🌹', name:'다정한 로맨티스트', tagline:'사랑은 표현하고, 챙기고, 함께.', desc:'애정을 아낌없이 표현하고 기념일과 데이트를 세심히 챙기며 늘 함께이고 싶어하는 유형. 상대는 사랑받는다는 걸 확실히 느낀다.', strengths:['표현이 풍부함','세심하고 다정함','헌신적'], compatible:['RPC','RSC']},
    EPF: {emoji:'🤝', name:'든든한 파트너', tagline:'확실한 애정, 존중하는 거리.', desc:'애정 표현은 분명하고 관계를 계획적으로 이끌되, 서로의 독립된 삶도 존중하는 균형형. 안정감과 자유를 동시에 준다.', strengths:['표현이 분명함','계획적이고 믿음직','상대 존중'], compatible:['RSF','ESF']},
    ESC: {emoji:'🔥', name:'열정적인 연인', tagline:'지금 이 순간, 뜨겁게.', desc:'감정을 솔직하게 드러내고 즉흥 이벤트를 즐기며 매 순간 붙어 있고 싶은 뜨거운 유형. 연애에 활력이 넘친다.', strengths:['열정적','표현이 솔직함','함께를 즐김'], compatible:['RPC','RPF']},
    ESF: {emoji:'🎈', name:'자유로운 로맨티스트', tagline:'사랑도, 자유도 놓치지 않아.', desc:'사랑을 자유롭게 표현하고 즉흥을 즐기지만 서로를 구속하지 않는 쿨한 유형. 함께 있어도 숨 막히지 않는다.', strengths:['표현이 자유로움','즉흥을 즐김','구속하지 않음'], compatible:['RPC','EPF']},
    RPC: {emoji:'🛡️', name:'묵묵한 헌신가', tagline:'말보다 행동으로 지킨다.', desc:'티 내기보다 행동으로 사랑을 보여주고 미래를 함께 그리며 조용히 곁을 지키는 유형. 믿음직한 안정감이 강점.', strengths:['한결같음','책임감','미래를 함께 계획'], compatible:['ESC','EPC']},
    RPF: {emoji:'♟️', name:'신중한 전략가', tagline:'감정보다 방향을 먼저.', desc:'감정을 드러내기보다 관계를 신중히 설계하고 각자의 성장을 중시하는 어른스러운 유형. 관계를 길게 본다.', strengths:['신중함','계획적','서로의 성장 존중'], compatible:['ESC','ESF']},
    RSC: {emoji:'🌙', name:'은근한 낭만가', tagline:'티는 안 나도 마음은 깊다.', desc:'표현은 아껴도 마음은 깊고, 계획보다 분위기를 따라 함께하는 시간을 소중히 여기는 유형. 잔잔한 다정함이 매력.', strengths:['속 깊음','함께를 소중히','분위기를 탐'], compatible:['EPC','ESC']},
    RSF: {emoji:'🍃', name:'쿨한 자유인', tagline:'담백하게, 각자의 속도로.', desc:'감정 표현도 관계 운영도 담백하고 서로의 자유를 최우선으로 존중하는 유형. 편안하고 부담 없는 연애를 추구.', strengths:['담백함','독립적','상대를 존중'], compatible:['EPF','EPC']}
  };

  var AXES = [
    {key:'ER', label:'표현', first:'E', second:'R', firstName:'표현형', secondName:'절제형'},
    {key:'PS', label:'계획', first:'P', second:'S', firstName:'계획형', secondName:'즉흥형'},
    {key:'CF', label:'거리감', first:'C', second:'F', firstName:'밀착형', secondName:'독립형'}
  ];
  var MIN_SCORE = 5;
  var MAX_SCORE = 25;

  function calculateResult(answers) {
    var scoreByAxis = {ER:0, PS:0, CF:0};

    QUESTIONS.forEach(function(q) {
      var raw = Number(answers[q.id]);
      var val = raw >= 1 && raw <= 5 ? raw : 3;
      scoreByAxis[q.dim] += q.reverse ? (6 - val) : val;
    });

    var code = AXES.map(function(axis) {
      return scoreByAxis[axis.key] >= 15 ? axis.first : axis.second;
    }).join('');

    var dimensions = AXES.map(function(axis) {
      var firstScore = scoreByAxis[axis.key];
      var firstPct = Math.round(((firstScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100);
      firstPct = Math.max(0, Math.min(100, firstPct));
      var dominantFirst = firstScore >= 15;
      return {
        key: axis.key,
        label: axis.label,
        first: axis.first,
        second: axis.second,
        firstName: axis.firstName,
        secondName: axis.secondName,
        firstScore: firstScore,
        secondScore: 30 - firstScore,
        firstPct: firstPct,
        secondPct: 100 - firstPct,
        dominant: dominantFirst ? axis.first : axis.second,
        dominantName: dominantFirst ? axis.firstName : axis.secondName,
        dominantPct: dominantFirst ? firstPct : 100 - firstPct
      };
    });

    return {code: code, type: TYPES[code], dimensions: dimensions, scores: scoreByAxis};
  }

  function init() {
    if (typeof document === 'undefined') return;

    var QS_PER_PAGE = 5;
    var totalPages = Math.ceil(QUESTIONS.length / QS_PER_PAGE);
    var page = 0;
    var answers = {};

    var quizSection = document.getElementById('lt-quiz-section');
    var resultSection = document.getElementById('lt-result-section');
    var container = document.getElementById('pt-container');
    var progressBar = document.getElementById('pt-progress-bar');
    var progressText = document.getElementById('pt-progress-text');
    var progressWrap = progressBar ? progressBar.closest('.kick-glass') : null;
    var prevBtn = document.getElementById('pt-prev');
    var nextBtn = document.getElementById('pt-next');
    var submitBtn = document.getElementById('pt-submit');
    var errorMsg = document.getElementById('pt-error');

    if (!container) return;
    injectQuizStyles();

    function renderPage() {
      var start = page * QS_PER_PAGE;
      var pageQs = QUESTIONS.slice(start, start + QS_PER_PAGE);
      container.innerHTML = '';

      pageQs.forEach(function(q, idx) {
        var globalIdx = start + idx + 1;
        var saved = answers[q.id] || 0;
        var card = document.createElement('div');
        card.className = 'pt-question-card' + (saved ? ' pt-answered' : '');
        card.innerHTML = [
          '<p class="pt-question-num">QUESTION ' + globalIdx + ' / ' + QUESTIONS.length + '</p>',
          '<p class="pt-question-text">' + escapeHtml(q.ko) + '</p>',
          '<div class="pt-likert" role="radiogroup" aria-label="' + escapeHtml(q.ko) + '">',
          '<span class="pt-end agree">동의</span>',
          likertButtons(q.id, saved),
          '<span class="pt-end disagree">비동의</span>',
          '</div>'
        ].join('');
        container.appendChild(card);
      });

      var firstUnanswered = container.querySelector('.pt-question-card:not(.pt-answered)');
      if (firstUnanswered) firstUnanswered.classList.add('pt-current');

      container.querySelectorAll('input[type=radio]').forEach(function(radio) {
        radio.addEventListener('change', function() {
          var qId = parseInt(this.name.replace('q', ''), 10);
          answers[qId] = parseInt(this.value, 10);
          var group = this.closest('.pt-likert');
          group.querySelectorAll('.pt-likert-btn').forEach(function(btn) { btn.classList.remove('active'); });
          this.closest('.pt-likert-btn').classList.add('active');
          this.closest('.pt-question-card').classList.add('pt-answered');
          if (errorMsg) errorMsg.style.display = 'none';
          updateProgress();
          advanceAfterAnswer();
        });
      });

      updateProgress();
      updateControls();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function likertButtons(questionId, saved) {
      var labels = ['매우 동의', '동의', '보통', '비동의', '매우 비동의'];
      return labels.map(function(label, i) {
        var val = 5 - i;
        var pole = i < 2 ? 'agree' : (i === 2 ? 'neutral' : 'disagree');
        return '<label class="pt-likert-btn s' + i + ' ' + pole + (saved === val ? ' active' : '') + '" title="' + label + '" aria-label="' + label + '">' +
          '<input type="radio" name="q' + questionId + '" value="' + val + '"' + (saved === val ? ' checked' : '') + '>' +
          '<span class="pt-ck">&#10003;</span>' +
          '</label>';
      }).join('');
    }

    function updateProgress() {
      var answered = Object.keys(answers).length;
      var pct = Math.round((answered / QUESTIONS.length) * 100);
      if (progressBar) progressBar.style.width = Math.max(pct, 3) + '%';
      if (progressText) progressText.textContent = answered + ' / ' + QUESTIONS.length;
    }

    function updateControls() {
      if (prevBtn) prevBtn.style.display = page === 0 ? 'none' : 'inline-flex';
      if (nextBtn) nextBtn.style.display = page === totalPages - 1 ? 'none' : 'inline-flex';
      if (submitBtn) submitBtn.style.display = page === totalPages - 1 ? 'inline-flex' : 'none';
    }

    function setQuizVisible(visible) {
      var display = visible ? '' : 'none';
      if (quizSection) quizSection.style.display = visible ? 'block' : 'none';
      if (container) container.style.display = display;
      if (progressWrap) progressWrap.style.display = display;
      if (errorMsg) errorMsg.style.display = 'none';
    }

    function pageAnswered() {
      var start = page * QS_PER_PAGE;
      return QUESTIONS.slice(start, start + QS_PER_PAGE).every(function(q) { return answers[q.id]; });
    }

    function advanceAfterAnswer() {
      var cards = Array.prototype.slice.call(container.querySelectorAll('.pt-question-card'));
      cards.forEach(function(card) { card.classList.remove('pt-current'); });
      var next = cards.filter(function(card) { return !card.classList.contains('pt-answered'); })[0];
      if (next) {
        next.classList.add('pt-current');
        setTimeout(function() { next.scrollIntoView({behavior:'smooth', block:'center'}); }, 120);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function() {
      if (page > 0) {
        page -= 1;
        renderPage();
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', function() {
      if (!pageAnswered()) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
      }
      if (page < totalPages - 1) {
        page += 1;
        renderPage();
      }
    });

    if (submitBtn) submitBtn.addEventListener('click', function() {
      if (!pageAnswered()) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
      }
      var result = calculateResult(answers);
      renderResult(result);
    });

    function renderResult(result) {
      var type = result.type;
      setText('lt-type-emoji', type.emoji);
      setText('lt-type-code', result.code);
      setText('lt-type-name', type.name);
      setText('lt-type-tagline', type.tagline);
      setText('lt-type-desc', type.desc);

      var strengths = document.getElementById('lt-strengths-list');
      if (strengths) {
        strengths.innerHTML = type.strengths.map(function(item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('');
      }

      var compat = document.getElementById('lt-compatible-list');
      if (compat) {
        compat.innerHTML = type.compatible.map(function(code) {
          var t = TYPES[code];
          return '<a href="#lt-type-' + code + '" class="lt-compatible-badge">' + t.emoji + ' <strong>' + code + '</strong> ' + escapeHtml(t.name) + '</a>';
        }).join('');
      }

      var bars = document.getElementById('lt-dimension-bars');
      if (bars) {
        bars.innerHTML = result.dimensions.map(function(d) {
          return '<div class="lt-axis-row">' +
            '<div class="lt-axis-title">' + escapeHtml(d.label) + ' — ' + escapeHtml(d.dominantName) + ' ' + d.dominantPct + '%</div>' +
            '<div class="lt-axis-labels"><span class="' + (d.dominant === d.first ? 'active' : '') + '">' + d.first + ' ' + d.firstName + '</span><span class="' + (d.dominant === d.second ? 'active' : '') + '">' + d.second + ' ' + d.secondName + '</span></div>' +
            '<div class="lt-axis-track"><div class="lt-axis-fill" style="width:' + d.firstPct + '%"></div></div>' +
            '<div class="lt-axis-meta"><span>' + d.firstPct + '%</span><span>' + d.secondPct + '%</span></div>' +
            '</div>';
        }).join('');
      }

      sessionStorage.setItem('love-type-result', result.code);
      sessionStorage.setItem('love-type-answers', JSON.stringify(answers));
      setQuizVisible(false);
      if (resultSection) resultSection.style.display = 'block';
      window.scrollTo({top: resultSection ? resultSection.offsetTop - 90 : 0, behavior:'smooth'});
    }

    var retake = document.getElementById('lt-retake');
    if (retake) {
      retake.addEventListener('click', function() {
        answers = {};
        page = 0;
        if (resultSection) resultSection.style.display = 'none';
        setQuizVisible(true);
        renderPage();
      });
    }

    var share = document.getElementById('lt-share');
    if (share) {
      share.addEventListener('click', function() {
        var code = sessionStorage.getItem('love-type-result') || 'EPC';
        var type = TYPES[code];
        var text = '내 연애 유형은 ' + code + ' ' + type.name + ' - ' + type.tagline;
        var url = 'https://smartaitest.com/ko/love-type/';
        if (navigator.share) {
          navigator.share({title:'연애 유형 테스트', text:text, url:url}).catch(function(){});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text + '\n' + url).then(function() {
            var old = share.textContent;
            share.textContent = '복사 완료';
            setTimeout(function() { share.textContent = old; }, 1600);
          });
        }
      });
    }

    var saveCard = document.getElementById('lt-save-card');
    if (saveCard) {
      saveCard.addEventListener('click', function() {
        var code = sessionStorage.getItem('love-type-result') || 'EPC';
        renderShareCard(code, function(blob) {
          if (!blob) return;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'love-type-' + code + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(a.href); }, 3000);
        });
      });
    }

    renderPage();
  }

  function renderShareCard(code, cb) {
    if (typeof document === 'undefined') return cb(null);
    var type = TYPES[code];
    if (!type) return cb(null);
    var canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    var ctx = canvas.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 1080, 1080);
    g.addColorStop(0, '#2b1021');
    g.addColorStop(0.5, '#71324f');
    g.addColorStop(1, '#f0b7c8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (var x = 0; x < 1080; x += 18) {
      for (var y = 0; y < 1080; y += 18) ctx.fillRect(x, y, 2, 2);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = '700 42px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText('나의 연애 유형', 540, 120);
    ctx.font = '160px -apple-system,"Apple Color Emoji",sans-serif';
    ctx.fillText(type.emoji, 540, 340);
    ctx.font = '900 96px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(code, 540, 470);
    ctx.font = '800 64px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText(type.name, 540, 570);
    ctx.font = '500 38px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    wrapCanvasText(ctx, type.tagline, 540, 650, 780, 56);
    ctx.globalAlpha = 0.72;
    ctx.font = '600 30px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
    ctx.fillText('smartaitest.com/ko/love-type/', 540, 980);
    ctx.globalAlpha = 1;
    canvas.toBlob(cb, 'image/png');
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = String(text).split('');
    var line = '';
    var lines = [];
    chars.forEach(function(ch) {
      var test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.forEach(function(ln, idx) { ctx.fillText(ln, x, y + idx * lineHeight); });
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function injectQuizStyles() {
    if (document.getElementById('lt-quiz-styles')) return;
    var s = document.createElement('style');
    s.id = 'lt-quiz-styles';
    s.textContent = [
      '.pt-question-card{padding:22px 18px;margin-bottom:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:18px;transition:border-color .3s ease;}',
      '.pt-question-card.pt-current{border-color:rgba(244,114,182,0.48);}',
      '.pt-question-num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.42);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}',
      '.pt-question-text{font-size:16px;font-weight:600;color:#F4F1F8;line-height:1.5;margin-bottom:18px;}',
      '.pt-likert{display:flex;align-items:center;justify-content:center;gap:clamp(3px,1.5vw,11px);flex-wrap:nowrap;}',
      '.pt-likert .pt-end{font-size:11px;font-weight:700;width:38px;text-align:center;flex:0 0 auto;line-height:1.2;}',
      '.pt-likert .pt-end.agree{color:#F9A8D4;}',
      '.pt-likert .pt-end.disagree{color:#D9C8F0;}',
      '.pt-likert .pt-likert-btn{position:relative;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,255,255,0.55);background:rgba(255,255,255,0.09);cursor:pointer;flex:0 0 auto;min-width:0;padding:0;box-sizing:border-box;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,background .15s;}',
      '.pt-likert .pt-likert-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0;}',
      '.pt-likert .pt-likert-btn:hover{transform:scale(1.12);}',
      '.pt-likert .pt-likert-btn .pt-ck{opacity:0;color:#16130F;font-weight:900;font-size:13px;pointer-events:none;transition:opacity .15s;}',
      '.pt-likert .pt-likert-btn.active .pt-ck{opacity:1;}',
      '.pt-likert .pt-likert-btn.s0,.pt-likert .pt-likert-btn.s4{width:38px;height:38px;}',
      '.pt-likert .pt-likert-btn.s1,.pt-likert .pt-likert-btn.s3{width:30px;height:30px;}',
      '.pt-likert .pt-likert-btn.s2{width:24px;height:24px;}',
      '.pt-likert .pt-likert-btn.agree.active{background:#F9A8D4;border-color:#F9A8D4;}',
      '.pt-likert .pt-likert-btn.neutral.active{background:rgba(255,255,255,0.60);border-color:rgba(255,255,255,0.60);}',
      '.pt-likert .pt-likert-btn.disagree.active{background:#D9C8F0;border-color:#D9C8F0;}',
      '@media (prefers-reduced-motion: reduce){.pt-likert .pt-likert-btn,.pt-question-card{transition:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(ch) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch];
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  return {
    questions: QUESTIONS,
    types: TYPES,
    axes: AXES,
    calculateResult: calculateResult
  };
});
