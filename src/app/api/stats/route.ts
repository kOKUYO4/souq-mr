import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

/* GET /api/stats — statistiques dashboard vendeur */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("nuqta-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "") || getTokenFromRequest(req);
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const admin = getSupabaseAdmin();
  const userId = payload.userId as string;

  const [{ count: listingsCount }, { count: activeCount }, { data: listings }] = await Promise.all([
    admin.from("listings").select("*", { count: "exact", head: true }).eq("seller_id", userId).neq("status", "deleted"),
    admin.from("listings").select("*", { count: "exact", head: true }).eq("seller_id", userId).eq("status", "active"),
    admin.from("listings").select("views, title").eq("seller_id", userId).neq("status", "deleted").order("views", { ascending: false }).limit(5),
  ]);

  const totalViews = (listings ?? []).reduce((acc: number, l: any) => acc + (l.views ?? 0), 0);

  return ok({
    listings_count: listingsCount ?? 0,
    active_count: activeCount ?? 0,
    total_views: totalViews,
    top_listings: listings ?? [],
  });
}
