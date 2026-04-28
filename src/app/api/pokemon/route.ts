import { NextResponse } from "next/server";
import { getPokemonPage } from "@/lib/pokeapi";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset") ?? "0");
    const limit = Number(searchParams.get("limit") ?? "20");
    const types = (searchParams.get("types") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const search = searchParams.get("search") ?? "";

    if (!Number.isFinite(offset) || offset < 0) {
      return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
    }
    if (!Number.isFinite(limit) || limit <= 0 || limit > 50) {
      return NextResponse.json({ error: "Invalid limit" }, { status: 400 });
    }

    const page = await getPokemonPage({ offset, limit, types, search });
    return NextResponse.json(page);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

