import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Classement des vendeurs",
  description: "Découvrez les meilleurs vendeurs et produits du moment sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
