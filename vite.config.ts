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
 
  resolve: {
    alias: {
      // ...
      "simple-peer": "simple-peer/simplepeer.min.js",
    },
  },
})
