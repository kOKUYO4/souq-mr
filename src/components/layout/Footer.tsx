"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Share2, Camera, Tv } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, isRTL } = useLanguage();

  const links = {
    marketplace: [
      { href: "/", label: isRTL ? "الرئيسية" : "Accueil" },
      { href: "/a-propos", label: isRTL ? "من نحن" : "À propos" },
      { href: "/categories", label: isRTL ? "الأقسام" : "Catégories" },
      { href: "/annonces", label: isRTL ? "الإعلانات" : "Annonces" },
      { href: "/vendre", label: isRTL ? "أبيع" : "Vendre" },
      { href: "/pro", label: isRTL ? "للتجار" : "Espace Pro" },
    ],
    help: [
      { href: "/aide", label: t.footer.help },
      { href: "/securite", label: isRTL ? "نصائح الأمان" : "Guide anti-arnaque" },
      { href: "/contact", label: t.footer.contact },
      { href: "/conditions", label: t.footer.terms },
      { href: "/confidentialite", label: t.footer.privacy },
    ],
    categories: [
      { href: "/categories/vehicles", label: isRTL ? "السيارات" : "Véhicules" },
      { href: "/categories/phones", label: isRTL ? "الهواتف" : "Téléphones" },
      { href: "/categories/fashion", label: isRTL ? "الملابس" : "Mode" },
      { href: "/categories/beauty", label: isRTL ? "الجمال" : "Beauté" },
      { href: "/categories/home", label: isRTL ? "المنزل" : "Maison" },
    ],
  };

  return (
    <footer className="relative bg-night-500 text-sand-200 overflow-hidden">
      <IslamicPattern opacity={0.04} />

      {/* Séparateur décoratif */}
      <div className="relative h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #C9A84C 20%, #E8C96A 50%, #C9A84C 80%, transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 ${isRTL ? "text-right" : ""}`}>
          {/* Colonne marque */}
          <div className="lg:col-span-1">
            <div className={`${isRTL ? "flex justify-end" : ""} mb-4`}>
              <Logo size="md" />
            </div>
            <p className="text-sm text-sand-300/80 leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="space-y-2 text-sm text-sand-300/70">
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <MapPin size={14} className="text-sand-400 flex-shrink-0" />
                <span>{isRTL ? "نواكشوط، موريتانيا" : "Nouakchott, Mauritanie"}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <Phone size={14} className="text-sand-400 flex-shrink-0" />
                <span dir="ltr">+222 XX XX XX XX</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <Mail size={14} className="text-sand-400 flex-shrink-0" />
                <span>contact@souq.mr</span>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
              {[Globe, Share2, Camera, Tv].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-night-600/60 flex items-center justify-center text-sand-300 hover:text-sand-400 hover:bg-night-600 transition-all"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sand-400 font-semibold text-sm uppercase tracking-wider mb-4">
              {isRTL ? "السوق" : "Marketplace"}
            </h4>
            <ul className="space-y-2.5">
              {links.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sand-300/70 hover:text-sand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="text-sand-400 font-semibold text-sm uppercase tracking-wider mb-4">
              {t.footer.help}
            </h4>
            <ul className="space-y-2.5">
              {links.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sand-300/70 hover:text-sand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories populaires */}
          <div>
            <h4 className="text-sand-400 font-semibold text-sm uppercase tracking-wider mb-4">
              {isRTL ? "أقسام شائعة" : "Catégories populaires"}
            </h4>
            <ul className="space-y-2.5">
              {links.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sand-300/70 hover:text-sand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App badges */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-sand-400 mb-2">
                {isRTL ? "حمّل التطبيق" : "Télécharger l'app"}
              </p>
              <div className="flex flex-col gap-2">
                {["App Store", "Google Play"].map((store) => (
                  <button
                    key={store}
                    className="px-3 py-2 text-xs border border-sand-400/20 rounded-lg text-sand-300 hover:border-sand-400/50 hover:text-sand-400 transition-all text-left"
                  >
                    📱 {store}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="mt-12 pt-6 border-t border-night-400/30">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-300/50 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <p>
              © {new Date().getFullYear()} SOUQ.MR — {t.footer.rights}
            </p>
            <p className="flex items-center gap-1">
              {t.footer.madeWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
