import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez parmi des milliers d'annonces sur SOUQ.MR — voitures, téléphones, mode, immobilier et plus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
