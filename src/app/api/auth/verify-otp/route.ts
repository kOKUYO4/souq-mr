import { NextRequest, NextResponse } from "next/server";
import { ok, err, signToken, type VerifyOtpBody } from "@/lib/api";
import { verifyOtp as checkOtp } from "@/lib/sms";
import { getProfileByPhone, upsertProfile } from "@/lib/db";
import { supabaseConfigured } from "@/lib/supabase";
import crypto from "crypto";

/* Génère un UUID v4 déterministe à partir d'un numéro de téléphone */
function phoneToUuid(phone: string): string {
  const hash = crypto.createHash("sha256").update(`souq:${phone}`).digest("hex");
  // Format UUID v4 : xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),          // version 4
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20), // variant
    hash.slice(20, 32),
  ].join("-");
}

export async function POST(req: NextRequest) {
  const body: VerifyOtpBody = await req.json();
  const { phone, otp } = body;

  if (!phone || !otp) return err("Téléphone et OTP requis");

  const normalized = phone.replace(/\s/g, "");
  const result = checkOtp(normalized, otp);

  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      invalid: "Code OTP invalide",
      expired: "Code OTP expiré. Demandez un nouveau code.",
      max_attempts: "Trop de tentatives. Demandez un nouveau code.",
    };
    return err(messages[result.reason], 401);
  }

  // ── Créer ou récupérer le profil dans Supabase ──────────────────────────
  let profile = null;

  if (supabaseConfigured) {
    try {
      // 1. Chercher un profil existant par téléphone
      profile = await getProfileByPhone(normalized);

      if (!profile) {
        // 2. Nouvel utilisateur — UUID déterministe basé sur le téléphone
        const newId = phoneToUuid(normalized);
        profile = await upsertProfile(newId, normalized, {
          name:     "Utilisateur NUQTA.MR",
          name_ar:  "مستخدم نقطة.مر",
          badge:    "regular",
          is_active: true,
        });

        if (profile) {
          console.log(`[auth] Nouveau profil créé — id: ${profile.id} phone: ${normalized}`);
        } else {
          console.error("[auth] Échec création profil Supabase pour", normalized);
        }
      }
    } catch (e) {
      // Ne pas bloquer la connexion si Supabase échoue — dégrader gracieusement
      console.error("[auth] Erreur Supabase:", e instanceof Error ? e.message : e);
    }
  }

  // ── Fallback si Supabase non configuré ou erreur ─────────────────────────
  const userId   = profile?.id    ?? phoneToUuid(normalized);
  const userName = profile?.name  ?? "Utilisateur";
  const userBadge = profile?.badge ?? "regular";

  const jwtPayload = { userId, phone: normalized, name: userName, badge: userBadge };
  const token = signToken(jwtPayload);

  const userResponse = profile ?? {
    id:          userId,
    phone:       normalized,
    name:        userName,
    name_ar:     "مستخدم",
    badge:       userBadge,
    rating:      0,
    reviews_count: 0,
    listings_count: 0,
    is_active:   true,
    created_at:  new Date().toISOString(),
  };

  const res = ok({ user: userResponse, token }) as NextResponse;

  res.headers.set(
    "Set-Cookie",
    [
      `nuqta-token=${token}`,
      "HttpOnly",
      "Path=/",
      `Max-Age=${7 * 24 * 3600}`,
      "SameSite=Strict",
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; ")
  );

  return res;
}
