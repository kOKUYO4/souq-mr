import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catégories",
  description: "Explorez toutes les catégories de SOUQ.MR — Véhicules, Téléphones, Mode, Beauté, Maison, Emploi, Animaux et plus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
