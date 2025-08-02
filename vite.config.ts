import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: '0.0.0.0', // Bind to all IPv4 interfaces safely (not "::")
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost', // Don't use external IPv6 host
      port: 8080,
      clientPort: 8080,
    },
    allowedHosts: [
      '40569afc-2265-4f8d-91d9-12353c695c88.lovableproject.com',
      '*.lovableproject.com',
      '*.lovable.app',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
}));
