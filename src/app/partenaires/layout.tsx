import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Partenaires & Écosystème",
  description: "Découvrez les partenaires officiels de SOUQ.MR : paiement, logistique, médias.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
