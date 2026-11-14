import { categories, byId, priceLine } from '../data/products.js';
import { vehicles, zones } from '../data/vehicles.js';
import { waLink } from '../data/business.js';
import { icon, tweenText } from './ui.js';

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

export const OrderBuilder = (state) => `
<section id="order" class="section build">
  <div class="container">
    <div class="section__head" data-reveal>
      <h2>Your order</h2>
      <p class="muted">Pick a truck and a delivery area. We write the WhatsApp message for you.</p>
    </div>
    <div class="build__grid">
      <div data-reveal>
        <fieldset class="step"><legend>Truck and delivery</legend>
          <div class="vehicles">${vehicles.map((v) => `<label class="choice"><input type="radio" name="vehicle" value="${v.id}" ${v.id === state.vehicle ? 'checked' : ''}><b>${v.name}</b><small>${v.role}</small></label>`).join('')}</div>
          <label class="field">Delivery area<select id="zone">${zones.map((z) => `<option value="${z.id}" ${z.id === state.zone ? 'selected' : ''}>${z.name}</option>`).join('')}</select></label>
          <label class="field">Notes for the driver (optional)<textarea id="note" placeholder="Landmark, gate colour, preferred day"></textarea></label>
        </fieldset>
      </div>
      <aside class="manifest" aria-live="polite" data-reveal style="--i:1">
        <h3>Check and send</h3>
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
      body.innerHTML = '<p class="manifest__empty">Nothing added yet. <a href="#/about/catalogue">Add materials from the catalogue</a> and your order appears here.</p>';
    }
    const send = $('#send');
    send.setAttribute('aria-disabled', s.lines.length ? 'false' : 'true');
    send.href = s.lines.length ? waLink(s.text) : '#';
  };

  root.addEventListener('change', (e) => {
    if (!e.target.closest('#order')) return;
    if (e.target.name === 'vehicle') store.set({ vehicle: e.target.value });
    if (e.target.id === 'zone') store.set({ zone: e.target.value });
  });
  $('#note').addEventListener('input', (e) => store.set({ note: e.target.value }));
  $('#send').addEventListener('click', (e) => { if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  const off = store.subscribe(refresh);
  refresh();
  return [off];
}
