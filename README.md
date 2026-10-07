# portfolioweb

Personal portfolio for Joshua Co, built with React and Vite.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed in your terminal. Press Control + C to stop the server.

## Checks

```bash
npm run build
npm run lint
npm test
```

Use `npm run preview` to preview the production build after building.

## SEO and deployment

The production build prerenders the full React portfolio into `dist/index.html`,
then hydrates it in the browser. Search engines and sharing crawlers receive the
name, projects, skills, certifications, contact links, and structured profile data
in the original HTML. Scroll effects leave content visible when JavaScript is unavailable.

Set the **real public HTTPS origin** in `src/site.js` (`url`) or the hosting
provider's `SITE_URL` build environment variable. The environment variable takes
precedence. Local settings can go in an ignored `.env` file; `.env.example` shows
the format. Use the origin only, without a path, query, or fragment.

With the public URL configured, `npm run build` generates matching canonical and
Open Graph URLs, absolute social images, `dist/robots.txt`, and `dist/sitemap.xml`.
This portfolio has one page, so the sitemap contains only the homepage;
section anchors such as `#work` are not separate pages. If no public URL is set,
the build warns and omits the canonical URL and sitemap rather than inventing a
domain. Configure it before publishing.

Deploy with **build command `npm run build`** and **output directory `dist`**.
Calling `vite build` directly skips prerendering and crawler-file generation.

After deploying:

1. Verify ownership in [Google Search Console](https://search.google.com/search-console).
   A Domain property uses a DNS record. For a URL-prefix property's HTML-tag
   method, set `GOOGLE_SITE_VERIFICATION` to the token from Google's verification
   tag, then rebuild and deploy. The token is public metadata.
2. Open `/robots.txt` and `/sitemap.xml` on the live domain and confirm they
   return their text/XML content with HTTP 200, without requiring a login.
3. Submit `sitemap.xml` in Search Console's Sitemaps report.
4. Inspect the homepage URL, test the live URL, and request indexing.
5. Check the live page with Google's
   [Rich Results Test](https://search.google.com/test/rich-results) and monitor
   Search Console for crawl and indexing issues.

The implementation follows Google's
[JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
and [profile-page structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
Google controls crawling, indexing, and ranking; publishing these changes does
not guarantee a position or immediate inclusion in search results.

## Image optimization

The original PNGs remain the editable source images. Generated WebP variants and
`src/image-assets.json` are committed so development and builds work immediately.
The portrait loads eagerly with high priority; project screenshots load lazily.
Intrinsic dimensions reserve space, and responsive sources reduce downloads on
smaller screens. `public/social-preview.jpg` is the 1200 × 630 sharing card.

After adding or replacing a PNG, regenerate the optimized assets:

```bash
npm run optimize:images
npm test
```

Commit the resulting WebP files, image manifest, and sharing card together. For
other image formats without a manifest entry, the component uses the original image.

## Editing

- `src/data.js`: **all content** (profile, projects, skills, certifications). Start here.
- `src/site.js`: SEO title, description, sharing image, and public URL
- `public/images/projects/`: project screenshots. See the README in that folder.
- `src/components/`: one component per section
- `src/components/arc/`: the [uiarc.dev](https://uiarc.dev) segmented control (and its tokens) that the glass nav pill is built on
- `src/App.css`: section styles
- `src/index.css`: design tokens (colors, type, radii) and global styles
- `docs/DESIGN.md`: portfolio design guide

### Adding project images

Every project shows a placeholder frame until you add an image:

1. Save the screenshot to `public/images/projects/`, for example `clak.jpg` (1600 × 1000).
2. In `src/data.js`, set that project's `image` to `'/images/projects/clak.jpg'`.
