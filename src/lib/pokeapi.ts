export type PokemonListItem = {
  id: number;
  name: string;
  image: string | null;
  types: string[];
};

export type PokemonPageResult = {
  items: PokemonListItem[];
  total: number;
};

export type PokemonTypeListItem = {
  name: string;
  url: string;
};

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

function toIdFromPokemonUrl(url: string): number | null {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function officialArtworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function pokeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // console.log("fetching path:", path); // debug temp
  const res = await fetch(`${POKEAPI_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    // throw new Error("bad req"); 
    throw new Error(`PokéAPI request failed: ${res.status} ${res.statusText}`);
  }

  const rawData = await res.json();
  // TODO: add proper zod validation later, for now just cast it
  return rawData as T;
}

type PokeListResponse = {
  count: number;
  results: { name: string; url: string }[];
};

type PokePokemonResponse = {
  id: number;
  name: string;
  sprites?: {
    other?: {
      ["official-artwork"]?: { front_default?: string | null };
    };
    front_default?: string | null;
  };
  types: { slot: number; type: { name: string } }[];
};

type PokeTypeResponse = {
  pokemon: { pokemon: { name: string; url: string } }[];
};

export async function getAllTypes(): Promise<PokemonTypeListItem[]> {
  const data = await pokeFetch<{ results: PokemonTypeListItem[] }>("/type");
  return data.results
    .filter((t) => !["unknown", "shadow"].includes(t.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getPokemonListItemsByName(names: string[]): Promise<PokemonListItem[]> {
  const details = await Promise.all(
    names.map((name) => pokeFetch<PokePokemonResponse>(`/pokemon/${encodeURIComponent(name)}`)),
  );

  return details.map((p) => {
    const image =
      p.sprites?.other?.["official-artwork"]?.front_default ??
      p.sprites?.front_default ??
      officialArtworkUrl(p.id);

    return {
      id: p.id,
      name: p.name,
      image,
      types: p.types.map((t) => t.type.name),
    };
  });
}

async function getPokemonNamesForTypes(types: string[]): Promise<string[]> {
  const typeResults = await Promise.all(
    types.map((t) => pokeFetch<PokeTypeResponse>(`/type/${encodeURIComponent(t)}`)),
  );

  const sets = typeResults.map((tr) => {
    const s = new Set<string>();
    for (const p of tr.pokemon) {
      s.add(p.pokemon.name);
    }
    return s;
  });

  if (sets.length === 0) return [];

  // Intersection for multi-select type filtering
  const [first, ...rest] = sets;
  const intersection: string[] = [];
  for (const name of first) {
    if (rest.every((s) => s.has(name))) intersection.push(name);
  }
  intersection.sort((a, b) => a.localeCompare(b));
  return intersection;
}

export async function getPokemonPage(params: {
  offset: number;
  limit: number;
  types?: string[];
  search?: string;
}): Promise<PokemonPageResult> {
  const { offset, limit, types, search } = params;
  const selectedTypes = (types ?? []).filter(Boolean);
  const q = search?.trim().toLowerCase() || "";

  let allNames: string[] = [];

  if (selectedTypes.length > 0) {
    allNames = await getPokemonNamesForTypes(selectedTypes);
    if (q) {
      allNames = allNames.filter((name) => name.includes(q));
    }
  } else if (q) {
    const list = await pokeFetch<PokeListResponse>("/pokemon?limit=10000");
    allNames = list.results.map((r) => r.name).filter((name) => name.includes(q));
  } else {
    const list = await pokeFetch<PokeListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
    const pageNames = list.results.map((r) => r.name);
    const items = await getPokemonListItemsByName(pageNames);
    return { items, total: list.count };
  }

  const pageNames = allNames.slice(offset, offset + limit);
  const items = await getPokemonListItemsByName(pageNames);
  return { items, total: allNames.length };
}

export async function getPokemonDetail(name: string) {
  return await pokeFetch<PokePokemonResponse>(`/pokemon/${encodeURIComponent(name)}`);
}

export function toPokemonListItemFromListUrl(entry: { name: string; url: string }): PokemonListItem {
  const id = toIdFromPokemonUrl(entry.url) ?? 0;
  return {
    id,
    name: entry.name,
    image: id ? officialArtworkUrl(id) : null,
    types: [],
  };
}

