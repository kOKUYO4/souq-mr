import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

/* GET /api/auth/me — profil utilisateur connecté */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("nuqta-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "") || getTokenFromRequest(req);
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", payload.userId as string)
    .single();

  if (error || !data) return err("Profil introuvable", 404);
  return ok(data);
}
