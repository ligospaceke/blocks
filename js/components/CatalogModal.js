import { products, formatPrice } from '../data/products.js';
import { icon, photo } from './ui.js';

const TABS = [{ id: 'all', label: 'All products' }, { id: 'blocks', label: 'Blocks' }, { id: 'cabro', label: 'Cabro' }, { id: 'sand', label: 'Sand' }];
const STEP = { blocks: 50, cabro: 50, sand: 1 };

export const CatalogModal = () => `
<dialog id="catalog" class="catalog" aria-labelledby="catalog-title">
  <div class="catalog__head"><h2 id="catalog-title">Products</h2>
    <button class="catalog__close" type="button" data-close aria-label="Close products">${icon('close')}</button></div>
  <div class="tabs" role="tablist" aria-label="Product categories">
    ${TABS.map((t) => `<button class="tab" role="tab" type="button" data-tab="${t.id}">${t.label}</button>`).join('')}
  </div>
  <div class="catalog__body"><div class="pgrid" id="catalog-list"></div></div>
  <div class="catalog__foot"><span class="muted" data-summary></span>
    <button class="btn btn--primary" type="button" data-goto-build>Go to your order</button></div>
</dialog>`;

export function mountCatalog(root, store) {
  const dlg = root.querySelector('#catalog');
  const list = dlg.querySelector('#catalog-list');
  const summary = dlg.querySelector('[data-summary]');
  let cat = 'all';

  const card = (p) => {
    const q = store.state.items[p.id] || 0;
    const ctl = q
      ? `<div class="stepper" role="group" aria-label="Quantity for ${p.name}"><button type="button" data-step="-" aria-label="Fewer ${p.name}">−</button><input type="number" min="0" inputmode="numeric" value="${q}" aria-label="${p.name} quantity"><button type="button" data-step="+" aria-label="More ${p.name}">+</button></div>`
      : `<button class="btn btn--ghost" type="button" data-step="+">Add to order</button>`;
    return `<article class="pcard" data-id="${p.id}">${photo(p.image, p.name, p.category)}
      <div class="pcard__body"><h3>${p.name}</h3><p class="pcard__spec">${p.spec}</p><p class="pcard__use">${p.use}</p>
      <p class="pcard__price">${formatPrice(p.price)} per ${p.unit}</p>${ctl}</div></article>`;
  };
  const render = () => {
    dlg.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === cat));
    list.innerHTML = products.filter((p) => cat === 'all' || p.category === cat).map(card).join('');
    const n = Object.keys(store.state.items).length;
    summary.textContent = n ? `${n} ${n === 1 ? 'item' : 'items'} in your order` : 'Nothing in your order yet';
  };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open-catalog]');
    if (!t) return;
    cat = t.dataset.openCatalog || 'all';
    render();
    dlg.showModal();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-close]')) return dlg.close();
    const tab = e.target.closest('[data-tab]');
    if (tab) { cat = tab.dataset.tab; return render(); }
    if (e.target.closest('[data-goto-build]')) {
      dlg.close();
      return document.getElementById('build').scrollIntoView();
    }
    const b = e.target.closest('[data-step]');
    if (b) {
      const id = b.closest('[data-id]').dataset.id;
      const p = products.find((x) => x.id === id);
      const cur = store.state.items[id] || 0;
      store.setQty(id, cur + (b.dataset.step === '+' ? STEP[p.category] : -STEP[p.category]));
    }
  });
  dlg.addEventListener('change', (e) => {
    if (e.target.matches('.stepper input')) store.setQty(e.target.closest('[data-id]').dataset.id, e.target.value);
  });
  store.subscribe(() => { if (dlg.open && !dlg.contains(document.activeElement?.matches('input') ? document.activeElement : null)) render(); });
}
