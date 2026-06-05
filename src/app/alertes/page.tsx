"use client";

import { useState } from "react";
import { Bell, BellOff, Plus, Trash2, TrendingDown, Search, ChevronDown, CheckCircle2, X } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/data/categories";

type AlertFreq = "instant" | "daily" | "weekly";

interface PriceAlert {
  id: string;
  keyword: string;
  keywordAr: string;
  category: string;
  maxPrice: number;
  frequency: AlertFreq;
  active: boolean;
  matches: number;
  createdAt: string;
}

const mockAlerts: PriceAlert[] = [
  { id: "a1", keyword: "iPhone 14 Pro", keywordAr: "آيفون 14 برو", category: "phones", maxPrice: 200000, frequency: "instant", active: true, matches: 3, createdAt: "2025-01-10" },
  { id: "a2", keyword: "Toyota Hilux", keywordAr: "تويوتا هايلوكس", category: "vehicles", maxPrice: 3000000, frequency: "daily", active: true, matches: 7, createdAt: "2025-01-08" },
  { id: "a3", keyword: "Appartement Tevragh", keywordAr: "شقة تيفرغ", category: "home", maxPrice: 0, frequency: "weekly", active: false, matches: 12, createdAt: "2025-01-05" },
  { id: "a4", keyword: "Climatiseur 18000 BTU", keywordAr: "مكيف 18000 BTU", category: "home", maxPrice: 80000, frequency: "daily", active: true, matches: 1, createdAt: "2025-01-02" },
];

const freqLabels: Record<AlertFreq, { fr: string; ar: string }> = {
  instant: { fr: "Instantané", ar: "فوري" },
  daily: { fr: "Quotidien", ar: "يومي" },
  weekly: { fr: "Hebdomadaire", ar: "أسبوعي" },
};

