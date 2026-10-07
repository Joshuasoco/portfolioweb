import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')

test('the HTML response contains the portfolio without running JavaScript', () => {
  assert.match(html, /<h1[^>]*>Joshua Co<\/h1>/)
  for (const id of ['work', 'skills', 'certifications', 'contact', 'clak', 'msme-pathways']) {
    assert.match(html, new RegExp(`id="${id}"`))
  }
  assert.match(html, /https:\/\/github.com\/Joshuasoco/)
  assert.match(html, /mailto:joshuasoyco@gmail.com/)
})

test('the initial HTML explains the profile to search engines and sharing crawlers', () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(match, 'JSON-LD must be in the original HTML')
  const schema = JSON.parse(match[1])
  const page = schema['@graph'].find((item) => item['@type'] === 'ProfilePage')
  const person = schema['@graph'].find((item) => item['@type'] === 'Person')
  assert.ok(page.mainEntity['@id'])
  assert.equal(page.mainEntity['@id'], person['@id'])
  assert.equal(person.name, 'Joshua Co')
  assert.ok(person.sameAs.includes('https://github.com/Joshuasoco'))
  assert.match(html, /name="twitter:card" content="summary_large_image"/)
  assert.match(html, /property="og:image"/)
})

test('the portrait is prioritized and project images have responsive sources', () => {
  const portrait = html.match(/<img[^>]+alt="Portrait of Joshua Co"[^>]*>/)?.[0]
  assert.ok(portrait)
  assert.match(portrait, /loading="eager"/)
  assert.match(portrait, /fetchPriority="high"/i)
  assert.match(portrait, /width="800"/)
  const screenshot = html.match(/<img[^>]+alt="Clak screenshot"[^>]*>/)?.[0]
  assert.ok(screenshot)
  assert.match(screenshot, /loading="lazy"/)
  assert.match(screenshot, /srcSet="[^"]+480w[^"]+960w[^"]+1440w"/i)
})

test('all optimized image references resolve to files in the deployment', async () => {
  const imagePaths = [...new Set(html.match(/\/images\/[a-z0-9/-]+\.webp/g))]
  assert.ok(imagePaths.length >= 12, 'responsive image variants must be in the prerendered HTML')
  for (const path of imagePaths) {
    assert.ok((await readFile(new URL(`../dist${path}`, import.meta.url))).length > 0)
  }
  assert.ok((await readFile(new URL('../dist/social-preview.jpg', import.meta.url))).length > 0)
})
