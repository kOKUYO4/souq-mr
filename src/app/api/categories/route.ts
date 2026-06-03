import { ok } from "@/lib/api";
import { categories, listings } from "@/data/mockData";

/* GET /api/categories — liste toutes les catégories avec compteurs réels */
export async function GET() {
  const withCounts = categories.map((cat) => ({
    ...cat,
    count: listings.filter((l) => l.category === cat.id).length,
  }));
  return ok(withCounts);
}
