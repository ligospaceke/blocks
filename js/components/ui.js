export const icon = (name) => `<span class="icon" style="--icon:url(assets/icons/${name}.svg)" aria-hidden="true"></span>`;
// Photo frame: shows the real image if it exists, otherwise the material-coloured fallback.
export const photo = (src, alt, cat) => `<div class="ph" data-cat="${cat}"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()"></div>`;
