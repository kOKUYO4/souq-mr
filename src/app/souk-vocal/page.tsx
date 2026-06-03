"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Play, Pause, CheckCircle2, ArrowRight, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

type Step = "intro" | "recording" | "processing" | "result";

const demoTranscriptions = {
  fr: [
    "Je vends une Toyota Land Cruiser 2018 diesel automatique, 120 000 km, très bon état, prix 1 200 000 MRU, négociable. Contact Nouakchott.",
    "Vends iPhone 15 Pro Max 256 GB comme neuf, boîte d'origine, prix 190 000 MRU ferme. Tevragh-Zeina.",
    "Appartement à louer 3 pièces Ryad, 2ème étage, 25 000 MRU par mois. Disponible immédiatement.",
  ],
  ar: [
    "أبيع تويوتا لاند كروزر 2018 ديزل أوتوماتيك، 120,000 كيلومتر، حالة ممتازة، السعر 1,200,000 أوقية قابل للتفاوض. نواكشوط.",
    "أبيع آيفون 15 برو ماكس 256 جيجا كالجديد، علبة أصلية، السعر 190,000 أوقية ثابت. تيفرغ زينة.",
    "شقة للإيجار 3 غرف الرياض، الطابق الثاني، 25,000 أوقية شهرياً. متاحة فوراً.",
  ],
};

const demoExtracted = {
  fr: [
    { titre: "Toyota Land Cruiser 2018 Diesel", categorie: "Véhicules", prix: "1 200 000 MRU", lieu: "Nouakchott", etat: "Très bon état", negociable: true },
    { titre: "iPhone 15 Pro Max 256GB — Neuf", categorie: "Téléphones", prix: "190 000 MRU", lieu: "Tevragh-Zeina", etat: "Neuf", negociable: false },
    { titre: "Appartement 3 pièces à louer — Ryad", categorie: "Immobilier", prix: "25 000 MRU/mois", lieu: "Ryad, Nouakchott", etat: "Disponible", negociable: false },
  ],
  ar: [
    { titre: "تويوتا لاند كروزر 2018 ديزل", categorie: "السيارات", prix: "1,200,000 أوقية", lieu: "نواكشوط", etat: "حالة ممتازة", negociable: true },
    { titre: "آيفون 15 برو ماكس 256 جيجا - جديد", categorie: "الهواتف", prix: "190,000 أوقية", lieu: "تيفرغ زينة", etat: "جديد", negociable: false },
    { titre: "شقة 3 غرف للإيجار - الرياض", categorie: "العقارات", prix: "25,000 أوقية/شهر", lieu: "الرياض، نواكشوط", etat: "متاحة", negociable: false },
  ],
};

