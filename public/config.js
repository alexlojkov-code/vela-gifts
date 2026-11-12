// ============================================================
//  НАСТРОЙКИ АКЦИИ — всё, что нужно менять, находится здесь
// ============================================================

window.CONFIG = {
  studio: 'VELA',
  studioFull: 'VELA Laser Studio',
  city: { ru: 'Ташкент', uz: 'Toshkent' },

  // Контакты (пустые поля просто не показываются на странице)
  instagram: 'velastudio.uz',     // без @
  telegram: 'vela_studio',        // аккаунт студии без @ — кнопка «Написать в Telegram»
  phone: '+998 77 311 12 24',
  address: { ru: 'Ташкент, Амир Темур, 1', uz: 'Toshkent, Amir Temur, 1' },
  hours: { ru: 'Ежедневно с 9:00 до 20:00', uz: 'Har kuni 9:00 dan 20:00 gacha' },
  // Точка на карте (из ссылки Google Maps) — для кнопок маршрута
  map: { lat: 41.331289, lng: 69.28441 },

  // Meta Pixel ID из Events Manager (пусто = пиксель выключен)
  pixelId: '',

  // Сколько дней действует подарок
  giftDays: 7,

  // Куда отправляется заявка (serverless-функция → Telegram)
  leadEndpoint: '/api/lead',

  // Демо для согласования: заявки никуда не уходят, коробки можно открывать заново.
  // Включается само на *.github.io или по ссылке с ?demo
  demo: /\.github\.io$/.test(location.hostname) || new URLSearchParams(location.search).has('demo'),
};

// ------------------------------------------------------------
//  ПРИЗЫ. Приз определяется в момент открытия коробки.
//  weight — шанс выпадения в процентах (сумма = 100).
//  retry: true — «Попробуйте ещё раз»: человек выбирает вторую коробку,
//  и во второй раз этот вариант уже не выпадает.
//  big/small — надпись на карточке в коробке, full — полное название,
//  list — короткая строка в блоке «Что может быть внутри»,
//  note — условие приза (показывается в списке призов, в окне выигрыша и в заявке).
// ------------------------------------------------------------
const CASHBACK_NOTE = {
  ru: 'Кешбэк можно потратить сразу целиком или накапливать. За одну процедуру можно списать не больше 50 000 сум.',
  uz: 'Keshbekni birdaniga to‘liq ishlatish yoki jamg‘arish mumkin. Bitta muolajada ko‘pi bilan 50 000 so‘m ishlatish mumkin.',
};

window.PRIZES = [
  {
    id: 'small_zone', weight: 5, main: true,
    ru: { big: 'Подарок', small: 'малая зона', full: 'Малая зона в подарок', list: 'Малая зона в подарок', note: 'Запишитесь сразу на 3 зоны или больше — самую недорогую из них сделаем бесплатно на первой процедуре.' },
    uz: { big: 'Sovg‘a', small: 'kichik zona', full: 'Kichik zona sovg‘a', list: 'Kichik zona sovg‘a', note: 'Birdaniga 3 yoki undan ko‘p zonaga yoziling — ulardan eng arzonini birinchi muolajada bepul qilamiz.' },
  },
  {
    id: 'first10', weight: 20,
    ru: { big: '−10%', small: 'на лазер', full: 'Скидка 10% на лазерную эпиляцию', list: '−10% на лазерную эпиляцию' },
    uz: { big: '−10%', small: 'lazerga', full: 'Lazer epilyatsiyasiga 10% chegirma', list: 'Lazer epilyatsiyasiga −10%' },
  },
  {
    id: 'first5', weight: 32,
    ru: { big: '−5%', small: 'на лазер', full: 'Скидка 5% на лазерную эпиляцию', list: '−5% на лазерную эпиляцию' },
    uz: { big: '−5%', small: 'lazerga', full: 'Lazer epilyatsiyasiga 5% chegirma', list: 'Lazer epilyatsiyasiga −5%' },
  },
  {
    id: 'retry', weight: 10, retry: true,
    ru: { big: 'Ещё раз', small: 'выберите снова', full: 'Попробуйте ещё раз' },
    uz: { big: 'Yana', small: 'qayta tanlang', full: 'Yana bir bor urinib ko‘ring' },
  },
  {
    id: 'cash30', weight: 23,
    ru: { big: '30 000', small: 'сум кешбэк', full: '30 000 сум кешбэк на лазер', list: 'Кешбэк 30 000 сум', note: CASHBACK_NOTE.ru },
    uz: { big: '30 000', small: 'so‘m keshbek', full: 'Lazerga 30 000 so‘m keshbek', list: 'Keshbek 30 000 so‘m', note: CASHBACK_NOTE.uz },
  },
  {
    id: 'cash50', weight: 10,
    ru: { big: '50 000', small: 'сум кешбэк', full: '50 000 сум кешбэк на лазер', list: 'Кешбэк 50 000 сум', note: CASHBACK_NOTE.ru },
    uz: { big: '50 000', small: 'so‘m keshbek', full: 'Lazerga 50 000 so‘m keshbek', list: 'Keshbek 50 000 so‘m', note: CASHBACK_NOTE.uz },
  },
];
