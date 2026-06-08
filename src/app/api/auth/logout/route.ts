import { NextResponse } from "next/server";

/* POST /api/auth/logout */
export async function POST() {
  const res = NextResponse.json({ success: true, message: "Déconnecté" });
  res.headers.set("Set-Cookie", "nuqta-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  return res;
}
