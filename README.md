# astro-b2b-ecommerce-inquiry-template

E-commerce inquiry mother template built with **Astro 5**, **React 19**, **Tailwind CSS 4**, optional **Sanity Studio**, and **Resend** contact handling. Designed for speed, SEO, and specific aesthetic appeal, featuring a fully functional shopping cart, favorites system, product details, blog, and more.

![astroEcommers](https://github.com/user-attachments/assets/dff02a23-5c09-4737-85a5-60d00fea14af)


## ✨ Features

- **⚡ Blazing Fast**: Built on top of Astro's next-gen island architecture.
- **🎨 Modern Design**: Styled with Tailwind CSS 4 and DaisyUI 5 for a premium look and feel.
- **🛒 Shopping Cart**: Fully functional cart with persistent state using Nanostores.
- **❤️ Whishlist/Favorites**: Save your favorite items with persistent local storage.
- **📦 Product Catalog**: Dynamic product listing with category filtering.
- **🧩 Sanity-ready catalog**: Optional embedded Sanity Studio at `/admin` with local product data fallback.
- **✉️ Resend inquiry endpoint**: Cloudflare Pages Function at `/api/contact` for contact and product inquiries.
- **📝 Blog Section**: Integrated blog for content marketing and SEO.
- **📱 Fully Responsive**: Mobile-first design that looks great on all devices.
- **🔍 Search**: Instant product search functionality.
- **� Checkout UI**: polished checkout page interface.
- **🔔 Notifications**: Toast notifications for user interactions (Sonner).
- **🖼️ Carousels**: Interactive product sliders using Swiper.

## 🛠️ Tech Stack

- **Framework**: [Astro 5.0](https://astro.build/)
- **UI Integrations**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores)
- **CMS**: [Sanity](https://www.sanity.io/) via `@sanity/astro`
- **Email**: Resend REST API through Cloudflare Pages Functions
- **Icons**: [Iconify](https://iconify.design/) (Lucide & MDI)
- **Animations**: CSS Transitions & Micro-interactions

## 📂 Project Structure

```text
/
├── public/           # Static assets
├── src/
│   ├── assets/       # Optimized images and assets
│   ├── components/   # Reusable UI components
│   │   ├── cart/     # Cart related components
│   │   ├── checkout/ # Checkout flow components
│   │   ├── home/     # Homepage sections
│   │   ├── navbar/   # Navigation bar
│   │   ├── products/ # Product displays
│   │   └── ui/       # Generic UI elements (buttons, inputs)
│   ├── data/         # Mock data (products, static content)
│   ├── layouts/      # Astro layouts (Base, etc.)
│   ├── pages/        # File-based routing
│   │   ├── category/ # Dynamic category pages
│   │   ├── product/  # Dynamic product details
│   │   └── ...       # Other static pages (About, Contact)
│   ├── store/        # Global state (Cart, Favorites)
│   └── styles/       # Global styles
└── astro.config.mjs  # Astro configuration
```

## Mother Template Notes

This template is prepared for the `b2b-site-launcher` skill. It keeps the original storefront UI, cart, favorites, checkout UI, categories, product details, contact page, and blog while adding optional B2B launch capabilities.

Sanity is optional. When `PUBLIC_SANITY_PROJECT_ID` is empty, the site builds from `src/data/products.ts`. When a Sanity project is configured, catalog routes use documents of type `atelierProduct` and fall back safely if the CMS is unavailable.

Key integration files:

- `sanity.config.ts` and `sanity.cli.ts`
- `sanity/schemaTypes/*`
- `src/lib/sanity.ts`
- `src/data/catalog.ts`
- `functions/api/contact.js`
- `.env.example`

Sanity document types intended for launcher/webhook filters:

```groq
_type in ["atelierProduct", "category", "aboutPage", "aboutRecommendation", "aboutImageGallery", "aboutCompanyCarousel", "siteSettings"] && !(_id in path("drafts.**"))
```

### Dynamic product categories

Product categories are managed as independent `category` documents in Sanity. Each category supports English and Chinese names, a stable URL slug, cover image, sort order, and an active/hidden switch. Products link to categories through the `productType` reference field. Homepage categories, navigation menus, product filters, and product-detail sidebars all use the same Sanity category query. The six local category definitions are only a build-safe fallback when Sanity is unavailable or contains no category documents.

For Cloudflare Pages, set:

```text
PUBLIC_SANITY_PROJECT_ID=<project-id>
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-07-03
CONTACT_TO_EMAIL=sales@example.com
CONTACT_FROM_EMAIL="Brand <noreply@send.example.com>"
RESEND_API_KEY=<secret>
```

`RESEND_API_KEY` must be configured as a secret in Cloudflare Pages. Do not commit real API keys or deploy hook URLs.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/buweihao/astro-b2b-ecommerce-inquiry-template.git
   cd astro-b2b-ecommerce-inquiry-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🧞 Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run sanity:dev` | Starts Sanity Studio locally when Sanity env vars are configured |
