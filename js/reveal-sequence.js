/**
 * Reveal Sequence - Step-by-step Result Reveal
 * SmartAITest.com Stage 2
 *
 * Stages:
 * A - Suspense Loading (2-3 seconds)
 * B - Type Reveal (tap/click card flip)
 * C - Character Appearance (fadeIn with effects)
 * D - Detailed Analysis (scroll triggered)
 * E - Share Encouragement
 */

// Multi-language loading messages
const LOADING_MESSAGES = {
  ko: [
    { progress: 0, text: "당신의 답변을 분석하고 있어요..." },
    { progress: 30, text: "흥미로운 패턴이 보여요! ✨" },
    { progress: 60, text: "당신의 소울 타입을 찾았어요... 🔍" },
    { progress: 90, text: "거의 다 됐어요! 🎯" }
  ],
  en: [
    { progress: 0, text: "Analyzing your answers..." },
    { progress: 30, text: "Interesting patterns detected! ✨" },
    { progress: 60, text: "Found your soul type... 🔍" },
    { progress: 90, text: "Almost there! 🎯" }
  ],
  ja: [
    { progress: 0, text: "あなたの回答を分析しています..." },
    { progress: 30, text: "興味深いパターンを発見! ✨" },
    { progress: 60, text: "あなたのソウルタイプを見つけました... 🔍" },
    { progress: 90, text: "もうすぐです! 🎯" }
  ],
  zh: [
    { progress: 0, text: "正在分析您的答案..." },
    { progress: 30, text: "发现了有趣的模式! ✨" },
    { progress: 60, text: "找到了您的灵魂类型... 🔍" },
    { progress: 90, text: "快完成了! 🎯" }
  ],
  es: [
    { progress: 0, text: "Analizando tus respuestas..." },
    { progress: 30, text: "¡Patrones interesantes detectados! ✨" },
    { progress: 60, text: "Encontré tu tipo de alma... 🔍" },
    { progress: 90, text: "¡Casi listo! 🎯" }
  ]
};

// Reveal card texts
const REVEAL_TEXTS = {
  ko: { tap: "탭해서 확인하기", click: "클릭해서 확인하기" },
  en: { tap: "TAP TO REVEAL", click: "CLICK TO REVEAL" },
  ja: { tap: "タップして確認", click: "クリックして確認" },
  zh: { tap: "点击查看", click: "点击查看" },
  es: { tap: "TOCA PARA REVELAR", click: "HAZ CLIC PARA REVELAR" }
};

// Scroll prompts
const SCROLL_PROMPTS = {
  ko: "스크롤하여 더 보기 ↓",
  en: "Scroll to see more ↓",
  ja: "スクロールして詳細を見る ↓",
  zh: "向下滚动查看更多 ↓",
  es: "Desplázate para ver más ↓"
};

// Share encouragement texts
const SHARE_TEXTS = {
  ko: "친구도 테스트해보게 하세요!",
  en: "Let your friends try the test too!",
  ja: "友達にもテストを勧めましょう!",
  zh: "让朋友也来测试吧!",
  es: "¡Deja que tus amigos también lo prueben!"
};

// Feedback messages for question selection
const SELECTION_FEEDBACK = {
  ko: [
    "좋은 선택이에요! 💪",
    "흥미로운 답변이네요! ✨",
    "당신다운 선택이에요! 🎯",
    "좋아요! 👍",
    "멋진 선택! 🌟"
  ],
  en: [
    "Great choice! 💪",
    "Interesting answer! ✨",
    "That's so you! 🎯",
    "Nice! 👍",
    "Excellent pick! 🌟"
  ],
  ja: [
    "いい選択ですね! 💪",
    "興味深い回答です! ✨",
    "あなたらしい選択です! 🎯",
    "いいですね! 👍",
    "素晴らしい選択! 🌟"
  ],
  zh: [
    "好选择! 💪",
    "有趣的回答! ✨",
    "这很像你! 🎯",
    "不错! 👍",
    "绝佳选择! 🌟"
  ],
  es: [
    "¡Gran elección! 💪",
    "¡Respuesta interesante! ✨",
    "¡Muy tú! 🎯",
    "¡Genial! 👍",
    "¡Excelente! 🌟"
  ]
};

