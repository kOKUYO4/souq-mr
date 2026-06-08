import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Recrutement",
  description: "Rejoignez l'équipe NUQTA.MR et participez à la transformation numérique mauritanienne.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
