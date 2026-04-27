## Pokedex Lite

A responsive Pokedex-style web app built with **Next.js (App Router) + TypeScript** using **PokéAPI**.

### Features

- **SSR**: Server-rendered first page for fast initial load
- **List**: Responsive grid with Pokémon name, image, and types
- **Search**: Instant filtering by name (as you type)
- **Type filter**: Multi-select type filtering (intersection)
- **Pagination**: Next/Prev paging (no “fetch all”)
- **Favorites**: Persisted to `localStorage`
- **Detail view**: Animated modal with stats + abilities
- **OAuth (bonus)**: NextAuth proof-of-concept (GitHub/Google providers, optional)
- **Animations (bonus)**: Hover + modal transitions via Framer Motion

## Getting started (local)

Install deps and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## OAuth (bonus) setup (optional)

OAuth is implemented via **NextAuth**, but providers are **enabled only if env vars are present**.
There is also a **Demo** credentials provider so the auth UI works out of the box.

1) Copy env template:

```bash
cp .env.example .env.local
```

2) Fill one provider (GitHub or Google) + set a secret:

- **GitHub**: `GITHUB_ID`, `GITHUB_SECRET`
- **Google**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **NextAuth**: `NEXTAUTH_SECRET` (required)

Then restart `npm run dev`.

## Build

```bash
npm run build
npm start
```

## Deploy (optional)

- **Vercel**: import the repo in Vercel, set any desired env vars from `.env.example`, and deploy.

## Tech choices

- **Next.js App Router**: SSR-friendly, clean routing + API routes
- **Tailwind CSS**: fast iteration for responsive UI
- **Framer Motion**: subtle UI motion and modal transitions
- **NextAuth**: minimal OAuth proof-of-concept
- **PokéAPI**: public data source

## Notes / challenges

- **Type filtering**: PokéAPI’s main list endpoint doesn’t include types, so the app fetches details for the current page and uses the `/type/{type}` endpoint for type-based browsing with pagination.
