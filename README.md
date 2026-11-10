# The Builder’s Collection

Zero-dependency site: HTML, CSS and native ES modules. No build step.

## Run it
ES modules do not load from file://, so serve the folder:
    python3 -m http.server 8080
Then open http://localhost:8080

## What the owner edits
- js/data/business.js: WhatsApp number, phone, location (replace the sample number)
- js/data/products.js: names, specs, prices (null shows "Price on request")
- js/data/vehicles.js: truck capacities (sample numbers), delivery areas and fees
- assets/images/: real photos (see README.txt there)
- css/variables.css: all colours and fonts, light and dark
