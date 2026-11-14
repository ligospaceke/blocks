import { brickMark, icon } from './ui.js';
export const Navbar = () => `
<header class="nav">
  <div class="container nav__bar">
    <a class="brand" href="#/">${brickMark()}<span class="brand__name">The Builder’s Collection</span></a>
    <nav class="nav__links" aria-label="Main">
      <a href="#/" data-route="">Home and gallery</a>
      <a href="#/about" data-route="about">About and catalogue</a>
      <a href="#/contact" data-route="contact">Contact</a>
    </nav>
    <div class="nav__tools">
      <button class="theme" type="button" aria-label="Dark mode" aria-pressed="true"><span class="theme__track"><span class="theme__knob"></span></span></button>
      <a class="btn btn--primary nav__cta" href="#/about/order">${icon('whatsapp')}Your order <span class="count" data-count hidden>0</span></a>
    </div>
  </div>
</header>`;

export function setActive(route) {
  document.querySelectorAll('.nav__links a').forEach((a) => (a.dataset.route === route ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
}

export function mountNavbar(root, store) {
  const btn = root.querySelector('.theme');
  const count = root.querySelector('[data-count]');
  const sync = () => btn.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'dark');
  btn.addEventListener('click', async () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('tbc-theme', next); } catch {} sync(); };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    await vt.ready;
    document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' });
  });
  const update = () => { const n = Object.keys(store.state.items).length; count.textContent = n; count.hidden = n === 0; };
  sync(); update();
  store.subscribe(update);
}
