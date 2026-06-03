"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, Truck, CreditCard, MessageCircle, Phone, Mail } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const faqs = {
  fr: [
    { q: "Comment vendre sur SOUQ.MR ?", a: "Créez un compte avec votre numéro mauritanien, puis cliquez sur « Vendre ». Ajoutez des photos, une description et votre prix. Votre annonce sera publiée après modération (< 2h)." },
    { q: "Le paiement est-il sécurisé ?", a: "Oui. Pour les transactions > 50 000 MRU, notre système Escrow bloque les fonds jusqu'à la livraison. Le paiement à la livraison (COD) est aussi disponible pour toutes les transactions." },
    { q: "Comment fonctionne la négociation ?", a: "Chaque annonce marquée « Prix négociable » vous permet de soumettre une offre. Le vendeur peut accepter, refuser ou contre-proposer. Cliquez sur « Dernier prix ? » pour obtenir le meilleur tarif." },
    { q: "Quelles sont les zones de livraison ?", a: "Nous couvrons tous les quartiers de Nouakchott (Tevragh-Zeina, Ksar, Arafat, El Mina, Ryad...), Nouadhibou et les principales villes de Mauritanie. Délai estimé : 1-4 heures en ville." },
    { q: "Comment signaler une annonce frauduleuse ?", a: "Sur chaque annonce, un bouton « Signaler » vous permet de nous alerter. Notre équipe examine les signalements sous 1h. En cas d'arnaque, contactez-nous au +222 XX XX XX XX." },
    { q: "Mon annonce est-elle gratuite ?", a: "Oui, les 5 premières annonces sont totalement gratuites. Pour plus d'annonces ou pour les mettre en vedette, consultez notre Espace Pro à partir de 4 990 MRU/mois." },
    { q: "Comment fonctionne Bankily/Masrvi ?", a: "Lors du paiement, sélectionnez « Mobile Money ». Entrez votre numéro Bankily ou Masrvi. Vous recevrez une notification pour confirmer la transaction." },
    { q: "Puis-je créer une annonce en arabe ?", a: "Oui ! SOUQ.MR est entièrement bilingue. Vous pouvez rédiger votre annonce en français et en arabe (Hassaniya). Utilisez aussi le mode Souk Vocal pour enregistrer votre annonce par message vocal." },
  ],
  ar: [
    { q: "كيف أبيع على سوق.مر؟", a: "أنشئ حساباً برقم هاتفك الموريتاني، ثم انقر على «أبيع». أضف صوراً ووصفاً وسعرك. سينشر إعلانك بعد المراجعة (أقل من ساعتين)." },
    { q: "هل الدفع آمن؟", a: "نعم. للمعاملات التي تتجاوز 50,000 أوقية، يُجمّد نظام الضمان المالي لدينا الأموال حتى التسليم. الدفع عند الاستلام (COD) متاح أيضاً لجميع المعاملات." },
    { q: "كيف يعمل التفاوض؟", a: "كل إعلان مُعلَّم بـ«السعر قابل للتفاوض» يتيح لك تقديم عرض. يمكن للبائع القبول أو الرفض أو تقديم عرض مضاد. انقر على «آخر سعر؟» للحصول على أفضل سعر." },
    { q: "ما هي مناطق التوصيل؟", a: "نغطي جميع أحياء نواكشوط (تيفرغ زينة، القصر، عرفات، الميناء، الرياض...)، ونواذيبو والمدن الرئيسية في موريتانيا. وقت التقدير: 1-4 ساعات في المدينة." },
    { q: "كيف أبلغ عن إعلان مشبوه؟", a: "في كل إعلان، زر «الإبلاغ» يتيح لك تنبيهنا. يراجع فريقنا البلاغات خلال ساعة. في حالة الاحتيال، تواصل معنا على +222 XX XX XX XX." },
    { q: "هل إعلاني مجاني؟", a: "نعم، أول 5 إعلانات مجانية تماماً. لمزيد من الإعلانات أو تمييزها، راجع مساحة التجار المحترفين من 4,990 أوقية/شهر." },
    { q: "كيف يعمل بانكيلي/مصرفي؟", a: "عند الدفع، اختر «موبايل موني». أدخل رقم بانكيلي أو مصرفي الخاص بك. ستتلقى إشعاراً لتأكيد المعاملة." },
    { q: "هل يمكنني إنشاء إعلان بالعربية؟", a: "نعم! سوق.مر ثنائي اللغة بالكامل. يمكنك كتابة إعلانك بالفرنسية والعربية (الحسانية). استخدم أيضاً وضع السوق الصوتي لتسجيل إعلانك برسالة صوتية." },
  ],
};

