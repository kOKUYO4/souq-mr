import { ok } from "@/lib/api";
import { supabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const info: Record<string, unknown> = {
    supabaseConfigured,
    nodeEnv: process.env.NODE_ENV,
    url,
    urlLength: url.length,
    anonKeyPrefix: anon.slice(0, 12),
    anonKeyLength: anon.length,
    serviceKeyPrefix: serviceKey.slice(0, 12),
    serviceKeyLength: serviceKey.length,
  };

  // Test direct fetch vers Supabase REST API
  if (url) {
    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      });
      info.fetchTest = { status: res.status, ok: res.ok };
    } catch (e: unknown) {
      const err = e as Error & { cause?: unknown };
      info.fetchTest = {
        error: err.message,
        cause: err.cause ? String(err.cause) : null,
        causeDetails: err.cause ? JSON.stringify(err.cause, Object.getOwnPropertyNames(err.cause)) : null,
      };
    }
  }

  return ok(info);
}
