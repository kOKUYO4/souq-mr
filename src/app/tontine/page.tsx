"use client";

import { useState } from "react";
import { Users, TrendingUp, CheckCircle2, Lock, Bell, ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const exampleGroups = {
  fr: [
    { name: "Groupe Électroménager", members: 10, amount: 15000, cycle: "mensuel", next: "15 jan 2025", filled: 6 },
    { name: "Économies Voiture", members: 12, amount: 50000, cycle: "mensuel", next: "1 fév 2025", filled: 9 },
    { name: "Projet Boutique", members: 8, amount: 25000, cycle: "bi-mensuel", next: "20 jan 2025", filled: 5 },
  ],
  ar: [
    { name: "مجموعة الأجهزة المنزلية", members: 10, amount: 15000, cycle: "شهري", next: "15 يناير 2025", filled: 6 },
    { name: "مدخرات السيارة", members: 12, amount: 50000, cycle: "شهري", next: "1 فبراير 2025", filled: 9 },
    { name: "مشروع المتجر", members: 8, amount: 25000, cycle: "نصف شهري", next: "20 يناير 2025", filled: 5 },
  ],
};

export default function TontinePage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [contribution, setContribution] = useState(10000);
  const [members, setMembers] = useState(10);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const groups = exampleGroups[locale];
  const totalPot = contribution * members;

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #2D6A4F, #1A3F2A)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-green-200 text-sm mb-6">
            <Users size={14} />
            {isRTL ? "مدخرات تقليدية رقمية" : "Épargne communautaire digitale"}
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "تنظيم الادخار الجماعي" : "Tontine Numérique"}
          </h1>
          <p className="text-green-200/70 max-w-xl mx-auto">
            {isRTL
              ? "النظام التقليدي الموريتاني للادخار الجماعي، الآن بصيغة رقمية وآمنة"
              : "Le système traditionnel mauritanien d'épargne collective, maintenant digitalisé et sécurisé"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Concept */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 text-xl mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "ما هو نظام الادخار الجماعي؟" : "Comment fonctionne la tontine ?"}
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { n: "01", fr: "Un groupe se forme (10-20 membres)", ar: "يتشكل مجموعة (10-20 عضو)" },
              { n: "02", fr: "Chacun cotise un montant fixe chaque mois", ar: "كل عضو يودع مبلغاً ثابتاً شهرياً" },
              { n: "03", fr: "Chaque mois, un membre reçoit la cagnotte totale", ar: "كل شهر، يستلم عضو واحد المبلغ الكلي" },
              { n: "04", fr: "Le cycle se répète jusqu'à ce que tous aient reçu", ar: "تتكرر الدورة حتى يستلم الجميع" },
            ].map((s, i) => (
              <div key={i} className={`text-center p-4 rounded-xl bg-sand-50 ${isRTL ? "font-arabic" : ""}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #2D6A4F, #1A3F2A)" }}>
                  {s.n}
                </div>
                <p className="text-xs text-night-400/80 leading-relaxed">{isRTL ? s.ar : s.fr}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 text-xl mb-6 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "احسب مدخراتك" : "Calculez votre tontine"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className={isRTL ? "text-right" : ""}>
              <label className={`text-sm font-semibold text-night-500 block mb-3 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "المساهمة الشهرية (أوقية)" : "Cotisation mensuelle (MRU)"}
              </label>
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => setContribution((c) => Math.max(1000, c - 1000))}
                  className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-night-400 hover:bg-sand-200 transition-colors">
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-sand-500">{contribution.toLocaleString()}</p>
                  <p className="text-xs text-night-400/50">MRU</p>
                </div>
                <button onClick={() => setContribution((c) => c + 1000)}
                  className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-night-400 hover:bg-sand-200 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <label className={`text-sm font-semibold text-night-500 block mb-3 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "عدد الأعضاء" : "Nombre de membres"}
              </label>
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => setMembers((m) => Math.max(3, m - 1))}
                  className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-night-400 hover:bg-sand-200 transition-colors">
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-sand-500">{members}</p>
                  <p className={`text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? "عضو" : "membres"}</p>
                </div>
                <button onClick={() => setMembers((m) => Math.min(30, m + 1))}
                  className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-night-400 hover:bg-sand-200 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="mt-6 p-5 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #2D6A4F, #1A3F2A)" }}>
            <p className={`text-green-200/70 text-sm mb-1 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "كل عضو سيستلم" : "Chaque membre recevra"}
            </p>
            <p className="text-4xl font-display font-bold text-white">
              {totalPot.toLocaleString()} <span className="text-2xl">MRU</span>
            </p>
            <p className={`text-green-200/60 text-xs mt-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL
                ? `مرة واحدة خلال ${members} أشهر`
                : `Une fois tous les ${members} mois`}
            </p>
          </div>
        </div>

        {/* Groups disponibles */}
        <div>
          <h2 className={`font-bold text-night-500 text-xl mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "المجموعات المفتوحة" : "Groupes ouverts"}
          </h2>
          <div className="space-y-3">
            {groups.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card transition-all">
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={isRTL ? "text-right" : ""}>
                    <h3 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{g.name}</h3>
                    <div className={`flex items-center gap-3 mt-1 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Users size={11} />
                        {g.filled}/{g.members} {isRTL ? "عضو" : "membres"}
                      </span>
                      <span>•</span>
                      <span>{g.amount.toLocaleString()} MRU/{isRTL ? "شهر" : "mois"}</span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        <Bell size={11} />
                        {isRTL ? "التالي" : "Prochain"}: {g.next}
                      </span>
                    </div>
                  </div>
                  <div className={`flex flex-col items-${isRTL ? "start" : "end"} gap-2`}>
                    <div className="text-xs font-semibold text-islamic-400">
                      {g.members - g.filled} {isRTL ? "مقعد متبقٍ" : "place(s) dispo"}
                    </div>
                    <div className="w-32 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(g.filled / g.members) * 100}%`, background: "linear-gradient(135deg, #2D6A4F, #4A9B6F)" }} />
                    </div>
                    <button
                      onClick={() => success(isRTL ? "تم إرسال طلب الانضمام ✓" : "Demande d'adhésion envoyée ✓")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white ${isRTL ? "flex-row-reverse" : ""}`}
                      style={{ background: "linear-gradient(135deg, #2D6A4F, #1A3F2A)" }}>
                      {isRTL ? "انضم" : "Rejoindre"}
                      <Arrow size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => success(isRTL ? "سيتم التواصل معك لإنشاء مجموعة ✓" : "Nous vous contacterons pour créer le groupe ✓")}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-sand-300 text-night-400/60 hover:border-sand-400 hover:text-sand-500 transition-all text-sm font-semibold ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
            <Plus size={16} />
            {isRTL ? "إنشاء مجموعة جديدة" : "Créer un nouveau groupe"}
          </button>
        </div>

        {/* Avantages */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Lock, fr: "Fonds sécurisés", ar: "أموال مؤمَّنة", descFr: "Escrow NUQTA.MR protège toutes les contributions", descAr: "ضمان نقطة.مر يحمي جميع المساهمات", color: "#1B2A4A" },
            { icon: CheckCircle2, fr: "Membres vérifiés", ar: "أعضاء موثقون", descFr: "Chaque membre est identifié par numéro mauritanien", descAr: "كل عضو موثق برقم هاتف موريتاني", color: "#2D6A4F" },
            { icon: TrendingUp, fr: "Historique complet", ar: "سجل كامل", descFr: "Toutes les transactions sont enregistrées et traçables", descAr: "جميع المعاملات مسجلة وقابلة للتتبع", color: "#C9A84C" },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-card ${isRTL ? "text-right font-arabic" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${a.color}20` }}>
                  <Icon size={18} style={{ color: a.color }} />
                </div>
                <h4 className="font-bold text-night-500 mb-1">{isRTL ? a.ar : a.fr}</h4>
                <p className="text-xs text-night-400/70">{isRTL ? a.descAr : a.descFr}</p>
              </div>
            );
          })}
        </div>

        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/escrow" className="btn-night text-sm py-3 px-6">
            {isRTL ? "تعرف على الضمان المالي" : "En savoir sur l'Escrow"}
          </Link>
          <Link href="/paiement" className="btn-gold text-sm py-3 px-6">
            {isRTL ? "طرق الدفع" : "Modes de paiement"}
          </Link>
        </div>
      </div>
    </div>
  );
}
