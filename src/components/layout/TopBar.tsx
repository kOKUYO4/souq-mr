"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const messages = [
  { fr: "🇲🇷 Achetez mauritanien — chaque achat soutient une famille locale", ar: "🇲🇷 اشترِ موريتانياً — كل عملية شراء تدعم عائلة محلية" },
  { fr: "💛 Commerce local, fierté nationale — bienvenue sur SOUQ.MR", ar: "💛 تجارة محلية، فخر وطني — مرحباً بك في سوق.مر" },
  { fr: "🤝 Ensemble, construisons l'économie de demain en Mauritanie", ar: "🤝 معاً نبني اقتصاد الغد في موريتانيا" },
];

export default function TopBar() {
  const { isRTL } = useLanguage();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const msg = isRTL ? messages[index].ar : messages[index].fr;

  return (
    <div
      className="w-full text-center py-1.5 px-4 text-xs font-medium"
      style={{ background: "linear-gradient(90deg, #1B2A4A 0%, #243660 50%, #1B2A4A 100%)" }}
    >
      <span
        className={`text-sand-300 transition-opacity duration-400 ${isRTL ? "font-arabic" : ""}`}
        style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {msg}
      </span>
    </div>
  );
}
