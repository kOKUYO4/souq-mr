/* Utilitaires API partagés — types, helpers, réponses standard */

import { NextResponse } from "next/server";
import type { Listing, Seller, Review } from "@/data/mockData";
import { listings, sellers, reviews, categories } from "@/data/mockData";

/* ── Types ── */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total: number; page: number; limit: number; hasMore: boolean };
};

export type CreateListingBody = {
  title: string;
  titleAr: string;
  price: number;
  category: string;
  subcategory: string;
  condition: "new" | "used";
  negotiable: boolean;
  cod: boolean;
  description: string;
  descriptionAr: string;
  location: string;
  locationAr: string;
  images?: string[];
  attributes?: Record<string, string>;
};

export type OtpBody = { phone: string };
export type VerifyOtpBody = { phone: string; otp: string };

/* ── Helpers réponse ── */
export const ok = <T>(data: T, meta?: ApiResponse<T>["meta"]) =>
  NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });

export const err = (message: string, status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

/* ── Filtre + pagination ── */
export interface ListingsQuery {
  category?: string;
  subcategory?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  negotiable?: boolean;
  cod?: boolean;
  location?: string;
  featured?: boolean;
  sort?: "recent" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
  q?: string;
}

export function filterListings(query: ListingsQuery): { items: Listing[]; total: number } {
  let result = [...listings];

  if (query.q) {
    const q = query.q.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.titleAr.includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }
  if (query.category) result = result.filter((l) => l.category === query.category);
  if (query.subcategory) result = result.filter((l) => l.subcategory === query.subcategory);
  if (query.condition && query.condition !== "all") result = result.filter((l) => l.condition === query.condition);
  if (query.priceMin) result = result.filter((l) => l.price >= query.priceMin!);
  if (query.priceMax) result = result.filter((l) => l.price <= query.priceMax!);
  if (query.negotiable) result = result.filter((l) => l.negotiable);
  if (query.cod) result = result.filter((l) => l.cod);
  if (query.featured) result = result.filter((l) => l.featured);
  if (query.location) result = result.filter((l) => l.location.toLowerCase().includes(query.location!.toLowerCase()));

  switch (query.sort) {
    case "price_asc": result.sort((a, b) => a.price - b.price); break;
    case "price_desc": result.sort((a, b) => b.price - a.price); break;
    case "popular": result.sort((a, b) => b.views - a.views); break;
    default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = result.length;
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const items = result.slice((page - 1) * limit, page * limit);

  return { items, total };
}

/* ── Validation téléphone mauritanien ── */
export function isValidMauritanianPhone(phone: string): boolean {
  return /^\+?222\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(phone.replace(/\s/g, ""));
}

/* ── JWT simulé (demo — en prod utiliser jose/jsonwebtoken) ── */
const SECRET = process.env.JWT_SECRET ?? "souq-mr-secret-2026";

export function signToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 86400 * 1000 }));
  const sig = btoa(`${SECRET}-${header}.${body}`).slice(0, 20);
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [, body] = token.split(".");
    const payload = JSON.parse(atob(body));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.headers.get("cookie");
  const match = cookie?.match(/souq-token=([^;]+)/);
  return match?.[1] ?? null;
}
