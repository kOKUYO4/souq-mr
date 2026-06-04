import { NextRequest, NextResponse } from "next/server";
import { ok, err, signToken, type VerifyOtpBody } from "@/lib/api";
import { verifyOtp as checkOtp } from "@/lib/sms";
import { sellers } from "@/data/mockData";

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

  const user = sellers[0]; // TODO: lookup ou création réelle en base
  const payload = { userId: user.id, phone: normalized, name: user.name, badge: user.badge };
  const token = signToken(payload);

  const res = ok({ user, token }) as NextResponse;

  // Cookie HTTP-only — protège contre XSS
  res.headers.set(
    "Set-Cookie",
    `souq-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
  );

  return res;
}
