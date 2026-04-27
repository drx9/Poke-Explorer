const TYPE_COLORS: Record<string, string> = {
  normal: "bg-zinc-200 text-zinc-900",
  fire: "bg-orange-200 text-orange-950",
  water: "bg-sky-200 text-sky-950",
  electric: "bg-yellow-200 text-yellow-950",
  grass: "bg-emerald-200 text-emerald-950",
  ice: "bg-cyan-200 text-cyan-950",
  fighting: "bg-red-200 text-red-950",
  poison: "bg-fuchsia-200 text-fuchsia-950",
  ground: "bg-amber-200 text-amber-950",
  flying: "bg-indigo-200 text-indigo-950",
  psychic: "bg-pink-200 text-pink-950",
  bug: "bg-lime-200 text-lime-950",
  rock: "bg-stone-200 text-stone-950",
  ghost: "bg-violet-200 text-violet-950",
  dragon: "bg-purple-200 text-purple-950",
  dark: "bg-zinc-800 text-zinc-100",
  steel: "bg-slate-200 text-slate-950",
  fairy: "bg-rose-200 text-rose-950",
};

export function typePillClass(type: string) {
  return TYPE_COLORS[type] ?? "bg-zinc-200 text-zinc-900";
}

