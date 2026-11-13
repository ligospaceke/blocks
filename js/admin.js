import { products, categories } from './data/products.js';
import { zones } from './data/vehicles.js';
import { loadConfig, defaultConfig } from './data/prices.js';

const root = document.getElementById('admin');
let token = sessionStorage.getItem('tbc-admin') || '';
let live = false;
const $ = (s) => root.querySelector(s);

async function init() {
  live = await fetch('api/prices', { cache: 'no-store' }).then((r) => r.ok).catch(() => false);
  await loadConfig();
  render();
}

function status(msg, kind = '') {
  const el = $('.status');
  if (el) { el.textContent = msg; el.dataset.kind = kind; }
}

function login() {
  root.innerHTML = `<form class="login card">
    <h1 style="font-size:1.75rem;margin-bottom:16px">Staff sign in</h1>
    ${live ? '' : '<p class="muted" style="margin-bottom:16px">The price server is not running here, so changes cannot be saved from this page. You can still prepare a prices file.</p>'}
    <label class="field">Password<input type="password" name="pw" autocomplete="current-password" required></label>
    <button class="btn btn--primary" type="submit" style="width:100%">Sign in</button>
    <p class="status" role="status" style="margin-top:12px"></p></form>`;
  $('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const r = await fetch('api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: e.target.pw.value }) });
      if (!r.ok) return status('Wrong password', 'error');
      token = (await r.json()).token;
      sessionStorage.setItem('tbc-admin', token);
      render();
    } catch { status('Could not reach the server', 'error'); }
  });
}

const val = (p) => (p == null ? '' : p);
function editor() {
  const cfg = defaultConfig();
  const live_ = (id) => cfg.products[id];
  root.innerHTML = `
  <div class="admin__top"><div><h1 style="font-size:1.75rem">Prices and delivery</h1></div>
    <div><a class="btn btn--ghost" href="index.html">View site</a><button class="btn btn--ghost" type="button" data-logout>Sign out</button></div></div>
  <section class="card"><h2>WhatsApp number</h2>
    <p class="muted">Every order from the site is sent to this number. Use the country code, digits only, like 254712345678.</p>
    <label class="field">Number<input id="wa" inputmode="numeric" value="${cfg.whatsapp}"></label></section>
  ${categories.map((c) => `<section class="card"><h2>${c.label}</h2>${products.filter((p) => p.category === c.id).map((p) => `
    <div class="arow" data-id="${p.id}"><div><b>${p.name}</b><small>${p.spec}</small></div>
      <label><span class="muted" style="font-size:12px">KES per ${p.unit}</span><input type="number" min="0" step="1" placeholder="On request" value="${val(live_(p.id).price)}" data-price></label>
      <label class="sw"><input type="checkbox" data-avail ${live_(p.id).available ? 'checked' : ''}>In stock</label></div>`).join('')}</section>`).join('')}
  <section class="card"><h2>Delivery fee per trip</h2>${zones.map((z) => `
    <div class="arow" data-zone="${z.id}"><div><b>${z.name}</b></div>
      <label><span class="muted" style="font-size:12px">KES per trip</span><input type="number" min="0" step="1" placeholder="On request" value="${val(cfg.zones[z.id].fee)}" data-fee></label><span></span></div>`).join('')}</section>
  <div class="bar"><button class="btn btn--primary" type="button" data-save ${live ? '' : 'disabled'}>Save changes</button>
    <button class="btn btn--ghost" type="button" data-download>Download prices.json</button><span class="status" role="status"></span></div>`;

  const read = () => {
    const num = (v) => (v === '' ? null : Math.max(0, Math.round(Number(v))));
    return {
      whatsapp: $('#wa').value.replace(/\D/g, ''),
      products: Object.fromEntries([...root.querySelectorAll('[data-id]')].map((r) => [r.dataset.id, { price: num(r.querySelector('[data-price]').value), available: r.querySelector('[data-avail]').checked }])),
      zones: Object.fromEntries([...root.querySelectorAll('[data-zone]')].map((r) => [r.dataset.zone, { fee: num(r.querySelector('[data-fee]').value) }])),
    };
  };
  $('[data-logout]').addEventListener('click', () => { token = ''; sessionStorage.removeItem('tbc-admin'); render(); });
  $('[data-download]').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(read(), null, 2)], { type: 'application/json' }));
    a.download = 'prices.json';
    a.click();
  });
  $('[data-save]').addEventListener('click', async () => {
    const data = read();
    if (data.whatsapp.length < 9) return status('Enter a valid WhatsApp number', 'error');
    try {
      const r = await fetch('api/prices', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
      if (r.status === 401) { token = ''; sessionStorage.removeItem('tbc-admin'); return render(); }
      status(r.ok ? 'Saved. The site shows the new prices now' : 'Could not save', r.ok ? '' : 'error');
    } catch { status('Could not reach the server', 'error'); }
  });
}

function render() { if (live && !token) login(); else if (!live && !token) login(); else editor(); }
init();
