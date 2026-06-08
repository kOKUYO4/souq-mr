import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tontine numérique",
  description: "Participez à des groupes d'épargne collectifs avec NUQTA.MR Tontine.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
