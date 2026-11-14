import { Topo } from '../components/Topo.js';
import { ContactForm, mountContactForm } from '../components/ContactForm.js';
import { business, waLink } from '../data/business.js';
import { icon } from '../components/ui.js';

export const title = 'Contact | The Builder’s Collection';
const q = encodeURIComponent(business.mapQuery);
export const render = () => `
<section class="contact" id="contact" data-io>${Topo(true)}
  <div class="container">
    <div class="contact__head"><h1><span class="line" style="--i:0"><span>Write to us, or</span></span><span class="line" style="--i:1"><span>come and see the yard</span></span></h1>
      <p data-reveal style="--i:3">Send your message and it opens in WhatsApp, so you get a reply where you already chat.</p></div>
    <div class="contact__grid">
      <div data-reveal style="--i:4">${ContactForm()}
        <div class="ways"><a href="${waLink('Hello, I’d like to place an order.')}" target="_blank" rel="noopener">${icon('whatsapp')}Chat on WhatsApp</a>
          <span>${business.phoneDisplay}</span><span>${icon('location')} ${business.location}</span></div></div>
      <div class="map" data-reveal style="--i:5"><div class="map__frame"><iframe title="Map of ${business.mapQuery}" src="https://www.google.com/maps?q=${q}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
        <a class="map__link" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Open in Google Maps</a></div>
    </div>
  </div>
</section>`;
export function mount(root) { mountContactForm(root); return []; }
