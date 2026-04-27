export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-black/10 bg-white p-8">
          <p className="text-base font-semibold">Loading Pokédex…</p>
          <p className="mt-2 text-sm text-zinc-600">Fetching Pokémon data from PokéAPI.</p>
        </div>
      </div>
    </div>
  );
}

