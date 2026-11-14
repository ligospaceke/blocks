import { Topo } from './Topo.js';
import { Areas } from './Departments.js';

const chapters = [
  { t: 'Made at the yard', p: 'Blocks and cabro are made on site in Kajiado South. Sand is stocked at the same yard, ready to load.', img: 'assets/images/yard-pile.jpg', alt: 'A heap of grey blocks beside a boundary wall' },
  { t: 'Loaded on our own trucks', p: 'Your order goes onto our tippers and canters, matched to the size of the job and the road to your site.', img: 'assets/images/fuso-canter.jpg', alt: 'A canter truck loaded with stacked blocks' },
  { t: 'Tipped at your gate', p: 'We deliver across Kimana, Rombo, Loitokitok and Entonet and tip the load where you need it.', img: 'assets/images/hero.jpg', alt: 'A tipper truck tipping a load of grey blocks onto the ground', areas: true },
];

export const Story = () => `
<section class="story" id="story-start" data-io>
  ${Topo(true)}
  <div class="container story__grid">
    <div class="chapters">${chapters.map((c, i) => `
      <article class="chapter" data-i="${i}"><h2>${c.t}</h2><p>${c.p}</p>${c.areas ? Areas() : ''}
        <figure class="chapter__fig ph"><img src="${c.img}" alt="${c.alt}" loading="lazy"></figure></article>`).join('')}
    </div>
    <div class="stage">${chapters.map((c, i) => `<img src="${c.img}" alt="${c.alt}" data-i="${i}" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>
  </div>
</section>`;

export function mountStory(root) {
  const items = [...root.querySelectorAll('.chapter')];
  const imgs = [...root.querySelectorAll('.stage img')];
  const set = (i) => { items.forEach((c, k) => c.classList.toggle('is-active', k === i)); imgs.forEach((m, k) => m.classList.toggle('is-on', k === i)); };
  set(0);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(Number(e.target.dataset.i)); }), { rootMargin: '-42% 0px -42% 0px' });
  items.forEach((c) => io.observe(c));
  return [() => io.disconnect()];
}
