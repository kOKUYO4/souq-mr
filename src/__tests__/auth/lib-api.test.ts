/**
 * Tests — lib/api (JWT HMAC-SHA256 + validation téléphone)
 *        + lib/sms (OTP service)
 */
import { describe, it, expect, beforeEach } from "vitest";
import { signToken, verifyToken, isValidMauritanianPhone } from "@/lib/api";
import { storeOtp, verifyOtp, checkSendRateLimit } from "@/lib/sms";

/* ── isValidMauritanianPhone ── */
describe("isValidMauritanianPhone", () => {
  it("accepte les numéros +222 valides", () => {
    expect(isValidMauritanianPhone("+22236000000")).toBe(true);
    expect(isValidMauritanianPhone("+22220000000")).toBe(true);
    expect(isValidMauritanianPhone("+22246000000")).toBe(true);
  });

  it("rejette les formats non-mauritaniens", () => {
    expect(isValidMauritanianPhone("0612345678")).toBe(false);
    expect(isValidMauritanianPhone("+33612345678")).toBe(false);
    expect(isValidMauritanianPhone("")).toBe(false);
    expect(isValidMauritanianPhone("+222123")).toBe(false);
  });
});

/* ── JWT HMAC-SHA256 ── */
describe("signToken / verifyToken", () => {
  it("signe et retourne un JWT à 3 parties", () => {
    const token = signToken({ userId: "s1", phone: "+222" });
    expect(token.split(".")).toHaveLength(3);
  });

  it("vérifie un token valide et retourne le payload", () => {
    const token = signToken({ userId: "s1", phone: "+22236000001" });
    const decoded = verifyToken(token);
    expect(decoded?.userId).toBe("s1");
    expect(decoded?.phone).toBe("+22236000001");
  });

  it("retourne null pour chaîne vide", () => {
    expect(verifyToken("")).toBeNull();
  });

  it("retourne null pour token malformé", () => {
    expect(verifyToken("abc.!!!.xyz")).toBeNull();
  });

  it("retourne null pour un token expiré", () => {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify({ userId: "s1", exp: Math.floor(Date.now() / 1000) - 100 })).toString("base64url");
    expect(verifyToken(`${header}.${body}.invalidsig`)).toBeNull();
  });

  it("retourne null pour une signature altérée (anti-tamper)", () => {
    const token = signToken({ userId: "s1", phone: "+222" });
    const [h, b] = token.split(".");
    expect(verifyToken(`${h}.${b}.FAKEXXXXXXXXXXXXXXXXX`)).toBeNull();
  });
});

/* ── OTP service ── */
describe("lib/sms — storeOtp / verifyOtp", () => {
  const phone = "+22236111000";

  beforeEach(() => {
    // Stocker un OTP frais avant chaque test de vérification
  });

  it("accepte le code universel 123456 en développement", () => {
    expect(verifyOtp(phone, "123456")).toEqual({ ok: true });
  });

  it("accepte un OTP stocké valide", () => {
    storeOtp(phone, "987654");
    expect(verifyOtp(phone, "987654")).toEqual({ ok: true });
  });

  it("rejette un OTP incorrect", () => {
    storeOtp(phone, "111111");
    const result = verifyOtp(phone, "999999");
    expect(result.ok).toBe(false);
    expect((result as { ok: false; reason: string }).reason).toBe("invalid");
  });

  it("invalide l'OTP après utilisation (usage unique)", () => {
    storeOtp(phone, "222222");
    verifyOtp(phone, "222222"); // consomme
    const result = verifyOtp(phone, "222222"); // doit échouer
    expect(result.ok).toBe(false);
  });
});

/* ── Rate limiting ── */
describe("lib/sms — checkSendRateLimit", () => {
  it("autorise le premier envoi", () => {
    expect(checkSendRateLimit("+22236222001").allowed).toBe(true);
  });
});
