/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Neutral canvas — cool paper, not cream, not pure black-on-white.
        canvas: {
          DEFAULT: "#F6F7FA",
          dark: "#0B0D12",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#12151C",
        },
        ink: {
          DEFAULT: "#12141A",
          dark: "#EEF0F5",
        },
        muted: {
          DEFAULT: "#63697A",
          dark: "#9198AC",
        },
        border: {
          DEFAULT: "#E4E6EE",
          dark: "#232733",
        },
        // Brand accent — indigo, used sparingly as the "AI" signal color.
        brand: {
          50: "#EEF0FF",
          100: "#E0E3FF",
          300: "#B3B9FF",
          500: "#5B5FEF",
          600: "#4A4DDB",
          700: "#3B3EB0",
        },
        // Tone spectrum — the signature element. Each rewrite tone sits at a
        // point between "casual/warm" and "formal/cool", and its button
        // carries that point's color. This is real information, not decor.
        tone: {
          friendly: "#F2994A",
          professional: "#5B5FEF",
          boss: "#2F6FED",
          client: "#0EA5A4",
          formal: "#1E3A8A",
          shorter: "#EA5B78",
          longer: "#9333EA",
          polite: "#16A34A",
          confident: "#DC2626",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18, 20, 26, 0.04), 0 8px 24px -8px rgba(18, 20, 26, 0.08)",
        softDark: "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pop-check": {
          "0%": { transform: "scale(0.6)", opacity: 0 },
          "60%": { transform: "scale(1.15)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        shimmer: "shimmer 1.6s infinite linear",
        "pop-check": "pop-check 0.35s cubic-bezier(.34,1.56,.64,1) both",
      },
    },
  },
  plugins: [],
};
