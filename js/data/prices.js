import { products } from './products.js';
import { zones } from './vehicles.js';
import { business } from './business.js';

export const defaultConfig = () => ({
  whatsapp: business.whatsapp,
  products: Object.fromEntries(products.map((p) => [p.id, { price: p.price, available: p.available !== false }])),
  zones: Object.fromEntries(zones.map((z) => [z.id, { fee: z.fee }])),
});

export function applyConfig(cfg) {
  if (cfg.whatsapp) business.whatsapp = String(cfg.whatsapp);
  for (const p of products) {
    const c = cfg.products && cfg.products[p.id];
    if (c) { p.price = c.price == null ? null : Number(c.price); p.available = c.available !== false; }
  }
  for (const z of zones) {
    const c = cfg.zones && cfg.zones[z.id];
    if (c) z.fee = c.fee == null ? null : Number(c.fee);
  }
}

// Live prices come from the server API; on plain static hosting the site reads data/prices.json.
export async function loadConfig() {
  for (const url of ['api/prices', 'data/prices.json']) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (r.ok) { const cfg = await r.json(); applyConfig(cfg); return cfg; }
    } catch {}
  }
  return null;
}