// Interstitial messages between question sections
const INTERSTITIAL_MESSAGES = {
  ko: [
    {
      emoji: "✨",
      title: "잠깐! 지금까지 잘하고 있어요!",
      subtitle: "당신의 소울 타입이 조금씩 보이기 시작하고 있어요... 🦊❓",
      button: "계속하기 →"
    },
    {
      emoji: "🔮",
      title: "흥미로운 패턴이 나타나고 있어요!",
      subtitle: "조금만 더 답해주시면 정확한 타입을 알 수 있어요...",
      button: "계속하기 →"
    },
    {
      emoji: "🌟",
      title: "거의 다 왔어요!",
      subtitle: "마지막 몇 가지 질문만 남았어요!",
      button: "마무리하기 →"
    }
  ],
  en: [
    {
      emoji: "✨",
      title: "Wait! You're doing great!",
      subtitle: "Your soul type is starting to emerge... 🦊❓",
      button: "Continue →"
    },
    {
      emoji: "🔮",
      title: "Interesting patterns emerging!",
      subtitle: "Just a few more answers to find your exact type...",
      button: "Continue →"
    },
    {
      emoji: "🌟",
      title: "Almost there!",
      subtitle: "Just a few more questions left!",
      button: "Finish up →"
    }
  ],
  ja: [
    {
      emoji: "✨",
      title: "ちょっと待って！順調ですよ！",
      subtitle: "あなたのソウルタイプが見え始めています... 🦊❓",
      button: "続ける →"
    },
    {
      emoji: "🔮",
      title: "興味深いパターンが現れています！",
      subtitle: "もう少しで正確なタイプがわかります...",
      button: "続ける →"
    },
    {
      emoji: "🌟",
      title: "もうすぐです！",
      subtitle: "残りの質問はわずかです！",
      button: "完了する →"
    }
  ],
  zh: [
    {
      emoji: "✨",
      title: "等一下！你做得很好！",
      subtitle: "你的灵魂类型开始显现了... 🦊❓",
      button: "继续 →"
    },
    {
      emoji: "🔮",
      title: "有趣的模式正在出现！",
      subtitle: "再回答几个问题就能找到你的确切类型...",
      button: "继续 →"
    },
    {
      emoji: "🌟",
      title: "快完成了！",
      subtitle: "只剩最后几个问题了！",
      button: "完成 →"
    }
  ],
  es: [
    {
      emoji: "✨",
      title: "¡Espera! ¡Lo estás haciendo genial!",
      subtitle: "Tu tipo de alma está empezando a surgir... 🦊❓",
      button: "Continuar →"
    },
    {
      emoji: "🔮",
      title: "¡Patrones interesantes emergiendo!",
      subtitle: "Unas respuestas más para encontrar tu tipo exacto...",
      button: "Continuar →"
    },
    {
      emoji: "🌟",
      title: "¡Casi listo!",
      subtitle: "¡Solo quedan unas pocas preguntas!",
      button: "Terminar →"
    }
  ]
};

/**
 * RevealSequence class - manages the step-by-step reveal
 */
