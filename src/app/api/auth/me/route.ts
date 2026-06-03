import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { sellers } from "@/data/mockData";

/* GET /api/auth/me — profil utilisateur connecté */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return err("Non authentifié", 401);

  const payload = verifyToken(token);
  if (!payload) return err("Token invalide ou expiré", 401);

  const user = sellers.find((s) => s.id === payload.userId) ?? sellers[0];
  return ok({ user, payload });
}
