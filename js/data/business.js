// EDIT: put the owner's real WhatsApp number (country code, no + or spaces).
export const business = {
  name: 'The Builder’s Collection',
  whatsapp: '254700000000',
  phoneDisplay: '+254 700 000 000',
  location: 'Kajiado South, Kenya',
};
export const waLink = (text) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
