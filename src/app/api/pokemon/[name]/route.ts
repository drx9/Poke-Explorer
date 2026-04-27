import { NextResponse } from "next/server";
import { getPokemonDetail } from "@/lib/pokeapi";

export async function GET(_: Request, ctx: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await ctx.params;
    const detail = await getPokemonDetail(name);
    return NextResponse.json(detail);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

