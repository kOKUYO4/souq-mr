import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Livraison",
  description: "Informations sur la livraison et les délais sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
