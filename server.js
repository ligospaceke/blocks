// Zero-dependency server: serves the site, exposes prices, and lets the admin page save them.
// Run: ADMIN_PASSWORD=choose-a-password node server.js
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const FILE = path.join(ROOT, 'data', 'prices.json');
let PASSWORD = process.env.ADMIN_PASSWORD;
if (!PASSWORD) { PASSWORD = crypto.randomBytes(6).toString('hex'); console.log(`No ADMIN_PASSWORD set. Temporary password for this run: ${PASSWORD}`); }
const sessions = new Map();
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const HIDDEN = new Set(['server.js', 'package.json', 'README.md']);

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const readBody = async (req) => { let b = ''; for await (const c of req) { b += c; if (b.length > 1e5) throw new Error('too large'); } return b ? JSON.parse(b) : {}; };
const same = (a, b) => crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest());
const authed = (req) => { const exp = sessions.get((req.headers.authorization || '').replace('Bearer ', '')); return !!exp && exp > Date.now(); };
const money = (v) => v === null || (Number.isFinite(v) && v >= 0 && v < 1e9);

function merge(current, input) {
  const out = JSON.parse(JSON.stringify(current));
  const wa = String(input.whatsapp || '').replace(/\D/g, '');
  if (wa.length >= 9 && wa.length <= 15) out.whatsapp = wa; else throw new Error('Invalid WhatsApp number');
  for (const id of Object.keys(out.products)) {
    const p = input.products && input.products[id];
    if (!p) continue;
    if (!money(p.price)) throw new Error(`Invalid price for ${id}`);
    out.products[id] = { price: p.price, available: p.available !== false };
  }
  for (const id of Object.keys(out.zones)) {
    const z = input.zones && input.zones[id];
    if (!z) continue;
    if (!money(z.fee)) throw new Error(`Invalid fee for ${id}`);
    out.zones[id] = { fee: z.fee };
  }
  return out;
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/prices' && req.method === 'GET') return send(res, 200, fs.readFileSync(FILE));
    if (url.pathname === '/api/login' && req.method === 'POST') {
      const { password } = await readBody(req);
      if (!same(password || '', PASSWORD)) { await new Promise((r) => setTimeout(r, 800)); return send(res, 401, { error: 'Wrong password' }); }
      const token = crypto.randomBytes(24).toString('hex');
      sessions.set(token, Date.now() + 8 * 3600e3);
      return send(res, 200, { token });
    }
    if (url.pathname === '/api/prices' && req.method === 'PUT') {
      if (!authed(req)) return send(res, 401, { error: 'Sign in again' });
      const next = merge(JSON.parse(fs.readFileSync(FILE, 'utf8')), await readBody(req));
      fs.writeFileSync(FILE + '.tmp', JSON.stringify(next, null, 2));
      fs.renameSync(FILE + '.tmp', FILE);
      return send(res, 200, next);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Not allowed' });
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT + path.sep) || HIDDEN.has(path.basename(file)) || file.includes(path.sep + '.')) return send(res, 404, 'Not found', 'text/plain');
    fs.readFile(file, (err, data) => {
      if (err) return send(res, 404, 'Not found', 'text/plain');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(data);
    });
  } catch (e) { send(res, 400, { error: e.message }); }
}).listen(PORT, () => console.log(`The Builder’s Collection running at http://localhost:${PORT}`));
