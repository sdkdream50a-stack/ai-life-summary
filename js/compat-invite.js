/* Answers stay in memory. Only this visitor's animal may enter localStorage. */
(function () {
  'use strict';
  const data = JSON.parse(document.getElementById('invite-data').textContent);
  const { lang, ui, names, SHARE_SRC, ANIMALS, ANIMAL_COUPLES, DEFAULT_COUPLE, COMPAT_QUESTIONS } = data;
  const KEY = 'compat-invite-animal';
  const valid = id => ANIMALS.some(animal => animal.id === id);
  const params = new URLSearchParams(location.search);
  const from = valid(params.get('from')) ? params.get('from') : null;
  if (from) document.getElementById('invite-subtitle').textContent = ui[19];
  const src = SHARE_SRC.includes(params.get('src')) ? params.get('src') : '';
  // Remove labels and untrusted query/hash before consent/analytics can see the URL.
  history.replaceState(null, '', location.pathname);
  const quiz = document.getElementById('quiz');
  const result = document.getElementById('result');
  const status = document.getElementById('status');
  let own = null;
  let answers = [];
  let step = 0;
  const events = [];
  let tries = 0;
  function flush() {
    if (window.AnalyticsEvents && typeof window.AnalyticsEvents.track === 'function') {
      while (events.length) window.AnalyticsEvents.track(events.shift(), { lang, src });
    } else if (tries++ < 100) setTimeout(flush, 50);
  }
  function track(event) { events.push(event); flush(); }
  function personalAnimal(values) {
    if (values.length !== 8 || !values.every(v => Number.isInteger(v) && v >= 1 && v <= 5)) {
      throw new Error('Eight answers from 1 to 5 are required');
    }
    // Pair 1 -> bit 0, pair 2 -> bit 1, pair 3 -> bit 2, pair 4 -> bit 3.
    // Index 0..15: lion, cat, bear, rabbit, fox, dog, wolf, dolphin,
    // owl, eagle, panda, tiger, deer, penguin, butterfly, koala.
    const order = ['lion', 'cat', 'bear', 'rabbit', 'fox', 'dog', 'wolf', 'dolphin',
      'owl', 'eagle', 'panda', 'tiger', 'deer', 'penguin', 'butterfly', 'koala'];
    let index = 0;
    for (let pair = 0; pair < 4; pair++) {
      if (values[pair * 2] + values[pair * 2 + 1] >= 6) index |= 1 << pair;
    }
    return order[index];
  }
  function getAnimalCouple(a, b) {
    const ids = [a, b].sort();
    return ANIMAL_COUPLES[ids.join('-')] || ANIMAL_COUPLES[ids.reverse().join('-')] || DEFAULT_COUPLE;
  }
  function node(tag, text) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function animalCard(id, label) {
    const animal = ANIMALS.find(a => a.id === id);
    const card = node('div');
    card.className = 'animal';
    card.append(node('strong', label));
    const emoji = node('span', animal.emoji);
    emoji.className = 'emoji';
    emoji.setAttribute('aria-hidden', 'true');
    card.append(emoji, node('span', names[ANIMALS.indexOf(animal)]));
    return card;
  }
  function inviteURL(animal, channel) {
    if (!valid(animal) || !SHARE_SRC.includes(channel)) throw new Error('Invalid invite link');
    const url = new URL('/' + lang + '/compatibility/invite/', location.origin);
    url.searchParams.set('from', animal);
    url.searchParams.set('src', channel);
    return url.href;
  }
  async function send() {
    if (navigator.share) {
      try { await navigator.share({ url: inviteURL(own, 'webshare') }); track('invite_sent'); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    const url = inviteURL(own, 'copy');
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = ui[15];
      track('invite_sent');
    } catch (_) {
      status.textContent = ui[17];
      document.getElementById('copy-box').hidden = false;
      const input = document.getElementById('copy-link');
      input.value = url;
      input.focus();
      input.select();
      // A displayed URL is not evidence that it was sent.
    }
  }
  function showResult() {
    quiz.hidden = true;
    document.getElementById('sender').replaceChildren();
    result.replaceChildren();
    result.hidden = false;
    const cards = node('div');
    cards.className = 'pair';
    cards.append(animalCard(own, ui[2]));
    if (from) cards.append(animalCard(from, ui[3]));
    result.append(cards);
    if (from) {
      const couple = getAnimalCouple(own, from);
      result.append(node('h2', couple.title[lang] || couple.title.en),
        node('p', couple.desc[lang] || couple.desc.en));
    }
    const actions = node('div');
    actions.className = 'actions';
    const share = node('button', ui[from ? 5 : 4]);
    share.type = 'button';
    share.addEventListener('click', send);
    const full = node('a', ui[7]);
    full.href = '/' + lang + '/compatibility/';
    const retake = node('a', ui[6]);
    retake.href = '#quiz';
    retake.addEventListener('click', event => {
      event.preventDefault();
      try { localStorage.removeItem(KEY); } catch (_) { /* Storage may be disabled. */ }
      own = null;
      answers = [];
      step = 0;
      result.hidden = true;
      status.textContent = '';
      document.getElementById('copy-box').hidden = true;
      if (from) document.getElementById('sender').replaceChildren(animalCard(from, ui[3]));
      showQuestion();
    });
    actions.append(share, full, retake);
    result.append(actions);
  }
  function showQuestion() {
    quiz.hidden = false;
    quiz.replaceChildren();
    const field = node('fieldset');
    const legend = node('legend', (step + 1) + ' / 8 · ' + COMPAT_QUESTIONS[step][lang]);
    legend.tabIndex = -1;
    field.append(legend);
    for (let value = 1; value <= 5; value++) {
      const label = node('label');
      const input = node('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = String(value);
      input.required = true;
      label.append(input, node('span', ui[value + 8]));
      field.append(label);
    }
    const next = node('button', ui[step === 7 ? 14 : 18]);
    next.type = 'submit';
    quiz.append(field, next);
    legend.focus();
  }
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const selected = quiz.querySelector('input:checked');
    if (!selected) return;
    answers.push(Number(selected.value));
    if (++step < 8) { showQuestion(); return; }
    own = personalAnimal(answers);
    answers = [];
    try { localStorage.setItem(KEY, own); } catch (_) { /* The flow also works without storage. */ }
    showResult();
    if (from) track('invite_complete');
  });
  track('invite_view');
  try { const saved = localStorage.getItem(KEY); if (valid(saved)) own = saved; } catch (_) {}
  if (from) document.getElementById('sender').append(animalCard(from, ui[3]));
  if (own) { showResult(); if (from) track('invite_complete'); }
  else showQuestion();
}());
