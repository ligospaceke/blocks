# The Builder’s Collection

HTML, CSS and native ES modules. No build step, no packages.

## Run it
    ADMIN_PASSWORD=choose-a-strong-password node server.js
Open http://localhost:8080 for the site and http://localhost:8080/admin.html for the admin panel.
Needs Node 18 or newer. Without ADMIN_PASSWORD, a temporary one is printed in the terminal.

## Admin panel
Sign in at /admin.html to set the WhatsApp number, each product price, in-stock status and delivery fee per trip.
Changes are saved to data/prices.json and appear on the site straight away.
Customers never see the admin password. Only prices, stock and fees can be changed from the panel.

If you host on plain static hosting (no Node), the site reads data/prices.json directly.
Use "Download prices.json" in the panel and upload the file to data/ to publish changes.

## Orders
Every checkout builds a WhatsApp message (items, truck, delivery area, notes, totals when prices are set) and opens WhatsApp to the number in the admin panel.

## Other edits
- js/data/products.js: names, specs, photos
- js/data/vehicles.js: trucks, capacities (sample numbers), delivery areas
- assets/images/: photos
- css/variables.css: colours and fonts, light and dark
