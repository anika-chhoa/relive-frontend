import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        "ink-faint": "var(--color-ink-faint)",
        lavender: "var(--color-lavender)",
        pink: "var(--color-pink)",
        rose: "var(--color-rose)",
        sky: "var(--color-sky)",
        blue: "var(--color-blue)",
        cta: "var(--color-cta)",
        "cta-hover": "var(--color-cta-hover)",
        "cta-tint": "var(--color-cta-tint)",
        error: "var(--color-error)",
        success: "var(--color-success)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        field: "var(--radius-input)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // Only one theme, built entirely from Relive's own palette — we are
    // NOT using any stock daisyUI theme (light/dark/cupcake/etc). This
    // just gives us daisyUI's component classes (btn, input, dropdown,
    // alert, join…) pre-wired to our brand colors.
    themes: [
      {
        relive: {
          primary: "#D6608F", // deepened rose — main CTA
          "primary-content": "#FFFFFF",
          secondary: "#A2D2FF", // blue
          "secondary-content": "#2B2440",
          accent: "#FFC8DD", // pink
          "accent-content": "#2B2440",
          neutral: "#2B2440", // ink
          "neutral-content": "#FFFBFE",
          "base-100": "#FFFFFF", // surface
          "base-200": "#FFFBFE", // bg
          "base-300": "#EDE6F3", // border
          "base-content": "#2B2440", // ink
          info: "#A2D2FF",
          success: "#3C9A5F",
          warning: "#FFAFCC",
          error: "#D14343",

          "--rounded-box": "20px", // matches --radius-card
          "--rounded-btn": "9999px", // pill buttons, matches existing CTAs
          "--rounded-badge": "9999px",
          "--tab-radius": "12px",
        },
      },
    ],
    darkTheme: "relive",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};

export default config;
