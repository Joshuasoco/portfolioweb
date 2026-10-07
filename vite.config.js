import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createSeoHead } from './scripts/seo.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), {
      name: 'portfolio-seo',
      transformIndexHtml(html) {
        return html.replace('<!--seo-head-->', () => createSeoHead(env.SITE_URL, env.GOOGLE_SITE_VERIFICATION))
      },
    }],
  }
})
