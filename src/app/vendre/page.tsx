"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, CheckCircle2, Lock, Loader2, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import IslamicPattern from "@/components/ui/IslamicPattern";
import ImageUploader from "@/components/ui/ImageUploader";

const STEP_LABELS = {
  fr: ["Photos & Catégorie", "Détails & Prix", "Contact & Publication"],
  ar: ["الصور والقسم", "التفاصيل والسعر", "التواصل والنشر"],
};

export default function VendrePage() {
  const { isRTL } = useLanguage();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "", titleAr: "", category: "", subcategory: "",
    price: "", negotiable: false, cod: false,
    condition: "new", description: "", descriptionAr: "",
    location: "", locationAr: "", phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-card">
          <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-sand-400" />
          </div>
          <h2 className={`text-lg font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تسجيل الدخول مطلوب" : "Connexion requise"}
          </h2>
          <p className="text-sm text-night-400/70 mb-6">
            {isRTL ? "يجب تسجيل الدخول لنشر إعلان" : "Connectez-vous pour déposer une annonce"}
          </p>
          <Link href="/connexion" className="btn-gold w-full justify-center">
            {isRTL ? "تسجيل الدخول" : "Se connecter"}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price) || 0,
          images: images.length
            ? images
            : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
        }),
      });
      const json = await res.json();
      if (json.success || res.ok) {
        success(isRTL ? "تم نشر إعلانك! 🚀" : "Annonce publiée avec succès ! 🚀");
        const id = json.data?.id;
        if (id) {
          router.push(`/annonce/${id}`);
        } else {
          setSubmitted(true);
        }
      } else {
        toastError(json.error || (isRTL ? "خطأ في النشر" : "Erreur lors de la publication"));
      }
    } catch {
      setSubmitError(isRTL ? "خطأ في الشبكة" : "Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-card">
          <div className="w-16 h-16 rounded-full bg-islamic-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-islamic-400" />
          </div>
          <h2 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تم نشر إعلانك!" : "Annonce publiée !"}
          </h2>
          <p className={`text-night-400/70 text-sm mb-6 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL
              ? "سيظهر إعلانك خلال دقائق بعد المراجعة"
              : "Votre annonce sera visible sous quelques minutes après modération"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setSubmitted(false); setStep(1); setFormData({ title: "", titleAr: "", category: "", subcategory: "", price: "", negotiable: false, cod: false, condition: "new", description: "", descriptionAr: "", location: "", locationAr: "", phone: "" }); setImages([]); }}
              className="flex-1 btn-outline py-2.5 text-sm"
            >
              {isRTL ? "إعلان جديد" : "Nouvelle annonce"}
            </button>
            <a href="/annonces" className="flex-1 btn-gold py-2.5 text-sm flex items-center justify-center">
              {isRTL ? "عرض الإعلانات" : "Voir les annonces"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const canGoToStep2 = !!formData.category && !!formData.title;
  const canGoToStep3 = canGoToStep2 && !!formData.price;
  const canSubmit = canGoToStep3 && !!formData.phone;

  const currentCategory = categories.find((c) => c.id === formData.category);

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header sticky */}
      <div className="sticky top-16 z-30 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className={`text-2xl font-display font-bold text-white mb-4 text-center ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "أضف إعلانك" : "Déposer une annonce"}
          </h1>

          {/* Stepper */}
          <div className={`flex items-center justify-center gap-0 ${isRTL ? "flex-row-reverse" : ""}`}>
            {STEP_LABELS.fr.map((_, idx) => {
              const s = idx + 1;
              const done = s < step;
              const active = s === step;
              return (
                <div key={s} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        done || active ? "text-night-500" : "bg-night-600/50 text-sand-400/50"
                      }`}
                      style={done || active ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}
                    >
                      {done ? "✓" : s}
                    </div>
                    <span className={`text-[10px] whitespace-nowrap ${active ? "text-sand-400" : "text-sand-400/40"} ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? STEP_LABELS.ar[idx] : STEP_LABELS.fr[idx]}
                    </span>
                  </div>
                  {s < 3 && (
                    <div className={`w-12 sm:w-20 h-px mx-2 mb-5 ${s < step ? "bg-sand-400" : "bg-night-400/30"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* ── STEP 1: Média + Catégorie ── */}
        {step === 1 && (
          <>
            {/* Voice mode */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right" : ""}>
                  <h3 className="font-semibold text-night-500 text-sm">
                    🎙️ {isRTL ? "وضع الإعلان الصوتي" : "Mode Souk Vocal"}
                  </h3>
                  <p className="text-xs text-night-400/60 mt-0.5">
                    {isRTL ? "سجّل إعلانك بصوتك بالحسانية" : "Enregistrez votre annonce en Hassaniya"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceMode(!voiceMode)}
                  className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${voiceMode ? "bg-islamic-400" : "bg-sand-200"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${voiceMode ? (isRTL ? "left-0.5" : "left-6") : (isRTL ? "left-6" : "left-0.5")}`} />
                </button>
              </div>
              {voiceMode && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <button type="button" className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <Mic size={24} className="text-red-500" />
                  </button>
                  <p className="text-xs text-night-400/60">{isRTL ? "اضغط للتسجيل" : "Appuyez pour enregistrer"}</p>
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className={`font-semibold text-night-500 mb-4 ${isRTL ? "text-right" : ""}`}>
                📸 {isRTL ? "الصور (حتى 6)" : "Photos (max 6)"}
              </h3>
              <ImageUploader value={images} onChange={setImages} max={6} />
            </div>

            {/* Catégorie + Titre */}
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
              <h3 className={`font-semibold text-night-500 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "القسم والعنوان" : "Catégorie & Titre"}
              </h3>
              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "القسم *" : "Catégorie *"}
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
                  className="input-field"
                >
                  <option value="">{isRTL ? "اختر قسماً" : "Choisir une catégorie..."}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{isRTL ? cat.nameAr : cat.name}</option>
                  ))}
                </select>
              </div>

              {currentCategory && (
                <div>
                  <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "الفئة الفرعية" : "Sous-catégorie"}
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="input-field"
                  >
                    <option value="">{isRTL ? "اختر فئة فرعية" : "Choisir..."}</option>
                    {currentCategory.subcategories?.map((sc) => (
                      <option key={sc.id} value={sc.id}>{isRTL ? sc.nameAr : sc.nameFr}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "العنوان (بالفرنسية) *" : "Titre (français) *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={isRTL ? "عنوان الإعلان بالفرنسية" : "Ex: iPhone 15 Pro Max 256GB"}
                  className="input-field"
                />
              </div>
              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "العنوان بالعربية" : "Titre (arabe)"}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="عنوان الإعلان بالعربية"
                  className="input-field font-arabic"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canGoToStep2}
              className="w-full btn-gold py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed gap-2"
            >
              {isRTL ? "التالي" : "Suivant"}
              <Arrow size={18} />
            </button>
          </>
        )}

        {/* ── STEP 2: Détails + Prix ── */}
        {step === 2 && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
              <h3 className={`font-semibold text-night-500 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "التفاصيل والسعر" : "Détails & Prix"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "الحالة" : "État"}
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="input-field"
                  >
                    <option value="new">{isRTL ? "جديد" : "Neuf"}</option>
                    <option value="used">{isRTL ? "مستعمل" : "Occasion"}</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "السعر (أوقية) *" : "Prix (MRU) *"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      className={`input-field ${isRTL ? "pl-14" : "pr-14"}`}
                    />
                    <span className={`absolute top-1/2 -translate-y-1/2 text-sand-400 text-sm font-semibold ${isRTL ? "left-4" : "right-4"}`}>MRU</span>
                  </div>
                </div>
              </div>

              <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <label className={`flex items-center gap-2 text-sm text-night-500 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                    className="w-4 h-4 accent-sand-400"
                  />
                  {isRTL ? "قابل للتفاوض" : "Prix négociable"}
                </label>
                <label className={`flex items-center gap-2 text-sm text-night-500 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input
                    type="checkbox"
                    checked={formData.cod}
                    onChange={(e) => setFormData({ ...formData, cod: e.target.checked })}
                    className="w-4 h-4 accent-sand-400"
                  />
                  {isRTL ? "دفع عند الاستلام" : "Paiement à la livraison"}
                </label>
              </div>

              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "الوصف (بالفرنسية)" : "Description (français)"}
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={isRTL ? "أضف وصفاً تفصيلياً..." : "Décrivez votre article en détail..."}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "الوصف بالعربية" : "Description (arabe)"}
                </label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="وصف المنتج بالعربية..."
                  className="input-field resize-none font-arabic"
                />
              </div>
            </div>

            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline py-3.5 px-5 gap-2 text-sm"
              >
                <BackArrow size={16} />
                {isRTL ? "السابق" : "Retour"}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canGoToStep3}
                className="flex-1 btn-gold py-3.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed gap-2"
              >
                {isRTL ? "التالي" : "Suivant"}
                <Arrow size={16} />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Contact + Review ── */}
        {step === 3 && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
              <h3 className={`font-semibold text-night-500 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "الموقع والتواصل" : "Localisation & Contact"}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "المدينة/الحي" : "Ville / Quartier"}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={isRTL ? "نواكشوط، تيفرغ زينة" : "Nouakchott, Tevragh-Zeina"}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "رقم الهاتف *" : "Numéro de téléphone *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+222 XX XX XX XX"
                    dir="ltr"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5">
              <h3 className={`font-semibold text-night-500 mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <CheckCircle2 size={16} className="text-islamic-400" />
                {isRTL ? "ملخص الإعلان" : "Récapitulatif"}
              </h3>
              <div className={`space-y-2 text-sm ${isRTL ? "text-right" : ""}`}>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-night-400/60">{isRTL ? "العنوان" : "Titre"}</span>
                  <span className="font-medium text-night-500 max-w-[200px] truncate">{formData.title || "—"}</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-night-400/60">{isRTL ? "القسم" : "Catégorie"}</span>
                  <span className="font-medium text-night-500">{currentCategory ? (isRTL ? currentCategory.nameAr : currentCategory.name) : "—"}</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-night-400/60">{isRTL ? "السعر" : "Prix"}</span>
                  <span className="font-bold text-sand-500">{formData.price ? `${parseInt(formData.price).toLocaleString()} MRU` : "—"}</span>
                </div>
                <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-night-400/60">{isRTL ? "الصور" : "Photos"}</span>
                  <span className="font-medium text-night-500">{images.length} {isRTL ? "صورة" : "photo(s)"}</span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline py-3.5 px-5 gap-2 text-sm"
              >
                <BackArrow size={16} />
                {isRTL ? "السابق" : "Retour"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="flex-1 btn-gold py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <Loader2 size={20} className="animate-spin" />
                  : <>🚀 {isRTL ? "انشر الإعلان مجاناً" : "Publier l'annonce gratuitement"}</>
                }
              </button>
            </div>

            <p className={`text-center text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL
                ? "بالنشر، أنت توافق على شروط الاستخدام"
                : "En publiant, vous acceptez nos conditions d'utilisation"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
