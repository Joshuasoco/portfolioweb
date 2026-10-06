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
```

Use `npm run preview` to preview the production build after building.

## Editing

- `src/data.js`: **all content** (profile, Clak, projects, skills, certifications). Start here.
- `public/images/projects/`: project screenshots. See the README in that folder.
- `src/components/`: one component per section
- `src/App.css`: section styles
- `src/index.css`: design tokens (colors, type, radii) and global styles
- `docs/DESIGN.md`: portfolio design guide

### Adding project images

Every project shows a placeholder frame until you add an image:

1. Save the screenshot to `public/images/projects/`, for example `clak.jpg` (1600 × 1000).
2. In `src/data.js`, set that project's `image` to `'/images/projects/clak.jpg'`.
