import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { listings } from "@/data/mockData";

/* GET /api/listings/[id] */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const listing = listings.find((l) => l.id === params.id);
  if (!listing) return err("Annonce introuvable", 404);
  return ok({ ...listing, views: listing.views + 1 });
}

/* PATCH /api/listings/[id] — modifier */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const listing = listings.find((l) => l.id === params.id);
  if (!listing) return err("Annonce introuvable", 404);

  const body = await req.json();
  const updated = { ...listing, ...body, id: params.id };
  return ok(updated);
}

/* DELETE /api/listings/[id] — supprimer */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const listing = listings.find((l) => l.id === params.id);
  if (!listing) return err("Annonce introuvable", 404);

  return ok({ deleted: true, id: params.id });
}
