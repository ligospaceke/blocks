import { vehicles, zones } from './data/vehicles.js';
import { Navbar, mountNavbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { Departments } from './components/Departments.js';
import { OrderBuilder, mountOrderBuilder } from './components/OrderBuilder.js';
import { CatalogModal, mountCatalog } from './components/CatalogModal.js';
import { Footer } from './components/Footer.js';

// One small store shared by every component. The order survives page reloads.
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

const app = document.getElementById('app');
app.innerHTML = Navbar() + `<main id="main" tabindex="-1">${Hero()}${Departments()}${OrderBuilder(store.state)}</main>` + Footer() + CatalogModal();
mountNavbar(app, store);
mountOrderBuilder(app, store);
mountCatalog(app, store);

// Loader: first visit only, shown for at least 1.3 seconds.
const loader = document.getElementById('loader');
if (document.documentElement.classList.contains('seen')) {
  loader.remove();
} else {
  Promise.all([new Promise((r) => setTimeout(r, 1300)), document.fonts && document.fonts.ready]).then(() => {
    loader.classList.add('loader--out');
    setTimeout(() => loader.remove(), 500);
    try { sessionStorage.setItem('tbc-seen', '1'); } catch {}
  });
}
