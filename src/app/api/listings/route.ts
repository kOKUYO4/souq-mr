import { NextRequest } from "next/server";
import { ok, err, getTokenFromRequest, verifyToken, type CreateListingBody } from "@/lib/api";
import { supabaseServer } from "@/lib/supabase";

/* GET /api/listings — liste paginée avec filtres */
export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;

  const page  = s.get("page")  ? Number(s.get("page"))  : 1;
  const limit = s.get("limit") ? Number(s.get("limit")) : 12;
  const from  = (page - 1) * limit;

  let query = supabaseServer
    .from("listings")
    .select("*, profiles!seller_id(*)", { count: "exact" })
    .eq("status", "active");

  /* ── Filtres texte ── */
  const q = s.get("q");
  if (q) {
    query = query.or(`title.ilike.%${q}%,title_ar.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const category = s.get("category");
  if (category) query = query.eq("category", category);

  const subcategory = s.get("subcategory");
  if (subcategory) query = query.eq("subcategory", subcategory);

  const condition = s.get("condition");
  if (condition && condition !== "all") query = query.eq("condition", condition);

  const location = s.get("location");
  if (location) query = query.ilike("location", `%${location}%`);

  /* ── Filtres numériques/booléens ── */
  const priceMin = s.get("priceMin");
  if (priceMin) query = query.gte("price", Number(priceMin));

  const priceMax = s.get("priceMax");
  if (priceMax) query = query.lte("price", Number(priceMax));

  if (s.get("negotiable") === "true") query = query.eq("negotiable", true);
  if (s.get("cod")        === "true") query = query.eq("cod", true);
  if (s.get("featured")   === "true") query = query.eq("featured", true);

  /* ── Tri ── */
  const sort = s.get("sort") ?? "recent";
  switch (sort) {
    case "price_asc":  query = query.order("price", { ascending: true });  break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "popular":    query = query.order("views", { ascending: false }); break;
    default:           query = query.order("created_at", { ascending: false });
  }

  /* ── Pagination ── */
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error) return err(error.message, 500);

  const total = count ?? 0;
  return ok(data ?? [], { total, page, limit, hasMore: page * limit < total });
}

/* POST /api/listings — créer une annonce (auth requise) */
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return err("Non authentifié", 401);

  const body: CreateListingBody = await req.json();
  if (!body.title || !body.price || !body.category) return err("Champs obligatoires manquants");

  const { data, error } = await supabaseServer
    .from("listings")
    .insert({
      seller_id:       payload.userId,
      title:           body.title,
      title_ar:        body.titleAr,
      description:     body.description,
      description_ar:  body.descriptionAr,
      price:           body.price,
      category:        body.category,
      subcategory:     body.subcategory ?? null,
      condition:       body.condition,
      negotiable:      body.negotiable ?? false,
      cod:             body.cod ?? false,
      location:        body.location,
      location_ar:     body.locationAr,
      images:          body.images ?? [],
      attributes:      body.attributes ?? {},
      featured:        false,
      views:           0,
      status:          "active",
    })
    .select("*, profiles!seller_id(*)")
    .single();

  if (error) return err(error.message, 500);
  return ok(data);
}
