# VELA — колесо подарков (лендинг для таргета)

Мобильный лендинг: человек крутит колесо → получает подарок → оставляет имя и телефон → заявка приходит в Telegram.

## Что где менять
Всё в `public/config.js`:
- `telegram`, `phone`, `address` — контакты (пустые не показываются);
- `pixelId` — Meta Pixel (события `PageView`, `WheelSpin`, `Lead`);
- `giftDays` — срок действия подарка;
- `PRIZES` — призы и шансы (`weight`). Порядок в массиве = порядок секторов.

Ссылки для рекламы: `https://<домен>/` (RU) и `https://<домен>/?lang=uz` (UZ).
UTM-метки и fbclid из ссылки попадают в заявку.

## Локально
```
node server.mjs   # http://localhost:5210
```
Без `.env` заявки печатаются в консоль.

## Telegram-бот
1. @BotFather → /newbot → токен.
2. Создать группу для заявок, добавить туда бота, написать в группу любое сообщение.
3. Открыть `https://api.telegram.org/bot<ТОКЕН>/getUpdates` → взять `chat.id` (начинается с `-100…`).
4. Прописать `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (см. `.env.example`).

## Публикация (Vercel, бесплатно)
```
npx vercel          # первый раз — логин и создание проекта
npx vercel --prod
```
В Vercel → Settings → Environment Variables добавить две переменные из `.env.example`, затем ещё раз `npx vercel --prod`.
