# Ayush Verma — Academic Portfolio

A single-page portfolio for **Ayush Verma** — Scientist-'B'/Assistant Director at Software
Technology Parks of India (MeitY, Government of India) and Ph.D. Scholar at SC&SS, Jawaharlal
Nehru University.

Content is transcribed from [ayushexploring.github.io](https://ayushexploring.github.io/) and the
linked [Google Scholar profile](https://scholar.google.com/citations?user=mldR9EoAAAAJ&hl=en).

## Stack

React 19 · Vite 8 · Tailwind CSS 4 — no runtime dependencies beyond React.

## Getting started

```bash
npm install
npm run dev      # site at http://localhost:5173, editor at /admin.html
npm run build    # → dist/
npm run preview  # serve the production build
npm run lint
```

---

## Adding a publication (no code)

All content lives in [`src/data/content.json`](src/data/content.json). You never need to open it —
there is a form-based editor at **`/admin.html`**.

Because GitHub Pages serves static files and has no server to save to, the editor writes by
**committing `content.json` straight to this repo** through the GitHub API. That commit triggers the
Pages workflow, which rebuilds and redeploys. So the loop is:

```
edit at /admin.html  →  Publish  →  commit to repo  →  Actions rebuild  →  live (~1 min)
```

### One-time setup

1. Open `https://<your-site>/admin.html` (or `http://localhost:5173/admin.html`).
2. Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new):
   - **Repository access** → *Only select repositories* → this repo.
   - **Permissions → Repository permissions → Contents** → *Read and write*.
     (That is the only permission needed. Do not grant more.)
3. Paste the token plus your username, repo and branch, then press **Connect**.

The token is kept in that browser's `localStorage` and sent only to `api.github.com`. It is never
bundled into the deployed site. Anyone can open `/admin.html`, but without a token of their own it
can do nothing — and a token only ever grants what you scoped it to. Set an expiry, and revoke it
from GitHub settings if a device is lost.

### Day-to-day

Open `/admin.html` → **Publications** → **+ Add publication** → fill in the fields → **Publish**.

The editor also covers citation metrics, forthcoming papers, talks and honors, supervised students,
experience, education, teaching, the About text, contact links and the nav. Entries can be
reordered, duplicated and deleted.

Safeguards built in:

- **Publish stays disabled** until something has actually changed and every required field is valid
  (missing fields, malformed DOI URLs and duplicate DOIs are all caught and listed).
- The editor always **reloads the live file from GitHub first** and commits against that version's
  sha, so it cannot silently clobber an edit made elsewhere.
- **Download JSON** exports the current state if you would rather commit it by hand.
- Closing the tab with unpublished edits prompts first.

### Editing without the admin page

`content.json` is plain JSON — editing it in the GitHub web editor (or locally) works exactly the
same and triggers the same rebuild.

### What drives what

| Key            | Section                                                              |
| -------------- | -------------------------------------------------------------------- |
| `profile`      | Name, roles, About paragraphs, research interests, advisor           |
| `contacts`     | Contact cards, hero icon links, footer icons                         |
| `scholar`      | Citations / h-index / i10-index and the `retrieved` date shown       |
| `experience`   | Experience timeline                                                  |
| `education`    | Education timeline                                                   |
| `publications` | Publication cards — the type filter, search and sort read from these |
| `upcoming`     | "Forthcoming & recently indexed" list                                |
| `honors`       | Talks, honors and achievements                                       |
| `teaching`     | Teaching roles                                                       |
| `mentorship`   | Supervised students, grouped by level                                |
| `sections`     | Nav items — the order here is the nav order                          |

To add a **new field** to a section, add it to the relevant `fields` array in
[`src/admin/schema.js`](src/admin/schema.js) and it appears in the editor automatically; then render
it in the matching component.

### Refreshing citation metrics

Google Scholar has no public API, so `scholar` is a manual snapshot. Update the three numbers under
**Citation metrics** and change *Retrieved* — the hero footnote shows that date, so the figures are
never presented as live.

---

## Deploying to GitHub Pages

Free, and it hosts both the site and the editor.

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source → GitHub Actions.**
3. Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
   publishes `dist/` on every push, including every commit the editor makes.

`vite.config.js` sets `base: '/'`, correct for a user page at `https://<user>.github.io/`. For a
project page (`https://<user>.github.io/<repo>/`), change it to `base: '/<repo>/'`.

The build emits two pages — `index.html` (the site) and `admin.html` (the editor) — as separate
entry points, so the editor's JavaScript is never downloaded by visitors.

## Notes on implementation

- **Theme** — `useTheme` follows the OS preference until the user picks explicitly, then persists to
  `localStorage`. An inline script in [`index.html`](index.html) applies the stored theme before
  first paint so dark mode never flashes light.
- **Scroll reveal** — `.reveal` elements start hidden; `useReveal` adds `.is-visible` via
  `IntersectionObserver`. Publications re-arms the observer when its filter changes so newly
  rendered cards animate in. All of it collapses to a no-op under `prefers-reduced-motion: reduce`.
- **Anchor offset** — sections carry `scroll-mt-20` to clear the sticky nav. Don't also set
  `scroll-padding-top` on `html`; the two stack and overshoot.
- **Base64** — `content.json` contains typographic characters (’ – “ ”). The GitHub client encodes
  via `TextEncoder` rather than bare `btoa`, which would corrupt them.
- **Accessibility** — skip link, one `h1`, `aria-current` on the active nav item, labelled icon
  buttons, visible focus rings, and `rel="noopener"` on every new-tab link.
