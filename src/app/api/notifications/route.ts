import { NextRequest } from "next/server";
import { ok, err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("notifications")
    .select("*")
    .eq("user_id", payload.userId as string)
    .order("created_at", { ascending: false })
    .limit(30);

  const unread = (data ?? []).filter((n: any) => !n.read).length;
  return ok({ notifications: data ?? [], unread });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const admin = getSupabaseAdmin();
  await admin.from("notifications").update({ read: true }).eq("user_id", payload.userId as string).eq("read", false);
  return ok({ marked: true });
}
