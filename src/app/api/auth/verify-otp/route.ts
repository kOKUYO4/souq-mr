import { NextRequest, NextResponse } from "next/server";
import { ok, err, signToken, type VerifyOtpBody } from "@/lib/api";
import { sellers } from "@/data/mockData";

/* Même store que send-otp — en prod : Redis partagé */
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

/* POST /api/auth/verify-otp */
export async function POST(req: NextRequest) {
  const { phone, otp }: VerifyOtpBody = await req.json();

  if (!phone || !otp) return err("Téléphone et OTP requis");

  const stored = otpStore.get(phone);

  /* En dev : accepte "123456" comme OTP universel */
  const isDev = process.env.NODE_ENV === "development";
  const isValid = isDev
    ? otp === "123456" || stored?.otp === otp
    : stored?.otp === otp && stored.expires > Date.now();

  if (!isValid) return err("Code OTP invalide ou expiré", 401);

  /* Nettoie l'OTP utilisé */
  otpStore.delete(phone);

  /* Trouve ou crée l'utilisateur */
  const user = sellers[0];
  const payload = { userId: user.id, phone, name: user.name, badge: user.badge };
  const token = signToken(payload);

  const res = ok({ user, token });

  /* Cookie HTTP-only sécurisé */
  (res as NextResponse).headers.set(
    "Set-Cookie",
    `souq-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`
  );

  return res;
}
