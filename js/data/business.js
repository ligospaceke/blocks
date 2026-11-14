// The WhatsApp number can be changed from the admin panel (data/prices.json); this is the fallback.
// mapQuery: set this to the exact yard (a place name, address or Google Plus Code) so the map pins it.
export const business = {
  name: 'The Builder’s Collection',
  whatsapp: '254700000000',
  phoneDisplay: '+254 700 000 000',
  location: 'Kajiado South, Kenya',
  mapQuery: 'Kimana, Kajiado County, Kenya',
};
export const waLink = (text) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
