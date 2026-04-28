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


1) Copy env template:

```bash
cp .env.example .env.local
```

2) Fill GitHub  + set a secret:

- **GitHub**: `GITHUB_ID`, `GITHUB_SECRET`
- **NextAuth**: `NEXTAUTH_SECRET` (required)

Then restart `npm run dev`.

## Build

```bash
npm run build
npm start
```


## Tech choices

- **Next.js App Router**: SSR-friendly, clean routing + API routes
- **Tailwind CSS**: fast iteration for responsive UI
- **Framer Motion**: subtle UI motion and modal transitions
- **NextAuth**: minimal OAuth proof-of-concept
- **PokéAPI**: public data source
