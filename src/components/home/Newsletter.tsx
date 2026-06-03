"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Sparkles } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const { isRTL } = useLanguage();
  const { success } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    success(isRTL ? "تم الاشتراك بنجاح! 🎉" : "Inscription confirmée ! 🎉");
  }

  const perks = [
    {
      icon: "🏷️",
      fr: "Alertes prix sur vos catégories",
      ar: "تنبيهات الأسعار على فئاتك",
    },
    {
      icon: "⭐",
      fr: "Annonces vedettes en avant-première",
      ar: "إعلانات مميزة في العرض الأول",
    },
    {
      icon: "🎁",
      fr: "Offres exclusives pour les abonnés",
      ar: "عروض حصرية للمشتركين",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0C1426 0%, #1B2A4A 60%, #0C1426 100%)" }}>
      <IslamicPattern opacity={0.04} />

      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C96A 50%, #C9A84C 70%, transparent)" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-sand-400/20 bg-sand-400/10">
          <Sparkles size={14} className="text-sand-400" />
          <span className="text-sand-400 text-xs font-semibold uppercase tracking-widest">
            {isRTL ? "النشرة الإخبارية" : "Newsletter"}
          </span>
        </div>

        <h2 className={`text-3xl sm:text-4xl font-bold text-white mb-4 ${isRTL ? "font-arabic" : "font-display"}`}>
          {isRTL
            ? "لا تفوّت أي فرصة في السوق"
            : "Ne ratez aucune opportunité du souk"}
        </h2>
        <p className={`text-sand-300/70 max-w-lg mx-auto mb-10 ${isRTL ? "font-arabic" : ""}`}>
          {isRTL
            ? "اشترك في نشرتنا الإخبارية وكن أول من يعلم بأفضل الإعلانات والعروض الحصرية"
            : "Abonnez-vous et soyez le premier informé des meilleures annonces et offres exclusives en Mauritanie"}
        </p>

        {/* Perks */}
        <div className={`flex flex-wrap justify-center gap-4 mb-10 ${isRTL ? "flex-row-reverse" : ""}`}>
          {perks.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-sand-300/80 bg-night-600/40 border border-night-500/50 px-4 py-2 rounded-full"
            >
              <span>{p.icon}</span>
              <span className={isRTL ? "font-arabic" : ""}>{isRTL ? p.ar : p.fr}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-16 h-16 rounded-full bg-islamic-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-islamic-400" />
            </div>
            <p className={`text-xl font-bold text-white ${isRTL ? "font-arabic" : "font-display"}`}>
              {isRTL ? "شكراً لاشتراكك!" : "Merci pour votre inscription !"}
            </p>
            <p className={`text-sand-300/60 text-sm ${isRTL ? "font-arabic" : ""}`}>
              {isRTL
                ? "ستتلقى قريباً أفضل العروض في صندوق بريدك"
                : "Vous recevrez prochainement les meilleures offres dans votre boîte mail"}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto ${isRTL ? "sm:flex-row-reverse" : ""}`}
          >
            <div className="relative flex-1">
              <Mail size={16} className={`absolute top-1/2 -translate-y-1/2 text-sand-400/60 pointer-events-none ${isRTL ? "right-4" : "left-4"}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRTL ? "بريدك الإلكتروني" : "Votre adresse email"}
                required
                dir={isRTL ? "rtl" : "ltr"}
                className={`w-full bg-night-600/60 border border-night-500/60 text-white placeholder-sand-400/40 rounded-xl py-3.5 text-sm focus:outline-none focus:border-sand-400/60 transition-colors ${isRTL ? "pr-10 pl-4 text-right font-arabic" : "pl-10 pr-4"}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold px-6 py-3.5 gap-2 whitespace-nowrap text-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-night-500/40 border-t-night-500 rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {isRTL ? "اشتراك" : "S'abonner"}
            </button>
          </form>
        )}

        <p className={`text-xs text-sand-400/40 mt-4 ${isRTL ? "font-arabic" : ""}`}>
          {isRTL
            ? "بلا إزعاج. يمكنك إلغاء الاشتراك في أي وقت."
            : "Pas de spam. Désinscription en un clic."}
        </p>
      </div>
    </section>
  );
}
