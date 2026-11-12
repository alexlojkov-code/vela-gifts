// Один раз после публикации: открыть https://<домен>/api/setup —
// Telegram начнёт присылать сообщения боту на /api/bot (ответ «Ваш ID»).
// Повторный вызов безопасен: просто ставит тот же адрес ещё раз.
import { webhookSecret } from './bot.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ ok: false, error: 'TELEGRAM_BOT_TOKEN не задан' }));
  }
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers.host;
  const url = `https://${host}/api/bot`;
  const api = (method, body) => fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  }).then((r) => r.json());

  try {
    const set = await api('setWebhook', {
      url,
      secret_token: webhookSecret(token),
      allowed_updates: ['message', 'my_chat_member'],
    });
    const info = await api('getWebhookInfo');
    res.statusCode = set.ok ? 200 : 502;
    res.end(JSON.stringify({
      ok: !!set.ok,
      telegram: set.description,
      webhook: info.result && info.result.url,
      pending: info.result && info.result.pending_update_count,
      lastError: info.result && info.result.last_error_message,
    }));
  } catch (err) {
    res.statusCode = 502;
    res.end(JSON.stringify({ ok: false, error: String(err) }));
  }
}
