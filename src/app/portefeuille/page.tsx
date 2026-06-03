"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CreditCard,
  Smartphone,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

// ─── Types ───────────────────────────────────────────────────────────────────

type TxType = "credit" | "debit" | "escrow_hold" | "escrow_release" | "referral";
type TxStatus = "completed" | "pending" | "failed";
type TabId = "all" | "credit" | "debit" | "escrow";

interface Transaction {
  id: string;
  type: TxType;
  descFr: string;
  descAr: string;
  amount: number;
  date: string;
  status: TxStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "credit",
    descFr: "Vente iPhone 14 Pro",
    descAr: "بيع آيفون 14 برو",
    amount: 45000,
    date: "2026-05-28",
    status: "completed",
  },
  {
    id: "tx2",
    type: "debit",
    descFr: "Boost annonce x3",
    descAr: "تعزيز الإعلان ×3",
    amount: -2997,
    date: "2026-05-25",
    status: "completed",
  },
  {
    id: "tx3",
    type: "referral",
    descFr: "Parrainage - Fatimetou",
    descAr: "إحالة - فاطيمتو",
    amount: 2000,
    date: "2026-05-22",
    status: "completed",
  },
  {
    id: "tx4",
    type: "debit",
    descFr: "Abonnement Pro",
    descAr: "الاشتراك المميز",
    amount: -4990,
    date: "2026-05-20",
    status: "completed",
  },
  {
    id: "tx5",
    type: "escrow_hold",
    descFr: "Escrow retenu - Toyota",
    descAr: "ضمان محتجز - تويوتا",
    amount: -120000,
    date: "2026-05-18",
    status: "pending",
  },
  {
    id: "tx6",
    type: "escrow_release",
    descFr: "Remboursement Escrow",
    descAr: "استرداد مبلغ الضمان",
    amount: 120000,
    date: "2026-05-15",
    status: "completed",
  },
  {
    id: "tx7",
    type: "credit",
    descFr: "Recharge Bankily",
    descAr: "شحن بانكيلي",
    amount: 20000,
    date: "2026-05-12",
    status: "completed",
  },
  {
    id: "tx8",
    type: "debit",
    descFr: "Achat Tapis",
    descAr: "شراء سجادة",
    amount: -28000,
    date: "2026-05-10",
    status: "completed",
  },
  {
    id: "tx9",
    type: "credit",
    descFr: "Vente Galaxy Tab",
    descAr: "بيع غالاكسي تاب",
    amount: 95000,
    date: "2026-05-07",
    status: "completed",
  },
  {
    id: "tx10",
    type: "debit",
    descFr: "Frais de plateforme",
    descAr: "رسوم المنصة",
    amount: -1500,
    date: "2026-05-05",
    status: "completed",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR");
  return `${amount >= 0 ? "+" : "-"}${abs} MRU`;
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === "ar" ? "ar-MR" : "fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function txMatchesTab(tx: Transaction, tab: TabId): boolean {
  if (tab === "all") return true;
  if (tab === "credit") return tx.type === "credit" || tx.type === "referral" || tx.type === "escrow_release";
  if (tab === "debit") return tx.type === "debit";
  if (tab === "escrow") return tx.type === "escrow_hold" || tx.type === "escrow_release";
  return true;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TxIcon({ type }: { type: TxType }) {
  if (type === "credit") {
    return (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <ArrowDownLeft size={18} className="text-green-600" />
      </div>
    );
  }
  if (type === "debit") {
    return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight size={18} className="text-red-500" />
      </div>
    );
  }
  if (type === "escrow_hold" || type === "escrow_release") {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <Lock size={18} className="text-amber-600" />
      </div>
    );
  }
  // referral
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Users size={18} className="text-blue-600" />
    </div>
  );
}

function StatusBadge({ status, isRTL }: { status: TxStatus; isRTL: boolean }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
        <CheckCircle2 size={12} />
        {isRTL ? "مكتمل" : "Complété"}
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
        <Clock size={12} />
        {isRTL ? "معلق" : "En attente"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
      <XCircle size={12} />
      {isRTL ? "فشل" : "Échoué"}
    </span>
  );
}

// ─── Lock screen ──────────────────────────────────────────────────────────────

