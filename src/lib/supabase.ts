/**
 * Clients Supabase — browser + server (Next.js 14 App Router)
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON);

// Placeholder URL pour le build statique sans .env.local
const safeUrl  = SUPABASE_URL  || "https://placeholder.supabase.co";
const safeAnon = SUPABASE_ANON || "placeholder";

/* ── Client navigateur (singleton) ── */
export const supabase = createClient(safeUrl, safeAnon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

/* ── Client côté serveur (sans cookie, lecture seule anonyme) ── */
export const supabaseServer = createClient(safeUrl, safeAnon, {
  auth: { persistSession: false },
});

/* Indique si Supabase est configuré — utilisé pour le fallback mock */
export { isConfigured as supabaseConfigured };

/* ── Client admin (service_role) — uniquement côté serveur ── */
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant");
  return createClient(URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* ── Types base de données ── */
export type DbProfile = {
  id: string;
  phone: string;
  name: string;
  name_ar: string;
  avatar: string | null;
  badge: "regular" | "verified" | "pro";
  bio: string | null;
  bio_ar: string | null;
  rating: number;
  reviews_count: number;
  listings_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbListing = {
  id: string;
  seller_id: string;
  title: string;
  title_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  condition: "new" | "used" | "tbh";
  location: string;
  location_ar: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  negotiable: boolean;
  cod: boolean;
  featured: boolean;
  status: "active" | "sold" | "paused" | "deleted";
  views: number;
  attributes: Record<string, string>;
  created_at: string;
  updated_at: string;
  profiles?: DbProfile; // join seller
};

export type DbConversation = {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_at: string;
  buyer_unread: int;
  seller_unread: int;
  created_at: string;
  buyer?: DbProfile;
  seller?: DbProfile;
  listing?: DbListing;
};

export type DbMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
  sender?: DbProfile;
};

export type DbFavorite = {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: DbListing;
};

export type DbOffer = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: "pending" | "accepted" | "declined" | "countered" | "expired";
  counter_amount: number | null;
  message: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
  listing?: DbListing;
  buyer?: DbProfile;
  seller?: DbProfile;
};

// Workaround pour le type int dans DbConversation
type int = number;
