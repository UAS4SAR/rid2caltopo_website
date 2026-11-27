# RID2Caltopo website

Source for the public site at **rid2caltopo.com**: product
pages for RID2Caltopo, a Remote ID → CalTopo tool for search-and-rescue drone
teams, plus the managed-pilot request flow.

Related repositories:

- [UAS4SAR/RID2Caltopo](https://github.com/UAS4SAR/RID2Caltopo) – the free, open-source app
- [UAS4SAR/r2c-tracker](https://github.com/UAS4SAR/r2c-tracker) – the tracker

## Stack

- Next.js 16 / React 19 app routes in `app/`, run on
  [vinext](https://github.com/cloudflare/vinext) (Vite) rather than the Next.js server
- Tailwind 4 is installed, but nearly all styling is plain CSS in `app/globals.css`
- Deployed as a single Cloudflare Worker (`worker/index.ts`) that serves the
  rendered app, static assets from `dist/client`, `/robots.txt`, `/sitemap.xml`
  and the form endpoints `POST /api/request` and `POST /api/contact`
- Worker and domain configuration (name, custom domains, email binding) is defined
  in `vite.config.ts`; there is no `wrangler.jsonc`

## Getting started

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev     # local dev server
npm run build   # production build into dist/
npm start       # serve the production build locally
npm test        # build, then run tests/rendered-html.test.mjs
npm run lint
```

`npm test` renders pages through the built worker with different `Host` headers
and asserts on the HTML (headers, metadata, sitemap, assets, accessibility
rules). Run it before opening a PR.

## How the site is organised

| Path | What it is |
| --- | --- |
| `app/layout.tsx` | Global metadata, JSON-LD, skip link and the shared `SiteHeader` |
| `app/page.tsx` | Homepage; its mode depends on the host (see below) |
| `app/seo.ts` | `pageMetadata()` helper so every page gets canonical + Open Graph + Twitter tags |
| `app/components/SiteHeader.tsx` | The one header used on every page, including the mobile menu |
| `app/not-found.tsx` | 404 page |
| `app/globals.css` | All styles and design tokens (colors, focus ring, type sizes) |
| `worker/index.ts` | Worker entry: sitemap, robots, form handlers, email sending |
| `public/` | Static assets copied as-is, including `_headers` (cache rules) |
| `tests/` | Rendered-HTML tests |

### One canonical host

`https://rid2caltopo.com` is the only canonical origin. The Worker answers
`rid2caltopo.org`, `www.rid2caltopo.org` and `www.rid2caltopo.com` with a `301` to the
same path and query on `rid2caltopo.com` (see `canonicalRedirect()` in
`worker/index.ts`; the custom domains are listed in `vite.config.ts`). Canonical URLs,
Open Graph tags, the sitemap and `robots.txt` all use that origin.

The homepage defaults to the managed-pilot view for everyone. `/?view=community`
shows the free-app view and is linked from the page footer.

### Secrets and bindings

- `MANAGED_REQUEST_INGEST_KEY` (secret) – bearer token used when the Worker forwards
  managed-pilot requests to `https://r2c-tracker.com/managed-access-requests`
- `EMAIL` (Cloudflare Email send binding) – sends contact/request mail to
  `info@uas4sar.com` from `requests@rid2caltopo.com`

Set these in Cloudflare; never commit their values.

## Content conventions

- **Images**: Open Graph card is `public/og-image.jpg` (1200×630, under 300 KB).
  Icons are `favicon.ico`, `icon-32.png`, `icon-64.png`, `apple-touch-icon.png`.
  Responsive hero images come in `-480/-800/-1200` widths – add all sizes when
  replacing one.
- **Videos** in `public/*.mp4` have a matching `-poster.jpg` and an English WebVTT
  caption track (`.vtt`, wired through `captionsSrc` in `app/page.tsx`) plus a "Read the
  tutorial/transcript" panel. Videos load with `preload="none"`. When you replace a video,
  update its `.vtt` and transcript too (`app/tutorialTranscripts.ts`).
- **Caching**: hashed `/assets/*` files are immutable (vinext default); `public/_headers`
  sets longer cache lifetimes for the static media in `public/`.
- **Sitemap `lastmod`** is derived from git history at build time, so build from a
  full clone (not a shallow one) for accurate dates.
- **Accessibility**: keep text at 12 px or larger, use the `--muted` / `--accent-text`
  tokens instead of ad-hoc light greys/oranges, and give interactive elements the
  global `:focus-visible` ring. Tests enforce the palette and the minimum size.

## Deploying

`npm run deploy:cloudflare` builds and runs `wrangler deploy` with the generated
`dist/server/wrangler.json`. It publishes straight to the production custom domains,
so run it deliberately and only from an account that owns those zones.

`.openai/hosting.json` and `build/sites-vite-plugin.ts` come from the original
site-creator starter; the build plugin is still wired into `vite.config.ts`.

## Open items for the maintainers

There is no standalone privacy policy or terms-of-service page. `app/managedAccessTerms.ts`
holds only the acknowledgment text shown in the managed-pilot request flow.
