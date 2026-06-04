import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Alertes prix",
  description: "Créez des alertes pour être notifié quand le prix d'un article baisse sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
