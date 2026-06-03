import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";

const reports = new Map<string, object[]>();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.listingId || !body?.reason) {
    return err("listingId et reason sont requis");
  }

  const validReasons = ["fraud", "prohibited", "duplicate", "wrong_category", "other"];
  if (!validReasons.includes(body.reason)) return err("Raison invalide");

  const report = {
    id: `rep-${Date.now()}`,
    listingId: body.listingId,
    reason: body.reason,
    description: body.description || "",
    reporterIp: req.headers.get("x-forwarded-for") || "unknown",
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  const existing = reports.get(body.listingId) || [];
  reports.set(body.listingId, [...existing, report]);

  return ok({ message: "Signalement enregistré. Notre équipe examinera ce contenu sous 1h.", reportId: report.id });
}
