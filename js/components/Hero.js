import { icon } from './ui.js';
import { Topo } from './Topo.js';
export const Hero = () => `
<section class="hero" data-io>
  ${Topo(true)}
  <div class="hero__copy">
    <h1><span class="line" style="--i:0"><span>Blocks, cabro and sand,</span></span><span class="line" style="--i:1"><span>delivered to your site</span></span></h1>
    <p data-reveal style="--i:4">We make our blocks and load our sand in Kajiado South, then tip them at your gate in Kimana, Rombo, Loitokitok and Entonet.</p>
    <div class="hero__actions" data-reveal style="--i:5">
      <a class="btn btn--primary" href="#/about/catalogue">${icon('whatsapp')}Order materials</a>
      <a class="btn btn--ghost" href="#story-start" data-scroll>See how it works</a>
    </div>
  </div>
  <figure class="hero__visual"><img src="assets/images/hero.jpg" alt="A tipper truck tipping a load of grey blocks onto the ground" width="500" height="667" fetchpriority="high"></figure>
</section>`;
