"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { TypePill } from "./TypePill";

type Detail = {
  id: number;
  name: string;
  sprites?: {
    other?: { ["official-artwork"]?: { front_default?: string | null } };
    front_default?: string | null;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
};

function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.round((value / 200) * 100));
  return (
    <div className="grid grid-cols-[110px_1fr_44px] items-center gap-3">
      <p className="text-sm font-medium capitalize text-zinc-700">{label.replace("-", " ")}</p>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full rounded-full bg-zinc-900" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-right text-sm tabular-nums text-zinc-700">{value}</p>
    </div>
  );
}

export function PokemonDetailModal({
  name,
  open,
  onClose,
  isFavorite,
  onToggleFavorite,
}: {
  name: string | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [detail, setDetail] = React.useState<Detail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !name) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      setDetail(null);
      try {
        const res = await fetch(`/api/pokemon/${encodeURIComponent(name)}`);
        const data = (await res.json()) as Detail | { error: string };
        if (!res.ok) throw new Error("error" in data ? data.error : "Failed to load details");
        if (!cancelled) setDetail(data as Detail);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [name, open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const image =
    detail?.sprites?.other?.["official-artwork"]?.front_default ??
    detail?.sprites?.front_default ??
    null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={cn(
              "w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl",
              "border border-black/10",
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold capitalize text-zinc-900">
                  {name ?? "Pokémon"}
                </p>
                {detail && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {detail.types.map((t) => (
                      <TypePill key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isFavorite
                      ? "bg-rose-100 text-rose-700"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                  {isFavorite ? "Favorited" : "Favorite"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-[220px_1fr]">
              <div className="flex items-center justify-center rounded-2xl bg-zinc-50 p-4">
                {image ? (
                  <Image
                    src={image}
                    alt={name ?? "pokemon"}
                    width={220}
                    height={220}
                    className="h-44 w-44 object-contain"
                    priority
                  />
                ) : (
                  <div className="h-44 w-44 rounded-xl bg-zinc-100" />
                )}
              </div>

              <div className="space-y-5">
                {loading && (
                  <div className="space-y-3">
                    <div className="h-4 w-2/3 rounded bg-zinc-100" />
                    <div className="h-4 w-1/2 rounded bg-zinc-100" />
                    <div className="h-24 w-full rounded bg-zinc-100" />
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                {detail && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-black/10 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Height
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">
                          {(detail.height / 10).toFixed(1)} m
                        </p>
                      </div>
                      <div className="rounded-xl border border-black/10 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Weight
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">
                          {(detail.weight / 10).toFixed(1)} kg
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Abilities</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {detail.abilities.map((a) => (
                          <span
                            key={a.ability.name}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-sm capitalize text-zinc-800"
                          >
                            {a.ability.name.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Stats</p>
                      <div className="mt-3 space-y-2">
                        {detail.stats.map((s) => (
                          <StatBar key={s.stat.name} label={s.stat.name} value={s.base_stat} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