class RevealSequence {
  constructor(options = {}) {
    this.lang = options.lang || 'ko';
    this.soulType = options.soulType || null;
    this.container = options.container || document.body;
    this.onComplete = options.onComplete || (() => {});
    this.currentStage = 'init';
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Start the reveal sequence
   */
  async start() {
    await this.stageA_Loading();
    await this.stageB_TypeReveal();
    await this.stageC_CharacterAppearance();
    this.stageD_DetailedAnalysis();
    this.stageE_ShareEncouragement();
    this.onComplete();
  }

  /**
   * Stage A: Suspense Loading (2-3 seconds)
   */
  async stageA_Loading() {
    this.currentStage = 'loading';
    const loadingContainer = document.getElementById('loading-stage');
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    if (!loadingContainer || !progressBar || !loadingText) return;

    loadingContainer.classList.remove('hidden');
    const messages = LOADING_MESSAGES[this.lang] || LOADING_MESSAGES.en;

    return new Promise((resolve) => {
      let progress = 0;
      const duration = 2500; // 2.5 seconds
      const interval = 30;
      const increment = 100 / (duration / interval);

      const timer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          setTimeout(() => {
            loadingContainer.classList.add('hidden');
            resolve();
          }, 300);
        }

        progressBar.style.width = `${progress}%`;

        // Update text based on progress
        const currentMessage = messages.filter(m => m.progress <= progress).pop();
        if (currentMessage && loadingText.textContent !== currentMessage.text) {
          loadingText.classList.add('fade-out');
          setTimeout(() => {
            loadingText.textContent = currentMessage.text;
            loadingText.classList.remove('fade-out');
            loadingText.classList.add('fade-in');
          }, 150);
        }
      }, interval);
    });
  }

  /**
   * Stage B: Type Reveal (tap/click card flip)
   */
  async stageB_TypeReveal() {
    this.currentStage = 'reveal';
    const revealContainer = document.getElementById('reveal-stage');
    const revealCard = document.getElementById('reveal-card');
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');

    if (!revealContainer || !revealCard) return;

    revealContainer.classList.remove('hidden');

    // Set tap/click text
    const revealText = document.getElementById('reveal-text');
    if (revealText) {
      const texts = REVEAL_TEXTS[this.lang] || REVEAL_TEXTS.en;
      revealText.textContent = this.isMobile ? texts.tap : texts.click;
    }

    return new Promise((resolve) => {
      const flipCard = () => {
        revealCard.classList.add('flipped');

        // Show soul type on back of card
        if (cardBack && this.soulType) {
          cardBack.innerHTML = `
            <div class="soul-type-reveal">
              <div class="emoji-large">${this.soulType.emoji}</div>
              <div class="type-name">${getSoulTypeName(this.soulType, this.lang)}</div>
            </div>
          `;
        }

        // Play confetti effect
        this.playConfetti();

        setTimeout(resolve, 800);
      };

      revealCard.addEventListener('click', flipCard, { once: true });
      revealCard.addEventListener('touchstart', (e) => {
        e.preventDefault();
        flipCard();
      }, { once: true });
    });
  }

  /**
   * Stage C: Character Appearance
   */
  async stageC_CharacterAppearance() {
    this.currentStage = 'character';
    const characterContainer = document.getElementById('character-stage');
    const sloganText = document.getElementById('slogan-text');

    if (!characterContainer) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        characterContainer.classList.remove('hidden');
        characterContainer.classList.add('fade-in-up');

        // Typing effect for slogan
        if (sloganText && this.soulType) {
          const slogan = getSoulTypeSlogan(this.soulType, this.lang);
          this.typeText(sloganText, slogan, 50);
        }

        // Sparkle effect
        this.playSparkles(characterContainer);

        setTimeout(resolve, 1500);
      }, 500);
    });
  }

  /**
   * Stage D: Detailed Analysis (scroll triggered)
   */
  stageD_DetailedAnalysis() {
    this.currentStage = 'analysis';
    const analysisContainer = document.getElementById('analysis-stage');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const traitBars = document.querySelectorAll('.trait-bar');
    const rarityBadge = document.getElementById('rarity-badge');

    if (!analysisContainer) return;

    // Show scroll prompt
    if (scrollPrompt) {
      scrollPrompt.textContent = SCROLL_PROMPTS[this.lang] || SCROLL_PROMPTS.en;
      scrollPrompt.classList.remove('hidden');
      scrollPrompt.classList.add('bounce-animation');
    }

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate trait bars sequentially
          traitBars.forEach((bar, index) => {
            setTimeout(() => {
              const targetWidth = bar.dataset.value || '0';
              bar.style.width = targetWidth + '%';
              bar.classList.add('animate-fill');
            }, index * 200);
          });

          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    analysisContainer.classList.remove('hidden');
    observer.observe(analysisContainer);
  }

  /**
   * Stage E: Share Encouragement
   */
  stageE_ShareEncouragement() {
    this.currentStage = 'share';
    const shareContainer = document.getElementById('share-stage');
    const shareButtons = document.querySelectorAll('.share-button');
    const shareText = document.getElementById('share-encouragement');

    if (!shareContainer) return;

    // Show share text
    if (shareText) {
      shareText.textContent = SHARE_TEXTS[this.lang] || SHARE_TEXTS.en;
    }

    shareContainer.classList.remove('hidden');

    // Sequential button fade-in
    shareButtons.forEach((button, index) => {
      setTimeout(() => {
        button.classList.remove('hidden');
        button.classList.add('fade-in-up');
      }, index * 100);
    });
  }

  /**
   * Type text animation
   */
  typeText(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    };

    type();
  }

  /**
   * Play confetti effect
   */
  playConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
      confettiContainer.appendChild(confetti);
    }

    // Clean up after animation
    setTimeout(() => {
      confettiContainer.innerHTML = '';
    }, 3000);
  }

  /**
   * Play sparkle effect
   */
  playSparkles(container) {
    const sparkleContainer = container.querySelector('.sparkle-container') || container;
    const sparkleCount = 20;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 1 + 's';
      sparkleContainer.appendChild(sparkle);
    }

    // Clean up after animation
    setTimeout(() => {
      sparkleContainer.querySelectorAll('.sparkle').forEach(s => s.remove());
    }, 3000);
  }
}

