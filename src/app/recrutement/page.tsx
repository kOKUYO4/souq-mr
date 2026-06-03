"use client";

import { useState } from "react";
import { MapPin, Clock, Briefcase, Users, TrendingUp, Heart, ChevronDown, ChevronUp, Send } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

interface Job {
  id: string;
  titleFr: string;
  titleAr: string;
  department: string;
  departmentAr: string;
  type: string;
  typeAr: string;
  location: string;
  locationAr: string;
  descFr: string;
  descAr: string;
  skills: string[];
  skillsAr: string[];
  featured: boolean;
}

const jobs: Job[] = [
  {
    id: "j1",
    titleFr: "Développeur Full-Stack Senior", titleAr: "مطور Full-Stack أول",
    department: "Technologie", departmentAr: "التكنولوجيا",
    type: "CDI", typeAr: "عقد دائم",
    location: "Nouakchott", locationAr: "نواكشوط",
    descFr: "Rejoignez notre équipe tech pour construire le futur du e-commerce mauritanien. Stack: Next.js, TypeScript, PostgreSQL.",
    descAr: "انضم لفريقنا التقني لبناء مستقبل التجارة الإلكترونية الموريتانية. المكدس: Next.js، TypeScript، PostgreSQL.",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
    skillsAr: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
    featured: true,
  },
  {
    id: "j2",
    titleFr: "Chargé(e) de Modération", titleAr: "مسؤول مراجعة المحتوى",
    department: "Opérations", departmentAr: "العمليات",
    type: "CDI", typeAr: "عقد دائم",
    location: "Nouakchott", locationAr: "نواكشوط",
    descFr: "Assurez la qualité et la sécurité des annonces sur SOUQ.MR. Bilingue FR/AR requis.",
    descAr: "اضمن جودة وأمان الإعلانات على سوق.مر. إتقان العربية والفرنسية مطلوب.",
    skills: ["Modération", "Excel", "Communication", "FR/AR bilingue"],
    skillsAr: ["مراجعة المحتوى", "Excel", "تواصل", "عربية وفرنسية"],
    featured: false,
  },
  {
    id: "j3",
    titleFr: "Responsable Commercial Régional", titleAr: "مدير تجاري إقليمي",
    department: "Ventes", departmentAr: "المبيعات",
    type: "CDI", typeAr: "عقد دائم",
    location: "Nouadhibou / Kiffa", locationAr: "نواذيبو / كيفة",
    descFr: "Développez notre présence commerciale dans les régions. Réseau local requis.",
    descAr: "طوّر حضورنا التجاري في المناطق. شبكة محلية مطلوبة.",
    skills: ["Vente B2B", "Terrain", "Négociation", "Réseau local"],
    skillsAr: ["مبيعات B2B", "ميداني", "تفاوض", "شبكة محلية"],
    featured: false,
  },
  {
    id: "j4",
    titleFr: "Designer UX/UI", titleAr: "مصمم UX/UI",
    department: "Design", departmentAr: "التصميم",
    type: "CDI / Freelance", typeAr: "دائم / مستقل",
    location: "Nouakchott / Remote", locationAr: "نواكشوط / عن بُعد",
    descFr: "Créez des expériences utilisateur exceptionnelles pour des millions d'utilisateurs mauritaniens.",
    descAr: "اصنع تجارب مستخدم استثنائية لملايين المستخدمين الموريتانيين.",
    skills: ["Figma", "Design System", "Prototypage", "Tests utilisateurs"],
    skillsAr: ["Figma", "نظام التصميم", "النماذج الأولية", "اختبارات المستخدم"],
    featured: false,
  },
  {
    id: "j5",
    titleFr: "Community Manager", titleAr: "مدير مجتمع رقمي",
    department: "Marketing", departmentAr: "التسويق",
    type: "CDI", typeAr: "عقد دائم",
    location: "Nouakchott", locationAr: "نواكشوط",
    descFr: "Animez notre communauté sur les réseaux sociaux mauritaniens et développez notre présence digitale.",
    descAr: "نشّط مجتمعنا على وسائل التواصل الاجتماعي الموريتانية وطوّر حضورنا الرقمي.",
    skills: ["Réseaux sociaux", "Rédaction FR/AR", "Photographie", "Analytics"],
    skillsAr: ["وسائل التواصل", "كتابة عربية وفرنسية", "تصوير", "تحليلات"],
    featured: false,
  },
];

const values = [
  { emoji: "🚀", fr: "Impact réel", ar: "أثر حقيقي", descFr: "Vous construisez des outils utilisés par des centaines de milliers de Mauritaniens.", descAr: "تبني أدوات يستخدمها مئات الآلاف من الموريتانيين." },
  { emoji: "🌍", fr: "Mission locale", ar: "مهمة محلية", descFr: "Nous digitalisons l'économie informelle mauritanienne. Un défi unique et passionnant.", descAr: "نرقمن الاقتصاد غير الرسمي الموريتاني. تحدٍّ فريد ومثير." },
  { emoji: "📈", fr: "Croissance rapide", ar: "نمو سريع", descFr: "Startup en pleine croissance : +200% utilisateurs en 1 an. Évoluez avec nous.", descAr: "شركة ناشئة في نمو سريع: +200% مستخدمين في سنة. انمُ معنا." },
  { emoji: "🤝", fr: "Équipe soudée", ar: "فريق متماسك", descFr: "Une équipe multiculturelle FR/AR qui se respecte et s'entraide au quotidien.", descAr: "فريق متعدد الثقافات عربي وفرنسي يحترم بعضه ويتعاون يومياً." },
];

