import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Codes promo & Coupons",
  description: "Utilisez vos codes promo et coupons de réduction sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
