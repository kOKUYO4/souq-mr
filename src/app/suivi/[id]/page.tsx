import TrackingView from "@/components/tracking/TrackingView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Suivi de commande | NUQTA.MR" };

export default function SuiviDetailPage({ params }: { params: { id: string } }) {
  return <TrackingView orderId={params.id} />;
}
