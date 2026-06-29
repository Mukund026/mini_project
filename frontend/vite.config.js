import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [nodePolyfills()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    exclude: ['@truffle/hdwallet-provider'],
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5000',
    }
  }

});