export default function AlertesPage() {
  const { isRTL, locale } = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
  const [showForm, setShowForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMaxPrice, setNewMaxPrice] = useState("");
  const [newFreq, setNewFreq] = useState<AlertFreq>("instant");
  const [saved, setSaved] = useState(false);

  const toggleAlert = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));

  const deleteAlert = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const saveAlert = () => {
    if (!newKeyword.trim()) return;
    const alert: PriceAlert = {
      id: `a${Date.now()}`,
      keyword: newKeyword,
      keywordAr: newKeyword,
      category: newCategory,
      maxPrice: newMaxPrice ? parseInt(newMaxPrice) : 0,
      frequency: newFreq,
      active: true,
      matches: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAlerts((prev) => [alert, ...prev]);
    setNewKeyword("");
    setNewCategory("");
    setNewMaxPrice("");
    setNewFreq("instant");
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const activeCount = alerts.filter((a) => a.active).length;

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
            <Bell size={28} className="text-night-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            {isRTL ? "تنبيهات الأسعار" : "Alertes prix"}
          </h1>
          <p className="text-sand-300/80 text-sm max-w-md mx-auto">
            {isRTL
              ? "احصل على إشعار فوري عند نشر إعلان يطابق معاييرك"
              : "Soyez notifié dès qu'une annonce correspond à vos critères"}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sand-300 text-sm">
            <Bell size={14} />
            <span>{activeCount} {isRTL ? "تنبيه نشط" : "alerte(s) active(s)"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Success banner */}
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-islamic-400/10 border border-islamic-400/30 rounded-xl text-islamic-500 text-sm">
            <CheckCircle2 size={16} />
            {isRTL ? "تم حفظ التنبيه بنجاح" : "Alerte enregistrée avec succès"}
          </div>
        )}

        {/* Create alert */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`w-full flex items-center justify-between px-6 py-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #C9A84C20, #B8922E10)", border: "1px solid #C9A84C40" }}>
                <Plus size={18} className="text-sand-500" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className={`font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "إنشاء تنبيه جديد" : "Créer une nouvelle alerte"}
                </p>
                <p className="text-xs text-night-400/60">
                  {isRTL ? "مجاناً · بدون قيود" : "Gratuit · illimité"}
                </p>
              </div>
            </div>
            <ChevronDown size={18} className={`text-sand-400 transition-transform ${showForm ? "rotate-180" : ""}`} />
          </button>

          {showForm && (
            <div className="px-6 pb-6 border-t border-sand-100 pt-5 space-y-4">
              <div>
                <label className={`block text-xs font-semibold text-night-400/70 mb-1.5 ${isRTL ? "text-right font-arabic" : ""}`}>
                  {isRTL ? "كلمة البحث" : "Mot-clé de recherche"}
                </label>
                <div className="relative">
                  <input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder={isRTL ? "مثال: آيفون 14، تويوتا..." : "Ex: iPhone 14, Toyota Hilux..."}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm text-night-500 outline-none focus:border-sand-400 transition-all"
                  />
                  <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-sand-400 ${isRTL ? "left-3" : "right-3"}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold text-night-400/70 mb-1.5 ${isRTL ? "text-right font-arabic" : ""}`}>
                    {isRTL ? "الفئة (اختياري)" : "Catégorie (optionnel)"}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-sand-200 rounded-xl px-3 py-2.5 text-sm text-night-500 outline-none focus:border-sand-400 bg-white"
                  >
                    <option value="">{isRTL ? "كل الفئات" : "Toutes catégories"}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{isRTL ? c.nameAr : c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold text-night-400/70 mb-1.5 ${isRTL ? "text-right font-arabic" : ""}`}>
                    {isRTL ? "السعر الأقصى (MRU)" : "Prix max (MRU)"}
                  </label>
                  <input
                    value={newMaxPrice}
                    onChange={(e) => setNewMaxPrice(e.target.value)}
                    type="number"
                    placeholder={isRTL ? "غير محدود" : "Illimité"}
                    className="w-full border border-sand-200 rounded-xl px-3 py-2.5 text-sm text-night-500 outline-none focus:border-sand-400"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold text-night-400/70 mb-2 ${isRTL ? "text-right font-arabic" : ""}`}>
                  {isRTL ? "تكرار الإشعار" : "Fréquence de notification"}
                </label>
                <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {(["instant", "daily", "weekly"] as AlertFreq[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setNewFreq(f)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        newFreq === f
                          ? "border-sand-400 text-sand-500 bg-sand-50"
                          : "border-sand-200 text-night-400/60 hover:border-sand-300"
                      } ${isRTL ? "font-arabic" : ""}`}
                    >
                      {freqLabels[f][locale]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveAlert}
                disabled={!newKeyword.trim()}
                className="w-full btn-gold justify-center disabled:opacity-40"
              >
                <Bell size={15} />
                {isRTL ? "حفظ التنبيه" : "Enregistrer l'alerte"}
              </button>
            </div>
          )}
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          <h2 className={`font-bold text-night-500 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "تنبيهاتك" : "Vos alertes"} ({alerts.length})
          </h2>
          {alerts.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-card">
              <BellOff size={32} className="text-sand-300 mx-auto mb-3" />
              <p className={`text-night-400/60 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "لا توجد تنبيهات حتى الآن" : "Aucune alerte pour l'instant"}
              </p>
            </div>
          )}
          {alerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-2xl p-5 shadow-card flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  <p className={`font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? alert.keywordAr : alert.keyword}
                  </p>
                  {alert.matches > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-islamic-400/10 text-islamic-500">
                      {alert.matches} {isRTL ? "إعلان" : "annonce(s)"}
                    </span>
                  )}
                </div>
                <div className={`flex items-center gap-3 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  {alert.category && (
                    <span>{categories.find((c) => c.id === alert.category)?.[isRTL ? "nameAr" : "name"] || alert.category}</span>
                  )}
                  {alert.maxPrice > 0 && (
                    <>
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <TrendingDown size={11} />
                        {alert.maxPrice.toLocaleString()} MRU
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className={isRTL ? "font-arabic" : ""}>{freqLabels[alert.frequency][locale]}</span>
                </div>
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {/* Toggle */}
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`relative w-11 h-6 rounded-full transition-all ${alert.active ? "bg-islamic-400" : "bg-sand-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${alert.active ? "left-6" : "left-1"}`} />
                </button>
                {/* Delete */}
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-night-500 rounded-2xl p-6 text-sand-200">
          <h3 className={`font-bold mb-3 ${isRTL ? "font-arabic text-right" : ""}`}>
            💡 {isRTL ? "نصائح للتنبيهات الفعّالة" : "Conseils pour des alertes efficaces"}
          </h3>
          <ul className={`space-y-1.5 text-sm text-sand-300/80 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? (
              <>
                <li>• استخدم كلمات بحث واضحة مثل «آيفون 14 برو» بدلاً من «هاتف»</li>
                <li>• حدد فئة لتقليل الضوضاء وتلقي إعلانات أكثر دقة</li>
                <li>• الإشعار الفوري مثالي للمنتجات النادرة ذات الطلب العالي</li>
              </>
            ) : (
              <>
                <li>• Utilisez des termes précis comme «iPhone 14 Pro» plutôt que «téléphone»</li>
                <li>• Ajoutez une catégorie pour réduire le bruit et cibler vos recherches</li>
                <li>• L'instantané est idéal pour les produits rares très demandés</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
