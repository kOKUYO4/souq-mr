"use client";

import { useState } from "react";
import { CheckCircle2, Upload, Shield, Lock, Camera, Phone, User, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

type VerifStep = "intro" | "phone" | "identity" | "selfie" | "review" | "done";

const stepOrder: VerifStep[] = ["intro", "phone", "identity", "selfie", "review", "done"];

export default function VerificationPage() {
  const { isRTL, locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<VerifStep>("intro");
  const [phoneCode, setPhoneCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [docType, setDocType] = useState<"cni" | "passport" | "residence">("cni");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const next = () => {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
  };

  const sendCode = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setCodeSent(true); }, 1500);
  };

  const verifyCode = () => {
    if (phoneCode === "1234" || phoneCode.length === 4) { setVerified(true); setTimeout(next, 600); }
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  const benefits = locale === "ar" ? [
    "شارة ✓ موثق على ملفك الشخصي وإعلاناتك",
    "ثقة أكبر من المشترين وبائعين آخرين",
    "وصول إلى ميزات المدفوعات المتقدمة",
    "أولوية في نتائج البحث",
    "حد أعلى للمعاملات عبر الضمان المالي",
  ] : [
    "Badge ✓ Vérifié sur votre profil et vos annonces",
    "Confiance accrue des acheteurs et autres vendeurs",
    "Accès aux fonctionnalités de paiement avancées",
    "Priorité dans les résultats de recherche",
    "Limite de transaction Escrow plus élevée",
  ];

  const docTypes = [
    { id: "cni" as const, fr: "Carte Nationale d'Identité", ar: "بطاقة الهوية الوطنية" },
    { id: "passport" as const, fr: "Passeport", ar: "جواز السفر" },
    { id: "residence" as const, fr: "Titre de séjour", ar: "إقامة" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-card">
          <Lock size={28} className="text-sand-400 mx-auto mb-4" />
          <h2 className={`text-lg font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تسجيل الدخول مطلوب" : "Connexion requise"}
          </h2>
          <p className="text-sm text-night-400/70 mb-5">
            {isRTL ? "يجب تسجيل الدخول للتحقق من هويتك" : "Connectez-vous pour vérifier votre identité"}
          </p>
          <Link href="/connexion" className="btn-gold w-full justify-center">
            {isRTL ? "تسجيل الدخول" : "Se connecter"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-2xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="w-14 h-14 rounded-2xl bg-sand-400/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-sand-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "التحقق من الهوية" : "Vérification d'identité"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "احصل على شارة «موثق» وزد من ثقة المشترين" : "Obtenez le badge «Vérifié» et gagnez la confiance des acheteurs"}
          </p>
          {/* Progress */}
          {step !== "intro" && step !== "done" && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {(["phone", "identity", "selfie", "review"] as VerifStep[]).map((s, i) => (
                <div key={s} className={`h-1.5 rounded-full transition-all ${
                  stepOrder.indexOf(step) > i + 1 ? "w-8 bg-islamic-400" :
                  step === s ? "w-8 bg-sand-400" : "w-4 bg-white/20"
                }`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* INTRO */}
        {step === "intro" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className={`font-bold text-night-500 text-lg mb-4 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "لماذا التحقق من هويتك؟" : "Pourquoi vérifier votre identité ?"}
              </h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <CheckCircle2 size={16} className="text-islamic-400 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm text-night-400/80 ${isRTL ? "font-arabic" : ""}`}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "< 5min", l: { fr: "Durée totale", ar: "المدة الإجمالية" } },
                { n: "100%", l: { fr: "Données sécurisées", ar: "بيانات آمنة" } },
                { n: "Gratuit", l: { fr: "Service", ar: "مجاناً" } },
              ].map((s) => (
                <div key={s.n} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <p className="font-display font-bold text-sand-500">{s.n}</p>
                  <p className="text-xs text-night-400/60 mt-0.5">{s.l[locale]}</p>
                </div>
              ))}
            </div>

            <button onClick={next} className={`w-full btn-gold justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
              {isRTL ? "ابدأ التحقق" : "Commencer la vérification"}
              <Arrow size={16} />
            </button>
          </div>
        )}

        {/* PHONE */}
        {step === "phone" && (
          <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
                <Phone size={18} className="text-sand-500" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "التحقق من رقم الهاتف" : "Vérification du numéro"}
                </p>
                <p className="text-xs text-night-400/60">
                  {isRTL ? "سنرسل رمزاً إلى +222 XX XX XX XX" : "Nous envoyons un code au +222 XX XX XX XX"}
                </p>
              </div>
            </div>

            {!codeSent ? (
              <button onClick={sendCode} disabled={sending} className="w-full btn-gold justify-center">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                {isRTL ? "إرسال الرمز" : "Envoyer le code"}
              </button>
            ) : (
              <div className="space-y-3">
                <p className={`text-sm text-islamic-500 font-semibold ${isRTL ? "text-right font-arabic" : ""}`}>
                  ✓ {isRTL ? "تم إرسال الرمز" : "Code envoyé !"}
                </p>
                <input
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="1234"
                  maxLength={4}
                  dir="ltr"
                  className="w-full border-2 border-sand-200 rounded-xl px-4 py-3 text-center text-2xl font-display font-bold text-night-500 tracking-[0.4em] outline-none focus:border-sand-400"
                />
                <p className="text-xs text-center text-night-400/50">
                  {isRTL ? "(للتجربة: أدخل أي 4 أرقام)" : "(Demo: entrez n'importe quel code à 4 chiffres)"}
                </p>
                <button onClick={verifyCode} disabled={phoneCode.length < 4} className="w-full btn-gold justify-center disabled:opacity-40">
                  {verified ? <CheckCircle2 size={16} className="text-white" /> : null}
                  {isRTL ? "تأكيد الرمز" : "Confirmer le code"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* IDENTITY */}
        {step === "identity" && (
          <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
                <User size={18} className="text-sand-500" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "وثيقة الهوية" : "Document d'identité"}
                </p>
                <p className="text-xs text-night-400/60">
                  {isRTL ? "يُرجى تحميل صورة واضحة من وثيقتك" : "Téléchargez une photo claire de votre document"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {docTypes.map((d) => (
                <button key={d.id} onClick={() => setDocType(d.id)}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    docType === d.id ? "border-sand-400 bg-sand-50 text-sand-600" : "border-sand-200 text-night-400/60"
                  } ${isRTL ? "font-arabic" : ""}`}>
                  {d[locale]}
                </button>
              ))}
            </div>

            {!uploaded ? (
              <button onClick={simulateUpload} disabled={uploading}
                className="w-full flex flex-col items-center gap-3 p-8 border-2 border-dashed border-sand-200 rounded-2xl hover:border-sand-400 transition-all">
                {uploading ? (
                  <Loader2 size={28} className="text-sand-400 animate-spin" />
                ) : (
                  <>
                    <Upload size={28} className="text-sand-400" />
                    <span className={`text-sm text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? "انقر لتحميل الصورة" : "Cliquez pour télécharger"}
                    </span>
                    <span className="text-xs text-night-400/40">JPG, PNG, PDF — max 5 MB</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-islamic-400/10 border border-islamic-400/30 rounded-xl">
                <CheckCircle2 size={18} className="text-islamic-500" />
                <span className={`text-sm font-semibold text-islamic-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تم تحميل المستند بنجاح" : "Document téléchargé avec succès"}
                </span>
              </div>
            )}

            {uploaded && (
              <button onClick={next} className={`w-full btn-gold justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                {isRTL ? "التالي" : "Continuer"}
                <Arrow size={16} />
              </button>
            )}
          </div>
        )}

        {/* SELFIE */}
        {step === "selfie" && (
          <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
                <Camera size={18} className="text-sand-500" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "صورة سيلفي مع الوثيقة" : "Selfie avec le document"}
                </p>
                <p className="text-xs text-night-400/60">
                  {isRTL ? "التقط صورة تُظهر وجهك ووثيقتك معاً" : "Prenez une photo montrant votre visage et votre document"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-night-600 aspect-video flex items-center justify-center">
              <div className="text-center text-sand-400">
                <Camera size={40} className="mx-auto mb-2 opacity-50" />
                <p className={`text-sm ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "معاينة الكاميرا (تجريبي)" : "Aperçu caméra (démo)"}
                </p>
              </div>
            </div>

            <div className={`text-xs text-night-400/60 space-y-1 ${isRTL ? "text-right font-arabic" : ""}`}>
              {(isRTL ? [
                "✓ تأكد من وضوح وجهك وإضاءته جيداً",
                "✓ احمل وثيقتك مفتوحة أمام وجهك",
                "✓ تأكد من قراءة بيانات الوثيقة بوضوح",
              ] : [
                "✓ Assurez-vous que votre visage est bien éclairé et visible",
                "✓ Tenez votre document ouvert face à la caméra",
                "✓ Vérifiez que les données du document sont lisibles",
              ]).map((t, i) => <p key={i}>{t}</p>)}
            </div>

            <button onClick={next} className={`w-full btn-gold justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
              <Camera size={16} />
              {isRTL ? "التقاط الصورة" : "Prendre la photo"}
            </button>
          </div>
        )}

        {/* REVIEW */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className={`font-bold text-night-500 mb-4 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "مراجعة طلبك" : "Récapitulatif de votre demande"}
              </h2>
              {[
                { fr: "Numéro de téléphone", ar: "رقم الهاتف", status: "verified", val: "+222 XX XX XX XX" },
                { fr: "Document d'identité", ar: "وثيقة الهوية", status: "uploaded", val: docTypes.find((d) => d.id === docType)?.[locale] },
                { fr: "Selfie avec document", ar: "صورة سيلفي", status: "uploaded", val: isRTL ? "تم الالتقاط" : "Capturé" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-3 border-b border-sand-100 last:border-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-sm text-night-500 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? item.ar : item.fr}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-night-400/60">{item.val}</span>
                    <CheckCircle2 size={14} className="text-islamic-400" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-sand-50 rounded-xl p-4 text-xs text-night-400/70">
              <p className={isRTL ? "text-right font-arabic" : ""}>
                {isRTL
                  ? "سيتم مراجعة طلبك خلال 24 ساعة. ستتلقى إشعاراً عبر الرسائل والبريد الإلكتروني."
                  : "Votre demande sera examinée dans les 24 heures. Vous recevrez une notification par message et email."}
              </p>
            </div>
            <button onClick={next} className={`w-full btn-gold justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
              {isRTL ? "إرسال الطلب" : "Soumettre la demande"}
              <Arrow size={16} />
            </button>
          </div>
        )}

        {/* DONE */}
        {step === "done" && (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, #2D6A4F20, #1B4A3A10)", border: "2px solid #2D6A4F40" }}>
              <CheckCircle2 size={36} className="text-islamic-400" />
            </div>
            <div>
              <h2 className={`text-2xl font-display font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "تم إرسال الطلب!" : "Demande envoyée !"}
              </h2>
              <p className={`text-night-400/70 text-sm max-w-sm mx-auto ${isRTL ? "font-arabic" : ""}`}>
                {isRTL
                  ? "سيراجع فريقنا وثائقك خلال 24 ساعة. ستتلقى شارة «موثق» بعد الموافقة."
                  : "Notre équipe examinera vos documents sous 24h. Vous recevrez le badge «Vérifié» après approbation."}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-card text-left space-y-2 max-w-xs mx-auto">
              {(isRTL ? ["مراجعة الوثائق: 24 ساعة", "إشعار عبر الرسائل", "شارة موثق على ملفك الشخصي"] :
                ["Examen des documents : 24h", "Notification par message", "Badge Vérifié sur votre profil"]
              ).map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm text-night-500 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-5 h-5 rounded-full bg-sand-100 text-sand-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                  <span className={isRTL ? "font-arabic" : ""}>{s}</span>
                </div>
              ))}
            </div>
            <div className={`flex gap-3 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link href="/tableau-de-bord" className="btn-gold text-sm py-2.5 px-5">
                {isRTL ? "لوحة التحكم" : "Tableau de bord"}
              </Link>
              <Link href="/" className="btn-outline text-sm py-2.5 px-5">
                {isRTL ? "الرئيسية" : "Accueil"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
