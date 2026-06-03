import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";

/* Stockage messages en mémoire (dev) */
const messageStore: Record<string, Array<{ id: string; from: string; text: string; createdAt: string }>> = {};

/* GET /api/messages?sellerId=...&listingId=... */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const s = req.nextUrl.searchParams;
  const convKey = `${s.get("sellerId")}-${s.get("listingId") ?? "general"}`;
  const messages = messageStore[convKey] ?? [];

  return ok(messages);
}

/* POST /api/messages — envoyer un message */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const { sellerId, listingId, text } = await req.json();
  if (!sellerId || !text?.trim()) return err("sellerId et text requis");

  const convKey = `${sellerId}-${listingId ?? "general"}`;
  if (!messageStore[convKey]) messageStore[convKey] = [];

  const msg = { id: `m${Date.now()}`, from: "buyer", text, createdAt: new Date().toISOString() };
  messageStore[convKey].push(msg);

  return ok(msg);
}