/**
 * Question flow manager with card-based UI
 */
class QuestionFlow {
  constructor(options = {}) {
    this.lang = options.lang || 'ko';
    this.questions = options.questions || [];
    this.sectionsPerGroup = options.sectionsPerGroup || 3;
    this.currentIndex = 0;
    this.answers = [];
    this.container = options.container || document.body;
    this.onComplete = options.onComplete || (() => {});
    this.onAnswer = options.onAnswer || (() => {});
  }

  /**
   * Get random feedback message
   */
  getRandomFeedback() {
    const feedbacks = SELECTION_FEEDBACK[this.lang] || SELECTION_FEEDBACK.en;
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }

  /**
   * Get interstitial message for section break
   */
  getInterstitialMessage(sectionIndex) {
    const messages = INTERSTITIAL_MESSAGES[this.lang] || INTERSTITIAL_MESSAGES.en;
    return messages[Math.min(sectionIndex, messages.length - 1)];
  }

  /**
   * Show feedback after selection
   */
  showFeedback(element) {
    const feedback = document.createElement('div');
    feedback.className = 'selection-feedback';
    feedback.textContent = this.getRandomFeedback();
    element.appendChild(feedback);

    setTimeout(() => {
      feedback.classList.add('fade-out');
      setTimeout(() => feedback.remove(), 300);
    }, 500);
  }

  /**
   * Show interstitial screen
   */
  async showInterstitial(sectionIndex) {
    const message = this.getInterstitialMessage(sectionIndex);
    const interstitial = document.createElement('div');
    interstitial.className = 'interstitial-screen';
    interstitial.innerHTML = `
      <div class="interstitial-content">
        <div class="interstitial-emoji">${message.emoji}</div>
        <h2 class="interstitial-title">${message.title}</h2>
        <p class="interstitial-subtitle">${message.subtitle}</p>
        <button class="interstitial-button">${message.button}</button>
      </div>
    `;

    this.container.appendChild(interstitial);

    return new Promise((resolve) => {
      setTimeout(() => {
        interstitial.classList.add('visible');
      }, 50);

      const button = interstitial.querySelector('.interstitial-button');
      button.addEventListener('click', () => {
        interstitial.classList.remove('visible');
        setTimeout(() => {
          interstitial.remove();
          resolve();
        }, 300);
      });
    });
  }

