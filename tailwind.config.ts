import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0B0D",
        surface: "#111318",
        "surface-alt": "#161A22",
        border: "#1E2330",
        "border-hi": "#2A3045",
        accent: "#00E5A0",
        "accent-dim": "#00C98A",
        "accent-glow": "rgba(0,229,160,0.15)",
        danger: "#FF4D6A",
        warning: "#FFB347",
        info: "#4D9EFF",
        purple: "#A855F7",
        "text-primary": "#F0F2F5",
        "text-secondary": "#8892A4",
        "text-muted": "#4A5568",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(0,229,160,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(0,229,160,0.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
