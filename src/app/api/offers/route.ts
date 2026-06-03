import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { listings } from "@/data/mockData";

/* POST /api/offers — soumettre une offre de négociation */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const { listingId, amount, message } = await req.json();

  if (!listingId || !amount) return err("listingId et amount requis");
  if (amount <= 0) return err("Montant invalide");

  const listing = listings.find((l) => l.id === listingId);
  if (!listing) return err("Annonce introuvable", 404);
  if (!listing.negotiable) return err("Cette annonce n'est pas négociable");
  if (amount > listing.price) return err("L'offre ne peut pas dépasser le prix affiché");

  const pct = amount / listing.price;
  const floorPct = 0.88; // 12% de marge max

  /* Logique de négociation : réponse automatique du vendeur */
  let sellerResponse: { status: "accepted" | "counter" | "declined"; counterOffer?: number; message: string } ;

  if (pct >= 0.97) {
    sellerResponse = { status: "accepted", message: "Parfait, j'accepte votre offre ! 🤝" };
  } else if (pct >= floorPct) {
    const counter = Math.round(listing.price * 0.94);
    sellerResponse = { status: "counter", counterOffer: counter, message: `Mon dernier prix : ${counter.toLocaleString()} MRU 🤝` };
  } else {
    sellerResponse = { status: "declined", message: `Désolé, c'est trop bas. Mon minimum : ${Math.round(listing.price * floorPct).toLocaleString()} MRU` };
  }

  return ok({
    offer: { id: `o${Date.now()}`, listingId, amount, message, createdAt: new Date().toISOString() },
    sellerResponse: { ...sellerResponse, floorPrice: Math.round(listing.price * floorPct) },
  });
}
