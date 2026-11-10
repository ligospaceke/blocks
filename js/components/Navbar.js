export const Navbar = () => `
<header class="nav">
  <div class="container nav__bar">
    <a class="brand" href="#top"><span class="brand__mark" aria-hidden="true"></span><span class="brand__name">The Builder’s Collection</span></a>
    <nav class="nav__links" aria-label="Main">
      <a href="#departments">What we supply</a>
      <a href="#fleet">Transport</a>
      <a href="#build">Build your order</a>
    </nav>
    <div class="nav__tools">
      <button class="theme" type="button" aria-label="Dark mode" aria-pressed="false"><span class="theme__track"><span class="theme__knob"></span></span></button>
      <a class="btn btn--primary" href="#build">Your order <span class="count" data-count hidden>0</span></a>
    </div>
  </div>
</header>`;

export function mountNavbar(root, store) {
  const btn = root.querySelector('.theme');
  const count = root.querySelector('[data-count]');
  const sync = () => btn.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'dark');
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('tbc-theme', next); } catch {}
    sync();
  });
  const update = () => {
    const n = Object.keys(store.state.items).length;
    count.textContent = n;
    count.hidden = n === 0;
  };
  sync(); update();
  store.subscribe(update);
}
