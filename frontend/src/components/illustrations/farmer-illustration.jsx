import React from "react";

export function FarmerIllustration({ className = "w-full h-auto", variant = "field" }) {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AgroTrade Farmer Illustration"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyGrad" x1="250" y1="0" x2="250" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="60%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>

        {/* Sun gradient */}
        <radialGradient id="sunGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Rolling Hills gradient 1 */}
        <linearGradient id="hillGrad1" x1="0" y1="180" x2="500" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Rolling Hills gradient 2 */}
        <linearGradient id="hillGrad2" x1="0" y1="230" x2="500" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Front Field Soil gradient */}
        <linearGradient id="soilGrad" x1="0" y1="320" x2="500" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        {/* Crop Gold Accent */}
        <linearGradient id="cropGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect width="500" height="400" rx="24" fill="url(#skyGrad)" />

      {/* Radiant Sun */}
      <circle cx="360" cy="110" r="70" fill="url(#sunGrad)" />
      <circle cx="360" cy="110" r="32" fill="#fef08a" />

      {/* Distant Birds */}
      <path d="M120 70 Q126 65 132 70 Q138 65 144 70" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M150 85 Q154 81 158 85 Q162 81 166 85" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M90 95 Q95 90 100 95 Q105 90 110 95" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Distant Forest Ridge */}
      <path
        d="M0 200 Q70 185 140 195 Q210 205 280 190 Q350 175 420 190 Q470 198 500 190 L500 400 L0 400 Z"
        fill="#a7f3d0"
        opacity="0.8"
      />

      {/* Distant Silo & Red Barn */}
      <g opacity="0.85">
        <rect x="70" y="165" width="28" height="25" rx="3" fill="#dc2626" />
        <polygon points="66,165 84,150 102,165" fill="#991b1b" />
        <rect x="104" y="152" width="12" height="38" rx="6" fill="#cbd5e1" />
        <circle cx="110" cy="152" r="6" fill="#94a3b8" />
      </g>

      {/* Rolling Hills Midground */}
      <path
        d="M0 230 C90 200 180 250 270 220 C360 190 440 225 500 215 L500 400 L0 400 Z"
        fill="url(#hillGrad1)"
        opacity="0.95"
      />

      {/* Tractor in the Field */}
      <g transform="translate(320, 195) scale(0.65)" opacity="0.95">
        {/* Tractor Body */}
        <rect x="40" y="25" width="45" height="25" rx="5" fill="#10b981" />
        <rect x="60" y="10" width="22" height="20" rx="3" fill="#047857" />
        <rect x="63" y="13" width="16" height="12" rx="2" fill="#e0f2fe" opacity="0.8" />
        {/* Exhaust pipe */}
        <line x1="48" y1="25" x2="48" y2="8" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        {/* Big Back Wheel */}
        <circle cx="78" cy="50" r="16" fill="#1e293b" />
        <circle cx="78" cy="50" r="7" fill="#cbd5e1" />
        {/* Small Front Wheel */}
        <circle cx="42" cy="54" r="11" fill="#1e293b" />
        <circle cx="42" cy="54" r="5" fill="#cbd5e1" />
      </g>

      {/* Foreground Terraced Crop Rows */}
      <path
        d="M0 275 C120 250 240 300 360 270 C430 255 470 270 500 265 L500 400 L0 400 Z"
        fill="url(#hillGrad2)"
      />

      {/* Deep Soil Baseline */}
      <path
        d="M0 330 C150 310 300 350 500 325 L500 400 L0 400 Z"
        fill="url(#soilGrad)"
      />

      {/* Golden Wheat Stalks Left */}
      <g transform="translate(15, 260) scale(0.85)">
        <path d="M20 100 Q15 50 10 10" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="7" cy="15" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-20 7 15)" />
        <ellipse cx="14" cy="28" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(20 14 28)" />
        <ellipse cx="9" cy="42" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-20 9 42)" />
        <ellipse cx="16" cy="56" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(20 16 56)" />

        <path d="M40 100 Q40 45 35 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="33" cy="10" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-15 33 10)" />
        <ellipse cx="40" cy="24" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(15 40 24)" />
        <ellipse cx="35" cy="38" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-15 35 38)" />
        <ellipse cx="42" cy="52" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(15 42 52)" />
      </g>

      {/* The Central Farmer Figure (Bengali Cultivator Character) */}
      <g transform="translate(180, 210)">
        {/* Legs / Lungi / Trousers */}
        <path d="M45 130 L40 180 L52 180 L56 130 Z" fill="#047857" />
        <path d="M60 130 L64 180 L76 180 L72 130 Z" fill="#065f46" />
        {/* Feet / Sandals */}
        <ellipse cx="46" cy="182" rx="9" ry="4" fill="#78350f" />
        <ellipse cx="70" cy="182" rx="9" ry="4" fill="#78350f" />

        {/* Body / Kurta Shirt */}
        <path d="M35 80 L30 135 L85 135 L80 80 Z" fill="#10b981" />
        {/* Belt/Gamcha at waist */}
        <rect x="30" y="125" width="55" height="10" rx="3" fill="#ea580c" />

        {/* Arms */}
        {/* Left Arm holding basket */}
        <path d="M35 85 Q15 105 25 125" stroke="#fed7aa" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* Right Arm waving / holding crop */}
        <path d="M80 85 Q100 95 105 115" stroke="#fed7aa" strokeWidth="11" strokeLinecap="round" fill="none" />

        {/* Head and Neck */}
        <rect x="52" y="65" width="12" height="18" fill="#fed7aa" />
        <circle cx="58" cy="58" r="16" fill="#fed7aa" />

        {/* Facial features (Friendly smile) */}
        <circle cx="53" cy="55" r="2.2" fill="#374151" />
        <circle cx="63" cy="55" r="2.2" fill="#374151" />
        <path d="M53 63 Q58 69 63 63" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Traditional Straw Mathal (Farmer Hat) */}
        <ellipse cx="58" cy="46" rx="36" ry="8" fill="#d97706" />
        <path d="M30 46 Q58 14 86 46 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="58" cy="18" r="3" fill="#b45309" />

        {/* Traditional Woven Bamboo Basket with Vegetables */}
        <g transform="translate(5, 115)">
          <path d="M5 10 C5 35 45 35 45 10 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          <line x1="5" y1="18" x2="45" y2="18" stroke="#78350f" strokeWidth="1.5" />
          {/* Fresh Vegetables inside basket */}
          <circle cx="16" cy="8" r="7" fill="#ef4444" /> {/* Tomato */}
          <ellipse cx="25" cy="5" rx="6" ry="11" fill="#84cc16" transform="rotate(35 25 5)" /> {/* Green chilli / gourd */}
          <circle cx="34" cy="7" r="8" fill="#f97316" /> {/* Carrot / Orange */}
          <ellipse cx="20" cy="2" rx="4" ry="7" fill="#22c55e" /> {/* Spinach leaf */}
        </g>
      </g>

      {/* Foreground Wheat Stalks Right */}
      <g transform="translate(420, 270) scale(0.9)">
        <path d="M30 90 Q35 45 40 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="42" cy="10" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(15 42 10)" />
        <ellipse cx="35" cy="24" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-15 35 24)" />
        <ellipse cx="43" cy="38" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(15 43 38)" />
        <ellipse cx="36" cy="52" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-15 36 52)" />

        <path d="M55 90 Q50 50 45 15" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="43" cy="20" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-20 43 20)" />
        <ellipse cx="50" cy="34" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(20 50 34)" />
        <ellipse cx="45" cy="48" rx="5" ry="9" fill="url(#cropGold)" transform="rotate(-20 45 48)" />
      </g>
    </svg>
  );
}
