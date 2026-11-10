import { icon } from './ui.js';
export const Hero = () => `
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__copy">
      <h1>Blocks, cabro and sand, delivered to your site.</h1>
      <p>We make our blocks and load our sand in Kajiado South, then tip it at your gate in Kimana, Rombo, Loitokitok and Entonet.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#build">${icon('whatsapp')}Build your order</a>
        <button class="btn btn--ghost" type="button" data-open-catalog="all">Browse products</button>
      </div>
    </div>
    <div class="hero__visual" role="img" aria-label="Layers of stone, sand and earth">
      <img src="assets/images/hero.jpg" alt="" onerror="this.remove()">
      <span class="hero__caption">Loaded at our yard in Kajiado South</span>
    </div>
  </div>
</section>`;
