import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills}  from 'vite-plugin-node-polyfills'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    nodePolyfills({
      exclude: [] // Include all polyfills
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Create separate chunks for each library
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      // ...
      "simple-peer": "simple-peer/simplepeer.min.js",
    },
  },
})
