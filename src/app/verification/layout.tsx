import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vérification d'identité",
  description: "Vérifiez votre identité pour une expérience sécurisée sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
