"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export default function Logo({ size = "md", variant = "full" }: LogoProps) {
  const { isRTL } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-2xl" },
    lg: { icon: 52, text: "text-4xl" },
  };

  const s = sizes[size];

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
      style={{
        /* Pas de flou sur les enfants avec transform */
        transform: "translateZ(0)",
        willChange: "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icône animée */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={!hovered ? "animate-logo-pulse" : ""}
        style={{
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease",
          transform: hovered ? "rotate(-8deg) scale(1.12)" : "rotate(0deg) scale(1)",
          filter: hovered
            ? "drop-shadow(0 0 10px rgba(201,168,76,0.8)) drop-shadow(0 0 20px rgba(201,168,76,0.35))"
            : undefined,
          animation: !hovered ? undefined : "none",
        }}
      >
        {/* Fond cercle */}
        <circle cx="24" cy="24" r="24" fill="#1B2A4A" />
        {/* Arche de tente (khayma) */}
        <path
          d="M8 36 L24 10 L40 36"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Porte arrondie */}
        <path
          d="M19 36 L19 28 Q19 22 24 22 Q29 22 29 28 L29 36"
          fill="#C9A84C"
          opacity="0.9"
        />
        {/* Motif décoratif haut */}
        <circle cx="24" cy="13" r="2" fill="#C9A84C" opacity="0.7" />
        {/* Lignes décoratives */}
        <line x1="12" y1="36" x2="36" y2="36" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
        {/* Étoile islamique */}
        <path
          d="M24 6 L24.7 8.2 L27 8.2 L25.2 9.5 L25.9 11.7 L24 10.4 L22.1 11.7 L22.8 9.5 L21 8.2 L23.3 8.2 Z"
          fill="#C9A84C"
          opacity="0.5"
        />
      </svg>

      {variant === "full" && (
        <div
          className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}
          style={{
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}
        >
          <span
            className={`${s.text} font-display font-bold leading-none`}
            style={{
              background: hovered
                ? "linear-gradient(135deg, #E8C96A 0%, #F5D97A 50%, #C9A84C 100%)"
                : "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B8922E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transition: "background 0.3s ease",
              /* Rendu net du gradient text */
              WebkitFontSmoothing: "antialiased" as never,
            }}
          >
            {isRTL ? "نقطة.مر" : "NUQTA.MR"}
          </span>
          <span
            className="text-[10px] font-body tracking-widest uppercase leading-none mt-0.5"
            style={{
              color: hovered ? "#C9A84C" : "rgba(201,168,76,0.5)",
              transition: "color 0.3s ease, letter-spacing 0.3s ease",
              letterSpacing: hovered ? "0.2em" : "0.15em",
            }}
          >
            {isRTL ? "السوق الرقمي" : "Marketplace"}
          </span>
        </div>
      )}
    </div>
  );
}
