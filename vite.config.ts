import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'non-blocking-css',
        enforce: 'post' as const,
        transformIndexHtml(html: string) {
          return html.replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
            '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
          );
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});