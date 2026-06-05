import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

/* GET /api/profile/[id] */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", params.id).single();
  if (!profile) return err("Profil introuvable", 404);

  const { data: listings } = await admin
    .from("listings")
    .select("*")
    .eq("seller_id", params.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return ok({ profile, listings: listings ?? [] });
}

/* PATCH /api/profile/[id] — mettre à jour le profil */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return err(error.message);
  return ok(data);
}
