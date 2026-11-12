// Локальный сервер для проверки: раздаёт public/ и обрабатывает POST /api/lead.
// Запуск: node server.mjs   (переменные берутся из .env, если он есть)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from './api/lead.js';

const root = fileURLToPath(new URL('./public/', import.meta.url));
try { process.loadEnvFile(fileURLToPath(new URL('./.env', import.meta.url))); } catch { /* .env нет — ок */ }

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/lead') {
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 20000) break; }
    req.body = raw;
    return handler(req, res);
  }

  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, rel.endsWith('/') ? rel + 'index.html' : rel);
  if (!file.startsWith(root)) { res.statusCode = 403; return res.end(); }
  try {
    const data = await readFile(file);
    res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = Number(process.env.PORT) || 5210;
server.listen(port, '127.0.0.1', () => console.log(`VELA gifts → http://localhost:${port}`));
