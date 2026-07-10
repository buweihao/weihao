// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sanity from '@sanity/astro';

const sanityProjectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const sanityDataset = process.env.PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? 'production';
const sanityApiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? '2026-07-03';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE ?? 'https://example.com',
  integrations: [
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
