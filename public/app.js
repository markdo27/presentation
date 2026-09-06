const view = document.body.dataset.view;
const selected = document.getElementById(`${view}-view`);
if (selected) selected.hidden = false;
let me;
function message(form, text, success = false) {
  const el = form.querySelector('.message');
  el.textContent = text; el.classList.toggle('success', success);
}
async function api(path, body, headers = {}) {
  const res = await fetch(path, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store', headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': me?.csrf || '' }), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const data = await res.json();
  if (!res.ok) { if (res.status === 401 && path !== '/api/login') location.replace('/login'); throw new Error(data.error || 'Please try again.'); }
  return data;
}
function bindForm(id, handler) {
  const form = document.getElementById(id);
  form.addEventListener('submit', async event => {
    event.preventDefault(); message(form, '');
    const button = form.querySelector('button[type="submit"],button.primary');
    button.disabled = true;
    try { await handler(Object.fromEntries(new FormData(form)), form); }
    catch (error) { message(form, error.message); }
    finally { button.disabled = false; }
  });
}
function matchingPasswords(body) { if (body.password !== body.confirm) throw new Error('The passwords don’t match.'); }
bindForm('login-form', async body => { const data = await api('/api/login', body); location.assign(data.next); });
bindForm('setup-form', async body => { matchingPasswords(body); const data = await api('/api/setup', body, { 'X-Setup-Token': document.querySelector('meta[name="setup-token"]').content }); location.assign(data.next); });
bindForm('password-form', async body => { matchingPasswords(body); const data = await api('/api/password', body); location.assign(data.next); });
bindForm('create-form', async (body, form) => { const data = await api('/api/users', body); form.reset(); message(form, data.message, true); await loadPeople(); });
bindForm('reset-form', async (body, form) => { const data = await api(`/api/users/${body.id}/password`, { password: body.password }); form.reset(); document.getElementById('reset-dialog').close(); const status = document.getElementById('people-status'); status.textContent = data.message; status.classList.add('success'); await loadPeople(); });
document.getElementById('cancel-reset').addEventListener('click', () => { document.getElementById('reset-dialog').close(); document.getElementById('reset-form').reset(); });
document.getElementById('logout').addEventListener('click', async () => { try { await api('/api/logout', {}); location.replace('/login'); } catch { location.replace('/login'); } });
document.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => { const input = document.getElementById(button.dataset.reveal); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; button.textContent = show ? 'Hide' : 'Show'; button.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); }));
function element(tag, text, cls) { const node = document.createElement(tag); node.textContent = text; if (cls) node.className = cls; return node; }
async function loadPeople() {
  const people = await api('/api/users');
  const list = document.getElementById('people-list'); list.replaceChildren();
  document.getElementById('people-count').textContent = `${people.length} ${people.length === 1 ? 'person' : 'people'}`;
  for (const person of people) {
    const row = element('article', '', 'person'), details = element('div', '');
    details.append(element('h3', person.name + (person.id === me.id ? ' (you)' : '')), element('p', person.username), element('span', `${person.role === 'admin' ? 'Admin' : 'Viewer'} / ${person.active ? 'Active' : 'Revoked'}${person.must_change ? ' / Password change required' : ''}`, 'role'));
    row.append(details);
    if (person.id !== me.id) {
      const actions = element('div', '', 'person-actions');
      const reset = element('button', 'Reset password'); reset.type = 'button';
      reset.addEventListener('click', () => { const form = document.getElementById('reset-form'); form.reset(); message(form, ''); form.elements.id.value = person.id; document.getElementById('reset-title').textContent = `Reset ${person.name}’s password`; document.getElementById('reset-dialog').showModal(); });
      const toggle = element('button', person.active ? 'Revoke access' : 'Restore access', person.active ? 'revoke' : ''); toggle.type = 'button';
      toggle.addEventListener('click', async () => {
        toggle.disabled = true;
        const status = document.getElementById('people-status');
        try { const data = await api(`/api/users/${person.id}/access`, { active: !person.active }); status.textContent = data.message; status.classList.add('success'); await loadPeople(); }
        catch (error) { status.textContent = error.message; status.classList.remove('success'); toggle.disabled = false; }
      });
      actions.append(reset, toggle); row.append(actions);
    }
    list.append(row);
  }
}
async function initialize() {
  if (['login', 'setup'].includes(view)) return;
  try {
    me = await api('/api/me');
    document.getElementById('account-nav').hidden = false;
    document.getElementById('admin-nav').hidden = me.role !== 'admin' || me.mustChange;
    if (me.mustChange && view !== 'password') return location.replace('/password');
    if (view === 'library') document.getElementById('welcome-name').textContent = `Welcome, ${me.name}.`;
    if (view === 'password' && me.mustChange) document.getElementById('password-description').textContent = 'Before opening the presentation, replace your temporary password with one only you know.';
    if (view === 'admin') await loadPeople();
  } catch (error) { const el = document.getElementById('people-status'); if (view === 'admin') el.textContent = error.message; }
}
initialize();
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
