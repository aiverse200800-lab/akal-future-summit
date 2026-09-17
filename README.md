# Akal Future Founders Summit

Official website for the Akal Future Founders Summit — a two-day entrepreneurship and innovation experience for Grade 9–12 students, hosted at Akal Academy Baru Sahib on 22–23 October 2026, in collaboration with AIC ISB Mohali, TalentGro Global, and Amoeba Education.

## Stack

- Vite + React 18 + TypeScript + Tailwind CSS
- Cloudflare Pages (hosting + Functions), D1 (database), R2 (payment screenshot storage)

## Development

```bash
npm install
npm run dev        # frontend only (Vite)
```

To run the full stack locally (including the `/api/register` function with local D1 + R2 emulation):

```bash
npx wrangler d1 execute akal-future-founders-summit --local --file=migrations/0001_init.sql   # one-time: create local DB
npm run dev:full   # builds and serves via wrangler pages dev on :8788
```

## Build & Deploy

```bash
npm run build        # outputs to dist/
npm run typecheck
npm run lint
npm run deploy       # build + deploy to Cloudflare Pages (needs CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)
```

Production: https://affs.talentg.io (aliases: akalfuturefounders.talentg.io, futurefounders.talentg.io).
