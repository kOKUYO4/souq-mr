"use client";

import { useState } from "react";
import { MessageCircle, Zap, Handshake, ChevronRight } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

export default function HagglingBanner() {
  const { t, isRTL } = useLanguage();
  const [offer, setOffer] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (offer) { setSent(true); setTimeout(() => setSent(false), 3000); setOffer(""); }
  };

  const steps = isRTL
    ? [
        { icon: "🏷️", title: "البائع يضع سعره", desc: "مع سعر أدنى سري" },
        { icon: "💬", title: "تفاوض في الوقت الفعلي", desc: "تبادل مباشر للعروض" },
        { icon: "🤝", title: "اتفقتم!", desc: "انقر على «آخر سعر؟» للحصول على الأفضل" },
      ]
    : [
        { icon: "🏷️", title: "Le vendeur fixe son prix", desc: "Avec un prix plancher secret" },
        { icon: "💬", title: "Négociation en temps réel", desc: "Échange direct d'offres" },
        { icon: "🤝", title: "Accord conclu !", desc: "Cliquez «Dernier prix ?» pour le meilleur" },
      ];

  return (
    <section
      className="relative overflow-hidden py-16"
      style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0C1426 100%)" }}
    >
      <IslamicPattern opacity={0.06} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? "lg:flex lg:flex-row-reverse" : ""}`}>
          {/* Texte gauche */}
          <div className={isRTL ? "text-right" : ""}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-400/15 border border-sand-400/20 text-sand-300 text-sm mb-6">
              <Zap size={14} className="text-sand-400" />
              {isRTL ? "ميزة حصرية" : "Fonctionnalité exclusive"}
            </div>
            <h2
              className={`text-3xl md:text-4xl font-display font-bold text-white mb-4 ${isRTL ? "font-arabic" : ""}`}
            >
              {isRTL ? (
                <>
                  <span className="text-gold-gradient">فاوض</span> كما في السوق الحقيقي
                </>
              ) : (
                <>
                  <span style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>Négocie</span> comme<br />au vrai souk
                </>
              )}
            </h2>
            <p className={`text-sand-300/70 mb-8 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
              {t.haggle.subtitle}
            </p>

            {/* Étapes */}
            <div className="space-y-4 mb-8">
              {steps.map((step, i) => (
                <div key={i} className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-sand-400/15 flex items-center justify-center text-xl flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-white text-sm font-semibold">{step.title}</p>
                    <p className="text-sand-400/60 text-xs">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight size={14} className="text-sand-400/30 mt-3 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Widget démonstration */}
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-gold-lg max-w-sm mx-auto">
              {/* Entête widget */}
              <div
                className="px-5 py-4"
                style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}
              >
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-sand-400/20 flex items-center justify-center">
                    <MessageCircle size={18} className="text-sand-400" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-white text-sm font-semibold">
                      {isRTL ? "محادثة تفاوض" : "Chat de négociation"}
                    </p>
                    <p className="text-sand-400/70 text-xs">
                      {isRTL ? "iPhone 15 Pro Max — 195,000 أوقية" : "iPhone 15 Pro Max — 195 000 MRU"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 bg-sand-50 min-h-[180px]">
                {[
                  { from: "seller", text: isRTL ? "السعر 195,000 أوقية" : "195 000 MRU, prix fixé !", align: "left" },
                  { from: "buyer", text: isRTL ? "أقبل 175,000 أوقية؟" : "Je vous offre 175 000 MRU ?", align: "right" },
                  { from: "seller", text: isRTL ? "أقل سعر 185,000 🤝" : "185 000 MRU, dernier prix 🤝", align: "left" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.align === "right" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                        msg.align === "right"
                          ? "text-white"
                          : "bg-white text-night-500 shadow-sm"
                      }`}
                      style={msg.align === "right" ? { background: "linear-gradient(135deg, #1B2A4A, #364E8F)" } : undefined}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input offre */}
              <div className="p-4 bg-white border-t border-sand-100">
                {sent ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-islamic-400 text-sm font-semibold">
                    ✅ {isRTL ? "تم إرسال عرضك!" : "Offre envoyée !"}
                  </div>
                ) : (
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <input
                      type="number"
                      placeholder={t.haggle.yourOffer}
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                      dir={isRTL ? "rtl" : "ltr"}
                      className="flex-1 input-field text-sm py-2"
                    />
                    <button
                      onClick={handleSend}
                      className="btn-gold py-2 px-4 text-sm whitespace-nowrap"
                    >
                      {isRTL ? "أرسل" : "Envoyer"}
                    </button>
                  </div>
                )}
                <button
                  className="w-full mt-2 py-2.5 rounded-xl border-2 border-sand-400 text-sand-500 text-sm font-bold hover:bg-sand-50 transition-colors"
                >
                  🤝 {t.haggle.askLastPrice}
                </button>
              </div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #2D6A4F, transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
