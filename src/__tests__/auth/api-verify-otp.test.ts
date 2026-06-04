/**
 * Tests unitaires — POST /api/auth/verify-otp
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sms", () => ({
  verifyOtp: vi.fn(),
}));

import { POST } from "@/app/api/auth/verify-otp/route";
import { verifyOtp } from "@/lib/sms";

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/verify-otp", () => {
  beforeEach(() => {
    vi.mocked(verifyOtp).mockReturnValue({ ok: true });
  });

  it("retourne 400 si phone ou otp sont absents", async () => {
    const res = await POST(makeReq({ phone: "+22236000010" }));
    expect(res.status).toBe(400);
  });

  it("retourne 200 avec token JWT valide et user", async () => {
    const res = await POST(makeReq({ phone: "+22236000011", otp: "123456" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.token.split(".")).toHaveLength(3);
    expect(json.data.user).toBeTruthy();
  });

  it("pose un cookie HTTP-only SameSite=Strict", async () => {
    const res = await POST(makeReq({ phone: "+22236000012", otp: "123456" }));
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/souq-token=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Strict/i);
  });

  it("retourne 401 avec message 'invalide' si OTP incorrect", async () => {
    vi.mocked(verifyOtp).mockReturnValue({ ok: false, reason: "invalid" });
    const res = await POST(makeReq({ phone: "+22236000013", otp: "000000" }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/invalide/i);
  });

  it("retourne 401 avec message 'expiré' si OTP expiré", async () => {
    vi.mocked(verifyOtp).mockReturnValue({ ok: false, reason: "expired" });
    const res = await POST(makeReq({ phone: "+22236000014", otp: "123456" }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/expiré/i);
  });

  it("retourne 401 avec message 'tentatives' si brute-force détecté", async () => {
    vi.mocked(verifyOtp).mockReturnValue({ ok: false, reason: "max_attempts" });
    const res = await POST(makeReq({ phone: "+22236000015", otp: "123456" }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/tentatives/i);
  });
});
