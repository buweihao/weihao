# Astro B2B Sanity Showcase Template

A reusable mother template for bilingual B2B product showcase and inquiry websites. It combines Astro, Tailwind CSS, an embedded Sanity Studio, Cloudflare Pages Functions, and static local-content fallbacks.

## Included

- English and Chinese path-prefixed routes
- remembered language switcher and localized metadata
- product listing, filtering, detail, cart preview, favorites, blog, about, and contact pages
- responsive product detail layout with category/new-product sidebar
- non-blocking floating inquiry panel and configured quick-contact links
- email inquiry endpoint for Cloudflare Pages and Resend
- embedded Sanity Studio at `/admin`
- Sanity schemas for localized products and site settings
- editable announcement rotation, homepage carousel, global contact details, and social links
- local sample products and settings when Sanity is not configured
- image URLs that preserve complete product artwork without forced cropping
- Search Console-ready sitemap, robots rules, and configurable verification meta tag
- optional Umami analytics with automatic page views and shared conversion events
- automatic WhatsApp click events without page-by-page instrumentation
- first/last-touch attribution, referrer, UTM, locale, product, and inquiry ID in contact emails

## Start locally

```bash
npm ci
cp .env.example .env
npm run dev
```

The public site works without Sanity and uses local fallback content. To enable `/admin` and live CMS content, fill in the public Sanity values in `.env`.

## Environment variables

```dotenv
SITE=https://example.com
PUBLIC_GOOGLE_SITE_VERIFICATION=
PUBLIC_UMAMI_WEBSITE_ID=
PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-07-03
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
CONTACT_TO_EMAIL=sales@example.com
CONTACT_FROM_EMAIL="Example Brand <noreply@example.com>"
RESEND_API_KEY=
```

`PUBLIC_SANITY_PROJECT_ID`, dataset, and API version are public configuration. Never commit Sanity write tokens, Resend keys, deploy hooks, GitHub tokens, or Cloudflare tokens.

Search Console domain ownership is verified once per production domain, normally with a DNS TXT record. The optional HTML verification value above supports URL-prefix verification. Umami remains disabled until `PUBLIC_UMAMI_WEBSITE_ID` is configured.

## Build

```bash
npm run build
```

Cloudflare Pages settings:

- Build command: `npm run build`
- Output directory: `dist`
- Package manager: npm
- Recommended npm version: `10.9.2`

## Use with b2b-site-launcher

Copy `project.example.json`, replace its placeholder values, and use this repository URL as `templateUrl`. The launcher should create a new Sanity project for each customer site when `sanity.mode` is `auto-create`, then inject that public project ID into the generated project configuration.

Do not add a real Sanity project ID to this mother template. Generated customer repositories may use a public project ID fallback after project creation.

## Content model

Products use a single document with localized fields (`nameI18n`, `descriptionI18n`, and related fields). Images, slug, order, price, specifications, and operational fields remain shared across languages.

Site settings include brand information, logo, contact details, social links, homepage carousel slides, and an ordered array of bilingual top announcements.

## Inquiry setup

The included `/api/contact` Pages Function validates inquiries and can send notifications through Resend. Configure `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and `RESEND_API_KEY` in Cloudflare Pages. Verify the sender domain before testing production email delivery.

The shared form automatically includes first/last landing pages, referrers, UTM parameters, page language, product interest, country, and timestamps. The global analytics layer records successful inquiry submissions and WhatsApp clicks without per-page code.

## Publishing CMS changes

Astro output is static. Configure a Cloudflare Pages Deploy Hook and a Sanity outgoing webhook for published `atelierProduct` and `siteSettings` changes so CMS updates trigger a rebuild.
