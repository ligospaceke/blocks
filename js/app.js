import { vehicles, zones } from './data/vehicles.js';
import { products } from './data/products.js';
import { loadConfig } from './data/prices.js';
import { Navbar, mountNavbar, setActive } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import * as Home from './pages/Home.js';
import * as About from './pages/About.js';
import * as Contact from './pages/Contact.js';

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
  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn); },
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

const routes = { '': Home, about: About, contact: Contact };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
const curtain = document.getElementById('curtain');
let main, current = null, cleanup = [];

// Entrances: each block rises and fades once as it comes into view.
function reveal() {
  document.querySelectorAll('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => { c.setAttribute('data-reveal', ''); c.style.setProperty('--i', Math.min(i, 5)); }));
  const els = document.querySelectorAll('[data-reveal],[data-io]');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
  cleanup.push(() => io.disconnect());
  setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 5000);
}

async function cover() {
  curtain.style.transition = 'none';
  curtain.style.transform = 'translateY(100%)';
  curtain.getBoundingClientRect();
  curtain.style.transition = 'transform .45s var(--ease-cine)';
  curtain.style.transform = 'translateY(0)';
  await wait(470);
}
async function uncover(ms = 700) {
  curtain.style.transition = `transform ${ms}ms var(--ease-cine)`;
  curtain.style.transform = 'translateY(-100%)';
  await wait(ms + 20);
}
function toAnchor(anchor, behavior) {
  const el = anchor && document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior });
}

async function navigate(first = false) {
  const [seg = '', anchor = ''] = location.hash.replace(/^#\/?/, '').split('/');
  const page = routes[seg] ? seg : '';
  if (!first && page === current) return toAnchor(anchor, 'smooth');
  if (!first) await cover();
  cleanup.forEach((f) => f()); cleanup = [];
  const P = routes[page];
  main.innerHTML = P.render(store);
  document.title = P.title;
  cleanup = [...(P.mount(main, store) || [])];
  setActive(page);
  current = page;
  window.scrollTo({ top: 0, behavior: 'instant' });
  toAnchor(anchor, 'instant');
  setTimeout(reveal, first ? 450 : 300);
  await uncover(first ? 900 : 650);
  if (first) curtain.classList.remove('curtain--boot');
}

async function start() {
  const boot = new Promise((r) => setTimeout(r, reduce ? 0 : 1900));
  await loadConfig();
  Object.keys(store.state.items).filter((id) => products.find((p) => p.id === id)?.available === false).forEach((id) => store.setQty(id, 0));
  const app = document.getElementById('app');
  app.innerHTML = Navbar() + '<main id="main" tabindex="-1"></main>' + Footer();
  main = document.getElementById('main');
  mountNavbar(app, store);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-scroll]');
    if (a) { e.preventDefault(); document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth' }); }
  });
  window.addEventListener('hashchange', () => navigate());
  await Promise.all([boot, document.fonts && document.fonts.ready]);
  await navigate(true);
}
start();
