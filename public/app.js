(() => {
  'use strict';

  const CONFIG = window.CONFIG;
  const PRIZES = window.PRIZES;
  const STORE_KEY = 'vela_boxes_v1';
  const BOX_COUNT = 6;
  const BOX_STYLES = ['wine', 'cream', 'nude', 'cream', 'nude', 'wine'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- тексты ----------------
  const T = {
    ru: {
      pageTitle: 'VELA — подарочные коробки',
      badge: 'Акция для всех клиентов',
      title: 'Выберите коробку и заберите подарок на лазерную эпиляцию',
      sub: 'В каждой коробке — подарок. Одна попытка на человека.',
      pick: 'Нажмите на любую коробку',
      opening: 'Открываем…',
      retryMsg: 'Почти! Выберите ещё одну коробку',
      wonHint: 'Подарок действует {days} дней',
      claim: 'Забрать подарок',
      myGift: 'Мой подарок',
      insideTitle: 'Что может быть внутри',
      boxLabel: 'Коробка {n}',
      resultTitle: 'Поздравляем! Ваш подарок:',
      alreadyTitle: 'Вы уже открыли коробку. Ваш подарок:',
      formLead: 'Оставьте номер — администратор закрепит подарок за вами и подберёт удобное время.',
      name: 'Ваше имя',
      phone: 'Телефон',
      submit: 'Забрать подарок',
      sending: 'Отправляем…',
      consent: 'Нажимая кнопку, вы соглашаетесь, чтобы студия связалась с вами по этому номеру, и принимаете',
      privacyLink: 'политику конфиденциальности',
      consentTail: '.',
      privacyTitle: 'Политика конфиденциальности',
      successTitle: 'Подарок ваш!',
      successText: 'Администратор скоро свяжется с вами. Назовите ему промокод:',
      validity: 'Действует {days} дней — до {date}',
      errName: 'Введите имя',
      errPhone: 'Введите номер в формате +998 XX XXX XX XX',
      errSend: 'Не удалось отправить. Проверьте интернет и попробуйте ещё раз — или напишите нам напрямую.',
      stepsTitle: 'Как это работает',
      step1: 'Выбираете одну из шести коробок',
      step2: 'Оставляете имя и номер телефона',
      step3: 'Администратор перезвонит и запишет вас на процедуру с подарком',
      termsTitle: 'Условия акции',
      terms: [
        'Одна попытка на один номер телефона.',
        'Подарок действует {days} дней с момента получения.',
        'Подарок не суммируется с другими акциями и не обменивается на деньги.',
        'Акция для клиентов старше 18 лет.',
      ],
      writeTg: 'Написать в Telegram',
      writeIg: 'Написать в Instagram',
      call: 'Позвонить',
      tgText: 'Здравствуйте! Мой подарок из коробки VELA: {prize}. Промокод {code}',
      contactsTitle: 'Как нас найти',
      addressLabel: 'Адрес',
      hoursLabel: 'Часы работы',
      phoneLabel: 'Телефон',
      routeGoogle: 'Маршрут в Google Maps',
      routeYandex: 'Яндекс Карты',
      demoBar: 'Демо для согласования — заявки никуда не отправляются',
      demoReset: 'Начать заново',
    },
    uz: {
      pageTitle: 'VELA — sovg‘a qutilari',
      badge: 'Barcha mijozlar uchun aksiya',
      title: 'Qutini tanlang va lazer epilyatsiyasiga sovg‘a oling',
      sub: 'Har bir qutida — sovg‘a. Har bir kishiga bitta urinish.',
      pick: 'Istalgan qutini bosing',
      opening: 'Ochilmoqda…',
      retryMsg: 'Oz qoldi! Yana bitta qutini tanlang',
      wonHint: 'Sovg‘a {days} kun amal qiladi',
      claim: 'Sovg‘ani olish',
      myGift: 'Mening sovg‘am',
      insideTitle: 'Ichida nima bo‘lishi mumkin',
      boxLabel: '{n}-quti',
      resultTitle: 'Tabriklaymiz! Sizning sovg‘angiz:',
      alreadyTitle: 'Siz qutini ochib bo‘lgansiz. Sovg‘angiz:',
      formLead: 'Raqamingizni qoldiring — administrator sovg‘ani siz uchun band qiladi va qulay vaqtni tanlab beradi.',
      name: 'Ismingiz',
      phone: 'Telefon raqam',
      submit: 'Sovg‘ani olish',
      sending: 'Yuborilmoqda…',
      consent: 'Tugmani bosib, studiya siz bilan ushbu raqam orqali bog‘lanishiga rozilik bildirasiz va',
      privacyLink: 'maxfiylik siyosati',
      consentTail: 'ni qabul qilasiz.',
      privacyTitle: 'Maxfiylik siyosati',
      successTitle: 'Sovg‘a sizniki!',
      successText: 'Administrator tez orada siz bilan bog‘lanadi. Unga promokodni ayting:',
      validity: '{days} kun amal qiladi — {date} gacha',
      errName: 'Ismingizni kiriting',
      errPhone: 'Raqamni +998 XX XXX XX XX formatida kiriting',
      errSend: 'Yuborib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring yoki bizga to‘g‘ridan-to‘g‘ri yozing.',
      stepsTitle: 'Bu qanday ishlaydi',
      step1: 'Oltita qutidan birini tanlaysiz',
      step2: 'Ismingiz va telefon raqamingizni qoldirasiz',
      step3: 'Administrator qo‘ng‘iroq qilib, sizni sovg‘a bilan muolajaga yozadi',
      termsTitle: 'Aksiya shartlari',
      terms: [
        'Bitta telefon raqamiga bitta urinish.',
        'Sovg‘a olingan kundan boshlab {days} kun amal qiladi.',
        'Sovg‘a boshqa aksiyalar bilan qo‘shilmaydi va pulga almashtirilmaydi.',
        'Aksiya 18 yoshdan katta mijozlar uchun.',
      ],
      writeTg: 'Telegramda yozish',
      writeIg: 'Instagramda yozish',
      call: 'Qo‘ng‘iroq qilish',
      tgText: 'Assalomu alaykum! VELA qutisidan sovg‘am: {prize}. Promokod {code}',
      contactsTitle: 'Bizni qanday topish mumkin',
      addressLabel: 'Manzil',
      hoursLabel: 'Ish vaqti',
      phoneLabel: 'Telefon',
      routeGoogle: 'Google Maps’da yo‘nalish',
      routeYandex: 'Yandex Xaritalar',
      demoBar: 'Kelishuv uchun demo — arizalar hech qayerga yuborilmaydi',
      demoReset: 'Qaytadan boshlash',
    },
  };

  const $ = (id) => document.getElementById(id);
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

  // ---------------- безопасное хранилище ----------------
  const store = {
    get(key, session) {
      try { return JSON.parse((session ? sessionStorage : localStorage).getItem(key)); } catch { return null; }
    },
    set(key, val, session) {
      try { (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(val)); } catch { /* приватный режим */ }
    },
  };

  // ---------------- состояние ----------------
  // state = { prizeId, code, ts, submitted, box, retryBox }
  let state = store.get(STORE_KEY) || null;
  let lang = pickLang();
  let busy = false;
  let retryBox = null;     // индекс коробки с «ещё раз» (в текущей попытке)
  let wiggleTimer = 0;
  const opened = {};       // индекс коробки → id приза, чтобы перерисовать при смене языка

  // UTM-метки из рекламы (запоминаем на сессию)
  const utm = (() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    const params = new URLSearchParams(location.search);
    const fromUrl = {};
    keys.forEach((k) => { if (params.get(k)) fromUrl[k] = params.get(k).slice(0, 200); });
    if (Object.keys(fromUrl).length) { store.set('vela_utm', fromUrl, true); return fromUrl; }
    return store.get('vela_utm', true) || {};
  })();

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'uz' || q === 'ru') return q;
    const saved = store.get('vela_lang');
    if (saved === 'uz' || saved === 'ru') return saved;
    return (navigator.language || '').toLowerCase().startsWith('uz') ? 'uz' : 'ru';
  }

  const prizeById = (id) => PRIZES.find((p) => p.id === id);
  const t = (key) => T[lang][key];

  // ---------------- Meta Pixel ----------------
  function initPixel() {
    if (!CONFIG.pixelId) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONFIG.pixelId);
    window.fbq('track', 'PageView');
  }
  const pixel = (...args) => { if (window.fbq) window.fbq(...args); };

  // ---------------- коробки ----------------
  const boxEls = [];
  const BOW_SVG =
    '<svg viewBox="0 0 60 36" aria-hidden="true">' +
      '<path fill="currentColor" d="M27 27 L19 36 L24 36 L30 29 Z M33 27 L41 36 L36 36 L30 29 Z"/>' +
      '<path fill="currentColor" fill-rule="evenodd" d="M30 27 C18 3 1 4 3 16 C5 27 20 29 30 27 Z M26 24 C18 13 9 11 9 16.5 C10 22 18 24.5 26 24 Z"/>' +
      '<path fill="currentColor" fill-rule="evenodd" d="M30 27 C42 3 59 4 57 16 C55 27 40 29 30 27 Z M34 24 C42 13 51 11 51 16.5 C50 22 42 24.5 34 24 Z"/>' +
      '<ellipse cx="30" cy="25.5" rx="5.5" ry="5" fill="currentColor"/>' +
    '</svg>';

  function buildBoxes() {
    const wrap = $('boxes');
    wrap.innerHTML = '';
    for (let i = 0; i < BOX_COUNT; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'box box--' + BOX_STYLES[i % BOX_STYLES.length];
      b.style.setProperty('--d', (i * 0.37).toFixed(2) + 's');
      b.innerHTML =
        '<span class="box-inner">' +
          '<span class="box-shadow"></span>' +
          '<span class="box-glow"></span>' +
          '<span class="box-card"><b></b><small></small></span>' +
          '<span class="box-body"></span>' +
          '<span class="box-lid"><span class="bow">' + BOW_SVG + '</span></span>' +
        '</span>';
      b.addEventListener('click', () => pick(i));
      wrap.append(b);
      boxEls.push(b);
    }
  }

  function setCard(i, prize) {
    opened[i] = prize.id;
    const card = boxEls[i].querySelector('.box-card');
    card.querySelector('b').textContent = prize[lang].big;
    card.querySelector('small').textContent = prize[lang].small;
  }

  function pickPrize(excludeRetry) {
    const pool = PRIZES.filter((p) => !(excludeRetry && p.retry));
    const total = pool.reduce((s, p) => s + Math.max(0, p.weight), 0);
    let r = Math.random() * total;
    for (const p of pool) {
      r -= Math.max(0, p.weight);
      if (r < 0) return p;
    }
    return pool[0];
  }

  function pick(i) {
    if (busy || state || i === retryBox) return;
    busy = true;
    stopWiggle();
    const box = boxEls[i];
    boxEls.forEach((b) => { b.disabled = true; });
    setStatus(t('opening'));

    const prize = pickPrize(retryBox !== null);
    setCard(i, prize);
    box.classList.add('shake');
    const shakeMs = reduceMotion ? 0 : 600;
    setTimeout(() => {
      box.classList.remove('shake');
      box.classList.add('open');
      if (navigator.vibrate) navigator.vibrate(30);
    }, shakeMs);
    setTimeout(() => (prize.retry ? afterRetry(i) : win(prize, i)), shakeMs + (reduceMotion ? 300 : 900));
  }

  function afterRetry(i) {
    retryBox = i;
    busy = false;
    boxEls[i].classList.add('spent');
    boxEls.forEach((b, j) => { b.disabled = j === i; });
    setStatus(t('retryMsg'), true);
    pixel('trackCustom', 'GiftBoxRetry');
    startWiggle();
  }

  function win(prize, i) {
    busy = false;
    state = { prizeId: prize.id, code: makeCode(), ts: Date.now(), submitted: false, box: i, retryBox };
    store.set(STORE_KEY, state);
    if (navigator.vibrate) navigator.vibrate([30, 60, 40]);
    pixel('trackCustom', 'GiftBoxOpen', { prize: prize.id });
    renderBoxesState();
    renderClaim();
    confetti(boxEls[i]);
    setTimeout(() => openSheet(true), reduceMotion ? 200 : 700);
  }

  // восстановление после перезагрузки
  function renderBoxesState() {
    const wrap = $('boxes');
    if (!state) return;
    wrap.classList.add('chosen');
    boxEls.forEach((b) => { b.disabled = true; });
    if (Number.isInteger(state.retryBox) && boxEls[state.retryBox]) {
      setCard(state.retryBox, PRIZES.find((p) => p.retry) || prizeById(state.prizeId));
      boxEls[state.retryBox].classList.add('open', 'spent');
    }
    const i = Number.isInteger(state.box) && boxEls[state.box] ? state.box : 0;
    setCard(i, prizeById(state.prizeId));
    boxEls[i].classList.add('open');
  }

  // покачиваем случайную коробку, чтобы приглашала нажать
  function startWiggle() {
    if (reduceMotion) return;
    stopWiggle();
    wiggleTimer = setInterval(() => {
      if (busy || state) return stopWiggle();
      const free = boxEls.filter((_, j) => j !== retryBox);
      const b = free[(Math.random() * free.length) | 0];
      b.classList.remove('wiggle');
      void b.offsetWidth;
      b.classList.add('wiggle');
      setTimeout(() => b.classList.remove('wiggle'), 750);
    }, 1800);
  }
  function stopWiggle() { clearInterval(wiggleTimer); }

  function setStatus(text, accent) {
    const s = $('status');
    s.textContent = text;
    s.classList.toggle('accent', !!accent);
  }

  function makeCode() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    const rnd = crypto.getRandomValues(new Uint32Array(5));
    for (let i = 0; i < 5; i++) s += abc[rnd[i] % abc.length];
    return 'VELA-' + s;
  }

  // ---------------- окно ----------------
  let freshWin = false;
  function openSheet(fresh = false) {
    if (!state) return;
    freshWin = fresh;
    renderSheet();
    $('sheet').hidden = false;
    document.body.style.overflow = 'hidden';
    if (!state.submitted && !('ontouchstart' in window)) setTimeout(() => $('nameInput').focus(), 350);
  }
  function closeSheet() {
    $('sheet').hidden = true;
    document.body.style.overflow = '';
    $('claimBtn').focus({ preventScroll: true });
  }

  function giftUntil() {
    const d = new Date(state.ts + CONFIG.giftDays * 864e5);
    return d.toLocaleDateString(lang === 'uz' ? 'uz-Latn-UZ' : 'ru-RU', { day: 'numeric', month: 'long' });
  }

  function renderSheet() {
    if (!state) return;
    const prize = prizeById(state.prizeId) || PRIZES[0];
    const full = prize[lang].full;
    $('claimView').hidden = state.submitted;
    $('doneView').hidden = !state.submitted;
    $('sheetTitle').textContent = freshWin ? t('resultTitle') : t('alreadyTitle');
    $('prizeText').textContent = full;
    $('donePrize').textContent = full;
    const note = prize[lang].note || '';
    ['prizeNote', 'donePrizeNote'].forEach((id) => { $(id).textContent = note; $(id).hidden = !note; });
    $('promoCode').textContent = state.code;
    $('validity').textContent = fill(t('validity'), { days: CONFIG.giftDays, date: giftUntil() });

    const links = $('contactLinks');
    links.innerHTML = '';
    if (CONFIG.telegram) {
      const msg = fill(t('tgText'), { prize: full, code: state.code });
      links.append(chip(`https://t.me/${CONFIG.telegram}?text=${encodeURIComponent(msg)}`, t('writeTg'), true));
    }
    if (CONFIG.instagram) links.append(chip(`https://ig.me/m/${CONFIG.instagram}`, t('writeIg'), !CONFIG.telegram));
    if (CONFIG.phone) links.append(chip(`tel:${CONFIG.phone.replace(/[^\d+]/g, '')}`, t('call')));
  }

  function chip(href, text, solid) {
    const a = document.createElement('a');
    a.className = 'chip' + (solid ? ' solid' : '');
    a.href = href;
    a.textContent = text;
    if (!href.startsWith('tel:')) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  // ---------------- телефон ----------------
  function phoneDigits(raw) {
    let d = raw.replace(/\D/g, '');
    if (d.startsWith('998')) d = d.slice(3);
    return d.slice(0, 9);
  }
  function formatPhone(raw) {
    const r = phoneDigits(raw);
    const parts = [r.slice(0, 2), r.slice(2, 5), r.slice(5, 7), r.slice(7, 9)].filter(Boolean);
    return '+998 ' + parts.join(' ');
  }

  // ---------------- отправка ----------------
  async function submitLead(e) {
    e.preventDefault();
    const nameEl = $('nameInput');
    const phoneEl = $('phoneInput');
    const errEl = $('formError');
    const name = nameEl.value.trim();
    const local = phoneDigits(phoneEl.value);
    nameEl.classList.toggle('invalid', !name);
    phoneEl.classList.toggle('invalid', local.length !== 9);
    if (!name) return showError(t('errName'), nameEl);
    if (local.length !== 9) return showError(t('errPhone'), phoneEl);
    errEl.hidden = true;
    document.querySelectorAll('.err-links').forEach((n) => n.remove());

    const btn = $('submitBtn');
    btn.disabled = true;
    btn.textContent = t('sending');
    const prize = prizeById(state.prizeId);
    const payload = {
      name,
      phone: '998' + local,
      prizeId: prize.id,
      prize: prize.ru.full,
      note: prize.ru.note || '',
      code: state.code,
      lang,
      utm,
      page: location.origin + location.pathname,
      website: $('website').value,
    };

    try {
      if (CONFIG.demo) {
        await new Promise((r) => setTimeout(r, 700)); // демо: ничего не отправляем
      } else {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(CONFIG.leadEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        pixel('track', 'Lead', { content_name: prize.id }, { eventID: state.code });
      }
      state.submitted = true;
      store.set(STORE_KEY, state);
      renderSheet();
      renderClaim();
    } catch (err) {
      console.error(err);
      showError(t('errSend'));
      renderSheet();
      $('claimView').hidden = false;
      $('doneView').hidden = true;
      // запасные контакты прямо под ошибкой
      const links = $('contactLinks').cloneNode(true);
      links.removeAttribute('id');
      links.className = 'contact-links err-links';
      links.style.marginBottom = '12px';
      errEl.after(links);
    } finally {
      btn.disabled = false;
      btn.textContent = t('submit');
    }
  }
  function showError(msg, focusEl) {
    const errEl = $('formError');
    errEl.textContent = msg;
    errEl.hidden = false;
    if (focusEl) focusEl.focus();
  }

  // ---------------- конфетти ----------------
  function confetti(fromEl) {
    if (reduceMotion) return;
    const cv = $('confetti');
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const ox = r.left + r.width / 2;
    const oy = r.top + r.height * 0.3;
    const colors = ['#4C0010', '#7A1C2B', '#DEB289', '#C9965F', '#F6EEE4', '#F3D9B8'];
    const parts = Array.from({ length: 150 }, () => ({
      x: ox + (Math.random() - 0.5) * 40,
      y: oy,
      vx: (Math.random() - 0.5) * 13,
      vy: -Math.random() * 13 - 4,
      w: 5 + Math.random() * 6, h: 8 + Math.random() * 8,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const start = performance.now();
    const frame = (now) => {
      const life = (now - start) / 3200;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalAlpha = Math.max(0, 1 - life * life);
      parts.forEach((p) => {
        p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
        ctx.restore();
      });
      if (life < 1) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(frame);
  }

  // ---------------- отрисовка текстов ----------------
  function renderClaim() {
    const btn = $('claimBtn');
    btn.hidden = !state;
    if (state) {
      btn.textContent = state.submitted ? t('myGift') : t('claim');
      btn.classList.toggle('pulse', !state.submitted);
      setStatus(fill(t('wonHint'), { days: CONFIG.giftDays }));
    } else {
      setStatus(retryBox !== null ? t('retryMsg') : t('pick'), retryBox !== null);
    }
  }

  function textVars() {
    const h = (CONFIG.hours && CONFIG.hours[lang]) || '';
    return { days: CONFIG.giftDays, hours: h.charAt(0).toLowerCase() + h.slice(1) };
  }

  function renderTexts() {
    document.documentElement.lang = lang === 'uz' ? 'uz' : 'ru';
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach((n) => {
      const v = T[lang][n.dataset.i18n];
      if (typeof v === 'string') n.textContent = fill(v, textVars());
    });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));

    boxEls.forEach((b, i) => b.setAttribute('aria-label', fill(t('boxLabel'), { n: i + 1 })));
    Object.keys(opened).forEach((i) => setCard(Number(i), prizeById(opened[i])));

    const inside = $('insideList');
    inside.innerHTML = '';
    PRIZES.filter((p) => !p.retry).forEach((p) => {
      const li = document.createElement('li');
      const name = document.createElement('b');
      name.textContent = p[lang].list || p[lang].full;
      li.append(name);
      if (p[lang].note) {
        const note = document.createElement('span');
        note.textContent = p[lang].note;
        li.append(note);
      }
      if (p.main) li.className = 'main';
      inside.append(li);
    });

    const ul = $('termsList');
    ul.innerHTML = '';
    t('terms').forEach((s) => {
      const li = document.createElement('li');
      li.textContent = fill(s, { days: CONFIG.giftDays });
      ul.append(li);
    });

    $('footCity').textContent = `${CONFIG.studioFull} · ${CONFIG.city[lang]}`;
    renderContacts();

    const bar = document.querySelector('.demo-bar');
    if (bar) {
      bar.querySelector('span').textContent = t('demoBar');
      bar.querySelector('button').textContent = t('demoReset');
    }

    renderClaim();
    if (!$('sheet').hidden) renderSheet();
  }

  function renderContacts() {
    const addr = (CONFIG.address && CONFIG.address[lang]) || '';
    const hours = (CONFIG.hours && CONFIG.hours[lang]) || '';
    $('cAddress').textContent = addr;
    $('cAddress').closest('li').hidden = !addr;
    $('cHours').textContent = hours;
    $('cHours').closest('li').hidden = !hours;
    const tel = $('cPhone');
    tel.textContent = CONFIG.phone || '';
    tel.href = CONFIG.phone ? 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '') : '#';
    tel.closest('li').hidden = !CONFIG.phone;

    const links = $('cLinks');
    links.innerHTML = '';
    if (CONFIG.map) {
      const { lat, lng } = CONFIG.map;
      links.append(chip(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, t('routeGoogle'), true));
      links.append(chip(`https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`, t('routeYandex')));
    }
    if (CONFIG.telegram) links.append(chip(`https://t.me/${CONFIG.telegram}`, 'Telegram'));
    if (CONFIG.instagram) links.append(chip(`https://instagram.com/${CONFIG.instagram}`, 'Instagram'));
  }

  function renderDemoBar() {
    if (!CONFIG.demo) return;
    const bar = document.createElement('div');
    bar.className = 'demo-bar';
    const txt = document.createElement('span');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      try { localStorage.removeItem(STORE_KEY); } catch { /* ок */ }
      location.reload();
    });
    bar.append(txt, btn);
    document.body.prepend(bar);
  }

  // ---------------- старт ----------------
  function init() {
    renderDemoBar();
    if (!CONFIG.demo) initPixel();
    buildBoxes();

    if (state && !prizeById(state.prizeId)) state = null;
    if (state) renderBoxesState();
    else startWiggle();
    renderTexts();

    $('claimBtn').addEventListener('click', () => openSheet(false));
    $('sheetClose').addEventListener('click', closeSheet);
    $('sheet').addEventListener('click', (e) => { if (e.target === $('sheet')) closeSheet(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });
    $('leadForm').addEventListener('submit', submitLead);

    const phoneEl = $('phoneInput');
    phoneEl.addEventListener('input', () => { phoneEl.value = formatPhone(phoneEl.value); phoneEl.classList.remove('invalid'); });
    phoneEl.addEventListener('focus', () => { if (!phoneDigits(phoneEl.value)) phoneEl.value = '+998 '; });
    $('nameInput').addEventListener('input', (e) => e.target.classList.remove('invalid'));

    document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
      lang = b.dataset.lang;
      store.set('vela_lang', lang);
      renderTexts();
    }));
  }

  init();
})();
