import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { categories } from "@/data/categories";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("listings")
      .select("category")
      .eq("status", "active");

    const counts: Record<string, number> = {};
    (data ?? []).forEach((l: any) => { counts[l.category] = (counts[l.category] ?? 0) + 1; });

    const enriched = categories.map((c: any) => ({ ...c, count: counts[c.slug] ?? 0 }));
    return ok(enriched);
  } catch {
    return ok(categories);
  }
}
