import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
  ],
server: {
    proxy: {
      '/api': {
        target: 'https://vivoldi.com',
        changeOrigin: true,


      },
    },
  },
});
