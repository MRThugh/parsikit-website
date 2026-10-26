import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const ghRepo = process.env.GITHUB_REPOSITORY;
  const ghRepoBase = ghRepo ? `/${ghRepo.split('/')[1]}` : undefined;
  const rawBase = process.env.BASE_PATH || process.env.VITE_BASE_PATH || ghRepoBase || '/';
  const cleanBase = rawBase.trim();
  const normalizedBase = cleanBase.endsWith('/') ? cleanBase : `${cleanBase}/`;
  const cleanBasePath = cleanBase === '/' ? '' : cleanBase.replace(/\/+$/, '');

  return {
    base: normalizedBase,
    define: {
      'process.env.BASE_PATH': JSON.stringify(cleanBasePath),
      'process.env.VITE_BASE_PATH': JSON.stringify(cleanBasePath),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('src/data/docsManifest')) {
              return 'data-docs';
            }
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
