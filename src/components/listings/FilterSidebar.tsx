"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface FilterState {
  priceMin: string;
  priceMax: string;
  condition: string;
  location: string;
  negotiable: boolean;
  cod: boolean;
  [key: string]: string | boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categoryFilters?: string[];
  onReset: () => void;
  resultCount: number;
}

const locationOptions = {
  fr: ["Toute la Mauritanie", "Nouakchott", "Nouadhibou", "Rosso", "Kaédi", "Zouerate", "Atar", "Kiffa"],
  ar: ["كل موريتانيا", "نواكشوط", "نواذيبو", "روصو", "قيدي", "زويرات", "آتار", "كيفة"],
};

const marqueOptions = ["Toyota", "Hyundai", "Kia", "Nissan", "Mercedes", "BMW", "Apple", "Samsung", "Xiaomi", "Huawei"];
const carburantOptions = { fr: ["Essence", "Diesel", "Hybride", "Électrique"], ar: ["بنزين", "ديزل", "هجين", "كهربائي"] };
const tailleOptions = ["XS", "S", "M", "L", "XL", "XXL"];

export const defaultFilters: FilterState = {
  priceMin: "",
  priceMax: "",
  condition: "all",
  location: "",
  negotiable: false,
  cod: false,
  marque: "",
  carburant: "",
  taille: "",
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-night-500 mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} className="text-sand-400" /> : <ChevronDown size={14} className="text-sand-400" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  categoryFilters = [],
  onReset,
  resultCount,
}: FilterSidebarProps) {
  const { isRTL, locale } = useLanguage();

  const update = (key: string, value: string | boolean) => onChange({ ...filters, [key]: value });

  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "condition") return v !== "all";
    if (typeof v === "boolean") return v;
    return v !== "";
  }).length;

  return (
    <aside className={`bg-white rounded-2xl shadow-card p-5 sticky top-24 ${isRTL ? "text-right" : ""}`}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <SlidersHorizontal size={16} className="text-sand-400" />
          <h3 className="font-bold text-night-500 text-sm">
            {isRTL ? "الفلاتر" : "Filtres"}
          </h3>
          {activeCount > 0 && (
            <span className="badge-gold text-[10px]">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-sand-500 hover:underline">
            {isRTL ? "إعادة تعيين" : "Réinitialiser"}
          </button>
        )}
      </div>

      {/* Prix */}
      <Section title={isRTL ? "السعر (أوقية)" : "Prix (MRU)"}>
        <div className="space-y-2">
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => update("priceMin", e.target.value)}
              placeholder={isRTL ? "الأدنى" : "Min"}
              className="input-field text-sm py-2 flex-1"
            />
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => update("priceMax", e.target.value)}
              placeholder={isRTL ? "الأقصى" : "Max"}
              className="input-field text-sm py-2 flex-1"
            />
          </div>
          {/* Raccourcis prix */}
          <div className={`flex flex-wrap gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {[
              { label: "< 50K", max: "50000" },
              { label: "< 200K", max: "200000" },
              { label: "< 1M", max: "1000000" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => update("priceMax", opt.max)}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                  filters.priceMax === opt.max
                    ? "border-sand-400 text-sand-500 bg-sand-50"
                    : "border-sand-200 text-night-400/60 hover:border-sand-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* État */}
      <Section title={isRTL ? "الحالة" : "État"}>
        <div className="space-y-2">
          {[
            { value: "all", fr: "Tout", ar: "الكل" },
            { value: "new", fr: "Neuf", ar: "جديد" },
            { value: "used", fr: "Occasion", ar: "مستعمل" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2.5 cursor-pointer group ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                filters.condition === opt.value ? "border-sand-400" : "border-sand-200 group-hover:border-sand-300"
              }`}>
                {filters.condition === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-sand-400" />
                )}
              </div>
              <span
                className={`text-sm ${filters.condition === opt.value ? "text-night-500 font-semibold" : "text-night-400/70"}`}
                onClick={() => update("condition", opt.value)}
              >
                {isRTL ? opt.ar : opt.fr}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Localisation */}
      <Section title={isRTL ? "الموقع" : "Localisation"}>
        <select
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          className="input-field text-sm py-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {(isRTL ? locationOptions.ar : locationOptions.fr).map((city, i) => (
            <option key={i} value={i === 0 ? "" : city}>{city}</option>
          ))}
        </select>
      </Section>

      {/* Options avancées selon catégorie */}
      {categoryFilters.includes("marque") && (
        <Section title={isRTL ? "الماركة" : "Marque"} defaultOpen={false}>
          <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
            {marqueOptions.map((m) => (
              <label key={m} className={`flex items-center gap-2 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                <input
                  type="checkbox"
                  checked={filters.marque === m}
                  onChange={() => update("marque", filters.marque === m ? "" : m)}
                  className="w-3.5 h-3.5 accent-sand-400 flex-shrink-0"
                />
                <span className="text-sm text-night-500">{m}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {categoryFilters.includes("carburant") && (
        <Section title={isRTL ? "الوقود" : "Carburant"} defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {(isRTL ? carburantOptions.ar : carburantOptions.fr).map((c) => (
              <button
                key={c}
                onClick={() => update("carburant", filters.carburant === c ? "" : c)}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                  filters.carburant === c
                    ? "border-sand-400 bg-sand-50 text-sand-500 font-semibold"
                    : "border-sand-200 text-night-400/60 hover:border-sand-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>
      )}

      {categoryFilters.includes("taille") && (
        <Section title={isRTL ? "المقاس" : "Taille"} defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {tailleOptions.map((t) => (
              <button
                key={t}
                onClick={() => update("taille", filters.taille === t ? "" : t)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${
                  filters.taille === t
                    ? "border-sand-400 bg-sand-50 text-sand-500"
                    : "border-sand-200 text-night-400/60 hover:border-sand-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Options rapides */}
      <Section title={isRTL ? "خيارات إضافية" : "Options"} defaultOpen={false}>
        <div className="space-y-2.5">
          {[
            { key: "negotiable", fr: "Prix négociable", ar: "سعر قابل للتفاوض" },
            { key: "cod", fr: "Paiement à la livraison", ar: "الدفع عند الاستلام" },
          ].map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-2.5 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${
                  filters[opt.key] ? "bg-sand-400" : "bg-sand-200"
                }`}
                onClick={() => update(opt.key, !filters[opt.key])}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  filters[opt.key] ? "left-4" : "left-0.5"
                }`} />
              </div>
              <span className="text-sm text-night-500">
                {isRTL ? opt.ar : opt.fr}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Bouton appliquer */}
      <button className="w-full btn-gold py-3 text-sm font-bold mt-2">
        {isRTL ? `عرض ${resultCount} نتيجة` : `Voir ${resultCount} annonce${resultCount > 1 ? "s" : ""}`}
      </button>
    </aside>
  );
}
