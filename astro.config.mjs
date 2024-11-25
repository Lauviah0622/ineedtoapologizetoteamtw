// @ts-check
import { defineConfig } from 'astro/config';
import path from "path";


import react from '@astrojs/react';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react()],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },

  adapter: vercel(),
});