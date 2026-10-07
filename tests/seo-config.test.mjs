import assert from 'node:assert/strict'
import test from 'node:test'
import { createCrawlerFiles, createSeoHead, getSiteUrl } from '../scripts/seo.mjs'

test('canonical, sharing URLs, and sitemap use the same normalized origin', () => {
  const head = createSeoHead('https://portfolio.example')
  const files = createCrawlerFiles('https://portfolio.example')
  assert.match(head, /rel="canonical" href="https:\/\/portfolio\.example\/"/)
  assert.match(head, /property="og:url" content="https:\/\/portfolio\.example\/"/)
  assert.match(head, /property="og:image" content="https:\/\/portfolio\.example\/social-preview\.jpg"/)
  assert.equal(files['robots.txt'], 'User-agent: *\nAllow: /\n\nSitemap: https://portfolio.example/sitemap.xml\n')
  assert.match(files['sitemap.xml'], /<loc>https:\/\/portfolio\.example\/<\/loc>/)
  assert.equal((files['sitemap.xml'].match(/<url>/g) ?? []).length, 1)
})

test('invalid deployment origins fail instead of publishing incorrect canonical URLs', () => {
  for (const value of ['invalid', 'http://portfolio.example', 'https://portfolio.example/work',
    'https://portfolio.example/#work', 'https://portfolio.example/?preview=1',
    'https://user:password@portfolio.example']) {
    assert.throws(() => getSiteUrl(value), /HTTPS origin/)
  }
})

test('an unconfigured domain never publishes an invented canonical URL or sitemap', () => {
  const head = createSeoHead('')
  const files = createCrawlerFiles('')
  assert.doesNotMatch(head, /rel="canonical"/)
  assert.equal(files['sitemap.xml'], undefined)
  assert.doesNotMatch(files['robots.txt'], /Sitemap:/)
  assert.match(head, /name="robots" content="index, follow/)
})

test('Search Console verification is optional and HTML escaped', () => {
  assert.doesNotMatch(createSeoHead('https://portfolio.example'), /google-site-verification/)
  const head = createSeoHead('https://portfolio.example', 'token"><script>unsafe</script>')
  assert.match(head, /content="token&quot;&gt;&lt;script&gt;unsafe&lt;\/script&gt;"/)
  assert.doesNotMatch(head, /<script>unsafe/)
})
