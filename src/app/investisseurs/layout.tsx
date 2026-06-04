import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Espace Investisseurs",
  description: "Informations financières et opportunités d'investissement chez SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