const guides = {
  fr: [
    { icon: Shield, title: "Guide anti-arnaque", desc: "Comment éviter les arnaques et reconnaître les vendeurs de confiance" },
    { icon: CreditCard, title: "Guide des paiements", desc: "COD, Bankily, Masrvi, Escrow — comment choisir le bon mode" },
    { icon: Truck, title: "Guide livraison", desc: "Zones couvertes, tarifs et délais de livraison par quartier" },
    { icon: MessageCircle, title: "Guide négociation", desc: "Comment négocier efficacement comme au vrai souk mauritanien" },
  ],
  ar: [
    { icon: Shield, title: "دليل مكافحة الاحتيال", desc: "كيف تتجنب النصب وتتعرف على البائعين الموثوقين" },
    { icon: CreditCard, title: "دليل المدفوعات", desc: "COD، بانكيلي، مصرفي، ضمان مالي — كيف تختار الطريقة المناسبة" },
    { icon: Truck, title: "دليل التوصيل", desc: "المناطق المغطاة والأسعار والمواعيد حسب الحي" },
    { icon: MessageCircle, title: "دليل التفاوض", desc: "كيف تتفاوض بفعالية كما في السوق الموريتاني الحقيقي" },
  ],
};

export default function AidePage() {
  const { isRTL, locale } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqList = faqs[locale];
  const guideList = guides[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            {isRTL ? "مركز المساعدة" : "Centre d'aide"}
          </h1>
          <p className="text-sand-300/70">
            {isRTL ? "كل ما تحتاج لمعرفته عن سوق.مر" : "Tout ce que vous devez savoir sur SOUQ.MR"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Guides */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right" : ""}`}>
            {isRTL ? "الأدلة الإرشادية" : "Guides pratiques"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guideList.map((g, i) => (
              <button key={i} className={`bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 text-left ${isRTL ? "text-right" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center mb-3">
                  <g.icon size={18} className="text-sand-500" />
                </div>
                <h3 className="font-bold text-night-500 text-sm mb-1">{g.title}</h3>
                <p className="text-xs text-night-400/70">{g.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right" : ""}`}>
            {isRTL ? "الأسئلة الشائعة" : "Questions fréquentes"}
          </h2>
          <div className="space-y-3">
            {faqList.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sand-50 transition-colors ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <span className={`font-semibold text-night-500 text-sm pr-4 ${isRTL ? "font-arabic pl-4 pr-0 text-right" : ""}`}>{item.q}</span>
                  {openIdx === i ? <ChevronUp size={16} className="text-sand-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-sand-400 flex-shrink-0" />}
                </button>
                {openIdx === i && (
                  <div className={`px-5 pb-4 text-sm text-night-500/80 leading-relaxed border-t border-sand-100 pt-3 ${isRTL ? "text-right font-arabic" : ""}`}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-night-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className={`relative ${isRTL ? "text-right" : ""}`}>
            <h2 className={`text-xl font-bold mb-2 ${isRTL ? "font-arabic" : "font-display"}`}>
              {isRTL ? "لم تجد إجابتك؟" : "Vous n'avez pas trouvé votre réponse ?"}
            </h2>
            <p className="text-sand-300/70 text-sm mb-6">
              {isRTL ? "فريق الدعم لدينا متاح 7 أيام في الأسبوع" : "Notre équipe de support est disponible 7j/7"}
            </p>
            <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
              <a href="tel:+22200000000" className="btn-gold gap-2">
                <Phone size={16} />
                {isRTL ? "اتصل بنا" : "Nous appeler"}
              </a>
              <a href="mailto:support@souq.mr" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-sand-400/30 text-sand-300 hover:border-sand-400 hover:text-sand-400 transition-all">
                <Mail size={16} />
                {isRTL ? "راسلنا بالبريد" : "Envoyer un email"}
              </a>
              <a href="/messages" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-sand-400/30 text-sand-300 hover:border-sand-400 hover:text-sand-400 transition-all">
                <MessageCircle size={16} />
                {isRTL ? "الدردشة المباشرة" : "Chat en direct"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
