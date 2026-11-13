export const icon = (name) => `<span class="icon icon--${name}" aria-hidden="true"></span>`;
// A photo frame. Returns nothing when there is no photo, and removes itself if the file is missing.
export const photo = (src, alt) => (src ? `<figure class="ph"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.parentNode.remove()"></figure>` : '');
export const brickMark = () => '<svg viewBox="0 0 24 20" aria-hidden="true" fill="currentColor"><rect x="0" y="0" width="11" height="5" rx="1"/><rect x="13" y="0" width="11" height="5" rx="1"/><rect x="6.5" y="7.5" width="11" height="5" rx="1" fill="#E07A2F"/><rect x="0" y="15" width="11" height="5" rx="1"/><rect x="13" y="15" width="11" height="5" rx="1"/></svg>';
// Animates a changing figure instead of swapping it.
export function tweenText(el, to, fmt) {
  const from = el._v ?? to;
  el._v = to;
  if (from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 360);
    el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
    if (k < 1 && el._v === to) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
