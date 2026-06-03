"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const contactInfo = {
  fr: [
    { icon: Phone, label: "Téléphone", value: "+222 XX XX XX XX", href: "tel:+22200000000", note: "7j/7, 8h–22h" },
    { icon: Mail, label: "Email support", value: "support@souq.mr", href: "mailto:support@souq.mr", note: "Réponse sous 2h" },
    { icon: MapPin, label: "Adresse", value: "Tevragh-Zeina, Nouakchott", href: "#", note: "Mauritanie" },
    { icon: Clock, label: "Horaires", value: "Lun–Sam 8h–20h", href: "#", note: "Dim 10h–18h" },
  ],
  ar: [
    { icon: Phone, label: "الهاتف", value: "+222 XX XX XX XX", href: "tel:+22200000000", note: "7 أيام، 8ص–10م" },
    { icon: Mail, label: "البريد الإلكتروني", value: "support@souq.mr", href: "mailto:support@souq.mr", note: "رد خلال ساعتين" },
    { icon: MapPin, label: "العنوان", value: "تيفرغ زينة، نواكشوط", href: "#", note: "موريتانيا" },
    { icon: Clock, label: "أوقات العمل", value: "الإث–السبت 8ص–8م", href: "#", note: "الأحد 10ص–6م" },
  ],
};

const subjects = {
  fr: ["Problème avec une annonce", "Signalement d'arnaque", "Question sur le paiement", "Compte et connexion", "Espace Pro", "Autre"],
  ar: ["مشكلة في إعلان", "الإبلاغ عن احتيال", "سؤال عن الدفع", "الحساب وتسجيل الدخول", "مساحة التجار", "أخرى"],
};

export default function ContactPage() {
  const { isRTL, locale } = useLanguage();
  const info = contactInfo[locale];
  const subjectList = subjects[locale];

  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-4xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تواصل معنا" : "Contactez-nous"}
          </h1>
          <p className="text-sand-300/70">
            {isRTL ? "فريقنا هنا لمساعدتك 7 أيام في الأسبوع" : "Notre équipe est là pour vous aider 7j/7"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Infos contact */}
          <div className="lg:col-span-2 space-y-4">
            {info.map((item, i) => (
              <a key={i} href={item.href}
                className={`flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center">
                  <item.icon size={18} className="text-sand-500" />
                </div>
                <div>
                  <p className={`text-xs text-night-400/60 mb-0.5 ${isRTL ? "font-arabic" : ""}`}>{item.label}</p>
                  <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{item.value}</p>
                  <p className={`text-xs text-night-400/50 mt-0.5 ${isRTL ? "font-arabic" : ""}`}>{item.note}</p>
                </div>
              </a>
            ))}

            {/* Chat en direct */}
            <div className="bg-night-500 rounded-2xl p-5 relative overflow-hidden">
              <IslamicPattern opacity={0.05} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-islamic-400 rounded-full animate-pulse" />
                  <span className="text-xs text-islamic-400 font-semibold">
                    {isRTL ? "متاح الآن" : "En ligne maintenant"}
                  </span>
                </div>
                <p className={`text-sm font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "الدردشة المباشرة" : "Chat en direct"}
                </p>
                <a href="/messages" className="btn-gold text-sm py-2.5 w-full flex items-center justify-center gap-2">
                  <MessageCircle size={15} />
                  {isRTL ? "ابدأ محادثة" : "Démarrer un chat"}
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="bg-white rounded-2xl p-10 shadow-card text-center">
                <div className="w-16 h-16 rounded-full bg-islamic-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-islamic-400" />
                </div>
                <h2 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تم إرسال رسالتك!" : "Message envoyé !"}
                </h2>
                <p className={`text-sm text-night-400/70 mb-6 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "سيرد عليك فريقنا خلال ساعتين" : "Notre équipe vous répondra sous 2 heures"}
                </p>
                <button onClick={() => setSent(false)} className="btn-gold text-sm">
                  {isRTL ? "إرسال رسالة أخرى" : "Envoyer un autre message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-5">
                <h2 className={`text-lg font-bold text-night-500 ${isRTL ? "text-right font-arabic" : ""}`}>
                  {isRTL ? "أرسل رسالة" : "Envoyer un message"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                      {isRTL ? "الاسم" : "Votre nom"}
                    </label>
                    <input type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={isRTL ? "اسمك الكامل" : "Mohamed Ould..."}
                      dir={isRTL ? "rtl" : "ltr"}
                      className="input-field text-sm" />
                  </div>
                  <div>
                    <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                      {isRTL ? "الهاتف" : "Téléphone"}
                    </label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+222 XX XX XX XX" dir="ltr"
                      className="input-field text-sm" />
                  </div>
                </div>

                <div>
                  <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "الموضوع" : "Sujet"}
                  </label>
                  <select required value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="input-field text-sm">
                    <option value="">{isRTL ? "اختر موضوعاً..." : "Choisir un sujet..."}</option>
                    {subjectList.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "رسالتك" : "Votre message"}
                  </label>
                  <textarea required rows={5} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isRTL ? "اكتب رسالتك هنا..." : "Décrivez votre problème ou question..."}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="input-field text-sm resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full btn-gold py-3.5 font-bold disabled:opacity-60">
                  {loading
                    ? <Loader2 size={18} className="animate-spin mx-auto" />
                    : <><Send size={16} />{isRTL ? "إرسال الرسالة" : "Envoyer le message"}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
