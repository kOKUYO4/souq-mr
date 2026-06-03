import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken } from "@/lib/api";
import { listings, sellerStats } from "@/data/mockData";

/* GET /api/stats — statistiques dashboard vendeur */
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token)) return err("Non authentifié", 401);

  const myListings = listings.slice(0, 6);

  return ok({
    ...sellerStats,
    listingBreakdown: myListings.map((l) => ({
      id: l.id,
      title: l.title,
      views: l.views,
      price: l.price,
      category: l.category,
    })),
    conversionRate: ((sellerStats.totalSales / sellerStats.totalListings) * 100).toFixed(1),
    avgPrice: Math.round(myListings.reduce((s, l) => s + l.price, 0) / myListings.length),
  });
}
