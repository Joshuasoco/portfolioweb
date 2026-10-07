import { profile, skills } from '../src/data.js'
import { site } from '../src/site.js'

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

export function getSiteUrl(value = site.url) {
  if (!value?.trim()) return ''
  let url
  try { url = new URL(value.trim()) } catch { throw new Error('SITE_URL must be a valid HTTPS origin.') }
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTPS origin without a path, query, or fragment.')
  }
  return url.href
}

export function createSeoHead(value, verification = '') {
  const url = getSiteUrl(value)
  const absolute = (path) => url ? new URL(path, url).href : path
  const personId = `${url}#person`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': `${url}#website`,
        name: `${profile.name} Portfolio`, ...(url && { url }),
        inLanguage: 'en', publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage', '@id': `${url}#profile`,
        ...(url && { url }), name: site.title, description: site.description,
        isPartOf: { '@id': `${url}#website` }, mainEntity: { '@id': personId },
        inLanguage: 'en', primaryImageOfPage: { '@type': 'ImageObject', url: absolute('/images/profile-800.webp') },
      },
      {
        '@type': 'Person', '@id': personId, name: profile.name,
        ...(url && { url }), description: site.description,
        image: absolute('/images/profile-800.webp'),
        homeLocation: { '@type': 'Place', name: profile.location },
        sameAs: [profile.github, profile.linkedin],
        knowsAbout: skills.flatMap((group) => group.items),
      },
    ],
  }
  const tags = [
    `<title>${escapeHtml(site.title)}</title>`,
    `<meta name="description" content="${escapeHtml(site.description)}" />`,
    `<meta name="author" content="${escapeHtml(profile.name)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en_PH" />',
    `<meta property="og:site_name" content="${escapeHtml(`${profile.name} Portfolio`)}" />`,
    `<meta property="og:title" content="${escapeHtml(site.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(site.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(absolute(site.image))}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:type" content="image/jpeg" />',
    `<meta property="og:image:alt" content="${escapeHtml(site.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(site.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(site.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(absolute(site.image))}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(site.imageAlt)}" />`,
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
  ]
  if (url) tags.push(`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`)
  if (verification) tags.push(`<meta name="google-site-verification" content="${escapeHtml(verification)}" />`)
  return tags.join('\n    ')
}

export function createCrawlerFiles(value) {
  const url = getSiteUrl(value)
  const files = { 'robots.txt': `User-agent: *\nAllow: /\n${url ? `\nSitemap: ${url}sitemap.xml\n` : ''}` }
  if (url) files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeHtml(url)}</loc></url>\n</urlset>\n`
  return files
}
