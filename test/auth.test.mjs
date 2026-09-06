import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { createApp } from '../server.mjs';

test('authentication, role enforcement and protected presentation lifecycle', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'mrkd-auth-test-'));
  let app = await createApp({ dataDir: directory });
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  let origin = `http://127.0.0.1:${app.address().port}`;
  const admin = { cookie: '', csrf: '' }, viewer = { cookie: '', csrf: '' };
  async function request(path, { method = 'GET', body, actor, headers = {} } = {}) {
    const response = await fetch(origin + path, {
      method, redirect: 'manual', headers: {
        ...(actor?.cookie ? { Cookie: actor.cookie } : {}),
        ...(method === 'POST' ? { Origin: origin, 'Content-Type': 'application/json', ...(actor?.csrf ? { 'X-CSRF-Token': actor.csrf } : {}) } : {}), ...headers,
      }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (actor && response.headers.has('set-cookie')) actor.cookie = response.headers.get('set-cookie').split(';')[0];
    return response;
  }
  const post = (path, body, actor, headers) => request(path, { method: 'POST', body, actor, headers });
  const me = async actor => {
    const response = await request('/api/me', { actor }); assert.equal(response.status, 200);
    const data = await response.json(); actor.csrf = data.csrf; return data;
  };
  const close = async () => { app.closeAllConnections(); await new Promise(resolve => app.close(resolve)); };
  t.after(async () => { await close(); await rm(directory, { recursive: true, force: true }); });

  await t.test('direct URLs and source files cannot bypass login', async () => {
    for (const path of ['/deck', '/vibecoding-deck.html', '/library', '/admin']) {
      const response = await request(path); assert.equal(response.status, 303, path); assert.equal(response.headers.get('location'), '/login');
      assert.equal((await response.text()).includes('LIQUID.FONT'), false);
    }
    for (const path of ['/.build/vibecoding-deck.original.html', '/.data/presentation.sqlite', '/server.mjs', '/private/vibecoding-deck.html', '/%2e%2e/vibecoding-deck.html.bak', '/.git/config']) assert.equal((await request(path)).status, 404, path);
    assert.equal((await request('/api/me')).status, 401);
    assert.equal((await request('/api/users')).status, 401);
    assert.equal((await request('/login', { method: 'HEAD' })).status, 405);
    assert.equal((await post('/api/register', {})).status, 401);
  });

  await t.test('first-admin setup requires local request, origin and one-use token', async () => {
    const page = await request('/setup'); assert.equal(page.status, 200);
    const token = (await page.text()).match(/name="setup-token" content="([^"]+)"/)[1];
    assert.equal((await post('/api/setup', {}, undefined, { 'X-Setup-Token': 'invalid' })).status, 403);
    const body = { username: 'test-admin', name: 'Test Admin', password: 'test-admin-password-1234' };
    assert.equal((await post('/api/setup', body, undefined, { Origin: 'https://other.example', 'X-Setup-Token': token })).status, 403);
    const response = await post('/api/setup', body, admin, { 'X-Setup-Token': token }); assert.equal(response.status, 201);
    assert.match(response.headers.get('set-cookie'), /HttpOnly/); assert.match(response.headers.get('set-cookie'), /SameSite=Strict/);
    assert.equal((await me(admin)).role, 'admin');
    assert.equal((await post('/api/setup', body, undefined, { 'X-Setup-Token': token })).status, 403);
    assert.equal((await request('/setup')).status, 404);
  });

  await t.test('credentials are hashed, login errors are generic and CSRF is enforced', async () => {
    const badKnown = await post('/api/login', { username: 'test-admin', password: 'wrong' });
    const badUnknown = await post('/api/login', { username: 'not-an-account', password: 'wrong' });
    assert.equal(badKnown.status, 401); assert.deepEqual(await badKnown.json(), await badUnknown.json());
    const db = new DatabaseSync(join(directory, 'presentation.sqlite'));
    const row = db.prepare('SELECT password_hash FROM users').get(); assert.ok(!row.password_hash.includes('test-admin-password')); assert.match(row.password_hash, /^[a-f0-9]{32}:[a-f0-9]{128}$/); db.close();
    assert.equal((await post('/api/users', {}, { cookie: admin.cookie })).status, 403);
    assert.equal((await post('/api/users', {}, admin, { Origin: 'https://other.example' })).status, 403);
  });

  let viewerId;
  await t.test('admin creates a viewer, who must replace their temporary password', async () => {
    const created = await post('/api/users', { username: 'test-viewer', name: '<script>example</script>', password: 'temporary-test-password', role: 'user' }, admin);
    assert.equal(created.status, 201);
    const people = await (await request('/api/users', { actor: admin })).json(); viewerId = people.find(p => p.username === 'test-viewer').id;
    assert.ok(people.every(p => !Object.keys(p).some(k => /hash|csrf/.test(k))));
    const login = await post('/api/login', { username: 'test-viewer', password: 'temporary-test-password' }, viewer);
    assert.equal(login.status, 200); assert.equal((await login.json()).next, '/password'); await me(viewer);
    assert.equal((await request('/deck', { actor: viewer })).headers.get('location'), '/password');
    assert.equal((await request('/api/users', { actor: viewer })).status, 403);
    assert.equal((await post('/api/password', { currentPassword: 'wrong', password: 'new-test-password-123' }, viewer)).status, 400);
    assert.equal((await post('/api/password', { currentPassword: 'temporary-test-password', password: 'new-test-password-123' }, viewer)).status, 200);
    assert.equal((await me(viewer)).mustChange, false);
    const deck = await request('/vibecoding-deck.html', { actor: viewer }); assert.equal(deck.status, 200);
    assert.match(deck.headers.get('cache-control'), /no-store/);
    assert.match(deck.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    const content = await deck.text(); assert.ok(content.includes('LIQUID.FONT')); assert.equal((content.match(/<section class="slide"/g) || []).length, 34);
    const csp = deck.headers.get('content-security-policy');
    for (const match of content.matchAll(/<script\b(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)) assert.ok(csp.includes(createHash('sha256').update(match[1]).digest('base64')));
  });

  await t.test('viewers cannot administer accounts or promote themselves', async () => {
    assert.equal((await request('/admin', { actor: viewer })).status, 403);
    assert.equal((await request('/api/users', { actor: viewer })).status, 403);
    assert.equal((await post('/api/users', { role: 'admin', username: 'intruder', password: 'intruder-test-password' }, viewer)).status, 403);
    assert.equal((await post(`/api/users/${viewerId}/access`, { active: true, role: 'admin' }, viewer)).status, 403);
    assert.equal((await post(`/api/users/${viewerId}/password`, { password: 'intruder-test-password' }, viewer)).status, 403);
    assert.equal((await post('/api/users/1/access', { active: false }, admin)).status, 400);
  });

  await t.test('revocation terminates existing sessions; restoration does not restore them', async () => {
    const stale = { ...viewer };
    assert.equal((await post(`/api/users/${viewerId}/access`, { active: false }, admin)).status, 200);
    assert.equal((await request('/api/me', { actor: stale })).status, 401);
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'new-test-password-123' }, viewer)).status, 401);
    assert.equal((await post(`/api/users/${viewerId}/access`, { active: true }, admin)).status, 200);
    assert.equal((await request('/api/me', { actor: stale })).status, 401);
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'new-test-password-123' }, viewer)).status, 200); await me(viewer);
  });

  await t.test('password reset revokes old sessions and forces a new password', async () => {
    const stale = { ...viewer };
    assert.equal((await post(`/api/users/${viewerId}/password`, { password: 'another-temporary-password' }, admin)).status, 200);
    assert.equal((await request('/api/me', { actor: stale })).status, 401);
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'new-test-password-123' }, viewer)).status, 401);
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'another-temporary-password' }, viewer)).status, 200);
    assert.equal((await me(viewer)).mustChange, true);
    assert.equal((await post('/api/password', { currentPassword: 'another-temporary-password', password: 'permanent-test-password' }, viewer)).status, 200); await me(viewer);
  });

  await t.test('logout invalidates the server-side session', async () => {
    const stale = { ...viewer };
    const response = await post('/api/logout', {}, viewer); assert.equal(response.status, 200); assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
    assert.equal((await request('/api/me', { actor: stale })).status, 401);
  });

  await t.test('accounts survive a server restart', async () => {
    await close(); app = await createApp({ dataDir: directory }); app.listen(0, '127.0.0.1'); await once(app, 'listening'); origin = `http://127.0.0.1:${app.address().port}`;
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'permanent-test-password' }, viewer)).status, 200);
    assert.equal((await me(viewer)).role, 'user'); assert.equal((await request('/setup')).status, 404);
  });

  await t.test('idle and absolute session expiry deny access', async () => {
    const db = new DatabaseSync(join(directory, 'presentation.sqlite'));
    db.prepare('UPDATE sessions SET last_seen=? WHERE user_id=?').run(Date.now() - 61 * 60 * 1000, viewerId);
    assert.equal((await request('/api/me', { actor: viewer })).status, 401);
    assert.equal((await post('/api/login', { username: 'test-viewer', password: 'permanent-test-password' }, viewer)).status, 200);
    db.prepare('UPDATE sessions SET expires=? WHERE user_id=?').run(Date.now() - 1000, viewerId); db.close();
    assert.equal((await request('/api/me', { actor: viewer })).status, 401);
  });

  await t.test('repeated failed logins are throttled', async () => {
    for (let i = 0; i < 10; i++) assert.equal((await post('/api/login', { username: 'rate-test', password: 'wrong' })).status, 401);
    const response = await post('/api/login', { username: 'rate-test', password: 'wrong' }); assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '900');
  });
});

test('production fails closed without HTTPS and disables first-admin web setup', async t => {
  await assert.rejects(createApp({ production: true, origin: 'http://unsafe.example' }), /HTTPS/);
  const directory = await mkdtemp(join(tmpdir(), 'mrkd-prod-test-'));
  const app = await createApp({ production: true, origin: 'https://presentation.example', dataDir: directory });
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  t.after(async () => { app.closeAllConnections(); await new Promise(resolve => app.close(resolve)); await rm(directory, { recursive: true, force: true }); });
  const origin = `http://127.0.0.1:${app.address().port}`;
  const denied = await fetch(origin + '/login'); assert.equal(denied.status, 403);
  // Node fetch normalizes Host. Use HTTP directly to simulate the TLS proxy.
  const viaProxy = path => new Promise((resolve, reject) => {
    http.get(origin + path, { headers: { Host: 'presentation.example' } }, response => {
      let body = ''; response.on('data', chunk => body += chunk);
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
    }).on('error', reject);
  });
  const setup = await viaProxy('/setup'); assert.equal(setup.status, 404);
  const login = await viaProxy('/login'); assert.equal(login.status, 200); assert.match(login.headers['strict-transport-security'], /max-age/);
  assert.ok(!login.body.includes('Set up the first admin'));
});
