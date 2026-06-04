/**
 * Tests unitaires — helpers lib/api (JWT, validation téléphone)
 */
import { describe, it, expect } from "vitest";
import { signToken, verifyToken, isValidMauritanianPhone } from "@/lib/api";

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
    expect(isValidMauritanianPhone("+222123")).toBe(false); // trop court
  });
});

describe("signToken / verifyToken", () => {
  it("signe et retourne un JWT à 3 parties", () => {
    const payload = { userId: "s1", phone: "+22236000001", name: "Test", badge: "pro" as const };
    const token = signToken(payload);
    expect(token.split(".")).toHaveLength(3);
  });

  it("vérifie un token valide et retourne le payload", () => {
    const payload = { userId: "s1", phone: "+22236000001", name: "Test", badge: "pro" as const };
    const token = signToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("s1");
    expect(decoded?.phone).toBe("+22236000001");
  });

  it("retourne null pour une chaîne vide", () => {
    expect(verifyToken("")).toBeNull();
  });

  it("retourne null pour un token malformé (pas de JSON valide)", () => {
    // corps non-base64 valide
    expect(verifyToken("abc.!!!.xyz")).toBeNull();
  });

  it("retourne null pour un token expiré", () => {
    // Forger un payload avec exp dans le passé
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify({ userId: "s1", exp: Date.now() - 1000 }));
    const expired = `${header}.${body}.fakesig`;
    expect(verifyToken(expired)).toBeNull();
  });
});
