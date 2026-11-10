import { business, waLink } from '../data/business.js';
import { zones } from '../data/vehicles.js';
import { icon } from './ui.js';
export const Footer = () => `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div><h3>${business.name}</h3><p>Blocks, cabro, sand and delivery from ${business.location}.</p></div>
      <div><h3>Order</h3><ul>
        <li><a href="${waLink('Hello, I’d like to place an order.')}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp us</a></li>
        <li>${business.phoneDisplay}</li></ul></div>
      <div><h3>Where we deliver</h3><ul>${zones.filter((z) => z.id !== 'other').map((z) => `<li>${z.name}</li>`).join('')}</ul></div>
    </div>
    <p class="footer__legal">© ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
  </div>
</footer>`;
