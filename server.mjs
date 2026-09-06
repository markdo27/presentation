import http from 'node:http';
import { randomBytes, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = dirname(fileURLToPath(import.meta.url));
const derive = promisify(scrypt);
const token = () => randomBytes(32).toString('base64url');
const digest = value => createHash('sha256').update(value).digest('hex');
const hashOptions = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const SESSION_AGE = 8 * 60 * 60 * 1000;
const IDLE_AGE = 60 * 60 * 1000;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, hashOptions);
  return `${salt}:${key.toString('hex')}`;
}
async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const key = await derive(password, salt, 64, hashOptions);
  return timingSafeEqual(key, Buffer.from(hash, 'hex'));
}
function credentials(body) {
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = body.password;
  if (!/^[a-z0-9][a-z0-9._@-]{2,79}$/.test(username)) throw problem(400, 'Use a username of 3–80 letters, numbers, dots, @, underscores or hyphens.');
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw problem(400, 'Use a password between 12 and 128 characters.');
  return { username, password };
}
function problem(status, message) { return Object.assign(new Error(message), { status }); }

export async function createApp(options = {}) {
  const production = options.production ?? process.env.NODE_ENV === 'production';
  const configuredOrigin = options.origin ?? process.env.APP_ORIGIN;
  if (production && !configuredOrigin?.startsWith('https://')) throw new Error('Production requires an HTTPS APP_ORIGIN.');
  if (configuredOrigin && new URL(configuredOrigin).origin !== configuredOrigin) throw new Error('APP_ORIGIN must be an origin with no trailing slash or path.');
  const dataDir = resolve(options.dataDir ?? process.env.DATA_DIR ?? resolve(root, '.data'));
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(resolve(dataDir, 'presentation.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','user')),
      active INTEGER NOT NULL DEFAULT 1, must_change INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      csrf TEXT NOT NULL, expires INTEGER NOT NULL, last_seen INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  const dummyHash = await hashPassword(token());
  const bootstrap = token();
  const cookieName = production ? '__Host-mrkd' : 'mrkd_session';
  let passwordJobs = 0;
  const passwordWork = async fn => {
    if (passwordJobs >= 4) throw problem(429, 'Too many sign-in requests. Please try again shortly.');
    passwordJobs++;
    try { return await fn(); } finally { passwordJobs--; }
  };
  const usersExist = () => !!db.prepare('SELECT 1 FROM users LIMIT 1').get();
  function originFor(req) {
    if (configuredOrigin) {
      if (req.headers.host !== new URL(configuredOrigin).host) throw problem(403, 'This host is not allowed.');
      return configuredOrigin;
    }
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')) throw problem(403, 'This host is not allowed.');
    return `http://${req.headers.host}`;
  }
  const localSetup = req => !production && !configuredOrigin && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
  function session(req) {
    const value = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    if (!value || !/^[A-Za-z0-9_-]{43}$/.test(value)) return null;
    const hash = digest(value), now = Date.now();
    const row = db.prepare(`SELECT s.*,u.username,u.name,u.role,u.active,u.must_change FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.expires>? AND s.last_seen>? AND u.active=1`).get(hash, now, now - IDLE_AGE);
    if (row) db.prepare('UPDATE sessions SET last_seen=? WHERE hash=?').run(now, hash);
    return row || null;
  }
  function setSession(res, id) {
    const value = token(), now = Date.now();
    db.prepare('DELETE FROM sessions WHERE expires<? OR last_seen<?').run(now, now - IDLE_AGE);
    db.prepare('INSERT INTO sessions VALUES (?,?,?,?,?)').run(digest(value), id, token(), now + SESSION_AGE, now);
    res.setHeader('Set-Cookie', `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_AGE / 1000}${production ? '; Secure' : ''}`);
  }
  function limit(key, max, span) {
    const now = Date.now();
    db.prepare('DELETE FROM attempts WHERE expires<?').run(now);
    const row = db.prepare('SELECT * FROM attempts WHERE key=?').get(key);
    if (row && row.count >= max) throw problem(429, 'Too many attempts. Try again in 15 minutes.');
    db.prepare('INSERT INTO attempts VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key, 1, now + span);
  }
  const assets = new Map([
    ['/auth.css', ['text/css; charset=utf-8', 'auth.css']],
    ['/app.js', ['text/javascript; charset=utf-8', 'app.js']],
    ['/deck-session.js', ['text/javascript; charset=utf-8', 'deck-session.js']],
  ]);
  const page = (view, setupAllowed = false) => readFileSync(resolve(root, 'public/index.html'), 'utf8')
    .replaceAll('{{VIEW}}', view)
    .replace('{{SETUP_TOKEN}}', view === 'setup' ? bootstrap : '')
    .replace('{{SETUP_LINK}}', setupAllowed ? '<a class="quiet-link" href="/setup">Set up the first admin account</a>' : '');
  const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
  const redirect = (res, path) => { res.writeHead(303, { Location: path }); res.end(); };
  const html = (res, body) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(body); };
  async function readBody(req) {
    if (req.headers['content-type']?.split(';')[0] !== 'application/json') throw problem(415, 'Send JSON.');
    let size = 0, data = '';
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) throw problem(413, 'Request is too large.');
      data += chunk;
    }
    try { const body = JSON.parse(data); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); return body; }
    catch { throw problem(400, 'Invalid request.'); }
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    if (production) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    try {
      const origin = originFor(req);
      const path = new URL(req.url, origin).pathname;
      const auth = session(req);
      if (req.method === 'GET') {
        if (assets.has(path)) {
          const [type, name] = assets.get(path);
          res.writeHead(200, { 'Content-Type': type }); return res.end(readFileSync(resolve(root, 'public', name)));
        }
        if (path === '/health') return json(res, 200, { ok: true });
        if (path === '/') return redirect(res, auth ? (auth.must_change ? '/password' : '/library') : '/login');
        if (path === '/login') {
          if (auth) return redirect(res, auth.must_change ? '/password' : '/library');
          return html(res, page('login', !usersExist() && localSetup(req)));
        }
        if (path === '/setup') {
          if (usersExist() || !localSetup(req)) throw problem(404, 'Page not found.');
          return html(res, page('setup'));
        }
        if (['/library', '/admin', '/password', '/deck', '/vibecoding-deck.html', '/api/me', '/api/users'].includes(path)) {
          if (!auth) {
            if (path.startsWith('/api/')) throw problem(401, 'Please sign in.');
            return redirect(res, '/login');
          }
          if (auth.must_change && !['/password', '/api/me'].includes(path)) {
            if (path.startsWith('/api/')) throw problem(403, 'Change your temporary password first.');
            return redirect(res, '/password');
          }
          if (['/admin', '/api/users'].includes(path) && auth.role !== 'admin') throw problem(403, 'Admin access is required.');
          if (path === '/api/me') return json(res, 200, { id: auth.user_id, username: auth.username, name: auth.name, role: auth.role, csrf: auth.csrf, mustChange: !!auth.must_change });
          if (path === '/api/users') return json(res, 200, db.prepare('SELECT id,username,name,role,active,must_change,created_at FROM users ORDER BY created_at DESC').all());
          if (['/library', '/admin', '/password'].includes(path)) return html(res, page(path.slice(1)));
          let deck = readFileSync(resolve(root, 'vibecoding-deck.html'), 'utf8');
          const hashes = [...deck.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`).join(' ');
          res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'self' ${hashes}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`);
          deck = deck.replace('</html>', '<a href="/library" style="position:fixed;top:20px;right:32px;z-index:10000;background:#f0f0f0;color:#2e2e2e;border:1px solid #d8d8d8;border-radius:20px;padding:6px 12px;font:11px monospace;text-transform:uppercase">Library</a><script src="/deck-session.js"></script></html>');
          return html(res, deck);
        }
        throw problem(404, 'Page not found.');
      }
      if (req.method !== 'POST') throw problem(405, 'Method not allowed.');
      // Reject cross-origin requests before parsing any credentials or changing state.
      if (req.headers.origin !== origin) throw problem(403, 'Reload the page and try again.');
      const body = await readBody(req);
      if (path === '/api/setup') {
        if (usersExist() || !localSetup(req) || req.headers['x-setup-token'] !== bootstrap) throw problem(403, 'Setup is unavailable.');
        const { username, password } = credentials(body);
        const hash = await passwordWork(() => hashPassword(password));
        // Recheck after the async hash to avoid racing two first-admin requests.
        if (usersExist()) throw problem(409, 'An admin account already exists. Please sign in.');
        const result = db.prepare('INSERT INTO users(username,name,password_hash,role,created_at) VALUES (?,?,?,?,?)').run(username, String(body.name || username).trim().slice(0,80), hash, 'admin', Date.now());
        setSession(res, Number(result.lastInsertRowid));
        return json(res, 201, { next: '/admin' });
      }
      if (path === '/api/login') {
        const username = String(body.username || '').trim().toLowerCase().slice(0,80);
        const password = typeof body.password === 'string' && body.password.length <= 128 ? body.password : '';
        const ipKey = `ip:${digest(req.socket.remoteAddress || 'unknown')}`;
        const accountKey = `account:${digest(username)}`;
        limit(ipKey, 40, 15 * 60 * 1000); limit(accountKey, 10, 15 * 60 * 1000);
        const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
        const valid = await passwordWork(() => verifyPassword(password, user?.password_hash || dummyHash));
        const current = user && db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
        if (!valid || !current?.active || current.password_hash !== user.password_hash) throw problem(401, 'Username or password is incorrect.');
        if (auth) db.prepare('DELETE FROM sessions WHERE hash=?').run(auth.hash);
        db.prepare('DELETE FROM attempts WHERE key=?').run(accountKey);
        setSession(res, user.id);
        return json(res, 200, { next: current.must_change ? '/password' : '/library' });
      }
      if (!auth) throw problem(401, 'Please sign in.');
      if (req.headers['x-csrf-token'] !== auth.csrf) throw problem(403, 'Reload the page and try again.');
      if (path === '/api/logout') {
        db.prepare('DELETE FROM sessions WHERE hash=?').run(auth.hash);
        res.setHeader('Set-Cookie', `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production ? '; Secure' : ''}`);
        return json(res, 200, { next: '/login' });
      }
      if (path === '/api/password') {
        limit(`password:${auth.user_id}`, 10, 15 * 60 * 1000);
        const { password } = credentials({ username: auth.username, password: body.password });
        const user = db.prepare('SELECT * FROM users WHERE id=?').get(auth.user_id);
        if (typeof body.currentPassword !== 'string' || body.currentPassword.length > 128 || !await passwordWork(() => verifyPassword(body.currentPassword, user.password_hash))) throw problem(400, 'Your current password is incorrect.');
        if (body.currentPassword === password) throw problem(400, 'Choose a different password.');
        const hash = await passwordWork(() => hashPassword(password));
        const current = session(req);
        if (!current) throw problem(401, 'Please sign in again.');
        db.prepare('UPDATE users SET password_hash=?,must_change=0 WHERE id=?').run(hash, auth.user_id);
        db.prepare('DELETE FROM sessions WHERE user_id=?').run(auth.user_id);
        setSession(res, auth.user_id);
        return json(res, 200, { next: '/library' });
      }
      if (auth.must_change || auth.role !== 'admin') throw problem(403, 'Admin access is required.');
      if (path === '/api/users') {
        const { username, password } = credentials(body);
        const role = body.role === 'admin' ? 'admin' : 'user';
        if (db.prepare('SELECT 1 FROM users WHERE username=?').get(username)) throw problem(409, 'That username already exists.');
        const hash = await passwordWork(() => hashPassword(password));
        const current = session(req);
        if (!current || current.role !== 'admin') throw problem(403, 'Admin access is required.');
        try { db.prepare('INSERT INTO users(username,name,password_hash,role,must_change,created_at) VALUES (?,?,?,?,1,?)').run(username, String(body.name || username).trim().slice(0,80), hash, role, Date.now()); }
        catch (error) { if (String(error).includes('UNIQUE')) throw problem(409, 'That username already exists.'); throw error; }
        return json(res, 201, { message: 'Account created. Share the username and temporary password privately. They will choose a new password at first sign-in.' });
      }
      const match = path.match(/^\/api\/users\/(\d+)\/(access|password)$/);
      if (match) {
        const id = Number(match[1]);
        if (id === auth.user_id) throw problem(400, 'Use your own password page to update your account.');
        if (!db.prepare('SELECT id FROM users WHERE id=?').get(id)) throw problem(404, 'Account not found.');
        if (match[2] === 'access') {
          if (typeof body.active !== 'boolean') throw problem(400, 'Choose an access state.');
          db.prepare('UPDATE users SET active=? WHERE id=?').run(Number(body.active), id);
          db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
          return json(res, 200, { message: body.active ? 'Access restored.' : 'Access revoked. All sessions have ended.' });
        }
        const { password } = credentials({ username: 'reset-user', password: body.password });
        const hash = await passwordWork(() => hashPassword(password));
        const current = session(req);
        if (!current || current.role !== 'admin') throw problem(403, 'Admin access is required.');
        db.prepare('UPDATE users SET password_hash=?,must_change=1 WHERE id=?').run(hash, id);
        db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
        return json(res, 200, { message: 'Temporary password saved. Share it privately with this person.' });
      }
      throw problem(404, 'Page not found.');
    } catch (error) {
      if (res.headersSent) return res.end();
      const status = error.status || 500;
      if (status === 429) res.setHeader('Retry-After', '900');
      const message = status === 500 ? 'Something went wrong. Please try again.' : error.message;
      if (req.url?.startsWith('/api/')) return json(res, status, { error: message });
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MRKD / Access</title><link rel="stylesheet" href="/auth.css"><main class="error-page"><p class="eyebrow">MRKD / PRIVATE PRESENTATION</p><h1>${escapeHtml(message)}</h1><a class="button" href="/login">Back to sign in</a></main></html>`);
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.on('close', () => db.close());
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const app = await createApp();
  const port = Number(process.env.PORT || 8778), host = process.env.HOST || '127.0.0.1';
  app.listen(port, host, () => console.log(`MRKD presentation: ${process.env.APP_ORIGIN || `http://${host}:${port}`}`));
}
