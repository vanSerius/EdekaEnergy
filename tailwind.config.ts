import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        edeka: {
          yellow: "#FFD500",
          "yellow-soft": "#FFF6CC",
          "yellow-deep": "#F4B400",
          blue: "#003D8F",
          "blue-deep": "#001A4D",
        },
        paper: "#FFFFFF",
        "paper-soft": "#FAF9F5",
        ink: "#0A0E1A",
        "ink-soft": "#3A4055",
        "ink-faint": "#8089A0",
        leaf: "#1F9E63",
        "leaf-soft": "#DCEFE2",
        ember: "#D9531E",
        "ember-soft": "#FBE3D5",
        line: "rgba(10,14,26,0.10)",
        "line-strong": "rgba(10,14,26,0.18)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(10,14,26,0.04), 0 6px 20px -8px rgba(10,14,26,0.08)",
        "card-lift": "0 2px 0 0 rgba(10,14,26,0.04), 0 20px 50px -16px rgba(10,14,26,0.18)",
        "yellow-glow": "0 0 0 1px rgba(244,180,0,0.5), 0 12px 30px -8px rgba(244,180,0,0.40)",
        "deep": "0 2px 0 0 rgba(0,0,0,0.04), 0 30px 80px -30px rgba(0,26,77,0.5)",
        "crisp": "0 1px 0 0 rgba(10,14,26,0.04), 0 12px 30px -10px rgba(10,14,26,0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "rise": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "rise": "rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "blink": "blink 2s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
