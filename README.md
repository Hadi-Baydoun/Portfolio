# Hadi Baydoun Portfolio

React + Vite portfolio with three routes: home, explore (skills), and contact.

## Prerequisites

Node.js (LTS) and npm.

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` / `npm run format:check` | Prettier |

## Stack

React 19, Vite 8, React Router, Tailwind CSS 4, Framer Motion, Lucide, vanilla-lazyload, Rellax, lottie-web (homepage parallax in `scripts/script.js`), ESLint, Prettier.

`matter-js` is in package.json but unused — remove if you like.

## Imports

`@` maps to `src/` in `vite.config.js` (e.g. `@/components/...`).

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Homepage (`Hero`, parallax, Lottie) |
| `/explore` | Skills |
| `/contact` | Contact |

Shared: `layout/Navbar.jsx`, `layout/Footer.jsx`. Entry: `src/main.jsx` → `src/index.css`.

## Styles

- `src/index.css` — Tailwind, fonts, global layout/theme
- `src/styles/homepage.css` — Homepage-only (imported from `index.css`)

## Assets

Under `src/assets/`: `Homepage/`, `Explore/`, `Contact/`, `Skills/` (icons — **capital S** matters on Linux), `fonts/`. Import from JS so Vite can bundle them.

## Public folder (`public/`)

Served at the site root (not bundled as modules).

- `favicon.png` — linked in `index.html`
- **CV** — Put your PDF in `public/`. Edit `src/constants/cvPublic.js` and set `CV_PUBLIC_FILE` to that filename (exact match, including spaces). Download links use that value.
- `public/json/*.json` — Lottie data for the homepage script

## Build & deploy

1. `npm run build`
2. Deploy `dist/` to any static host. If the site isn’t at the domain root, set `base` in `vite.config.js`.

Include Lottie JSON under `public/json/` and the CV file named in `cvPublic.js` so links and fetches work in production.