  /**
   * Render current question
   */
  renderQuestion(index) {
    const question = this.questions[index];
    if (!question) return null;

    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-progress">
        <span>${index + 1} / ${this.questions.length}</span>
        <div class="progress-bar-mini">
          <div class="progress-fill" style="width: ${((index + 1) / this.questions.length) * 100}%"></div>
        </div>
      </div>
      <h3 class="question-text">${question.text}</h3>
      <div class="question-options">
        ${question.options.map((option, i) => `
          <button class="option-button" data-index="${i}" data-value="${option.value}">
            ${option.emoji ? `<span class="option-emoji">${option.emoji}</span>` : ''}
            <span class="option-text">${option.text}</span>
          </button>
        `).join('')}
      </div>
    `;

    return card;
  }

  /**
   * Handle option selection
   */
  handleSelection(optionElement, value, questionIndex) {
    // Add selected state
    const options = optionElement.parentElement.querySelectorAll('.option-button');
    options.forEach(opt => opt.classList.remove('selected'));
    optionElement.classList.add('selected');

    // Show feedback
    this.showFeedback(optionElement);

    // Store answer
    this.answers[questionIndex] = value;
    this.onAnswer(questionIndex, value);

    // Auto-advance after delay
    setTimeout(() => {
      this.nextQuestion();
    }, 600);
  }

  /**
   * Move to next question
   */
  async nextQuestion() {
    this.currentIndex++;

    // Check if we need an interstitial
    if (this.currentIndex > 0 &&
        this.currentIndex < this.questions.length &&
        this.currentIndex % this.sectionsPerGroup === 0) {
      const sectionIndex = Math.floor(this.currentIndex / this.sectionsPerGroup) - 1;
      await this.showInterstitial(sectionIndex);
    }

    // Check if complete
    if (this.currentIndex >= this.questions.length) {
      this.onComplete(this.answers);
      return;
    }

    // Render next question with transition
    this.transitionToQuestion(this.currentIndex);
  }

  /**
   * Transition to a specific question
   */
  transitionToQuestion(index) {
    const container = this.container.querySelector('.question-container');
    if (!container) return;

    const currentCard = container.querySelector('.question-card');
    if (currentCard) {
      currentCard.classList.add('slide-out-left');
    }

    setTimeout(() => {
      container.innerHTML = '';
      const newCard = this.renderQuestion(index);
      if (newCard) {
        newCard.classList.add('slide-in-right');
        container.appendChild(newCard);

        // Add click handlers
        newCard.querySelectorAll('.option-button').forEach(button => {
          button.addEventListener('click', () => {
            this.handleSelection(button, button.dataset.value, index);
          });
        });

        // Remove animation class after animation completes
        setTimeout(() => {
          newCard.classList.remove('slide-in-right');
        }, 300);
      }
    }, 300);
  }

  /**
   * Start the question flow
   */
  start() {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    this.container.appendChild(questionContainer);

    const firstCard = this.renderQuestion(0);
    if (firstCard) {
      firstCard.classList.add('fade-in');
      questionContainer.appendChild(firstCard);

      // Add click handlers
      firstCard.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
          this.handleSelection(button, button.dataset.value, 0);
        });
      });
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RevealSequence,
    QuestionFlow,
    LOADING_MESSAGES,
    REVEAL_TEXTS,
    SCROLL_PROMPTS,
    SHARE_TEXTS,
    SELECTION_FEEDBACK,
    INTERSTITIAL_MESSAGES
  };
}
