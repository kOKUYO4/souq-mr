import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken, signToken } from "@/lib/api";
import { sellers } from "@/data/mockData";

export async function POST(req: NextRequest) {
  const tokenData = getTokenFromRequest(req);
  if (!tokenData) return err("Non authentifié — effectuez d'abord la vérification OTP", 401);

  const user = verifyToken(tokenData);
  if (!user) return err("Token invalide", 401);

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) return err("Le nom est requis");

  // Find and update user data (in-memory for dev)
  const seller = sellers.find((s) => s.id === user.id) || sellers[0];
  const updated = {
    ...seller,
    name: body.name.trim(),
    nameAr: body.nameAr?.trim() || body.name.trim(),
  };

  // Issue new token with updated name
  const newToken = signToken({ id: updated.id, phone: updated.phone, name: updated.name });

  const res = ok({ user: updated, token: newToken });
  res.headers.set("Set-Cookie", `souq-token=${newToken}; Path=/; HttpOnly; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);
  return res;
}
