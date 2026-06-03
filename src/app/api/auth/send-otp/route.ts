import { NextRequest } from "next/server";
import { ok, err, isValidMauritanianPhone, type OtpBody } from "@/lib/api";

/* Stockage OTP en mémoire (dev) — en prod utiliser Redis */
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

/* POST /api/auth/send-otp */
export async function POST(req: NextRequest) {
  const { phone }: OtpBody = await req.json();

  if (!phone) return err("Numéro de téléphone requis");
  if (!isValidMauritanianPhone(phone)) return err("Numéro mauritanien invalide (format : +222 XX XX XX XX)");

  /* Anti-spam : max 3 tentatives en 10 min */
  const existing = otpStore.get(phone);
  if (existing && existing.attempts >= 3 && existing.expires > Date.now()) {
    return err("Trop de tentatives. Réessayez dans 10 minutes.", 429);
  }

  /* Génère un OTP à 6 chiffres */
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 min

  otpStore.set(phone, { otp, expires, attempts: (existing?.attempts ?? 0) + 1 });

  /* En production : envoyer via API SMS mauritanienne (Mauritel, Mattel, Chinguitel) */
  console.log(`[DEV] OTP pour ${phone}: ${otp}`);

  return ok({
    message: "Code OTP envoyé",
    phone,
    /* En dev : on renvoie l'OTP pour tester (retirer en prod) */
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  });
}
