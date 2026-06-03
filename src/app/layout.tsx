import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RamadanBanner from "@/components/home/RamadanBanner";

export const viewport: Viewport = {
  themeColor: "#C9A84C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: "SOUQ.MR — Le grand souk numérique de Mauritanie", template: "%s | SOUQ.MR" },
  description: "La première marketplace mauritanienne. Achetez, vendez et négociez des voitures, téléphones, vêtements et plus à Nouakchott.",
  keywords: ["marketplace mauritanie", "annonces mauritanie", "vente nouakchott", "souq mauritanien", "achat vente mauritanie"],
  metadataBase: new URL("https://souq.mr"),
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SOUQ.MR" },
  openGraph: {
    title: "SOUQ.MR — Le grand souk numérique de Mauritanie",
    description: "La première marketplace mauritanienne — Achetez, vendez, négociez.",
    type: "website",
    locale: "fr_MR",
    siteName: "SOUQ.MR",
    url: "https://souq.mr",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOUQ.MR",
    description: "Le grand souk numérique de Mauritanie",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');` }} />
      </head>
      <body className="min-h-screen bg-cream font-body antialiased">
        <AuthProvider>
          <LanguageProvider>
            <FavoritesProvider>
              <ToastProvider>
                <Navbar />
                <RamadanBanner />
                <main className="pt-16">{children}</main>
                <Footer />
              </ToastProvider>
            </FavoritesProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
