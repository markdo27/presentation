// Re-check on return to the tab. Loaded content cannot be recalled, but a revoked
// or expired session must never retrieve the presentation again.
async function checkAccess() {
  try {
    const res = await fetch('/api/me', { cache: 'no-store', credentials: 'same-origin' });
    if (res.status === 401 || res.status === 403) { document.body.replaceChildren(); location.replace('/login'); }
    else if (res.ok && (await res.json()).mustChange) { document.body.replaceChildren(); location.replace('/password'); }
  } catch { /* A temporary connection failure does not erase the presentation. */ }
}
window.addEventListener('pageshow', checkAccess);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkAccess(); });
setInterval(checkAccess, 60000);
