"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ChevronLeft, ChevronRight, LogIn, LogOut, Search, Star, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { PokemonListItem, PokemonTypeListItem } from "@/lib/pokeapi";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonDetailModal } from "@/components/PokemonDetailModal";
import { PokeballMark } from "@/components/PokeballMark";

type PageData = { items: PokemonListItem[]; total: number };

async function fetchPage(params: { offset: number; limit: number; types: string[] }): Promise<PageData> {
  const sp = new URLSearchParams();
  sp.set("offset", String(params.offset));
  sp.set("limit", String(params.limit));
  if (params.types.length > 0) sp.set("types", params.types.join(","));

  const res = await fetch(`/api/pokemon?${sp.toString()}`);
  const data = (await res.json()) as PageData | { error: string };
  if (!res.ok) throw new Error("error" in data ? data.error : "Failed to load Pokémon");
  return data as PageData;
}

export function PokedexClient({
  initial,
  types,
  pageSize = 20,
}: {
  initial: PageData;
  types: PokemonTypeListItem[];
  pageSize?: number;
}) {
  const { data: session } = useSession();
  const [offset, setOffset] = React.useState(0);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [onlyFavorites, setOnlyFavorites] = React.useState(false);
  const [data, setData] = React.useState<PageData>(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { state: favorites, setState: setFavorites, hydrated } = useLocalStorageState<string[]>(
    "pokedex-lite:favorites",
    [],
  );

  const favoritesSet = React.useMemo(() => new Set(favorites), [favorites]);

  const [openName, setOpenName] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const maxOffset = Math.max(0, Math.floor((data.total - 1) / pageSize) * pageSize);

  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = data.items;
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    if (onlyFavorites) items = items.filter((p) => favoritesSet.has(p.name));
    return items;
  }, [data.items, favoritesSet, onlyFavorites, search]);

  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  async function refetch(next: { offset: number; types: string[] }) {
    setLoading(true);
    setError(null);
    try {
      const page = await fetchPage({ offset: next.offset, limit: pageSize, types: next.types });
      setData(page);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Pokémon");
    } finally {
      setLoading(false);
    }
  }

  function setTypesAndReset(nextTypes: string[]) {
    setSelectedTypes(nextTypes);
    setOffset(0);
    void refetch({ offset: 0, types: nextTypes });
  }

  function toggleFavorite(name: string) {
    setFavorites((prev) => {
      const s = new Set(prev);
      if (s.has(name)) s.delete(name);
      else s.add(name);
      return Array.from(s).sort((a, b) => a.localeCompare(b));
    });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,0,80,0.10),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_48%),linear-gradient(to_bottom,#f8fafc,#ffffff)]">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-50 [background-image:radial-gradient(rgba(0,0,0,0.10)_1px,transparent_1px)] [background-size:18px_18px]" />

      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/55 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <PokeballMark className="drop-shadow-sm" />
                  <div className="absolute -inset-2 -z-10 rounded-full bg-gradient-to-br from-red-300/30 to-indigo-300/20 blur-md" />
                </div>
                <div>
                  <p className="font-display text-2xl leading-none text-zinc-900">Poke Explorer</p>
                  <p className="text-sm text-zinc-600">
                    Search, filter, favorite, and inspect Pokémon.
                  </p>
                </div>
              </div>
              <div className="sm:hidden">
                {session ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn()}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative w-full sm:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className={cn(
                    "h-11 w-full rounded-full border border-white/40 bg-white/70 pl-10 pr-10 text-sm shadow-sm backdrop-blur",
                    "text-zinc-900 placeholder:text-zinc-500",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-300/60",
                  )}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    setTypesAndReset(selectedTypes.includes(v) ? selectedTypes : [...selectedTypes, v]);
                  }}
                  className={cn(
                    "h-11 rounded-full border border-white/40 bg-white/70 px-4 text-sm capitalize shadow-sm backdrop-blur",
                    "text-zinc-900",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-300/60",
                  )}
                >
                  <option value="">Filter by type…</option>
                  {types.map((t) => (
                    <option key={t.name} value={t.name} className="capitalize">
                      {t.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setOnlyFavorites((v) => !v)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    onlyFavorites
                      ? "border-amber-300 bg-amber-200/70 text-amber-950 shadow-sm"
                      : "border-white/40 bg-white/70 text-zinc-800 hover:bg-white shadow-sm",
                  )}
                  disabled={!hydrated}
                >
                  <Star className={cn("h-4 w-4", onlyFavorites && "fill-current")} />
                  Favorites
                </button>

                <div className="hidden sm:block">
                  {session ? (
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signIn()}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-600">
              Showing <span className="font-medium text-zinc-900">{filteredItems.length}</span> of{" "}
              <span className="font-medium text-zinc-900">{data.items.length}</span> on this page
              {selectedTypes.length > 0 ? (
                <>
                  {" "}
                  (filtered by{" "}
                  <span className="font-medium text-zinc-900">{selectedTypes.join(", ")}</span>)
                </>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!hasPrev) return;
                  const nextOffset = Math.max(0, offset - pageSize);
                  setOffset(nextOffset);
                  void refetch({ offset: nextOffset, types: selectedTypes });
                }}
                disabled={!hasPrev || loading}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 text-sm font-medium shadow-sm backdrop-blur",
                  "text-zinc-900",
                  "disabled:opacity-50",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!hasNext) return;
                  const nextOffset = Math.min(maxOffset, offset + pageSize);
                  setOffset(nextOffset);
                  void refetch({ offset: nextOffset, types: selectedTypes });
                }}
                disabled={!hasNext || loading}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 text-sm font-medium shadow-sm backdrop-blur",
                  "text-zinc-900",
                  "disabled:opacity-50",
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter indicators row (keeps navbar height stable) */}
          <div className="mt-3 min-h-[40px]">
            {selectedTypes.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {selectedTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypesAndReset(selectedTypes.filter((x) => x !== t))}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white capitalize shadow-sm"
                  >
                    {t}
                    <X className="h-3.5 w-3.5 opacity-80" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTypesAndReset([])}
                  className="rounded-full border border-white/40 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm hover:bg-white"
                >
                  Clear types
                </button>
              </div>
            ) : (
              <div className="opacity-0">spacer</div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center gap-3 text-sm text-zinc-700">
            <span className="relative inline-flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400/40" />
              <span className="relative inline-flex h-5 w-5 rounded-full bg-indigo-500/70" />
            </span>
            Loading… <span className="text-zinc-500">Fetching Pokémon data</span>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
            <p className="text-base font-semibold">No Pokémon found</p>
            <p className="mt-1 text-sm text-zinc-600">
              Try clearing filters, changing the type selection, or adjusting your search term.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                Clear search
              </button>
              <button
                type="button"
                onClick={() => setTypesAndReset([])}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                Clear types
              </button>
              <button
                type="button"
                onClick={() => setOnlyFavorites(false)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                Show all
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.04 } },
            }}
          >
            {filteredItems.map((p) => (
              <motion.div
                key={p.name}
                variants={{
                  hidden: { opacity: 0, y: 8, scale: 0.98 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <PokemonCard
                  pokemon={p}
                  isFavorite={favoritesSet.has(p.name)}
                  onToggleFavorite={() => toggleFavorite(p.name)}
                  onOpen={() => {
                    setOpenName(p.name);
                    setModalOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <PokemonDetailModal
        name={openName}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isFavorite={openName ? favoritesSet.has(openName) : false}
        onToggleFavorite={() => {
          if (openName) toggleFavorite(openName);
        }}
      />
    </div>
  );
}

