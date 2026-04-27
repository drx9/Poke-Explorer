import { getAllTypes, getPokemonPage } from "@/lib/pokeapi";
import { PokedexClient } from "./PokedexClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [types, initial] = await Promise.all([getAllTypes(), getPokemonPage({ offset: 0, limit: 20 })]);
  return <PokedexClient initial={initial} types={types} pageSize={20} />;
}
