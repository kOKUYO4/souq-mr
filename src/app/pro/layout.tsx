import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Pro — Plans & Tarifs",
  description: "Développez votre activité avec SOUQ.MR Pro. Annonces illimitées, statistiques avancées, badge Marchand Pro à partir de 4 990 MRU/mois.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
