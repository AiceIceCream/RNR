# RNR OnlineShop — High-Performance Sportswear

Official online storefront for **RNR OnlineShop**, featuring aerodynamic cycling kits, moisture-wicking Dri-FIT performance apparel, and compression layers.

## Features

- **Editorial Homepage**: Lulus-inspired split hero featuring high-performance cycling models (Bike 1 & Bike 2) with interactive pose switcher and signature lookbook showcase.
- **20 Unique Sportswear Products**: Sourced from Photocards catalog with independent pricing, specifications, multi-color variation swatches, and size availability.
- **Verified Customer Reviews**: Review system with star ratings and name/email verification.
- **Mobile-Optimized & Adaptive**: Ergonomic bottom sheets, 2-column mobile catalog layout, horizontal category pills, and floating quick-bag drawer.
- **Order Tracking Portal**: Customer zero-knowledge order tracking using Order ID (`RNR-SPT-XXXXXX`) or RNT Express waybill (`RNT-XXXXXXXX`).
- **Admin Operations Hub**:
  - Protected admin login (`admin` / `admin12345`).
  - Real-time stock management and color variation configurator.
  - Device photo and multi-image uploads.
  - Payment verification & receipt dispatch.
  - RNT Express waybill generator and tracking dispatch.
  - Gmail EmailJS integration settings and live test sandbox.

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Anti-Slop / Industrial Atelier design system)
- **Email Delivery**: [@emailjs/browser](https://www.emailjs.com/)
- **Testing**: [Playwright](https://playwright.dev/) End-to-End Suite

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run Playwright test suite
npx playwright test

# Build production bundle
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub: `https://github.com/AiceIceCream/RNR.git`
2. Go to [vercel.com/new](https://vercel.com/new) and select the `RNR` repository.
3. Framework Preset will auto-detect as **Vite**.
4. (Optional) Add Environment Variables from `.env.example`:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_RECEIPT_TEMPLATE_ID`
   - `VITE_EMAILJS_DISPATCH_TEMPLATE_ID`
5. Click **Deploy**.
