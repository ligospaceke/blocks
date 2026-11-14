import { products, priceLine } from '../data/products.js';
import { photo } from './ui.js';

const TABS = [{ id: 'all', label: 'All products' }, { id: 'blocks', label: 'Blocks' }, { id: 'cabro', label: 'Cabro' }, { id: 'sand', label: 'Sand' }];
const STEP = { blocks: 50, cabro: 50, sand: 1 };

export const Catalogue = () => `
<section class="section" id="catalogue">
  <div class="container">
    <div class="section__head" data-reveal><h2>Catalogue</h2><p class="muted">Add what you need. Your order collects below, ready to send on WhatsApp.</p></div>
    <div class="tabs" role="tablist" aria-label="Product categories">${TABS.map((t) => `<button class="tab" role="tab" type="button" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
    <div class="pgrid" id="catalogue-list"></div>
  </div>
</section>`;

export function mountCatalogue(root, store) {
  const list = root.querySelector('#catalogue-list');
  let cat = 'all';
  const card = (p) => {
    const q = store.state.items[p.id] || 0;
    const ctl = p.available === false
      ? '<p class="stock">Out of stock</p>'
      : q
        ? `<div class="stepper" role="group" aria-label="Quantity for ${p.name}"><button type="button" data-step="-" aria-label="Fewer ${p.name}">−</button><input type="number" min="0" inputmode="numeric" value="${q}" aria-label="${p.name} quantity"><button type="button" data-step="+" aria-label="More ${p.name}">+</button></div>`
        : '<button class="btn btn--ghost" type="button" data-step="+">Add to order</button>';
    return `<article class="pcard" data-id="${p.id}">${photo(p.image, p.name)}<div class="pcard__body"><h3>${p.name}</h3><p class="pcard__spec">${p.spec}</p><p class="pcard__use">${p.use}</p><p class="pcard__price">${priceLine(p)}</p>${ctl}</div></article>`;
  };
  const render = () => {
    root.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === cat));
    list.innerHTML = products.filter((p) => cat === 'all' || p.category === cat).map(card).join('');
  };
  const section = root.querySelector('#catalogue');
  section.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { cat = tab.dataset.tab; return render(); }
    const b = e.target.closest('[data-step]');
    if (b) {
      const id = b.closest('[data-id]').dataset.id;
      const p = products.find((x) => x.id === id);
      store.setQty(id, (store.state.items[id] || 0) + (b.dataset.step === '+' ? STEP[p.category] : -STEP[p.category]));
    }
  });
  section.addEventListener('change', (e) => { if (e.target.matches('.stepper input')) store.setQty(e.target.closest('[data-id]').dataset.id, e.target.value); });
  render();
  return [store.subscribe(() => { if (document.activeElement?.tagName !== 'INPUT') render(); })];
}
