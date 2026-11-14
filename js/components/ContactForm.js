import { zones } from '../data/vehicles.js';
import { business, waLink } from '../data/business.js';
import { icon } from './ui.js';

const topics = ['A quote for materials', 'Delivery question', 'Something else'];

export const ContactForm = () => `
<form class="cform" novalidate>
  <div class="row2">
    <label class="field">Your name<input name="name" autocomplete="name" required aria-describedby="e-name"><span class="field__err" id="e-name"></span></label>
    <label class="field">Phone (optional)<input name="phone" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="e-phone"><span class="field__err" id="e-phone"></span></label>
  </div>
  <div class="row2">
    <label class="field">Delivery area<select name="area">${zones.map((z) => `<option>${z.name}</option>`).join('')}</select></label>
    <label class="field">What is it about<select name="topic">${topics.map((t) => `<option>${t}</option>`).join('')}</select></label>
  </div>
  <label class="field">Message<textarea name="message" required aria-describedby="e-message"></textarea><span class="field__err" id="e-message"></span></label>
  <button class="btn btn--primary" type="submit">${icon('whatsapp')}Send on WhatsApp</button>
  <p class="cform__status" role="status"></p>
</form>`;

export function mountContactForm(root) {
  const form = root.querySelector('.cform');
  const status = form.querySelector('.cform__status');
  const err = (name, msg) => {
    const f = form.elements[name];
    form.querySelector(`#e-${name}`).textContent = msg;
    msg ? f.setAttribute('aria-invalid', 'true') : f.removeAttribute('aria-invalid');
    return !msg;
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const ok = [
      err('name', d.name.trim() ? '' : 'Please tell us your name'),
      err('phone', !d.phone.trim() || d.phone.replace(/\D/g, '').length >= 9 ? '' : 'Check the phone number'),
      err('message', d.message.trim() ? '' : 'Please write a short message'),
    ];
    if (ok.includes(false)) { status.textContent = ''; return form.querySelector('[aria-invalid="true"]').focus(); }
    const text = [`Hello ${business.name},`, '', `Name: ${d.name.trim()}`, ...(d.phone.trim() ? [`Phone: ${d.phone.trim()}`] : []), `Area: ${d.area}`, `About: ${d.topic}`, '', d.message.trim()].join('\n');
    const url = waLink(text);
    window.open(url, '_blank', 'noopener');
    status.innerHTML = `WhatsApp should be opening with your message. If it did not, <a href="${url}" target="_blank" rel="noopener">open it here</a>.`;
    form.reset();
  });
}
