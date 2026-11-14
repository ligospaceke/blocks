import { Topo } from '../components/Topo.js';
import { Pillars, Fleet, Areas } from '../components/Departments.js';
import { Catalogue, mountCatalogue } from '../components/Catalogue.js';
import { OrderBuilder, mountOrderBuilder } from '../components/OrderBuilder.js';

export const title = 'About and catalogue | The Builder’s Collection';
export const render = (store) => `
<section class="intro" id="about" data-io>${Topo(true)}
  <div class="container"><div class="intro__copy">
    <h1><span class="line" style="--i:0"><span>Made at one yard,</span></span><span class="line" style="--i:1"><span>delivered by our own trucks</span></span></h1>
    <p data-reveal style="--i:3">The Builder’s Collection makes concrete blocks and cabro, supplies river, plastering and building sand, and delivers it all by tipper and canter across Kajiado South.</p>
    ${Areas()}
  </div></div>
</section>
<section class="section" style="padding-top:0"><div class="container">
  <div class="section__head" data-reveal><h2>What we do</h2></div>${Pillars()}</div></section>
<section class="section" style="padding-top:0" id="fleet"><div class="container">
  <div class="section__head" data-reveal><h2>The trucks</h2><p class="muted">Pick the truck that suits your order and your access road. We confirm the delivery fee on WhatsApp.</p></div>${Fleet()}</div></section>
${Catalogue()}
${OrderBuilder(store.state)}`;
export function mount(root, store) {
  return [...mountCatalogue(root, store), ...mountOrderBuilder(root, store)];
}
