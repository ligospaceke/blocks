# The Builder’s Collection

HTML, CSS and native ES modules. No build step, no packages.

## Pages
- Home and gallery (#/): cinematic hero, scroll story, photo gallery with viewer
- About and catalogue (#/about): who we are, trucks, catalogue, order builder (#/about/catalogue, #/about/order)
- Contact (#/contact): form that opens WhatsApp, and a map

## Run it
    ADMIN_PASSWORD=choose-a-strong-password node server.js
Open http://localhost:8080 for the site and http://localhost:8080/admin.html for the admin panel.
Needs Node 18 or newer. Without ADMIN_PASSWORD, a temporary one is printed in the terminal.

## Admin panel
Sign in at /admin.html to set the WhatsApp number, each product price, in-stock status and delivery fee per trip.
Changes are saved to data/prices.json and appear on the site straight away.
On plain static hosting (no Node) the site reads data/prices.json directly: use "Download prices.json" in the panel and upload the file to data/.

## Orders and messages
The order builder and the contact form both build a WhatsApp message and open WhatsApp to the number set in the admin panel.

## What to edit
- js/data/business.js: phone, location, and mapQuery (set it to the exact yard so the map pins it)
- js/data/products.js: names, specs, photos
- js/data/vehicles.js: trucks, capacities (sample numbers), delivery areas
- js/data/gallery.js: gallery photos
- assets/images/: photos
- css/variables.css: colours and fonts, dark and light
