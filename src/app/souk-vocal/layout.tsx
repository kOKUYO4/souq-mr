import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Souk Vocal",
  description: "Utilisez la voix pour chercher et publier des annonces sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