export default function RecrutementPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const applyToJob = (jobId: string) => {
    setApplying(jobId);
    setTimeout(() => {
      setApplying(null);
      setApplied((prev) => { const next = new Set(prev); next.add(jobId); return next; });
      success(isRTL ? "تم إرسال طلبك بنجاح!" : "Candidature envoyée avec succès !");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B4A3A, #2D6A4F)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <p className="text-green-200/70 text-sm font-semibold mb-3">
            {isRTL ? "انضم إلى سوق.مر" : "Rejoignez SOUQ.MR"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "شارك في بناء مستقبل التجارة الرقمية بموريتانيا" : "Construisez avec nous l'avenir du commerce digital en Mauritanie"}
          </h1>
          <p className="text-green-100/70 max-w-lg mx-auto text-sm mb-8">
            {isRTL
              ? "نبحث عن مواهب شغوفة لبناء المنصة الرائدة للتجارة الإلكترونية في موريتانيا"
              : "Nous recherchons des talents passionnés pour construire la plateforme e-commerce leader en Mauritanie"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { n: `${jobs.length} postes`, l: { ar: `${jobs.length} منصب` }, emoji: "💼" },
              { n: "Nouakchott", l: { ar: "نواكشوط" }, emoji: "📍" },
              { n: "CDI + avantages", l: { ar: "عقد دائم + مزايا" }, emoji: "🎯" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white text-sm">
                <span>{s.emoji}</span>
                <span className={isRTL ? "font-arabic" : ""}>{isRTL && s.l.ar ? s.l.ar : s.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Values */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-6 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "لماذا سوق.مر؟" : "Pourquoi rejoindre SOUQ.MR ?"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-3xl flex-shrink-0">{v.emoji}</span>
                <div className={isRTL ? "text-right" : ""}>
                  <p className={`font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? v.ar : v.fr}</p>
                  <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{isRTL ? v.descAr : v.descFr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job openings */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "الوظائف المتاحة" : "Postes ouverts"} ({jobs.length})
          </h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all">
                <button
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <span className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? job.titleAr : job.titleFr}
                      </span>
                      {job.featured && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full text-night-500"
                          style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                          ✦
                        </span>
                      )}
                    </div>
                    <div className={`flex flex-wrap items-center gap-2 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        <Briefcase size={11} />{isRTL ? job.departmentAr : job.department}
                      </span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <MapPin size={11} />{isRTL ? job.locationAr : job.location}
                      </span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        <Clock size={11} />{isRTL ? job.typeAr : job.type}
                      </span>
                    </div>
                  </div>
                  {openJob === job.id
                    ? <ChevronUp size={16} className="text-sand-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-sand-400 flex-shrink-0" />
                  }
                </button>

                {openJob === job.id && (
                  <div className="px-5 pb-5 border-t border-sand-100 pt-4">
                    <p className={`text-sm text-night-400/80 mb-4 leading-relaxed ${isRTL ? "text-right font-arabic" : ""}`}>
                      {isRTL ? job.descAr : job.descFr}
                    </p>
                    <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {(isRTL ? job.skillsAr : job.skills).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-sand-100 rounded-lg text-xs font-semibold text-night-500">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => applyToJob(job.id)}
                      disabled={applying === job.id || applied.has(job.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-night-500 transition-all disabled:opacity-60 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
                      style={{ background: applied.has(job.id) ? "#E8F4EE" : "linear-gradient(135deg, #C9A84C, #B8922E)" }}
                    >
                      {applying === job.id ? (
                        <span className="animate-spin">⟳</span>
                      ) : applied.has(job.id) ? (
                        <>✓ {isRTL ? "تم التقديم" : "Candidature envoyée"}</>
                      ) : (
                        <><Send size={14} /> {isRTL ? "تقدّم لهذا المنصب" : "Postuler"}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spontaneous application */}
        <div className="bg-night-500 rounded-2xl p-6 text-center relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className="relative">
            <Users size={24} className="text-sand-400 mx-auto mb-3" />
            <p className={`font-bold text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "لم تجد ما تبحث عنه؟" : "Vous ne trouvez pas votre profil ?"}
            </p>
            <p className={`text-sm text-sand-300/70 mb-4 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "أرسل طلبك المفتوح — نحن نقدّر كل موهبة" : "Envoyez une candidature spontanée — nous valorisons chaque talent"}
            </p>
            <a href="mailto:recrutement@souq.mr"
              className="inline-flex items-center gap-2 btn-gold text-sm">
              <Send size={14} />
              {isRTL ? "تقديم مفتوح" : "Candidature spontanée"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
