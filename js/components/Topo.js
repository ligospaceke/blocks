import { TOPO } from '../data/topo.js';
// Stylised terrain contour lines. draw=true makes the lines trace themselves in once.
export const Topo = (draw = false) => `<svg class="topo${draw ? ' topo--draw' : ''}" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${TOPO.map((d, i) => `<path d="${d}" pathLength="1" style="--k:${i}"/>`).join('')}</svg>`;
