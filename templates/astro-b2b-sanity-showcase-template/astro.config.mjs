// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const sanityProjectId = env.PUBLIC_SANITY_PROJECT_ID ?? env.SANITY_STUDIO_PROJECT_ID;
const sanityDataset = env.PUBLIC_SANITY_DATASET ?? env.SANITY_STUDIO_DATASET ?? 'production';
const sanityApiVersion = env.PUBLIC_SANITY_API_VERSION ?? '2026-07-03';

// https://astro.build/config
export default defineConfig({
  site: env.SITE ?? 'https://example.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
    ...(sanityProjectId
      ? [
          sanity({
            projectId: sanityProjectId,
            dataset: sanityDataset,
            apiVersion: sanityApiVersion,
            useCdn: false,
            studioBasePath: '/admin',
          }),
        ]
      : []),
    react(),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
