# MAH Diamonds website

First production-quality implementation of the MAH Diamonds digital experience, built with Next.js 16 and designed for deployment on Coolify.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Coolify deployment

Use the included `Dockerfile`. The application listens on port `3000` and the production image runs Next.js standalone output as an unprivileged user.

Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS origin when the production domain is confirmed.

## Content and integration status

- The approved MAH palette and seven-category primary navigation are implemented.
- Sections 05A through 20 have coherent frontend route foundations.
- Search, account, wishlist, bag and appointment booking remain utilities rather than primary navigation.
- The two photographs in `public/images` are original generated concept assets for review, not reference-PDF imagery and not representations of an MAH workshop or owned inventory.
- Catalogue, diamond feed, pricing, stock, CMS, enquiry, calendar, payment, tax, fulfilment and verification integrations require confirmed providers and data.
- Legal policies, operational promises, contact details and locations are intentionally not invented.

## Principal routes

`/engagement-rings`, `/wedding-rings`, `/diamonds`, `/jewellery`, `/bespoke`, `/atelier`, `/our-house`, `/journal`, `/expert`, `/appointments`, `/contact`, `/bag`, `/checkout`, `/verification`, `/confirmation`.
