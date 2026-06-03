"use client";

import { useState } from "react";
import { Upload, Mic, Camera, Plus, X, CheckCircle2 } from "lucide-react";
import { categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

export default function VendrePage() {
  const { isRTL } = useLanguage();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "", titleAr: "", category: "", price: "", negotiable: false,
    condition: "new", description: "", location: "", phone: "",
  });
  const [voiceMode, setVoiceMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            {isRTL ? "سيظهر إعلانك خلال دقائق بعد المراجعة" : "Votre annonce sera visible sous quelques minutes après modération"}
          </p>
          <div className="flex gap-3">
            <button onClick={() => { setSubmitted(false); setStep(1); }} className="flex-1 btn-outline py-2.5 text-sm">
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

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-3xl font-display font-bold text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "أضف إعلانك" : "Déposer une annonce"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "ابيع بسرعة وأمان في السوق الموريتاني" : "Vendez rapidement et en sécurité sur le marché mauritanien"}
          </p>

          {/* Étapes */}
          <div className={`flex items-center justify-center gap-2 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s <= step ? "text-night-500" : "bg-night-600/50 text-sand-400/50"
                }`}
                  style={s <= step ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && <div className={`w-8 h-px ${s < step ? "bg-sand-400" : "bg-night-400/30"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode vocal */}
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
                className={`relative w-12 h-6 rounded-full transition-all ${voiceMode ? "bg-islamic-400" : "bg-sand-200"}`}
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
              📸 {isRTL ? "الصور (حتى 8)" : "Photos (max 8)"}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <label className="aspect-square rounded-xl border-2 border-dashed border-sand-300 flex flex-col items-center justify-center cursor-pointer hover:border-sand-400 hover:bg-sand-50 transition-all">
                <Plus size={24} className="text-sand-400" />
                <span className="text-xs text-sand-400 mt-1">{isRTL ? "إضافة" : "Ajouter"}</span>
                <input type="file" accept="image/*" multiple className="hidden" />
              </label>
              <label className="aspect-square rounded-xl border-2 border-dashed border-sand-200 flex flex-col items-center justify-center cursor-pointer hover:border-sand-300 hover:bg-sand-50 transition-all">
                <Camera size={20} className="text-sand-300" />
                <span className="text-xs text-sand-300 mt-1">{isRTL ? "كاميرا" : "Caméra"}</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" />
              </label>
            </div>
          </div>

          {/* Infos annonce */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <h3 className={`font-semibold text-night-500 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? "معلومات الإعلان" : "Informations sur l'annonce"}
            </h3>

            <div>
              <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "العنوان (بالفرنسية)" : "Titre (français)"}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "القسم" : "Catégorie"}
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">{isRTL ? "اختر قسماً" : "Choisir..."}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{isRTL ? cat.nameAr : cat.name}</option>
                  ))}
                </select>
              </div>
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
            </div>

            <div>
              <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "السعر (أوقية)" : "Prix (MRU)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className={`input-field ${isRTL ? "pr-16" : "pr-16"}`}
                />
                <span className={`absolute top-1/2 -translate-y-1/2 text-sand-400 text-sm font-semibold ${isRTL ? "left-4" : "right-4"}`}>MRU</span>
              </div>
              <label className={`flex items-center gap-2 mt-2 text-sm text-night-400 cursor-pointer ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <input
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                  className="w-4 h-4 accent-sand-400"
                />
                {isRTL ? "السعر قابل للتفاوض" : "Prix négociable"}
              </label>
            </div>

            <div>
              <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "الوصف" : "Description"}
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                dir={isRTL ? "rtl" : "ltr"}
                placeholder={isRTL ? "أضف وصفاً تفصيلياً..." : "Décrivez votre article en détail..."}
                className="input-field resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  {isRTL ? "رقم الهاتف" : "Numéro de téléphone"}
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

          {/* Bouton publier */}
          <button type="submit" className="w-full btn-gold py-4 text-base font-bold">
            🚀 {isRTL ? "انشر الإعلان مجاناً" : "Publier l'annonce gratuitement"}
          </button>

          <p className={`text-center text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "بالنشر، أنت توافق على شروط الاستخدام" : "En publiant, vous acceptez nos conditions d'utilisation"}
          </p>
        </form>
      </div>
    </div>
  );
}
