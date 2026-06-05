import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  // Accept both listing_id (new) and listingId (legacy)
  const listing_id = body?.listing_id || body?.listingId;
  const reason = body?.reason;
  const details = body?.details || body?.description || "";

  if (!listing_id || !reason) return err("listing_id et reason requis");

  try {
    const admin = getSupabaseAdmin();
    await admin.from("notifications").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      type: "system",
      title: "Nouveau signalement",
      title_ar: "بلاغ جديد",
      body: `Annonce ${listing_id} signalée: ${reason}${details ? ` — ${details}` : ""}`,
      body_ar: `تم الإبلاغ عن إعلان ${listing_id}: ${reason}`,
      link: `/admin`,
    });
  } catch {
    // Silently ignore if notifications table doesn't exist
  }

  return ok({ reported: true });
}
