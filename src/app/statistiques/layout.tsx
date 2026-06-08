import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Statistiques du marché",
  description: "Analysez les tendances du marché mauritanien sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
