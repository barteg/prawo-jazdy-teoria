// server.js — Modern ES Module local HTTP server with LAN IP detection and HTTPS tunnel support

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const ENABLE_TUNNEL = process.argv.includes('--tunnel');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  if (pathname === '/') pathname = '/index.html';

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.json' || ext === '.png' ? 'public, max-age=3600' : 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('------------------------------------------------------------');
  console.log('🚗 Aplikacja Prawo Jazdy gotowa!');
  console.log(`💻 Lokalnie na komputerze: http://localhost:${PORT}`);
  console.log(`📱 Sieć lokalna LAN:      http://${localIp}:${PORT}`);
  console.log('------------------------------------------------------------');

  if (ENABLE_TUNNEL) {
    console.log('⏳ Uruchamianie bezpiecznego tunelu HTTPS dla telefonu...');
    const lt = spawn('npx', ['--yes', 'localtunnel', '--port', String(PORT)], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    lt.stdout.on('data', (data) => {
      const text = data.toString();
      const match = text.match(/https:\/\/[^\s]+/);
      if (match) {
        const tunnelUrl = match[0];
        console.log('\n============================================================');
        console.log('🌐 PUBLICZNY LINK HTTPS DLA TELEFONU (iPhone / Android):');
        console.log(`👉 ${tunnelUrl}`);
        console.log('============================================================');
        console.log('📱 KROKI:');
        console.log('1. Otwórz ten link w Safari na telefonie.');
        console.log('2. Kliknij Udostępnij ⎋ -> "Do ekranu początkowego".');
        console.log('3. Gotowe! Dzięki HTTPS Safari zapisze całą aplikację i');
        console.log('   pytania w pamięci telefonu — komputer można już wyłączyć!');
        console.log('============================================================\n');
      }
    });

    lt.stderr.on('data', (err) => {
      // ignore verbose lt logs
    });

    process.on('SIGINT', () => {
      lt.kill();
      process.exit();
    });
  } else {
    console.log('💡 JAK KORZYSTAĆ NA TELEFONIE BEZ WŁĄCZONEGO KOMPUTERA:');
    console.log('   iOS wymaga połączenia HTTPS, aby zapisać PWA w pamięci telefonu:');
    console.log('   👉 Opcja A (Zalecana - darmowy stały hosting):');
    console.log('      Uruchom w nowym terminalu: npm run deploy');
    console.log('      (Otrzymasz stały link https://twoj-login.github.io/prawo-jazdy-teoria/)');
    console.log('   👉 Opcja B (Szybki tymczasowy tunel HTTPS):');
    console.log('      Uruchom: npm run tunnel');
    console.log('------------------------------------------------------------');
  }
});
