import React from 'react';

export interface JVSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

export default function JVSLogo({ size = 'md', variant = 'full' }: JVSLogoProps) {
  const heightPx = sizeMap[size];
  
  if (variant === 'icon') {
    // Icon variant: Just the JVS letters with chrome gradient
    const width = heightPx;
    
    return (
      <svg
        width={width}
        height={heightPx}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="JVS"
      >
        <defs>
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#989898" />
            <stop offset="100%" stopColor="#585858" />
          </linearGradient>
        </defs>
        <text
          x="50"
          y="65"
          fontSize="48"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
          fill="url(#chromeGradient)"
          letterSpacing="-2"
        >
          JVS
        </text>
      </svg>
    );
  }
  
  // Full variant: Icon + AUTOWORKS + tagline + racing stripes
  const width = heightPx * 4.5;
  
  return (
    <svg
      width={width}
      height={heightPx}
      viewBox="0 0 450 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JVS Autoworks - JVS Bongabon"
    >
      <defs>
        <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="50%" stopColor="#989898" />
          <stop offset="100%" stopColor="#585858" />
        </linearGradient>
      </defs>
      
      {/* JVS Icon with chrome gradient */}
      <text
        x="50"
        y="55"
        fontSize="48"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
        fill="url(#chromeGradient)"
        letterSpacing="-2"
      >
        JVS
      </text>
      
      {/* AUTOWORKS text */}
      <text
        x="115"
        y="48"
        fontSize="32"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#585858"
        letterSpacing="2"
      >
        AUTOWORKS
      </text>
      
      {/* JVS Bongabon tagline */}
      <text
        x="115"
        y="72"
        fontSize="14"
        fontWeight="400"
        fontFamily="Arial, sans-serif"
        fill="#787878"
        letterSpacing="1"
      >
        JVS Bongabon
      </text>
      
      {/* Racing Red stripe */}
      <line
        x1="115"
        y1="80"
        x2="370"
        y2="80"
        stroke="#950304"
        strokeWidth="2"
      />
      
      {/* Steel Blue stripe */}
      <line
        x1="115"
        y1="85"
        x2="370"
        y2="85"
        stroke="#446A91"
        strokeWidth="2"
      />
    </svg>
  );
}
