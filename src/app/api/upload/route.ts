import { NextRequest, NextResponse } from "next/server";
import { err, verifyToken } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("souq-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return err("Non authentifié", 401);
  const payload = verifyToken(token);
  if (!payload) return err("Token invalide", 401);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return err("Fichier manquant");

  // Validate
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) return err("Format non supporté (jpeg, png, webp uniquement)");
  if (file.size > 5 * 1024 * 1024) return err("Fichier trop grand (max 5 MB)");

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${payload.userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = getSupabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();
  const { data, error } = await admin.storage
    .from("listings")
    .upload(filename, arrayBuffer, { contentType: file.type, upsert: false });

  if (error) return err(error.message);

  const { data: { publicUrl } } = admin.storage.from("listings").getPublicUrl(filename);
  return NextResponse.json({ ok: true, data: { url: publicUrl, path: data.path } });
}
