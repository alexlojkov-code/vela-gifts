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
};

// ------------------------------------------------------------
//  ПРИЗЫ. Порядок = порядок секторов на колесе (по часовой).
//  weight — относительный шанс выпадения. 0 = никогда не выпадает.
//  Сейчас шансы: −30% 22%, −20% 22%, −50% 2-я зона 18%,
//  подмышки 14%, сертификат 14%, бикини 7%, всё тело 2%, бесплатно 1%.
// ------------------------------------------------------------
window.PRIZES = [
  {
    id: 'first30', weight: 22,
    ru: { big: '−30%', small: 'первый визит', full: 'Скидка 30% на первый визит' },
    uz: { big: '−30%', small: 'ilk tashrif', full: 'Birinchi tashrifga 30% chegirma' },
  },
  {
    id: 'free_zone', weight: 1, main: true,
    ru: { big: 'Бесплатно', small: '1 зона', full: 'Бесплатная процедура на одну зону' },
    uz: { big: 'Bepul', small: '1 zona', full: 'Bitta zonaga bepul muolaja' },
  },
  {
    id: 'course20', weight: 22,
    ru: { big: '−20%', small: 'на курс', full: 'Скидка 20% на курс процедур' },
    uz: { big: '−20%', small: 'kursga', full: 'Muolajalar kursiga 20% chegirma' },
  },
  {
    id: 'armpits', weight: 14,
    ru: { big: 'Подмышки', small: 'в подарок', full: 'Лазерная эпиляция подмышек в подарок' },
    uz: { big: 'Qo‘ltiq', small: 'sovg‘a', full: 'Qo‘ltiq osti lazer epilyatsiyasi sovg‘a' },
  },
  {
    id: 'second50', weight: 18,
    ru: { big: '−50%', small: 'на 2-ю зону', full: 'Скидка 50% на вторую зону' },
    uz: { big: '−50%', small: '2-zonaga', full: 'Ikkinchi zonaga 50% chegirma' },
  },
  {
    id: 'body50', weight: 2,
    ru: { big: '−50%', small: 'всё тело', full: 'Скидка 50% на комплекс «Всё тело»' },
    uz: { big: '−50%', small: 'butun tana', full: '«Butun tana» kompleksiga 50% chegirma' },
  },
  {
    id: 'cert100', weight: 14,
    ru: { big: '100 000', small: 'сум сертификат', full: 'Сертификат на 100 000 сум' },
    uz: { big: '100 000', small: 'so‘m sertifikat', full: '100 000 so‘mlik sertifikat' },
  },
  {
    id: 'bikini40', weight: 7,
    ru: { big: '−40%', small: 'бикини', full: 'Скидка 40% на зону бикини' },
    uz: { big: '−40%', small: 'bikini', full: 'Bikini zonasiga 40% chegirma' },
  },
];
