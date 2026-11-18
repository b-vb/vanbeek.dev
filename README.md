# vanbeek.dev

A single page: one link, one one-liner. Built with [TanStack Start](https://tanstack.com/start) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Development

```bash
pnpm install
pnpm dev
```

Type-check with `pnpm typecheck`.

The site runs at http://localhost:3000.

## Deploy

```bash
pnpm dlx wrangler login   # once
pnpm deploy
```

This builds the app and publishes it as the `vanbeek-dev` Worker. To serve the real domain, add a custom domain (or route) for `vanbeek.dev` in the Cloudflare dashboard under the Worker's **Settings → Domains & Routes**.

## Structure

- `src/routes/__root.tsx` — HTML shell, meta tags, 404 page
- `src/routes/index.tsx` — the homepage
- `src/styles/app.css` — all styles (plain CSS, no framework)
- `wrangler.jsonc` — Cloudflare Worker config
- `pnpm-workspace.yaml` — pnpm settings (allowlisted build scripts)
