/**
 * Tests unitaires — POST /api/auth/send-otp
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// vi.mock est hoisté — déclaré ici, exécuté avant les imports
vi.mock("@/lib/sms", () => ({
  checkSendRateLimit: vi.fn(),
  sendOtpSms: vi.fn(),
}));

import { POST } from "@/app/api/auth/send-otp/route";
import { checkSendRateLimit, sendOtpSms } from "@/lib/sms";

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/send-otp", () => {
  beforeEach(() => {
    vi.mocked(checkSendRateLimit).mockReturnValue({ allowed: true });
    vi.mocked(sendOtpSms).mockResolvedValue({ success: true, devOtp: "654321" });
  });

  it("retourne 400 si le téléphone est absent", async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
  });

  it("retourne 400 si le format est invalide", async () => {
    const res = await POST(makeReq({ phone: "0612345678" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/mauritanien|invalide/i);
  });

  it("retourne 200 avec un numéro +222 valide", async () => {
    const res = await POST(makeReq({ phone: "+22236000001" }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  it("normalise les espaces dans le numéro", async () => {
    const res = await POST(makeReq({ phone: "+222 36 00 00 01" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.phone).toBe("+22236000001");
  });

  it("retourne 429 si le rate limit est dépassé", async () => {
    vi.mocked(checkSendRateLimit).mockReturnValue({ allowed: false, waitSeconds: 300 });
    const res = await POST(makeReq({ phone: "+22236000002" }));
    expect(res.status).toBe(429);
  });

  it("retourne 503 si l'envoi SMS échoue", async () => {
    vi.mocked(sendOtpSms).mockResolvedValue({ success: false, error: "Service SMS indisponible" });
    const res = await POST(makeReq({ phone: "+22236000003" }));
    expect(res.status).toBe(503);
  });
});
