import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { sellers } from "@/data/mockData";

let supabaseAdmin: ReturnType<typeof import("@/lib/supabase").getSupabaseAdmin> | null = null;
function getAdmin() {
  if (!supabaseAdmin) {
    const { getSupabaseAdmin } = require("@/lib/supabase");
    supabaseAdmin = getSupabaseAdmin();
  }
  return supabaseAdmin;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const sort = searchParams.get("sort") ?? "rating"; // rating | listings | newest

  try {
    const admin = getAdmin();
    let query = admin.from("profiles").select("*").eq("is_active", true).limit(limit);

    if (sort === "rating") query = query.order("rating", { ascending: false });
    else if (sort === "listings") query = query.order("listings_count", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return ok(data ?? []);
  } catch {
    // Fallback to mockData if Supabase not configured
    let result = [...sellers];
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "listings") result.sort((a, b) => b.listings - a.listings);
    else result.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
    return ok(result.slice(0, limit));
  }
}
