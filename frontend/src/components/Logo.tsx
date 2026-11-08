export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hexagonal Shield Frame */}
      <path
        d="M18 2L32 9.5V26.5L18 34L4 26.5V9.5L18 2Z"
        stroke="url(#teal-glow)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        className="opacity-85"
      />
      
      {/* Interlocking Inner Skill Core */}
      <path
        d="M18 8L26 12.5V23.5L18 28L10 23.5V12.5L18 8Z"
        fill="url(#core-teal-gradient)"
        fillOpacity="0.25"
        stroke="url(#teal-glow)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Central Quantum Node */}
      <circle cx="18" cy="18" r="3" fill="#2dd4bf" />
      <circle cx="18" cy="18" r="5" stroke="#2dd4bf" strokeWidth="0.75" strokeDasharray="2 2" className="animate-spin origin-center" />

      {/* Connecting Neural Vectors */}
      <line x1="18" y1="8" x2="18" y2="15" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="18" y1="21" x2="18" y2="28" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10" y1="18" x2="15" y2="18" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="21" y1="18" x2="26" y2="18" stroke="#0d9488" strokeWidth="1.25" strokeLinecap="round" />

      <defs>
        <linearGradient id="teal-glow" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="0.5" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="core-teal-gradient" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

