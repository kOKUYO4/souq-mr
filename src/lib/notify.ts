import { getSupabaseAdmin } from "@/lib/supabase";

type NotifType = "message" | "offer" | "order" | "review" | "system";

export async function createNotification(
  userId: string,
  type: NotifType,
  title: string,
  titleAr: string,
  body: string,
  bodyAr: string,
  link?: string
) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("notifications").insert({
      user_id: userId,
      type,
      title,
      title_ar: titleAr,
      body,
      body_ar: bodyAr,
      link: link ?? null,
    });
  } catch (e) {
    console.error("[notify] failed:", e);
  }
}