function LockScreen({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 px-4">
      <div className="w-20 h-20 rounded-full bg-night-500/10 flex items-center justify-center mb-5">
        <Wallet size={38} className="text-night-500/40" />
      </div>
      <h2
        className={`text-2xl font-display font-bold text-night-500 mb-2 ${isRTL ? "font-arabic text-right" : ""}`}
      >
        {isRTL ? "سجّل دخولك للمتابعة" : "Connectez-vous pour accéder"}
      </h2>
      <p className="text-night-400/60 text-sm mb-8 text-center max-w-xs">
        {isRTL
          ? "يجب تسجيل الدخول لعرض محفظتك والمعاملات."
          : "Vous devez être connecté pour consulter votre portefeuille et vos transactions."}
      </p>
      <Link href="/connexion" className="btn-gold inline-flex px-8 py-3">
        {isRTL ? "تسجيل الدخول" : "Se connecter"}
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortefeuillePage() {
  const { isRTL, locale } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="w-8 h-8 rounded-full border-2 border-sand-300 border-t-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LockScreen isRTL={isRTL} />;
  }

  const TABS: { id: TabId; labelFr: string; labelAr: string }[] = [
    { id: "all", labelFr: "Toutes", labelAr: "الكل" },
    { id: "credit", labelFr: "Crédits", labelAr: "إيداعات" },
    { id: "debit", labelFr: "Débits", labelAr: "سحوبات" },
    { id: "escrow", labelFr: "Escrow", labelAr: "ضمان" },
  ];

  const filtered = TRANSACTIONS.filter((tx) => txMatchesTab(tx, activeTab));

  return (
    <div className={`min-h-screen bg-sand-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* ── Hero / Balance Header ── */}
      <div
        className="relative overflow-hidden py-10"
        style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0C1426 100%)" }}
      >
        <IslamicPattern className="absolute inset-0 opacity-5" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Title */}
          <div className={`flex items-center gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.2)" }}>
              <Wallet size={22} style={{ color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <h1 className={`text-2xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "محفظتي" : "Mon Portefeuille"}
              </h1>
              <p className="text-sand-300/60 text-xs">SOUQ.MR · Wallet</p>
            </div>
          </div>

          {/* Balance card */}
          <div
            className="rounded-2xl p-6 mb-6 shadow-card"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            <p className={`text-sand-300/70 text-sm mb-1 ${isRTL ? "text-right font-arabic" : ""}`}>
              {isRTL ? "الرصيد المتاح" : "Solde disponible"}
            </p>
            <p
              className={`text-4xl font-display font-bold mb-6 ${isRTL ? "text-right" : ""}`}
              style={{ color: "#C9A84C" }}
            >
              12 500 <span className="text-2xl font-semibold">MRU</span>
            </p>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                className="btn-gold flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {isRTL ? "شحن" : "Recharger"}
              </button>
              <button
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                <ArrowUpRight size={16} />
                {isRTL ? "سحب" : "Retirer"}
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: <TrendingUp size={15} className="text-green-400" />,
                labelFr: "Total gagné",
                labelAr: "المكتسب",
                value: "45 200",
                color: "text-green-400",
              },
              {
                icon: <TrendingDown size={15} className="text-red-400" />,
                labelFr: "Total dépensé",
                labelAr: "المنفق",
                value: "32 700",
                color: "text-red-400",
              },
              {
                icon: <ShieldCheck size={15} className="text-amber-400" />,
                labelFr: "Escrow",
                labelAr: "الضمان",
                value: "5 000",
                color: "text-amber-400",
              },
            ].map((stat) => (
              <div
                key={stat.labelFr}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className={`text-[10px] text-sand-300/50 mb-0.5 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? stat.labelAr : stat.labelFr}
                </p>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-sand-300/40">MRU</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Tab bar ── */}
        <div className="bg-white rounded-2xl shadow-card p-1.5 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === tab.id
                  ? "text-white shadow-sm"
                  : "text-night-400/60 hover:text-night-500"
              } ${isRTL ? "font-arabic" : ""}`}
              style={
                activeTab === tab.id
                  ? { background: "linear-gradient(135deg, #C9A84C, #b8923d)" }
                  : {}
              }
            >
              {isRTL ? tab.labelAr : tab.labelFr}
            </button>
          ))}
        </div>

        {/* ── Transaction list ── */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className={`px-5 py-4 border-b border-sand-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`font-display font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "المعاملات" : "Transactions"}
            </h2>
            <span className="text-xs text-night-400/50 bg-sand-100 rounded-full px-2.5 py-0.5">
              {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Wallet size={36} className="mx-auto text-sand-300 mb-3" />
              <p className={`text-night-400/50 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "لا توجد معاملات" : "Aucune transaction"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-sand-100">
              {filtered.map((tx) => {
                const isPositive = tx.amount >= 0;
                return (
                  <li
                    key={tx.id}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-sand-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <TxIcon type={tx.type} />
                    <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                      <p className={`text-sm font-semibold text-night-500 truncate ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? tx.descAr : tx.descFr}
                      </p>
                      <div className={`flex items-center gap-2 mt-0.5 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                        <StatusBadge status={tx.status} isRTL={isRTL} />
                        <span className="text-[11px] text-night-400/40">·</span>
                        <span className="text-[11px] text-night-400/40">{formatDate(tx.date, locale)}</span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold flex-shrink-0 ${isPositive ? "text-green-600" : "text-red-500"}`}
                    >
                      {formatAmount(tx.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Payment methods card ── */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className={`px-5 py-4 border-b border-sand-100 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`font-display font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "وسائل الدفع" : "Moyens de paiement"}
            </h2>
            <CreditCard size={18} className="text-night-400/40" />
          </div>

          <ul className="divide-y divide-sand-100">
            {/* Bankily — linked */}
            <li className={`flex items-center gap-4 px-5 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Smartphone size={18} className="text-green-600" />
              </div>
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <p className="text-sm font-semibold text-night-500">Bankily</p>
                <p className="text-xs text-night-400/50">+222 •••• •• 47</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2.5 py-1">
                <CheckCircle2 size={11} />
                {isRTL ? "مربوط" : "Lié"}
              </span>
            </li>

            {/* Masrvi — not linked */}
            <li className={`flex items-center gap-4 px-5 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0">
                <Smartphone size={18} className="text-night-400/40" />
              </div>
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <p className="text-sm font-semibold text-night-500">Masrvi</p>
                <p className={`text-xs text-night-400/40 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "غير مربوط" : "Non lié"}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 transition-colors"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <Plus size={11} />
                {isRTL ? "إضافة" : "Ajouter"}
              </button>
            </li>

            {/* Carte bancaire — not linked */}
            <li className={`flex items-center gap-4 px-5 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0">
                <CreditCard size={18} className="text-night-400/40" />
              </div>
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "بطاقة بنكية" : "Carte bancaire"}
                </p>
                <p className={`text-xs text-night-400/40 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "غير مربوطة" : "Non liée"}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 transition-colors"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <Plus size={11} />
                {isRTL ? "إضافة" : "Ajouter"}
              </button>
            </li>
          </ul>
        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
}
