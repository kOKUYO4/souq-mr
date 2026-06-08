import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toutes les annonces",
  description: "Parcourez toutes les annonces de NUQTA.MR — voitures, téléphones, mode, immobilier et plus à Nouakchott et en Mauritanie.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
