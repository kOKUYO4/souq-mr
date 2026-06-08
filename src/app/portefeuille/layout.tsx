import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mon portefeuille",
  description: "Gérez votre solde et vos transactions sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
