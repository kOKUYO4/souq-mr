/**
 * Service SMS sécurisé — Twilio (production) + console (développement)
 * Gère l'envoi OTP, le stockage sécurisé et le rate limiting.
 */

import crypto from "crypto";

/* ── Configuration ── */
const isDev = process.env.NODE_ENV !== "production";

interface OtpRecord {
  hash: string;      // SHA-256 du code OTP — jamais stocké en clair
  expires: number;
  attempts: number;  // tentatives d'envoi (anti-spam)
  verifyAttempts: number; // tentatives de vérification (brute-force)
}

/* Store en mémoire pour dev/preview — en prod brancher Vercel KV (Redis) */
const otpStore = new Map<string, OtpRecord>();

/* Nettoyage automatique des entrées expirées toutes les 5 min */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    otpStore.forEach((val, key) => {
      if (val.expires < now) otpStore.delete(key);
    });
  }, 5 * 60 * 1000);
}

/* ── Génération OTP cryptographiquement sûre ── */
function generateOtp(): string {
  const buf = crypto.randomBytes(3);
  const num = (buf.readUIntBE(0, 3) % 900000) + 100000;
  return num.toString();
}

function hashOtp(otp: string, phone: string): string {
  const salt = process.env.JWT_SECRET ?? "nuqta-mr-otp-salt";
  return crypto.createHmac("sha256", salt).update(`${phone}:${otp}`).digest("hex");
}

/* ── Rate limiting ── */
export interface RateLimitResult {
  allowed: boolean;
  waitSeconds?: number;
}

export function checkSendRateLimit(phone: string): RateLimitResult {
  const existing = otpStore.get(phone);
  if (!existing) return { allowed: true };

  // Max 3 envois par fenêtre de 10 min
  if (existing.attempts >= 3 && existing.expires > Date.now()) {
    const waitSeconds = Math.ceil((existing.expires - Date.now()) / 1000);
    return { allowed: false, waitSeconds };
  }
  return { allowed: true };
}

/* ── Stockage OTP ── */
export function storeOtp(phone: string, otp: string): void {
  const existing = otpStore.get(phone);
  otpStore.set(phone, {
    hash: hashOtp(otp, phone),
    expires: Date.now() + 10 * 60 * 1000, // 10 min
    attempts: (existing?.attempts ?? 0) + 1,
    verifyAttempts: 0,
  });
}

/* ── Vérification OTP ── */
export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "max_attempts" };

export function verifyOtp(phone: string, otp: string): VerifyResult {
  const stored = otpStore.get(phone);

  // En dev : code universel 123456 accepté sans store
  if (isDev && otp === "123456") return { ok: true };

  if (!stored) return { ok: false, reason: "invalid" };
  if (stored.expires < Date.now()) { otpStore.delete(phone); return { ok: false, reason: "expired" }; }

  // Max 5 tentatives de vérification par code (anti brute-force)
  if (stored.verifyAttempts >= 5) { otpStore.delete(phone); return { ok: false, reason: "max_attempts" }; }

  const expected = hashOtp(otp, phone);
  // Comparaison en temps constant (anti-timing attack)
  const match = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(stored.hash));

  if (!match) {
    stored.verifyAttempts += 1;
    return { ok: false, reason: "invalid" };
  }

  otpStore.delete(phone); // OTP à usage unique
  return { ok: true };
}

/* ── Envoi SMS via Twilio ── */
export interface SendSmsResult {
  success: boolean;
  devOtp?: string;
  error?: string;
}

export async function sendOtpSms(phone: string): Promise<SendSmsResult> {
  const otp = generateOtp();
  storeOtp(phone, otp);

  // En développement : log + retourner l'OTP pour tester sans SMS
  if (isDev) {
    console.log(`\n🔐 [DEV] OTP pour ${phone}: ${otp}\n`);
    return { success: true, devOtp: otp };
  }

  // En production : envoi Twilio
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  console.log("[SMS] Config check — SID:", sid ? `${sid.slice(0,8)}...` : "MANQUANT", "| FROM:", from ?? "MANQUANT");

  if (!sid || !token || !from) {
    const missing = [!sid && "TWILIO_ACCOUNT_SID", !token && "TWILIO_AUTH_TOKEN", !from && "TWILIO_PHONE_NUMBER"].filter(Boolean).join(", ");
    console.error(`[SMS] Variables manquantes : ${missing}`);
    return { success: false, error: "Service SMS non configuré" };
  }

  try {
    const { default: twilio } = await import("twilio");
    const client = twilio(sid, token);

    const msg = await client.messages.create({
      to: phone,
      from,
      body: `Votre code NUQTA.MR : ${otp}\n\nValide 10 minutes. Ne le partagez jamais.\n\nرمز نقطة.مر: ${otp}`,
    });

    console.log(`[SMS] Envoyé — SID message: ${msg.sid} | Statut: ${msg.status}`);
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[SMS] Erreur Twilio:", msg);
    return { success: false, error: "Impossible d'envoyer le SMS. Réessayez." };
  }
}
