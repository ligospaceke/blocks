import { products } from '../data/products.js';
import { vehicles, zones } from '../data/vehicles.js';
import { waLink } from '../data/business.js';
import { icon, photo } from './ui.js';

const names = (cat) => products.filter((p) => p.category === cat).map((p) => `<li>${p.name}</li>`).join('');
const yard = [
  ['assets/images/yard-pile.jpg', 'A heap of grey blocks beside a boundary wall'],
  ['assets/images/yard-stone.jpg', 'Cut blocks piled in a store'],
  ['assets/images/solid.jpg', 'Rows of blocks stacked on sandy ground'],
];

export const Departments = () => `
<section id="departments" class="section">
  <div class="container">
    <div class="section__head" data-reveal>
      <h2>What we supply</h2>
      <p class="muted">Three departments, one yard. Order from any of them in a single request.</p>
    </div>
    <div class="depts" data-stagger>
      <article class="dept"><h3>Blocks and cabro</h3>
        <p class="muted">Concrete blocks and paving cabro, made on site.</p>
        <ul>${names('blocks')}${names('cabro')}</ul>
        <button class="btn btn--ghost" type="button" data-open-catalog="blocks">See blocks and cabro</button></article>
      <article class="dept"><h3>Sand supply</h3>
        <p class="muted">Sand sold by the truck load, for every stage of the build.</p>
        <ul>${names('sand')}</ul>
        <button class="btn btn--ghost" type="button" data-open-catalog="sand">See sand</button></article>
      <article class="dept"><h3>Delivery</h3>
        <p class="muted">Our own tippers and canters take your order to the gate.</p>
        <ul>${vehicles.map((v) => `<li>${v.name}</li>`).join('')}</ul>
        <a class="btn btn--ghost" href="#fleet">See the trucks</a></article>
    </div>
    <div class="yard" data-stagger>${yard.map(([s, a]) => photo(s, a)).join('')}</div>
  </div>
</section>
<section id="fleet" class="section" style="padding-top:0">
  <div class="container">
    <div class="section__head" data-reveal>
      <h2>Our trucks and where they go</h2>
      <p class="muted">Pick the truck that suits your order and your access road. We confirm the delivery fee on WhatsApp.</p>
    </div>
    <div class="fleet" data-stagger>${vehicles.map((v) => `
      <article class="vehicle">${photo(v.image, v.alt)}
        <div class="vehicle__body">
          <h3>${v.name}</h3><p class="muted">${v.blurb}</p><p class="vehicle__role">${v.role}</p>
          <a class="btn btn--ghost" href="${waLink(`Hello, I’d like to ask about the ${v.name} for a delivery.`)}" target="_blank" rel="noopener">${icon('whatsapp')}Ask about this truck</a>
        </div>
      </article>`).join('')}
    </div>
    <ul class="zones" aria-label="Delivery areas" data-reveal>${zones.map((z) => `<li>${icon('location')}${z.name}${z.fee != null ? ` <small>KES ${z.fee.toLocaleString('en-KE')} per trip</small>` : ''}</li>`).join('')}</ul>
  </div>
</section>`;
