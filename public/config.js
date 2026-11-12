// ============================================================
//  НАСТРОЙКИ АКЦИИ — всё, что нужно менять, находится здесь
// ============================================================

window.CONFIG = {
  studio: 'VELA',
  studioFull: 'VELA Laser Studio',
  city: { ru: 'Ташкент', uz: 'Toshkent' },

  // Контакты (пустые поля просто не показываются на странице)
  instagram: 'velastudio.uz',     // без @
  telegram: '',                   // username админа/бота без @, например 'vela_admin'
  phone: '',                      // '+998 90 123 45 67'
  address: { ru: '', uz: '' },    // 'ул. ..., ориентир ...'

  // Meta Pixel ID из Events Manager (пусто = пиксель выключен)
  pixelId: '',

  // Сколько дней действует подарок
  giftDays: 14,

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
//  list — короткая строка в блоке «Что может быть внутри».
// ------------------------------------------------------------
window.PRIZES = [
  {
    id: 'small_zone', weight: 5, main: true,
    ru: { big: 'Подарок', small: 'малая зона', full: 'Малая зона в подарок', list: 'Малая зона в подарок' },
    uz: { big: 'Sovg‘a', small: 'kichik zona', full: 'Kichik zona sovg‘a', list: 'Kichik zona sovg‘a' },
  },
  {
    id: 'first10', weight: 20,
    ru: { big: '−10%', small: 'первый визит', full: 'Скидка 10% на лазер на первое посещение', list: '−10% на первый визит' },
    uz: { big: '−10%', small: 'ilk tashrif', full: 'Birinchi tashrifda lazerga 10% chegirma', list: 'Ilk tashrifga −10%' },
  },
  {
    id: 'first5', weight: 32,
    ru: { big: '−5%', small: 'первый визит', full: 'Скидка 5% на лазер на первое посещение', list: '−5% на первый визит' },
    uz: { big: '−5%', small: 'ilk tashrif', full: 'Birinchi tashrifda lazerga 5% chegirma', list: 'Ilk tashrifga −5%' },
  },
  {
    id: 'retry', weight: 10, retry: true,
    ru: { big: 'Ещё раз', small: 'выберите снова', full: 'Попробуйте ещё раз' },
    uz: { big: 'Yana', small: 'qayta tanlang', full: 'Yana bir bor urinib ko‘ring' },
  },
  {
    id: 'cash30', weight: 23,
    ru: { big: '30 000', small: 'сум кешбэк', full: '30 000 сум кешбэк на лазер', list: 'Кешбэк 30 000 сум' },
    uz: { big: '30 000', small: 'so‘m keshbek', full: 'Lazerga 30 000 so‘m keshbek', list: 'Keshbek 30 000 so‘m' },
  },
  {
    id: 'cash50', weight: 10,
    ru: { big: '50 000', small: 'сум кешбэк', full: '50 000 сум кешбэк на лазер', list: 'Кешбэк 50 000 сум' },
    uz: { big: '50 000', small: 'so‘m keshbek', full: 'Lazerga 50 000 so‘m keshbek', list: 'Keshbek 50 000 so‘m' },
  },
];
