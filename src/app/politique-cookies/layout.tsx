import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Politique des cookies",
  description: "Gérez vos préférences cookies sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
