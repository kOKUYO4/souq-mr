import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mode Ramadan",
  description: "Offres et produits spéciaux pour le Ramadan sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
