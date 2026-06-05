import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const location = searchParams.get("location");
  const condition = searchParams.get("condition");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const admin = getSupabaseAdmin();
  let query = admin
    .from("listings")
    .select("*, profiles!seller_id(id,name,name_ar,avatar,badge,rating)", { count: "exact" })
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,title_ar.ilike.%${q}%`);
  if (category) query = query.eq("category", category);
  if (minPrice) query = query.gte("price", parseFloat(minPrice));
  if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
  if (location) query = query.ilike("location", `%${location}%`);
  if (condition) query = query.eq("condition", condition);

  const { data, count } = await query;
  return ok({ listings: data ?? [], total: count ?? 0 });
}
