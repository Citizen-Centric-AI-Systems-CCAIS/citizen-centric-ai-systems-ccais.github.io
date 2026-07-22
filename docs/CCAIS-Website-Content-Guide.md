# CCAIS Website — Content Guide

Static [Astro](https://astro.build/) site (live at **[ccais.ac.uk](https://ccais.ac.uk/)**). Content = Markdown files + one team file (`src/data/team.ts`). **Push to `main` → GitHub Actions builds and deploys** (live in a few minutes); nothing is built or uploaded by hand.

## Access

- Repo: **<https://github.com/Citizen-Centric-AI-Systems-CCAIS/citizen-centric-ai-systems-ccais.github.io>**
- Direct push needs **collaborator (write) access** — ask an admin (Seb Stein) to add your GitHub username.
- No write access → **fork + pull request** (also the route if you want review first; see [Pull requests](#pull-requests)).

## Setup

```bash
git clone git@github.com:Citizen-Centric-AI-Systems-CCAIS/citizen-centric-ai-systems-ccais.github.io.git
npm install
npm run dev              # http://localhost:4321  (site search only works in a full build)
npm run optimize-images  # optional: archive + down-scale oversized images in public/
```

## Where content lives

| Type | Folder | URL |
|---|---|---|
| Blog | `src/content/blog/` | `/uncategorised/<file>/` |
| News | `src/content/news/` | `/latest-news/<file>/` |
| Project | `src/content/projects/` | `/projects/<file>/` |
| Event | `src/content/events/` | `/events/<file>/` |
| Impact | `src/content/impacts/` | `/impacts/<file>/` |
| Open source | `src/content/open-source/` | `/open-sources/<file>/` |

- Filename → URL slug (`kebab-case`).
- Images live in `public/images/{news,projects,team}/` (create others as needed), referenced as `/images/…`.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | quoted |
| `date` | yes | `YYYY-MM-DD`; sorts newest-first |
| `image` | no | `/images/…`; omit → coloured gradient header |
| `imageCredit` / `imageCreditUrl` | no | small footer credit (+ optional link) |
| `excerpt` | no | overrides the auto-summary (first paragraph) |
| `author` | no | team **slug** → adds a byline, lists on their page |
| `members` | no | list of slugs and/or `{ name, url }` (external, no page) |
| `eventDate` | events only | `YYYY-MM-DD` (the day the event starts) |
| `eventEndDate` | events, no | `YYYY-MM-DD` — end day for a multi-day event |
| `location` | events, no | venue name, e.g. `"Highfield Campus, University of Southampton"`. Omit → defaults to University of Southampton |
| `locationUrl` | events, no | joining link for an **online** event (used instead of `location`) |
| `eventStatus` | events, no | `scheduled` (default), `cancelled`, `postponed`, `rescheduled` or `moved-online` |
| `performers` | events, no | list of speakers — each a plain name, or `{ name, affiliation }` to credit their organisation |

First paragraph = listing summary + meta description. No image is fine.

The extra event fields above feed Google's Event rich-result data (they surface as *recommended* items in Search Console). Only `eventDate` is required; the rest are optional and safe to omit.

## Add a post (blog / news / project)

New `.md` in the matching folder (see table). Same schema for all three:

```markdown
---
title: "…"
date: 2026-07-03
author: your-slug
image: "/images/news/foo.jpg"
imageCredit: "Photo by Jane Doe on Unsplash"
imageCreditUrl: "https://unsplash.com/@janedoe"
members:
  - sebastian-stein
  - { name: "Dr Bahar Rastegari", url: "https://www.southampton.ac.uk/people/5xrg8y/doctor-bahar-rastegari" }
---

Body in Markdown. Lead with a strong first paragraph.
```

`author`/`members` are team slugs; inline `{ name, url }` credits an external person with no CCAIS page. Then commit/push (or PR).

## Team (`src/data/team.ts`)

Single source of truth; the `/author/<slug>/` pages and the team page are generated from it.

- **Edit someone:** find their block, change fields. Retiring them → set `group: "Alumni"`.
- **Add someone:** drop a square photo in `public/images/team/`, then add a block in the right group's section (order within a group = display order):

```ts
{
  slug: "firstname-lastname",     // unique; → /author/firstname-lastname/, used in author/members
  name: "Dr Firstname Lastname",
  role: "PhD Student – Topic",
  group: "PhD Students",          // Researchers | PhD Students | Research Engineers / Assistants | PhD Graduates | Alumni
  photo: img("firstname-lastname.jpg"),
  email: "x@soton.ac.uk",         // optional
  websites: ["https://…"],        // optional; string or { label, url }
  biography: `…`,                 // optional
},
```

External collaborators without a page: inline `{ name, url }` in a post's `members`, or add them once to the `collaborators` list at the bottom of `team.ts` and reference by slug.

## Pull requests

- **Have write access, want review:** branch → push → PR → merge.
- **Read-only:** fork → PR (the GitHub web editor auto-forks and opens a PR via *Propose changes*).
- Only `main` deploys — a PR never touches the live site until merged.

## Gotchas

- Red build in **Actions** = almost always a frontmatter typo (missing `---`, unquoted `title`, bad `date`, or a missing comma/quote in `team.ts`).
- Renaming a file/slug changes its URL and breaks inbound links.
- Don't delete `public/google….html` (Search Console verification).
- Sitemap, search index, OG/Twitter tags, JSON-LD and `llms.txt` are all auto-generated — just add content.
