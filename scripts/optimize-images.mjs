import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { profile } from '../src/data.js'

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character])

const directory = 'public/images'
const files = ['profile.png', ...(await readdir(`${directory}/projects`))
  .filter((file) => file.endsWith('.png'))
  .map((file) => `projects/${file}`)]
const manifest = {}

for (const file of files) {
  const portrait = file === 'profile.png'
  const widths = portrait ? [400, 800] : [480, 960, 1440]
  const stem = file.replace(/\.png$/, '')
  const sources = []
  let dimensions

  for (const width of widths) {
    const output = `${stem}-${width}.webp`
    dimensions = await sharp(path.join(directory, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(directory, output))
    sources.push(`/images/${output} ${dimensions.width}w`)
  }

  manifest[`/images/${file}`] = {
    src: `/images/${stem}-${widths.at(-1)}.webp`,
    srcSet: sources.join(', '),
    width: dimensions.width,
    height: dimensions.height,
  }
}

// A conventional 1200 × 630 preview, built from the existing portrait and site copy.
const portrait = await sharp(`${directory}/profile.png`)
  .resize(420, 530, { fit: 'cover' }).png().toBuffer()
const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f5f5f7"/>
  <text x="72" y="215" fill="#1d1d1f" font-family="Arial, sans-serif" font-size="72" font-weight="700">${escapeXml(profile.name)}</text>
  <text x="74" y="285" fill="#424245" font-family="Arial, sans-serif" font-size="31">Web Developer &amp; AI Enthusiast</text>
  <text x="74" y="350" fill="#6e6e73" font-family="Arial, sans-serif" font-size="25">${escapeXml(profile.location)}</text>
  <text x="74" y="490" fill="#0071e3" font-family="Arial, sans-serif" font-size="24">Projects · AI agents · Web apps</text>
</svg>`)
await sharp(card).composite([{ input: portrait, left: 730, top: 50 }])
  .jpeg({ quality: 85, mozjpeg: true }).toFile('public/social-preview.jpg')
await writeFile('src/image-assets.json', `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Optimized ${files.length} images and generated the social preview.`)
