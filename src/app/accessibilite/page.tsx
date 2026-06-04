"use client";

import { Eye, Volume2, Type, Monitor, CheckCircle2, Mail } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

export default function AccessibilitePage() {
  const { isRTL, locale } = useLanguage();

  const features = [
    { icon: Eye, fr: "Contraste élevé", ar: "تباين عالٍ", descFr: "Palette de couleurs respectant WCAG 2.1 niveau AA pour les utilisateurs malvoyants.", descAr: "لوح ألوان يتوافق مع معيار WCAG 2.1 المستوى AA للمستخدمين ضعاف البصر." },
    { icon: Type, fr: "Texte redimensionnable", ar: "نص قابل للتغيير", descFr: "Le texte peut être agrandi jusqu'à 200% sans perte de fonctionnalité.", descAr: "يمكن تكبير النص حتى 200% دون فقدان الوظائف." },
    { icon: Monitor, fr: "Navigation clavier", ar: "تنقل بلوحة المفاتيح", descFr: "Tous les éléments interactifs sont accessibles via le clavier (Tab, Entrée, Espace).", descAr: "جميع العناصر التفاعلية متاحة عبر لوحة المفاتيح." },
    { icon: Volume2, fr: "Compatibilité lecteur d'écran", ar: "توافق قارئ الشاشة", descFr: "Structure sémantique HTML5 et attributs ARIA pour une compatibilité optimale.", descAr: "بنية HTML5 دلالية وسمات ARIA للتوافق الأمثل." },
  ];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "إمكانية الوصول" : "Accessibilité"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "سوق.مر ملتزم بجعل منصته في متناول الجميع" : "SOUQ.MR s'engage à rendre sa plateforme accessible à tous"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0">
                <f.icon size={18} className="text-sand-500" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className={`font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? f.ar : f.fr}</p>
                <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{isRTL ? f.descAr : f.descFr}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 mb-3 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "تقرير إمكانية الوصول" : "Rapport d'accessibilité"}
          </h2>
          <div className="space-y-2">
            {(isRTL ? [
              { label: "معيار WCAG 2.1", value: "مستوى AA", ok: true },
              { label: "توافق لوحة المفاتيح", value: "100% من العناصر", ok: true },
              { label: "نصوص بديلة للصور", value: "متاحة", ok: true },
              { label: "تسميات ARIA", value: "مطبّقة", ok: true },
              { label: "تعريف اللغة HTML", value: "AR / FR", ok: true },
            ] : [
              { label: "Conformité WCAG 2.1", value: "Niveau AA", ok: true },
              { label: "Navigation clavier", value: "100% des éléments", ok: true },
              { label: "Textes alternatifs images", value: "Implémentés", ok: true },
              { label: "Attributs ARIA", value: "Appliqués", ok: true },
              { label: "Déclaration langue HTML", value: "AR / FR", ok: true },
            ]).map((item, i) => (
              <div key={i} className={`flex items-center justify-between py-2 border-b border-sand-100 last:border-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={`text-sm text-night-500 ${isRTL ? "font-arabic" : ""}`}>{item.label}</span>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs text-night-400/60">{item.value}</span>
                  <CheckCircle2 size={14} className="text-islamic-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-night-500 rounded-2xl p-5 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Mail size={20} className="text-sand-400 flex-shrink-0" />
          <div className={`flex-1 ${isRTL ? "text-right font-arabic" : ""}`}>
            <p className="font-bold text-white text-sm">
              {isRTL ? "هل تواجه صعوبة في الاستخدام؟" : "Vous rencontrez une difficulté d'accès ?"}
            </p>
            <p className="text-sand-300/70 text-xs mt-0.5">
              {isRTL ? "تواصل معنا: accessibilite@souq.mr" : "Contactez-nous : accessibilite@souq.mr"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
