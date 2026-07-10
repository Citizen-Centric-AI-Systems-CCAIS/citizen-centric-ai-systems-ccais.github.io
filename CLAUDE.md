# CLAUDE.md — CCAIS website

Guidance for Claude Code working in this repository. Keep it concise and current
(see **Keeping documentation updated**).

## What this is

- Static [Astro](https://astro.build/) site for CCAIS, deployed to GitHub Pages at <https://www.ccais.ac.uk>.
- Content lives as Markdown in `src/content/`; the team lives in `src/data/team.ts`.
- **Deploy = push to `main`** → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes. Nothing is built or uploaded by hand.

## Commands

- `npm install` — dependencies. **Node 22** (matches CI; pinned in `.nvmrc`, minimum 20.3). Use `npm ci` for an install that matches `package-lock.json` exactly.
- `npm run dev` — dev server at <http://localhost:4321> (site search only works after a full build).
- `npm run build` — production build to `dist/`. **Runs the Pagefind `postbuild`** that generates the search index — always use this, not a bare `astro build` (which skips Pagefind).
- `npm run optimize-images` — archives masters to `originals/`, then down-scales oversized images in `public/`.
- `npm run fetch-project-images` — downloads externally-sourced header images listed in `scripts/fetch-project-images.mjs`.
- **Verify before pushing:** run `npm run build` and confirm it succeeds.

## Layout

- `src/content/{projects,news,blog,events,impacts,open-source}/` — Markdown collections; schema in `src/content.config.ts`. Filename = URL slug. Blog is served at `/uncategorised/<slug>/` (historical, to preserve old WordPress URLs).
- `src/data/team.ts` — single source of truth for people; the team page and each `/author/<slug>/` page are generated from it. `groups` defines the section headings; `collaborators` holds external people who have no CCAIS page.
- `src/layouts/Base.astro` — page shell and all `<head>` metadata.
- `src/lib/seo.ts` — site-wide Organization schema, JSON-LD builders, and `clip()`. `src/lib/excerpt.ts` — plain-text excerpts (used for summaries + meta descriptions).
- `src/pages/` — routes; `llms.txt.ts` generates `/llms.txt`.
- `public/` — served verbatim at the site root (images, favicons, `robots.txt`, the Google Search Console token). `originals/` — image masters, **not** deployed.
- `docs/` — human documentation (the content guide). Not deployed.

## Conventions (easy to get wrong)

- **SEO/metadata is centralised.** A page's description, Open Graph/Twitter tags and JSON-LD all come from `Base.astro` props (`description`, `image`, `ogType`, `jsonld`) fed by `src/lib/seo.ts`. New content detail page → pass `description` (usually `clip(excerptOf(entry))`), `image`, and the relevant builder's `jsonld`. New hand-built static page → pass a one-line `description=` (otherwise it falls back to the generic site description).
- **Generated — do not hand-maintain:** the sitemap (`@astrojs/sitemap`), the search index (Pagefind), `llms.txt` (`src/pages/llms.txt.ts`), and all meta/JSON-LD. If the output is wrong, fix the generator, never the built file in `dist/`.
- **Images:** put in `public/images/{news,projects,team}/`; reference with root-absolute paths (`/images/…`). Keep the masters in `originals/`.
- **Team edits happen only in `src/data/team.ts`.** A member's `group` must match a `groups` heading. A `slug` is effectively permanent — it's the person's URL and is referenced by posts' `author`/`members`.
- **Do not delete** `public/google*.html` (Search Console verification) or images still used by pages.
- **Do not** put docs or other non-site files in `public/` (they would be published). They belong in `docs/`.
- Asset paths are root-absolute, so the site must be served from a domain root — the custom domain is already configured in `astro.config.mjs`.

## Content workflows

For adding blog/news/project posts and editing or adding team members, follow
**`docs/CCAIS-Website-Content-Guide.md`** (the team-facing guide). Keep it correct — see below.

## Keeping documentation updated  ← important

When you change how content, templates, scripts, or workflows behave, update the
docs **in the same change**. Treat stale documentation as a bug: if a change
makes any doc inaccurate, fix the doc before you finish.

- `README.md` — developer/human docs: structure, scripts, deploy, conventions.
- `docs/CCAIS-Website-Content-Guide.md` — the team's content-authoring guide (then regenerate its PDF, below).
- `CLAUDE.md` (this file) — whenever commands, layout, or conventions change.

### Regenerate the content-guide PDF

After editing `docs/CCAIS-Website-Content-Guide.md`, rebuild the PDF so both
formats stay identical (run from the repo root; needs `pandoc` + a LaTeX engine such as `xelatex`):

```bash
pandoc docs/CCAIS-Website-Content-Guide.md -f gfm --pdf-engine=xelatex \
  -V geometry:margin=2.2cm -V mainfont="DejaVu Serif" -V sansfont="DejaVu Sans" \
  -V monofont="DejaVu Sans Mono" -V fontsize=11pt \
  -V colorlinks=true -V linkcolor=violet -V urlcolor=violet \
  --highlight-style=tango -o docs/CCAIS-Website-Content-Guide.pdf
```

## Deploy

Push to `main`; GitHub Actions builds with `npm run build` and publishes `dist/`.
Live within a few minutes — watch the Actions tab. A red build is almost always
a frontmatter typo or a `team.ts` syntax slip (missing comma/quote).
