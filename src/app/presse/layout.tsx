import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Presse & Médias",
  description: "Ressources presse et communiqués officiels de NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
