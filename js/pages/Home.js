import { Hero } from '../components/Hero.js';
import { Story, mountStory } from '../components/Story.js';
import { Gallery, mountGallery } from '../components/Gallery.js';
import { Topo } from '../components/Topo.js';

export const title = 'The Builder’s Collection | Blocks, cabro and sand in Kajiado South';
export const render = () => `
${Hero()}${Story()}${Gallery()}
<section class="closer container" data-io>${Topo()}
  <h2 data-reveal>Planning a build? Tell us what you need.</h2>
  <p class="muted" data-reveal style="--i:1;max-width:44ch">Browse the catalogue, build your order and send it on WhatsApp, or write to us if you want to talk it through.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap" data-reveal style="--i:2"><a class="btn btn--primary" href="#/about/catalogue">Browse the catalogue</a><a class="btn btn--ghost" href="#/contact">Contact us</a></div>
</section>`;
export function mount(root) {
  mountGallery(root);
  return mountStory(root);
}
