import { vehicles, zones } from './data/vehicles.js';
import { products } from './data/products.js';
import { loadConfig } from './data/prices.js';
import { Navbar, mountNavbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { Departments } from './components/Departments.js';
import { OrderBuilder, mountOrderBuilder } from './components/OrderBuilder.js';
import { CatalogModal, mountCatalog } from './components/CatalogModal.js';
import { Footer } from './components/Footer.js';

const KEY = 'tbc-order';
const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const store = {
  state: {
    items: saved.items || {},
    vehicle: vehicles.some((v) => v.id === saved.vehicle) ? saved.vehicle : vehicles[0].id,
    zone: zones.some((z) => z.id === saved.zone) ? saved.zone : zones[0].id,
    note: saved.note || '',
  },
  subs: new Set(),
  subscribe(fn) { this.subs.add(fn); },
  set(patch) {
    Object.assign(this.state, patch);
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch {}
    this.subs.forEach((fn) => fn(this.state));
  },
  setQty(id, qty) {
    const q = Math.max(0, Math.min(99999, Math.round(Number(qty) || 0)));
    const items = { ...this.state.items };
    if (q) items[id] = q; else delete items[id];
    this.set({ items });
  },
};

// Entrances: each block rises a few pixels and fades in once as it comes into view.
function reveal() {
  document.querySelectorAll('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => { c.setAttribute('data-reveal', ''); c.style.setProperty('--i', Math.min(i, 5)); }));
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
  setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 4000);
}

async function start() {
  await loadConfig(); // live prices and delivery fees from the admin panel
  const gone = Object.keys(store.state.items).filter((id) => products.find((p) => p.id === id)?.available === false);
  gone.forEach((id) => store.setQty(id, 0));

  const app = document.getElementById('app');
  app.innerHTML = Navbar() + `<main id="main" tabindex="-1">${Hero()}${Departments()}${OrderBuilder(store.state)}</main>` + Footer() + CatalogModal();
  mountNavbar(app, store);
  mountOrderBuilder(app, store);
  mountCatalog(app, store);

  const loader = document.getElementById('loader');
  if (document.documentElement.classList.contains('seen')) { loader.remove(); reveal(); return; }
  await Promise.all([new Promise((r) => setTimeout(r, 1000)), document.fonts && document.fonts.ready]);
  loader.classList.add('loader--out');
  reveal();
  setTimeout(() => loader.remove(), 500);
  try { sessionStorage.setItem('tbc-seen', '1'); } catch {}
}
start();
