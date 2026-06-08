import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez l'état de vos commandes en temps réel sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
