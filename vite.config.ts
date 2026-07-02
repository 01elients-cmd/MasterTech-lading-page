import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // Enable minification with esbuild (faster) or terser (smaller)
      minify: 'esbuild',
      // Increase chunk size limit warning threshold
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Manual chunk splitting for optimal browser caching
          manualChunks: {
            // Core React runtime — rarely changes
            'vendor-react': ['react', 'react-dom'],
            // Animation library — large, separate chunk
            'vendor-motion': ['motion'],
            // Icons — separate so app bundle stays small
            'vendor-icons': ['lucide-react'],
          },
          // Ensure assets get hashed filenames for cache busting
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
