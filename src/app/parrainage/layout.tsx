import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Programme de parrainage",
  description: "Parrainez vos amis sur SOUQ.MR et gagnez des récompenses.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
