// Names, specs and photos live here. Prices are managed from admin.html (stored in data/prices.json).
// image: null shows no photo. Add a file to assets/images and point to it here.
export const categories = [
  { id: 'blocks', label: 'Blocks' },
  { id: 'cabro', label: 'Cabro' },
  { id: 'sand', label: 'Sand' },
];
export const products = [
  { id: 'hollow-6', category: 'blocks', name: 'Hollow block, 6 inch', spec: '6 in wall, 9 × 18 in face', use: 'Load-bearing and outer walls', unit: 'piece', price: null, available: true, image: null },
  { id: 'hollow-4', category: 'blocks', name: 'Hollow block, 4 inch', spec: '4 in wall, 9 × 18 in face', use: 'Partition walls', unit: 'piece', price: null, available: true, image: null },
  { id: 'solid', category: 'blocks', name: 'Solid concrete block', spec: 'Full concrete, no voids', use: 'Foundations and retaining walls', unit: 'piece', price: null, available: true, image: 'assets/images/solid.jpg' },
  { id: 'cabro-60', category: 'cabro', name: 'Interlocking cabro, 60 mm', spec: '200 × 100 mm, 60 mm thick', use: 'Walkways and car parking', unit: 'piece', price: null, available: true, image: null },
  { id: 'cabro-80', category: 'cabro', name: 'Interlocking cabro, 80 mm', spec: '200 × 100 mm, 80 mm thick', use: 'Driveways and heavier traffic', unit: 'piece', price: null, available: true, image: null },
  { id: 'sand-building', category: 'sand', name: 'Building sand', spec: 'Sold by the truck load', use: 'Mortar and general building', unit: 'load', price: null, available: true, image: null },
  { id: 'sand-river', category: 'sand', name: 'River sand', spec: 'Sold by the truck load', use: 'Concrete mixes and screeds', unit: 'load', price: null, available: true, image: null },
  { id: 'sand-plaster', category: 'sand', name: 'Plastering sand', spec: 'Sold by the truck load', use: 'Smooth plaster and finishing', unit: 'load', price: null, available: true, image: null },
];
export const byId = Object.fromEntries(products.map((p) => [p.id, p]));
export const formatPrice = (p) => (p == null ? 'Price on request' : `KES ${p.toLocaleString('en-KE')}`);
export const priceLine = (p) => (p.price == null ? 'Price on request' : `${formatPrice(p.price)} per ${p.unit}`);
