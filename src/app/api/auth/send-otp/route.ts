import { NextRequest } from "next/server";
import { ok, err, isValidMauritanianPhone, type OtpBody } from "@/lib/api";
import { checkSendRateLimit, sendOtpSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const { phone }: OtpBody = await req.json();

  if (!phone) return err("Numéro de téléphone requis");

  const normalized = phone.replace(/\s/g, "");
  if (!isValidMauritanianPhone(normalized)) {
    return err("Numéro mauritanien invalide (format : +222 XX XX XX XX)");
  }

  const limit = checkSendRateLimit(normalized);
  if (!limit.allowed) {
    return err(
      `Trop de tentatives. Réessayez dans ${Math.ceil((limit.waitSeconds ?? 60) / 60)} minute(s).`,
      429
    );
  }

  const result = await sendOtpSms(normalized);
  if (!result.success) return err(result.error ?? "Impossible d'envoyer le SMS.", 503);

  return ok({ message: "Code envoyé par SMS", phone: normalized, devOtp: result.devOtp });
}