export default function SoukVocalPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [step, setStep] = useState<Step>("intro");
  const [recording, setRecording] = useState(false);
  const [demoIdx] = useState(() => Math.floor(Math.random() * 3));
  const [progress, setProgress] = useState(0);
  const [waveAmps, setWaveAmps] = useState<number[]>(Array(20).fill(4));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const transcription = demoTranscriptions[locale][demoIdx];
  const extracted = demoExtracted[locale][demoIdx];

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startRecording = () => {
    setRecording(true);
    setStep("recording");
    setProgress(0);
    // Animate wave bars
    intervalRef.current = setInterval(() => {
      setWaveAmps(Array(20).fill(0).map(() => 2 + Math.random() * 22));
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          setRecording(false);
          setStep("processing");
          setTimeout(() => setStep("result"), 2200);
          return 100;
        }
        return p + 2;
      });
    }, 120);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRecording(false);
    setStep("processing");
    setTimeout(() => setStep("result"), 2200);
  };

  const handlePublish = () => {
    success(isRTL ? "تم إرسال الإعلان للمراجعة ✓" : "Annonce envoyée en modération ✓");
    setTimeout(() => setStep("intro"), 2500);
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.06} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-400/15 border border-sand-400/20 text-sand-300 text-sm mb-6">
            <Mic size={14} className="text-sand-400" />
            {isRTL ? "مميزة فريدة" : "Fonctionnalité unique"}
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "سوق صوتي" : "Souk Vocal"}
          </h1>
          <p className="text-sand-300/70 max-w-lg mx-auto">
            {isRTL
              ? "أنشئ إعلانك بصوتك فقط — تحدث بالدارجة الحسانية أو الفرنسية"
              : "Créez votre annonce juste avec votre voix — parlez en Hassaniya ou en français"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {step === "intro" && (
          <div className="space-y-6">
            {/* How it works */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className={`font-bold text-night-500 text-lg mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "كيف يعمل؟" : "Comment ça marche ?"}
              </h2>
              <div className="space-y-4">
                {[
                  { n: "01", fr: "Appuyez sur le bouton micro", ar: "اضغط على زر الميكروفون" },
                  { n: "02", fr: "Décrivez votre annonce à voix haute (produit, prix, état, lieu)", ar: "صف إعلانك بصوت عالٍ (المنتج، السعر، الحالة، الموقع)" },
                  { n: "03", fr: "Notre IA transcrit et structure automatiquement votre annonce", ar: "يقوم ذكاؤنا الاصطناعي تلقائياً بنسخ إعلانك وهيكلته" },
                  { n: "04", fr: "Vérifiez les informations et publiez en un clic", ar: "تحقق من المعلومات وانشر بنقرة واحدة" },
                ].map((s, i) => (
                  <div key={i} className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-night-500 flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                      {s.n}
                    </div>
                    <p className={`text-sm text-night-400/80 pt-1.5 ${isRTL ? "font-arabic text-right" : ""}`}>
                      {isRTL ? s.ar : s.fr}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mic button */}
            <div className="text-center">
              <button
                onClick={startRecording}
                className="w-28 h-28 rounded-full flex items-center justify-center mx-auto transition-all hover:scale-105 active:scale-95 shadow-gold-lg"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
              >
                <Mic size={40} className="text-night-500" />
              </button>
              <p className={`mt-4 text-sm text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "اضغط لبدء التسجيل" : "Appuyez pour commencer"}
              </p>
            </div>

            {/* Tip */}
            <div className={`bg-sand-100 rounded-xl p-4 text-sm ${isRTL ? "text-right font-arabic" : ""}`}>
              <p className="font-semibold text-sand-600 mb-1">💡 {isRTL ? "نصيحة" : "Astuce"}</p>
              <p className="text-night-400/70">
                {isRTL
                  ? "مثال: «أبيع سيارة تويوتا 2020 ديزل بحالة ممتازة، السعر 800,000 أوقية قابل للتفاوض في نواكشوط»"
                  : "Exemple : «Je vends une Toyota 2020 diesel très bon état, prix 800 000 MRU négociable à Nouakchott»"}
              </p>
            </div>
          </div>
        )}

        {step === "recording" && (
          <div className="bg-white rounded-2xl p-8 shadow-card text-center">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mx-auto mb-6" />
            <p className={`font-bold text-night-500 text-lg mb-6 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "جارٍ التسجيل..." : "Enregistrement en cours..."}
            </p>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-1 mb-6 h-16">
              {waveAmps.map((amp, i) => (
                <div key={i} className="w-1.5 rounded-full transition-all duration-75"
                  style={{ height: `${amp}px`, background: "linear-gradient(to top, #C9A84C, #E8C96A)" }} />
              ))}
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-sand-100 rounded-full mb-4 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "linear-gradient(135deg, #C9A84C, #B8922E)" }} />
            </div>
            <p className="text-xs text-night-400/50 mb-6">{progress}%</p>

            <button onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto hover:bg-red-600 transition-colors">
              <MicOff size={24} className="text-white" />
            </button>
            <p className={`text-xs text-night-400/50 mt-3 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "اضغط لإيقاف التسجيل" : "Appuyez pour arrêter"}
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="bg-white rounded-2xl p-12 shadow-card text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
              <Wand2 size={28} className="text-sand-400 animate-pulse" />
            </div>
            <p className={`font-bold text-night-500 text-lg mb-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "الذكاء الاصطناعي يعالج صوتك..." : "Notre IA traite votre enregistrement..."}
            </p>
            <p className={`text-sm text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "النسخ • الاستخراج • الهيكلة" : "Transcription • Extraction • Structuration"}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-sand-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-4">
            {/* Transcription */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Volume2 size={15} className="text-sand-400" />
                <p className="text-xs font-semibold text-night-400/60 uppercase tracking-wide">
                  {isRTL ? "النص المنقول" : "Transcription"}
                </p>
              </div>
              <p className={`text-sm text-night-500 leading-relaxed italic ${isRTL ? "font-arabic text-right" : ""}`}>
                "{transcription}"
              </p>
            </div>

            {/* Annonce générée */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <CheckCircle2 size={15} className="text-islamic-400" />
                <p className="text-xs font-semibold text-night-400/60 uppercase tracking-wide">
                  {isRTL ? "الإعلان المُستخرج" : "Annonce extraite"}
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { k: isRTL ? "العنوان" : "Titre", v: extracted.titre },
                  { k: isRTL ? "القسم" : "Catégorie", v: extracted.categorie },
                  { k: isRTL ? "السعر" : "Prix", v: extracted.prix },
                  { k: isRTL ? "الموقع" : "Lieu", v: extracted.lieu },
                  { k: isRTL ? "الحالة" : "État", v: extracted.etat },
                  { k: isRTL ? "التفاوض" : "Négociable", v: extracted.negociable ? (isRTL ? "نعم" : "Oui") : (isRTL ? "لا" : "Non") },
                ].map((row) => (
                  <div key={row.k} className={`flex items-start gap-3 py-2 border-b border-sand-50 last:border-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-night-400/50 w-24 flex-shrink-0 pt-0.5 font-medium">{row.k}</span>
                    <span className={`text-sm text-night-500 font-medium flex-1 ${isRTL ? "font-arabic text-right" : ""}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setStep("intro")}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-sand-200 text-night-400 hover:bg-sand-50 transition-colors">
                {isRTL ? "إعادة التسجيل" : "Recommencer"}
              </button>
              <button onClick={handlePublish}
                className={`flex-1 py-3 rounded-xl text-sm font-bold text-night-500 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                {isRTL ? "نشر الإعلان" : "Publier l'annonce"}
                <Arrow size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
