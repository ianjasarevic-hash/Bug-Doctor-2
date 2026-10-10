import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette (per design)
        bg: "#151618",
        surface: "#202226",
        border: "#383C43",
        action: "#8BACFF",
        text: "#F2F3F5",
        muted: "#ACB2BE",
        // Status colors derived from base palette
        success: "#8BACFF",     // pass / healthy = the brand blue
        warning: "#ACB2BE",     // pending / degraded = muted
        danger: "#F2F3F5",      // fail / error = high-contrast text-on-bg
        // Difficulty scale — 4 steps, consistent across cards/badges/score
        diffEasy: "#88C9A1",        // muted green
        diffMedium: "#E0B265",      // amber
        diffHard: "#E58958",        // orange
        diffImpossible: "#E5739A",  // pink / red
        // Good / warn / bad — used by the AI feedback card to color the
        // "your" bars and the delta chips (better/worse-than-top-performers).
        good: "#7BD88F",
        warn: "#F2C14E",
        bad: "#FF6B6B",
        // Score-band colors for the example scorecard. Muted, in the
        // same saturation as the accent (periwinkle) so the card's
        // score row reads as one design system. `scoreStrong` for
        // scores >= 90, `scoreWarm` for scores < 80. The 80-89 band
        // reuses `action` so the three-band palette shares one
        // accent family.
        scoreStrong: "#88C9A1",
        scoreWarm: "#E0B265",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 0 0 1px #383C43, 0 12px 32px -16px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(139,172,255,0.4), 0 0 24px -4px rgba(139,172,255,0.25)",
        "glow-strong":
          "0 0 0 1px rgba(139,172,255,0.55), 0 0 32px -2px rgba(139,172,255,0.45), 0 0 64px -8px rgba(139,172,255,0.25)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(139,172,255,0.45), 0 0 18px -2px rgba(139,172,255,0.30), 0 0 36px -8px rgba(139,172,255,0.15)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(139,172,255,0.65), 0 0 28px 0px rgba(139,172,255,0.55), 0 0 60px -4px rgba(139,172,255,0.30)",
          },
        },
        "text-glow-pulse": {
          "0%, 100%": {
            textShadow:
              "0 0 18px rgba(139,172,255,0.30), 0 0 40px rgba(139,172,255,0.12)",
          },
          "50%": {
            textShadow:
              "0 0 24px rgba(139,172,255,0.55), 0 0 56px rgba(139,172,255,0.25)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        blink: "blink 1s step-end infinite",
        "glow-pulse": "glow-pulse 2.6s ease-in-out infinite",
        "text-glow-pulse": "text-glow-pulse 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;