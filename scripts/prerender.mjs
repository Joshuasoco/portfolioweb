import { readFile, writeFile } from 'node:fs/promises'
import { createServer, loadEnv } from 'vite'
import { createCrawlerFiles } from './seo.mjs'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
  const template = await readFile('dist/index.html', 'utf8')
  const html = template.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`)
  if (html === template) throw new Error('Could not find the root element to prerender.')
  await writeFile('dist/index.html', html)
  const env = loadEnv('production', process.cwd(), '')
  const files = createCrawlerFiles(env.SITE_URL)
  if (!files['sitemap.xml']) {
    console.warn('[SEO] Set SITE_URL or src/site.js url to generate the canonical URL and sitemap.xml before deploying.')
  }
  for (const [name, content] of Object.entries(files)) {
    await writeFile(`dist/${name}`, content)
  }
  console.log('Prerendered the complete portfolio into dist/index.html.')
} finally {
  await server.close()
}
