// Бот отвечает на /start и /id: присылает ID чата, чтобы его было легко добавить
// в TELEGRAM_CHAT_ID. Добавили бота в группу — он сам пишет ID группы.
// Заявки отсюда НЕ раздаются: получают их только чаты из TELEGRAM_CHAT_ID.
// Telegram шлёт сюда обновления после вызова /api/setup.
import { createHash } from 'node:crypto';

export const webhookSecret = (token) => createHash('sha256').update('vela-webhook:' + token).digest('hex').slice(0, 48);

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function reply(token, chat_id, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
  });
}

function idText(chat) {
  const isGroup = chat.type === 'group' || chat.type === 'supergroup';
  return isGroup
    ? `ID этой группы: <code>${chat.id}</code>\n\nПерешлите это число тому, кто настраивает заявки с сайта VELA.`
    : `Ваш ID: <code>${chat.id}</code>\n\nПерешлите это число тому, кто настраивает заявки с сайта VELA. Заявки начнут приходить сюда, когда ID добавят в настройки.`;
}

export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (req.method !== 'POST') return send(res, 200, { ok: true });
  if (!token || req.headers['x-telegram-bot-api-secret-token'] !== webhookSecret(token)) {
    return send(res, 401, { ok: false });
  }

  let update = req.body;
  if (typeof update === 'string') {
    try { update = JSON.parse(update || '{}'); } catch { update = {}; }
  }
  update = update || {};

  try {
    const msg = update.message;
    if (msg && msg.chat) {
      if (msg.migrate_to_chat_id) {
        // группа стала супергруппой — у неё новый ID
        await reply(token, msg.migrate_to_chat_id,
          `Группа обновилась, и у неё новый ID: <code>${msg.migrate_to_chat_id}</code>\n\nЕсли заявки шли сюда — замените ID в настройках Vercel.`);
      } else if (/^\/(start|id)(@\w+)?(\s|$)/i.test(msg.text || '')) {
        await reply(token, msg.chat.id, idText(msg.chat));
      }
    }

    // бота добавили в группу — сразу пишем её ID
    const member = update.my_chat_member;
    if (member && member.chat && member.chat.type !== 'private') {
      const was = member.old_chat_member && member.old_chat_member.status;
      const now = member.new_chat_member && member.new_chat_member.status;
      if ((was === 'left' || was === 'kicked') && (now === 'member' || now === 'administrator')) {
        await reply(token, member.chat.id, idText(member.chat));
      }
    }
  } catch (err) {
    console.error('[bot] error', err);
  }
  // всегда 200, иначе Telegram будет повторять одно и то же обновление
  return send(res, 200, { ok: true });
}
