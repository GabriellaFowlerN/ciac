# Ciac Static Site (scaffold)

Lightweight static website scaffold for Ciac (Tigernut instant milk) inspired by JapriFoods layout.

To view locally, open `CIAC Website/index.html` in a browser. The site is fully client-side and stores cart & reviews in `localStorage` (simulated ecommerce). Prices and currency use AED (Dirhams).


The hero banner image included: `assets/ciac foods.jpeg`.

Product image filenames (place your product photos here):
- `assets/product 1.jpeg` — Ciac Unsweetened product image
- `assets/product 2.jpeg` — Ciac Naturally Sweetened product image

If those files are not present the site will fall back to `assets/product-placeholder.svg`.

Files:
- index.html — main site
- styles.css — styles
- script.js — dynamic behavior (cart, reviews, modals)
- assets/ — placeholder images

Notes:
- This is a static, self-hosted prototype. For production you can connect a backend, payment gateway, or migrate to Shopify.
