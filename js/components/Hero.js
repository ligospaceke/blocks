import { icon } from './ui.js';
export const Hero = () => `
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__copy">
      <h1 data-reveal style="--i:0">Blocks, cabro and sand, delivered to your site</h1>
      <p data-reveal style="--i:1">We make our blocks and load our sand in Kajiado South, then tip them at your gate in Kimana, Rombo, Loitokitok and Entonet.</p>
      <div class="hero__actions" data-reveal style="--i:2">
        <a class="btn btn--primary" href="#build">${icon('whatsapp')}Build your order</a>
        <button class="btn btn--ghost" type="button" data-open-catalog="all">Browse products</button>
      </div>
    </div>
    <figure class="hero__visual ph" data-reveal style="--i:2"><img src="assets/images/hero.jpg" alt="A tipper truck tipping a load of grey blocks onto the ground" width="500" height="667" fetchpriority="high"></figure>
  </div>
</section>`;
