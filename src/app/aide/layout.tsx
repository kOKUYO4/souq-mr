import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centre d'aide",
  description: "Trouvez les réponses à toutes vos questions sur SOUQ.MR — paiement, livraison, sécurité, négociation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
