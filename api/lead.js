// Приём заявки с колеса и отправка в Telegram.
// Работает как Vercel Serverless Function (POST /api/lead) и в локальном server.mjs.
//
// Переменные окружения:
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — id чата/группы, куда слать заявки (можно несколько через запятую)

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { return send(res, 400, { ok: false, error: 'json' }); }
  }
  body = body || {};

  // бот заполнил скрытое поле — делаем вид, что всё ок
  if (body.website) return send(res, 200, { ok: true });

  const name = String(body.name || '').trim().slice(0, 60);
  const phone = String(body.phone || '').replace(/\D/g, '');
  if (!name) return send(res, 400, { ok: false, error: 'name' });
  if (!/^998\d{9}$/.test(phone)) return send(res, 400, { ok: false, error: 'phone' });

  const prize = String(body.prize || '').slice(0, 120);
  const code = String(body.code || '').slice(0, 20);
  const lang = body.lang === 'uz' ? 'UZ' : 'RU';
  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const pretty = `+998 ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10, 12)}`;
  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent', dateStyle: 'short', timeStyle: 'short' });

  const utmLines = ['utm_source', 'utm_campaign', 'utm_content', 'utm_term']
    .filter((k) => utm[k])
    .map((k) => `${k}: ${esc(String(utm[k]).slice(0, 120))}`);

  const text = [
    '🎁 <b>Новая заявка — подарочные коробки</b>',
    '',
    `👤 ${esc(name)}`,
    `📞 <a href="tel:+${phone}">${pretty}</a>`,
    `🎁 ${esc(prize)}`,
    `🔑 Промокод: <code>${esc(code)}</code>`,
    `🌐 Язык: ${lang}`,
    ...(utmLines.length ? ['', '📊 ' + utmLines.join('\n')] : []),
    '',
    `🕐 ${time} (Ташкент)`,
  ].join('\n');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = String(process.env.TELEGRAM_CHAT_ID || '').split(',').map((s) => s.trim()).filter(Boolean);

  if (!token || !chats.length) {
    // локальный режим без бота — просто печатаем заявку в консоль
    console.log('\n[lead] TELEGRAM_* не заданы, заявка не отправлена в Telegram:\n' + text.replace(/<[^>]+>/g, '') + '\n');
    return send(res, 200, { ok: true, dev: true });
  }

  try {
    const results = await Promise.all(chats.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      }).then((r) => r.ok)
    ));
    if (!results.some(Boolean)) return send(res, 502, { ok: false, error: 'telegram' });
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('[lead] telegram error', err);
    return send(res, 502, { ok: false, error: 'telegram' });
  }
}
