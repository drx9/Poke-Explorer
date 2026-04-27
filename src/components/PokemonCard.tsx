"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { PokemonListItem } from "@/lib/pokeapi";
import { TypePill } from "./TypePill";

export function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  pokemon: PokemonListItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full cursor-pointer select-none overflow-hidden rounded-2xl border border-white/30 bg-white/70 text-left shadow-sm backdrop-blur",
        "transition-all hover:-translate-y-0.5 hover:border-white/60 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-indigo-300/60",
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/10 via-transparent to-rose-400/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "absolute right-3 top-3 z-10 rounded-full p-2 transition-colors",
          isFavorite ? "bg-rose-200/80 text-rose-800" : "bg-white/70 text-zinc-700 hover:bg-white",
          "focus:outline-none focus:ring-2 focus:ring-indigo-300/60",
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </button>

      <div className="[perspective:1200px]">
        <div
          className={cn(
            "relative min-h-[264px] w-full transition-transform duration-500",
            "[transform-style:preserve-3d]",
            "group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]",
          )}
        >
          {/* Front */}
          <div className={cn("absolute inset-0 p-4", "[backface-visibility:hidden]")}>
            <div className="flex items-start justify-between gap-3 pr-9">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-base font-semibold capitalize text-zinc-900">
                    {pokemon.name}
                  </p>
                  <span className="text-xs tabular-nums text-zinc-500">#{pokemon.id}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pokemon.types.slice(0, 2).map((t) => (
                    <TypePill key={t} type={t} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex h-[160px] items-center justify-center overflow-hidden rounded-xl">
              {pokemon.image ? (
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={160}
                  height={160}
                  className="h-40 w-40 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-[1.06]"
                  priority={pokemon.id <= 12}
                />
              ) : (
                <div className="h-40 w-40 rounded-xl bg-zinc-100" />
              )}
            </div>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl p-4",
              "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            )}
          >
            <div className="flex h-full min-h-[264px] flex-col justify-between">
              <div className="pr-9">
                <p className="font-display text-lg text-zinc-900">
                  {pokemon.name.toUpperCase()}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Dex #{pokemon.id} • {pokemon.types.length ? pokemon.types.join(" / ") : "—"}
                </p>

                <div className="mt-4 rounded-xl border border-white/40 bg-white/60 px-3 py-2 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Types
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pokemon.types.length ? (
                      pokemon.types.map((t) => <TypePill key={t} type={t} />)
                    ) : (
                      <span className="text-sm text-zinc-600">—</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/40 bg-white/60 px-3 py-2 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      Favorite
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {isFavorite ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/40 bg-white/60 px-3 py-2 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      Details
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">Click to open</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>Hover to flip</span>
                <span className="font-medium text-zinc-700">Click to inspect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

