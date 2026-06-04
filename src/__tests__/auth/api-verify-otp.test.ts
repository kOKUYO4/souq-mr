/**
 * Tests unitaires — POST /api/auth/verify-otp
 */
import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";

async function getHandlers() {
  const send = await import("@/app/api/auth/send-otp/route");
  const verify = await import("@/app/api/auth/verify-otp/route");
  return { sendOtp: send.POST, verifyOtp: verify.POST };
}

function makeReq(path: string, body: object) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/verify-otp", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  it("retourne une erreur si phone ou otp sont absents", async () => {
    const { verifyOtp } = await getHandlers();
    const res = await verifyOtp(makeReq("/api/auth/verify-otp", { phone: "+22236000010" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("accepte le code universel 123456 en développement", async () => {
    const { verifyOtp } = await getHandlers();
    const res = await verifyOtp(makeReq("/api/auth/verify-otp", {
      phone: "+22236000011",
      otp: "123456",
    }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.token).toBeTruthy();
    expect(json.data.user).toBeTruthy();
  });

  it("retourne user et token JWT valides à la connexion", async () => {
    const { verifyOtp } = await getHandlers();
    const res = await verifyOtp(makeReq("/api/auth/verify-otp", {
      phone: "+22236000012",
      otp: "123456",
    }));
    const json = await res.json();
    const { token, user } = json.data;
    // JWT : 3 parties séparées par "."
    expect(token.split(".")).toHaveLength(3);
    expect(user.id).toBeTruthy();
    expect(user.name).toBeTruthy();
  });

  it("rejette un OTP incorrect en production", async () => {
    process.env.NODE_ENV = "production";
    const { verifyOtp } = await getHandlers();
    const res = await verifyOtp(makeReq("/api/auth/verify-otp", {
      phone: "+22236000013",
      otp: "999999",
    }));
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    process.env.NODE_ENV = "development";
  });
});
