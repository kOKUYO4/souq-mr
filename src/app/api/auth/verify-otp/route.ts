import { NextRequest, NextResponse } from "next/server";
import { ok, err, signToken, type VerifyOtpBody } from "@/lib/api";
import { verifyOtp as checkOtp } from "@/lib/sms";
import { getProfileByPhone, upsertProfile } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { phone, otp }: VerifyOtpBody = await req.json();

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

  // Récupérer ou créer le profil dans Supabase
  let profile = await getProfileByPhone(normalized);

  if (!profile) {
    // Nouveau utilisateur — créer un UUID stable basé sur le téléphone
    const crypto = await import("crypto");
    const userId = crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 36)
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*/, "$1-$2-$3-$4-$5");

    profile = await upsertProfile(userId, normalized, {
      name: "Utilisateur SOUQ.MR",
      name_ar: "مستخدم سوق.مر",
      badge: "regular",
    });
  }

  // Fallback si Supabase non configuré (dev sans .env.local)
  const userId = profile?.id ?? normalized;
  const userName = profile?.name ?? "Utilisateur";
  const userBadge = profile?.badge ?? "regular";

  const payload = { userId, phone: normalized, name: userName, badge: userBadge };
  const token = signToken(payload);

  const res = ok({ user: profile ?? { id: userId, phone: normalized, name: userName, badge: userBadge }, token }) as NextResponse;

  res.headers.set(
    "Set-Cookie",
    `souq-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
  );

  return res;
}
