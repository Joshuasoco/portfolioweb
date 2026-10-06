import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // uiarc's Avatar imports next/image; this is a plain <img> stand-in.
      'next/image': fileURLToPath(
        new URL('./src/shims/next-image.jsx', import.meta.url),
      ),
    },
  },
})
