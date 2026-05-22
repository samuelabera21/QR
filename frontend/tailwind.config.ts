import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#050816",
          900: "#0A1020",
          800: "#121A2E",
        },
        neon: {
          cyan: "#6EE7FF",
          violet: "#8B5CF6",
          mint: "#34D399",
          amber: "#F59E0B",
        },
      },
      boxShadow: {
        glow: "0 0 60px rgba(110, 231, 255, 0.18)",
        glass: "0 20px 80px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.95" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floatSlow: "floatSlow 8s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at top, rgba(110, 231, 255, 0.16), transparent 38%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.18), transparent 28%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.12), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
