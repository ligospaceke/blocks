import { gallery } from '../data/gallery.js';
import { icon } from './ui.js';

export const Gallery = () => `
<section class="gallery" id="gallery">
  <div class="container gallery__head">
    <div class="section__head" style="margin:0" data-reveal><h2>Gallery</h2><p class="muted">Stock, trucks and deliveries from the yard.</p></div>
    <div class="gallery__nav"><button type="button" data-g="-1" aria-label="Scroll gallery back">←</button><button type="button" data-g="1" aria-label="Scroll gallery forward">→</button></div>
  </div>
  <div class="track" tabindex="0" aria-label="Photo gallery">${gallery.map((g, i) => `<button class="shot" type="button" data-i="${i}" style="aspect-ratio:${g.w}/${g.h}" aria-label="Open photo: ${g.alt}"><img src="${g.src}" alt="" loading="lazy"></button>`).join('')}</div>
  <dialog class="lightbox" aria-label="Photo viewer"><img alt=""><div class="lightbox__bar"><span data-cap></span>
    <div><button type="button" data-l="-1" aria-label="Previous photo">←</button><button type="button" data-l="1" aria-label="Next photo">→</button><button type="button" data-lclose aria-label="Close">${icon('close')}</button></div></div></dialog>
</section>`;

export function mountGallery(root) {
  const track = root.querySelector('.track');
  const dlg = root.querySelector('.lightbox');
  let i = 0;
  const show = (n) => { i = (n + gallery.length) % gallery.length; const g = gallery[i]; const im = dlg.querySelector('img'); im.src = g.src; im.alt = g.alt; dlg.querySelector('[data-cap]').textContent = g.alt; };
  root.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: Number(b.dataset.g) * track.clientWidth * 0.7, behavior: 'smooth' })));
  track.addEventListener('click', (e) => { const s = e.target.closest('.shot'); if (s) { show(Number(s.dataset.i)); dlg.showModal(); } });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-lclose]')) return dlg.close();
    const n = e.target.closest('[data-l]'); if (n) show(i + Number(n.dataset.l));
  });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
}
