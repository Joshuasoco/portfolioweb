# Design guide

The portfolio follows an Apple-inspired, minimalist language: content first, generous space, quiet color.

## Principles

- **One idea per screen.** Each section has a single headline and leads with the work.
- **Type does the heavy lifting.** Large, tightly tracked headlines; calm, gray body copy.
- **Color is rare.** Neutral grays everywhere; blue (`#0071e3`) only for actions and links.
- **Motion is subtle.** Content fades up once as it scrolls into view. All motion respects `prefers-reduced-motion`.

## Tokens (`src/index.css`)

| Token        | Light     | Dark      | Use                       |
| ------------ | --------- | --------- | ------------------------- |
| `--bg`       | `#ffffff` | `#000000` | Page background           |
| `--bg-alt`   | `#f5f5f7` | `#0b0b0c` | Alternating sections      |
| `--text`     | `#1d1d1f` | `#f5f5f7` | Headlines, primary text   |
| `--text-2`   | `#6e6e73` | `#a1a1a6` | Body copy                 |
| `--text-3`   | `#86868b` | `#86868b` | Eyebrows, captions        |
| `--accent`   | `#0071e3` | `#0071e3` | Buttons                   |

Light and dark follow the visitor's system setting.

## Type

System font stack (SF Pro on Apple devices) with Inter as the fallback.

- Hero name: 52–96px, weight 700, tracking −0.045em
- Section titles: 40–64px, weight 700, tracking −0.035em
- Body: 17px, line height 1.47

## Page structure

1. Hero (compact, so the work shows right away)
2. Selected work (Clak, MSME-Pathways, Plant Identifier, Reducing Readmissions, Day One: Survival)
3. About
4. Toolkit (bento grid)
5. Certifications
6. Contact

## Images

Projects use 16:10 images; the portrait uses 4:5. Until an image is set in `src/data.js`, a placeholder shows the expected size and folder.
