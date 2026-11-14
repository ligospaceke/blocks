import { products } from '../data/products.js';
import { vehicles, zones } from '../data/vehicles.js';
import { waLink } from '../data/business.js';
import { icon, photo } from './ui.js';

const names = (cat) => products.filter((p) => p.category === cat).map((p) => `<li>${p.name}</li>`).join('');

export const Areas = () => `<ul class="areas" aria-label="Delivery areas">${zones.map((z) => `<li>${icon('location')}${z.name}${z.fee != null ? ` <small>KES ${z.fee.toLocaleString('en-KE')} per trip</small>` : ''}</li>`).join('')}</ul>`;

export const Pillars = () => `
<div class="pillars" data-stagger>
  <article class="pillar"><h3>Blocks and cabro</h3><p class="muted">Concrete blocks and paving cabro, made on site.</p><ul>${names('blocks')}${names('cabro')}</ul></article>
  <article class="pillar"><h3>Sand supply</h3><p class="muted">Sand sold by the truck load, for every stage of the build.</p><ul>${names('sand')}</ul></article>
  <article class="pillar"><h3>Delivery</h3><p class="muted">Our own tippers and canters take your order to the gate.</p><ul>${vehicles.map((v) => `<li>${v.name}</li>`).join('')}</ul></article>
</div>`;

export const Fleet = () => `
<div class="fleet" data-stagger>${vehicles.map((v) => `
  <article class="vehicle">${photo(v.image, v.alt)}
    <div class="vehicle__body"><h3>${v.name}</h3><p class="muted">${v.blurb}</p><p class="vehicle__role">${v.role}</p>
      <a class="btn btn--ghost" href="${waLink(`Hello, I’d like to ask about the ${v.name} for a delivery.`)}" target="_blank" rel="noopener">${icon('whatsapp')}Ask about this truck</a></div>
  </article>`).join('')}
</div>`;
