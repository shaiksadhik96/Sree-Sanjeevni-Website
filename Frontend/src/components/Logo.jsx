const Logo = ({ size = "md" }) => {
  const sizeMap = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  return (
    <div className={`${sizeMap[size]} relative inline-flex items-center justify-center`}>
      {/* Futuristic, minimal monogram with herbal gradient */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#e6efe2", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#7eab76", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="logoRing" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#f4eddc", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#a2c49a", stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="logoShadow">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#logoCore)" filter="url(#logoShadow)" />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="url(#logoRing)"
          strokeWidth="3"
          strokeDasharray="6 4"
          opacity="0.7"
        />
        <circle cx="76" cy="28" r="4" fill="#fbf8f2" opacity="0.9" />
        <circle cx="76" cy="28" r="7" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
      </svg>

      <span
        className="relative font-semibold text-white"
        style={{
          letterSpacing: "-0.02em",
          fontFamily: "'Space Grotesk', 'Poppins', 'Segoe UI', sans-serif",
          fontSize: "inherit",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.18)",
        }}
      >
        SS
      </span>
    </div>
  );
};

export default Logo;
