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
        stroke="url(#cyan-glow)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        className="opacity-80"
      />
      
      {/* Interlocking Inner Skill Core */}
      <path
        d="M18 8L26 12.5V23.5L18 28L10 23.5V12.5L18 8Z"
        fill="url(#core-gradient)"
        fillOpacity="0.25"
        stroke="url(#cyan-glow)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Central Quantum Node */}
      <circle cx="18" cy="18" r="3" fill="#38bdf8" />
      <circle cx="18" cy="18" r="5" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="2 2" className="animate-spin origin-center" />

      {/* Connecting Neural Vectors */}
      <line x1="18" y1="8" x2="18" y2="15" stroke="#0284c7" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="18" y1="21" x2="18" y2="28" stroke="#0284c7" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10" y1="18" x2="15" y2="18" stroke="#0284c7" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="21" y1="18" x2="26" y2="18" stroke="#0284c7" strokeWidth="1.25" strokeLinecap="round" />

      <defs>
        <linearGradient id="cyan-glow" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="core-gradient" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

