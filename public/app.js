(() => {
  'use strict';

  const CONFIG = window.CONFIG;
  const PRIZES = window.PRIZES;
  const STORE_KEY = 'vela_wheel_v1';
  const SEG = 360 / PRIZES.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- тексты ----------------
  const T = {
    ru: {
      pageTitle: 'VELA — колесо подарков',
      badge: 'Акция для новых клиентов',
      title: 'Крутите колесо и заберите подарок на лазерную эпиляцию',
      sub: 'Каждый сектор — выигрышный. Одна попытка на человека.',
      spin: 'Крутить колесо',
      spinning: 'Крутится…',
      claim: 'Забрать подарок',
      myGift: 'Мой подарок',
      hint: 'Подарок действует {days} дней',
      resultTitle: 'Поздравляем! Ваш подарок:',
      alreadyTitle: 'Вы уже крутили колесо. Ваш подарок:',
      formLead: 'Оставьте номер — администратор закрепит подарок за вами и подберёт удобное время.',
      name: 'Ваше имя',
      phone: 'Телефон',
      submit: 'Забрать подарок',
      sending: 'Отправляем…',
      consent: 'Нажимая кнопку, вы соглашаетесь, чтобы студия связалась с вами по этому номеру.',
      successTitle: 'Подарок ваш!',
      successText: 'Мы позвоним в ближайшее время (в рабочие часы). Назовите администратору промокод:',
      validity: 'Действует {days} дней — до {date}',
      errName: 'Введите имя',
      errPhone: 'Введите номер в формате +998 XX XXX XX XX',
      errSend: 'Не удалось отправить. Проверьте интернет и попробуйте ещё раз — или напишите нам напрямую.',
      stepsTitle: 'Как это работает',
      step1: 'Крутите колесо — приз есть в каждом секторе',
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
      tgText: 'Здравствуйте! Я выиграл(а) в колесе VELA: {prize}. Промокод {code}',
    },
    uz: {
      pageTitle: 'VELA — sovg‘alar g‘ildiragi',
      badge: 'Yangi mijozlar uchun aksiya',
      title: 'G‘ildirakni aylantiring — lazer epilyatsiyasiga sovg‘a oling',
      sub: 'Har bir sektor — yutuqli. Har bir kishiga bitta urinish.',
      spin: 'Aylantirish',
      spinning: 'Aylanmoqda…',
      claim: 'Sovg‘ani olish',
      myGift: 'Mening sovg‘am',
      hint: 'Sovg‘a {days} kun amal qiladi',
      resultTitle: 'Tabriklaymiz! Sizning sovg‘angiz:',
      alreadyTitle: 'Siz g‘ildirakni aylantirib bo‘lgansiz. Sovg‘angiz:',
      formLead: 'Raqamingizni qoldiring — administrator sovg‘ani siz uchun band qiladi va qulay vaqtni tanlab beradi.',
      name: 'Ismingiz',
      phone: 'Telefon raqam',
      submit: 'Sovg‘ani olish',
      sending: 'Yuborilmoqda…',
      consent: 'Tugmani bosib, studiya siz bilan ushbu raqam orqali bog‘lanishiga rozilik bildirasiz.',
      successTitle: 'Sovg‘a sizniki!',
      successText: 'Tez orada (ish vaqtida) qo‘ng‘iroq qilamiz. Administratorga promokodni ayting:',
      validity: '{days} kun amal qiladi — {date} gacha',
      errName: 'Ismingizni kiriting',
      errPhone: 'Raqamni +998 XX XXX XX XX formatida kiriting',
      errSend: 'Yuborib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring yoki bizga to‘g‘ridan-to‘g‘ri yozing.',
      stepsTitle: 'Bu qanday ishlaydi',
      step1: 'G‘ildirakni aylantirasiz — har bir sektorda sovg‘a bor',
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
      tgText: 'Assalomu alaykum! VELA g‘ildiragida yutdim: {prize}. Promokod {code}',
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
  let state = store.get(STORE_KEY) || null; // { prizeId, code, ts, submitted }
  let lang = pickLang();
  let rotation = 0;
  let spinning = false;
  let idleRaf = 0;

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

  // ---------------- рисуем колесо ----------------
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const pt = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [r * Math.sin(a), -r * Math.cos(a)];
  };

  function drawWheel() {
    const svg = $('wheel');
    svg.innerHTML = '';
    const R = 184;

    const defs = el('defs', {}, svg);
    const gold = el('linearGradient', { id: 'gold', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
    el('stop', { offset: '0', 'stop-color': '#F3D9B8' }, gold);
    el('stop', { offset: '1', 'stop-color': '#CF9F6A' }, gold);
    const shade = el('radialGradient', { id: 'shade', cx: '0', cy: '0', r: '1', gradientUnits: 'userSpaceOnUse', gradientTransform: `scale(${R})` }, defs);
    el('stop', { offset: '0.55', 'stop-color': '#000', 'stop-opacity': '0' }, shade);
    el('stop', { offset: '1', 'stop-color': '#2B0A10', 'stop-opacity': '0.18' }, shade);

    // обод
    el('circle', { r: 199, fill: '#4C0010' }, svg);
    el('circle', { r: 191, fill: 'none', stroke: '#DEB289', 'stroke-width': 1.5, opacity: 0.9 }, svg);

    PRIZES.forEach((p, i) => {
      const a0 = i * SEG;
      const a1 = (i + 1) * SEG;
      const [x0, y0] = pt(R, a0);
      const [x1, y1] = pt(R, a1);
      const dark = i % 2 === 0;
      const fillColor = p.main ? 'url(#gold)' : dark ? '#5C111C' : '#FBF3EA';
      el('path', { d: `M0 0 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`, fill: fillColor }, svg);
    });
    el('circle', { r: R, fill: 'url(#shade)' }, svg);

    // разделители
    PRIZES.forEach((_, i) => {
      const [x, y] = pt(R, i * SEG);
      el('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: '#DEB289', 'stroke-width': 1.2, opacity: 0.7 }, svg);
    });

    // подписи
    PRIZES.forEach((p, i) => {
      const c = i * SEG + SEG / 2;
      const dark = i % 2 === 0 && !p.main;
      const color = dark ? '#F6EEE4' : '#4C0010';
      const g = el('g', { transform: `rotate(${c - 90})` }, svg);
      const L = p[lang];
      const cx = 118;
      const bigFs = 27;
      const smallFs = 12.5;
      const big = el('text', {
        x: cx, y: -3, 'text-anchor': 'middle', fill: color,
        'font-size': bigFs.toFixed(1), 'font-weight': 700,
      }, g);
      big.textContent = L.big;
      const small = el('text', {
        x: cx, y: 14, 'text-anchor': 'middle', fill: color,
        'font-size': smallFs.toFixed(1), 'font-weight': 500, opacity: 0.9,
        'letter-spacing': '0.02em',
      }, g);
      small.textContent = L.small;
      fitText(big, 104, bigFs);
      fitText(small, 100, smallFs);
    });

    // лампочки на ободе
    for (let i = 0; i < 24; i++) {
      const [x, y] = pt(195, i * 15 + 7.5);
      el('circle', { cx: x, cy: y, r: 3.4, fill: '#FFF1D6', class: 'bulb' + (i % 2 ? ' alt' : '') }, svg);
    }
    el('circle', { r: 50, fill: '#DEB289', opacity: 0.35 }, svg);
  }

  // уменьшаем шрифт, если подпись не влезает в сектор
  function fitText(node, maxLen, fs) {
    let len = 0;
    try { len = node.getComputedTextLength(); } catch { return; }
    if (len > maxLen) node.setAttribute('font-size', (fs * maxLen / len).toFixed(1));
  }

  const setRotation = (deg) => {
    rotation = deg;
    $('wheel').style.transform = `rotate(${deg}deg)`;
  };
  const segAt = (deg) => Math.floor((((-deg) % 360) + 360) % 360 / SEG);
  const restAngleFor = (i) => 360 - (i * SEG + SEG / 2);

  // лёгкое покачивание до вращения — приглашает нажать
  function startIdle() {
    if (reduceMotion) return;
    let last = performance.now();
    const loop = (now) => {
      setRotation(rotation + (now - last) * 0.006);
      last = now;
      idleRaf = requestAnimationFrame(loop);
    };
    idleRaf = requestAnimationFrame(loop);
  }

  function pickPrizeIndex() {
    const total = PRIZES.reduce((s, p) => s + Math.max(0, p.weight), 0);
    let r = Math.random() * total;
    for (let i = 0; i < PRIZES.length; i++) {
      r -= Math.max(0, PRIZES[i].weight);
      if (r < 0) return i;
    }
    return 0;
  }

  function tickPointer() {
    const p = document.querySelector('.pointer');
    p.classList.remove('tick');
    void p.offsetWidth;
    p.classList.add('tick');
  }

  function spin() {
    if (spinning) return;
    if (state) { openSheet(); return; }
    spinning = true;
    cancelAnimationFrame(idleRaf);
    renderButton();

    const index = pickPrizeIndex();
    const prize = PRIZES[index];
    const jitter = (Math.random() - 0.5) * SEG * 0.6;
    const from = rotation;
    const base = from - (((from % 360) + 360) % 360);
    const target = base + 360 * (reduceMotion ? 1 : 7) + restAngleFor(index) + jitter;
    const duration = reduceMotion ? 1200 : 5600;
    const start = performance.now();
    let lastSeg = segAt(from);
    let lastTick = 0;

    const frame = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - k, 4);
      setRotation(from + (target - from) * e);
      const s = segAt(rotation);
      if (s !== lastSeg && now - lastTick > 45) { tickPointer(); lastTick = now; }
      lastSeg = s;
      if (k < 1) requestAnimationFrame(frame);
      else finish(prize);
    };
    requestAnimationFrame(frame);
  }

  function finish(prize) {
    spinning = false;
    state = { prizeId: prize.id, code: makeCode(), ts: Date.now(), submitted: false };
    store.set(STORE_KEY, state);
    if (navigator.vibrate) navigator.vibrate(40);
    pixel('trackCustom', 'WheelSpin', { prize: prize.id });
    renderButton();
    confetti();
    setTimeout(() => openSheet(true), 650);
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
    freshWin = fresh;
    renderSheet();
    $('sheet').hidden = false;
    document.body.style.overflow = 'hidden';
    if (!state.submitted && !('ontouchstart' in window)) setTimeout(() => $('nameInput').focus(), 350);
  }
  function closeSheet() {
    $('sheet').hidden = true;
    document.body.style.overflow = '';
    $('spinBtn').focus({ preventScroll: true });
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

    const btn = $('submitBtn');
    btn.disabled = true;
    btn.textContent = t('sending');
    const prize = prizeById(state.prizeId);
    const payload = {
      name,
      phone: '998' + local,
      prizeId: prize.id,
      prize: prize.ru.full,
      code: state.code,
      lang,
      utm,
      page: location.origin + location.pathname,
      website: $('website').value,
    };

    try {
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
      state.submitted = true;
      store.set(STORE_KEY, state);
      pixel('track', 'Lead', { content_name: prize.id }, { eventID: state.code });
      renderSheet();
      renderButton();
    } catch (err) {
      console.error(err);
      showError(t('errSend'));
      renderSheet();
      $('claimView').hidden = false;
      $('doneView').hidden = true;
      // показываем запасные контакты прямо под ошибкой
      document.querySelectorAll('.err-links').forEach((n) => n.remove());
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
  function confetti() {
    if (reduceMotion) return;
    const cv = $('confetti');
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ['#4C0010', '#7A1C2B', '#DEB289', '#C9965F', '#F6EEE4', '#F3D9B8'];
    const parts = Array.from({ length: 150 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80,
      y: innerHeight * 0.42,
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
  function renderButton() {
    const btn = $('spinBtn');
    btn.textContent = spinning ? t('spinning') : !state ? t('spin') : state.submitted ? t('myGift') : t('claim');
    btn.disabled = spinning;
    $('hub').disabled = spinning || !!state;
    btn.classList.toggle('pulse', !spinning && !(state && state.submitted));
  }

  function renderTexts() {
    document.documentElement.lang = lang === 'uz' ? 'uz' : 'ru';
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach((n) => {
      const v = T[lang][n.dataset.i18n];
      if (typeof v === 'string') n.textContent = fill(v, { days: CONFIG.giftDays });
    });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));

    const ul = $('termsList');
    ul.innerHTML = '';
    t('terms').forEach((s) => {
      const li = document.createElement('li');
      li.textContent = fill(s, { days: CONFIG.giftDays });
      ul.append(li);
    });

    $('footCity').textContent = `${CONFIG.studioFull} · ${CONFIG.city[lang]}`;
    const addr = CONFIG.address && CONFIG.address[lang];
    $('footAddress').hidden = !addr;
    $('footAddress').textContent = addr || '';
    const fl = $('footLinks');
    fl.innerHTML = '';
    if (CONFIG.instagram) fl.append(chip(`https://instagram.com/${CONFIG.instagram}`, '@' + CONFIG.instagram));
    if (CONFIG.telegram) fl.append(chip(`https://t.me/${CONFIG.telegram}`, 'Telegram'));
    if (CONFIG.phone) fl.append(chip(`tel:${CONFIG.phone.replace(/[^\d+]/g, '')}`, CONFIG.phone));

    renderButton();
    drawWheel();
    if (!$('sheet').hidden) renderSheet();
  }

  // ---------------- старт ----------------
  function init() {
    initPixel();
    renderTexts();
    // после загрузки шрифтов перемеряем подписи на колесе
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWheel);

    if (state && prizeById(state.prizeId)) {
      setRotation(restAngleFor(PRIZES.findIndex((p) => p.id === state.prizeId)));
    } else {
      state = null;
      startIdle();
    }

    $('spinBtn').addEventListener('click', spin);
    $('hub').addEventListener('click', spin);
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
