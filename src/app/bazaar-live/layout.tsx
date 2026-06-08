import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bazaar Live",
  description: "Ventes en direct et enchères live sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
