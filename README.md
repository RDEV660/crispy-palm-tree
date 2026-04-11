This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

You can deploy on **[Vercel](https://vercel.com)** (Postgres + standard Node) or on **Cloudflare Workers** with [OpenNext](https://opennext.js.org/) and **D1**.

### Language

The site picks **English or Spanish** from the browser’s language on the first visit (`Accept-Language`) and stores it in a `locale` cookie. Visitors can switch language with the header control; admins see the same behavior on `/admin`.

## Online contracts

The owner signs in at **`/admin/login`** → **`/admin/contracts`**. Publishing a draft creates a client link: **`/c/{uuid}`**. Clients sign there; the owner countersigns in the editor; completed contracts can be downloaded as PDF from **`/api/contracts/{uuid}/pdf`**.

### Deploy on Vercel (Postgres)

1. Create a **Postgres** database (e.g. [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or any provider) and copy the connection string.
2. In the Vercel project **Environment Variables**, set:
   - **`DATABASE_URL`** — Postgres connection string (TLS required for hosted DBs; the app uses `ssl: "require"` when not localhost).
   - **`CONTRACT_ADMIN_PASSWORD`** — owner login password.
   - **`CONTRACT_SESSION_SECRET`** — at least **16 characters** (signs the admin session cookie).
   - Optional: **`NEXT_PUBLIC_HERO_VIDEO_URL`** — same as below.
   - Optional: **`NEXT_PUBLIC_SITE_URL`** — your public site URL (e.g. `https://yourdomain.com`). Makes Open Graph / WhatsApp link previews use the correct domain and logo. If omitted, Vercel’s `VERCEL_URL` is used at build time.
3. Run the SQL in [`migrations/postgres/0001_contracts.sql`](./migrations/postgres/0001_contracts.sql) once against that database (SQL editor in the provider’s dashboard, or `psql`).
4. Connect the Git repo and deploy. The build sets `VERCEL=1` automatically; OpenNext Cloudflare init is skipped so the build is a normal Next.js build.
5. **After changing environment variables**, trigger a **new deployment** (Redeploy) so serverless functions see the new values. A **500 on login** almost always means `CONTRACT_SESSION_SECRET` is missing, under 16 characters, or not deployed yet — not the `npm warn deprecated` lines from the install log (those are harmless).

If **`DATABASE_URL`** is **not** set, the app expects **Cloudflare D1** (see below).

### One-time setup (Cloudflare + D1)

1. **Create a D1 database** in your Cloudflare account and copy its id, then replace `database_id` under `d1_databases` in [`wrangler.jsonc`](./wrangler.jsonc) (or run `wrangler d1 create ohana-events-contracts` and paste the id).
2. **Apply migrations** (from this directory):

   ```bash
   npx wrangler d1 migrations apply ohana-events-contracts --local
   npx wrangler d1 migrations apply ohana-events-contracts --remote
   ```

3. **Secrets and local dev**
   - Add to **`.dev.vars`** (and Cloudflare dashboard / `wrangler secret` for production):
     - `CONTRACT_ADMIN_PASSWORD` — shared owner login password.
     - `CONTRACT_SESSION_SECRET` — at least **16 characters**; used to sign admin session cookies (verified in **Node** Route Handlers and the protected admin layout).
   - `next.config.ts` merges `.dev.vars` into `process.env` during development so the login API and server components see the same secrets.
   - For `next build` / CI / Cloudflare Workers, set these variables in the deployment environment (e.g. Wrangler secrets) so Route Handlers can sign and verify sessions.

### Homepage hero (slideshow + video)

- Homepage hero + gallery photos live in **`public/hero/`** as `home-03.png` … `home-11.png` (9 images; older `home-01`/`home-02` are not used). The ordered list is in `src/data/home-hero-slides.ts`. Optional: set **`NEXT_PUBLIC_HERO_VIDEO_URL`** for a subtle background video layer.
- Optional: set **`NEXT_PUBLIC_HERO_VIDEO_URL`** to a public `.mp4` or `.webm` URL (or a path under `public/`, e.g. `/hero/promo.mp4`). If unset, a small CC0 sample clip is used.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel (reminder)

Import this repo in the [Vercel dashboard](https://vercel.com/new), add **`DATABASE_URL`**, **`CONTRACT_ADMIN_PASSWORD`**, and **`CONTRACT_SESSION_SECRET`**, apply the Postgres migration, then deploy. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for general options.
