import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Application mobile NUQTA.MR",
  description: "Téléchargez l'application mobile NUQTA.MR sur iOS et Android.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
