"use client";

interface IslamicPatternProps {
  opacity?: number;
  className?: string;
}

/* SVG de motif géométrique islamique — utilisé comme fond décoratif */
export default function IslamicPattern({
  opacity = 0.06,
  className = "",
}: IslamicPatternProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="islamic-geo"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Étoile à 8 branches */}
          <path
            d="M30 5 L33 19 L47 12 L40 26 L54 29 L40 32 L47 46 L33 39 L30 53 L27 39 L13 46 L20 32 L6 29 L20 26 L13 12 L27 19 Z"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.6"
          />
          {/* Carré central */}
          <rect
            x="23"
            y="23"
            width="14"
            height="14"
            transform="rotate(45 30 30)"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.4"
          />
          {/* Points décoratifs */}
          <circle cx="30" cy="30" r="2" fill="#C9A84C" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </svg>
  );
}
