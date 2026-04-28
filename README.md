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

## Challenges Faced & Solutions

**1. Implementing Global Search with a Paginated API**
*Challenge:* The PokéAPI does not have a native "search by partial string across all Pokémon" endpoint. Initially, the app only searched within the currently visible page of 20 Pokémon.
*Solution:* I updated the backend to fetch a lightweight index of all Pokémon (`?limit=10000`), filter them by name on the server, and then correctly slice and paginate those results before fetching their full details. To prevent spamming the API, I implemented a 300ms "debounce" delay on the client-side search input.

**2. Missing Brand Icons in Modern Icon Libraries**
*Challenge:* While setting up GitHub authentication on the sign-in page, the `lucide-react` library threw a build error because they recently removed all brand logos (like GitHub) from their package.
*Solution:* Rather than installing a heavy secondary icon library just for one logo, I created a custom, lightweight inline SVG component (`GithubIcon`) that perfectly matches the existing UI style.
