/**
 * Tests unitaires — POST /api/auth/send-otp
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Résolution dynamique pour éviter le cache du module entre tests
async function getSendOtp() {
  vi.resetModules();
  const mod = await import("@/app/api/auth/send-otp/route");
  return mod.POST;
}

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/send-otp", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  it("retourne une erreur si le téléphone est absent", async () => {
    const POST = await getSendOtp();
    const res = await POST(makeReq({}));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBeTruthy();
  });

  it("retourne une erreur si le format est invalide", async () => {
    const POST = await getSendOtp();
    const res = await POST(makeReq({ phone: "0612345678" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/mauritanien|invalide/i);
  });

  it("accepte un numéro mauritanien valide (+222...)", async () => {
    const POST = await getSendOtp();
    const res = await POST(makeReq({ phone: "+22236000001" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.message).toBeTruthy();
  });

  it("renvoie le devOtp en mode développement", async () => {
    const POST = await getSendOtp();
    const res = await POST(makeReq({ phone: "+22236000002" }));
    const json = await res.json();
    expect(json.data.devOtp).toMatch(/^\d{6}$/);
  });

  it("ne renvoie pas le devOtp en mode production", async () => {
    process.env.NODE_ENV = "production";
    const POST = await getSendOtp();
    const res = await POST(makeReq({ phone: "+22236000003" }));
    const json = await res.json();
    expect(json.data.devOtp).toBeUndefined();
    process.env.NODE_ENV = "development";
  });
});
