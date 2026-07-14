interface WebXcelLogoProps {
  className?: string;
  variant?: "full" | "icon";
}

export default function WebXcelLogo({ className = "", variant = "full" }: WebXcelLogoProps) {
  // Shared definitions for gradients, shadows, and filters
  const defs = (
    <defs>
      {/* Royal Blue to Vibrant Blue Gradient */}
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" /> {/* Deep Blue */}
        <stop offset="100%" stopColor="#3B82F6" /> {/* Vibrant Blue */}
      </linearGradient>

      {/* Cyber Cyan Gradient */}
      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0891B2" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>

      {/* Emerald to Mint Green Gradient */}
      <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>

      {/* Radiant Mint Gradient */}
      <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>

      {/* Premium Integrated Text Gradient (Blue to Emerald) */}
      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2563EB" /> {/* Web Blue */}
        <stop offset="100%" stopColor="#10B981" /> {/* Xcel Green */}
      </linearGradient>

      {/* High-contrast drop shadow for that crisp neo-brutalist pop */}
      <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
      </filter>
    </defs>
  );

  // Technical blueprint orbits behind the icon
  const techBlueprint = (
    <g opacity="0.85">
      {/* Outer dashed blueprint circle */}
      <circle 
        cx="95" 
        cy="100" 
        r="75" 
        stroke="#E2E8F0" 
        strokeWidth="1.5" 
        strokeDasharray="4 6" 
        fill="none" 
      />
      {/* Inner dashed blueprint circle */}
      <circle 
        cx="95" 
        cy="100" 
        r="55" 
        stroke="#CBD5E1" 
        strokeWidth="1" 
        strokeDasharray="2 4" 
        fill="none" 
        opacity="0.6"
      />
      {/* Tech alignment guidelines */}
      <line x1="95" y1="20" x2="95" y2="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="15" y1="100" x2="175" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
    </g>
  );

  // Centerpiece 3D Geometric Logo Mark
  const logoMark = (
    <g filter="url(#logoShadow)">
      {/* Top-Left Wing (Royal Blue) */}
      <polygon 
        points="71,86 35,40 63,30 95,72" 
        fill="url(#blueGrad)" 
        stroke="#000000" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Top-Right Wing (Cyber Cyan) */}
      <polygon 
        points="95,72 127,30 155,40 119,86" 
        fill="url(#cyanGrad)" 
        stroke="#000000" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Bottom-Right Wing (Emerald Green) */}
      <polygon 
        points="119,114 155,160 127,170 95,128" 
        fill="url(#greenGrad)" 
        stroke="#000000" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Bottom-Left Wing (Mint Green) */}
      <polygon 
        points="95,128 63,170 35,160 71,114" 
        fill="url(#mintGrad)" 
        stroke="#000000" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Central Hexagonal Core Hub (Slate Dark) */}
      <polygon 
        points="71,86 95,72 119,86 119,114 95,128 71,114" 
        fill="#0F172A" 
        stroke="#000000" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Glowing white/cyan forward acceleration indicator (Chevron) */}
      <path 
        d="M 89,88 L 105,100 L 89,112" 
        stroke="#FFFFFF" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
    </g>
  );

  if (variant === "icon") {
    return (
      <div className={`relative ${className} shrink-0`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 200 200" 
          width="100%" 
          height="100%"
          className="w-full h-full"
        >
          {defs}
          {techBlueprint}
          {logoMark}
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className} shrink-0`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 540 200" 
        width="100%" 
        height="100%"
        className="w-full h-full"
      >
        {defs}
        {techBlueprint}
        {logoMark}
        
        {/* Core Typography - High Contrast Slate & Integrated Brand Gradient */}
        <g filter="url(#logoShadow)">
          <text 
            x="195" 
            y="118" 
            fontFamily="'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif" 
            fontSize="68" 
            fontWeight="800" 
            letterSpacing="-0.02em"
          >
            <tspan fill="#000000">WEB</tspan>
            <tspan fill="url(#brandGradient)" fontWeight="900">Xcel</tspan>
          </text>
        </g>

      </svg>
    </div>
  );
}
