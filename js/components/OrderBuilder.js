import { products, categories, byId, priceLine } from '../data/products.js';
import { vehicles, zones } from '../data/vehicles.js';
import { waLink } from '../data/business.js';
import { icon, tweenText } from './ui.js';

const STEP = { blocks: 50, cabro: 50, sand: 1 };
const unit = (p, q) => (p.unit === 'load' ? (q === 1 ? 'load' : 'loads') : q === 1 ? 'piece' : 'pieces');
const kes = (n) => `KES ${n.toLocaleString('en-KE')}`;

// Turns the current order into lines, a trip estimate, totals and the WhatsApp message.
export function summarise(state) {
  const v = vehicles.find((x) => x.id === state.vehicle) || vehicles[0];
  const z = zones.find((x) => x.id === state.zone) || zones[0];
  const lines = Object.entries(state.items).map(([id, q]) => ({ p: byId[id], q })).filter((l) => l.p && l.q > 0 && l.p.available !== false);
  let trips = 0;
  for (const c of categories) {
    const qty = lines.filter((l) => l.p.category === c.id).reduce((s, l) => s + l.q, 0);
    if (qty) trips += Math.ceil(qty / (v.capacity[c.id] || 1));
  }
  const materials = lines.length && lines.every((l) => l.p.price != null) ? lines.reduce((s, l) => s + l.p.price * l.q, 0) : null;
  const delivery = z.fee != null ? z.fee * trips : null;
  const total = materials != null && delivery != null ? materials + delivery : null;
  const text = [
    'Hello The Builder’s Collection, I’d like to order:', '',
    ...lines.map((l) => `- ${l.p.name}: ${l.q} ${unit(l.p, l.q)}`), '',
    `Truck: ${v.name} (about ${trips} ${trips === 1 ? 'trip' : 'trips'})`,
    `Deliver to: ${z.name}`,
    ...(state.note.trim() ? [`Notes: ${state.note.trim()}`] : []),
    ...(materials != null ? [`Materials: ${kes(materials)}`] : []),
    ...(delivery != null ? [`Delivery: ${kes(delivery)}`] : []),
    ...(total != null ? [`Total: ${kes(total)}`] : []),
  ].join('\n');
  return { v, z, lines, trips, materials, delivery, total, text };
}

const row = (p, q) => {
  const off = p.available === false;
  return `
<div class="row" data-id="${p.id}">
  <div class="row__info"><b>${p.name}</b><small>${p.spec}</small><small>${off ? 'Out of stock' : `${priceLine(p)}`}</small></div>
  <div class="stepper" role="group" aria-label="Quantity for ${p.name}">
    <button type="button" data-step="-" aria-label="Fewer ${p.name}" ${off ? 'disabled' : ''}>−</button>
    <input type="number" min="0" inputmode="numeric" value="${off ? 0 : q}" aria-label="${p.name} quantity" ${off ? 'disabled' : ''}>
    <button type="button" data-step="+" aria-label="More ${p.name}" ${off ? 'disabled' : ''}>+</button>
  </div>
</div>`;
};

export const OrderBuilder = (state) => `
<section id="build" class="section build">
  <div class="container">
    <div class="section__head" data-reveal>
      <h2>Build your order</h2>
      <p class="muted">Choose your materials, pick a truck and a delivery area. We write the WhatsApp message for you.</p>
    </div>
    <div class="build__grid">
      <div data-reveal>
        <fieldset class="step"><legend><span class="step__n">1</span>Materials</legend>
          ${categories.map((c) => `<p class="group">${c.label}</p>${products.filter((p) => p.category === c.id).map((p) => row(p, state.items[p.id] || 0)).join('')}`).join('')}
        </fieldset>
        <fieldset class="step"><legend><span class="step__n">2</span>Truck and delivery</legend>
          <div class="vehicles">${vehicles.map((v) => `<label class="choice"><input type="radio" name="vehicle" value="${v.id}" ${v.id === state.vehicle ? 'checked' : ''}><b>${v.name}</b><small>${v.role}</small></label>`).join('')}</div>
          <label class="field">Delivery area<select id="zone">${zones.map((z) => `<option value="${z.id}" ${z.id === state.zone ? 'selected' : ''}>${z.name}</option>`).join('')}</select></label>
          <label class="field">Notes for the driver (optional)<textarea id="note" placeholder="Landmark, gate colour, preferred day"></textarea></label>
        </fieldset>
      </div>
      <aside class="manifest" aria-live="polite" data-reveal style="--i:1">
        <h3><span class="step__n">3</span>Check and send</h3>
        <div id="manifest-body"></div>
        <a id="send" class="btn btn--primary" href="#" target="_blank" rel="noopener">${icon('whatsapp')}Send order on WhatsApp</a>
      </aside>
    </div>
  </div>
</section>`;

export function mountOrderBuilder(root, store) {
  const $ = (s) => root.querySelector(s);
  $('#note').value = store.state.note;

  const refresh = () => {
    root.querySelectorAll('.row').forEach((r) => {
      const input = r.querySelector('input');
      if (document.activeElement !== input && !input.disabled) input.value = store.state.items[r.dataset.id] || 0;
    });
    const s = summarise(store.state);
    const body = $('#manifest-body');
    if (s.lines.length) {
      const meta = [`<span>${s.v.name}, about ${s.trips} ${s.trips === 1 ? 'trip' : 'trips'}</span>`, `<span>Deliver to ${s.z.name}</span>`];
      meta.push(s.materials != null ? `<span>Materials ${kes(s.materials)}</span>` : '<span>Materials priced on WhatsApp</span>');
      meta.push(s.delivery != null ? `<span>Delivery ${kes(s.delivery)}</span>` : '<span>Delivery fee confirmed on WhatsApp</span>');
      body.innerHTML = `<ul>${s.lines.map((l) => `<li><span>${l.p.name}</span><span>${l.q} ${unit(l.p, l.q)}</span></li>`).join('')}</ul>
        <div class="manifest__meta">${meta.join('')}${s.total != null ? '<span class="manifest__total" data-total></span>' : ''}</div><pre></pre>`;
      body.querySelector('pre').textContent = s.text;
      const t = body.querySelector('[data-total]');
      if (t) tweenText(t, s.total, kes);
    } else {
      body.innerHTML = '<p class="manifest__empty">Nothing added yet. Add materials and your order appears here.</p>';
    }
    const send = $('#send');
    send.setAttribute('aria-disabled', s.lines.length ? 'false' : 'true');
    send.href = s.lines.length ? waLink(s.text) : '#';
  };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('#build [data-step]');
    if (!b) return;
    const id = b.closest('[data-id]').dataset.id;
    const cur = store.state.items[id] || 0;
    const step = STEP[byId[id].category];
    store.setQty(id, cur + (b.dataset.step === '+' ? step : -step));
  });
  root.addEventListener('change', (e) => {
    if (!e.target.closest('#build')) return;
    if (e.target.matches('.stepper input')) store.setQty(e.target.closest('[data-id]').dataset.id, e.target.value);
    if (e.target.name === 'vehicle') store.set({ vehicle: e.target.value });
    if (e.target.id === 'zone') store.set({ zone: e.target.value });
  });
  $('#note').addEventListener('input', (e) => store.set({ note: e.target.value }));
  $('#send').addEventListener('click', (e) => { if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  store.subscribe(refresh);
  refresh();
}
