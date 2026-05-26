/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors ────────────────────────────────────────────────────────────
      // These map directly to your CSS variables.
      // Usage: bg-primary, text-accent, bg-dark etc.
      colors: {
        primary:      "#E8450A",  // saffron orange
        accent:       "#FF7A3D",  // warm accent
        "primary-soft": "#FFF0E8",

        dark:         "#4A5759",  // navbar/footer
        "dark-deep":  "#2D3A3C",

        bg:           "#FFF8F0",  // page background
        surface:      "#FFFFFF",
        "surface-warm": "#FDF4EC",

        yatri: {
          50:  "#FFF8F0",
          100: "#FFF0E0",
          200: "#FFD0A0",
          300: "#FF9F60",
          400: "#FF7A3D",
          500: "#E8450A",
          600: "#C43A08",
          700: "#9E2E06",
          800: "#7A2405",
          900: "#5A1A03",
        },

        teal: {
          50:  "#F0F4F4",
          100: "#D8E2E3",
          200: "#B0C4C6",
          300: "#7DA0A3",
          400: "#5C7F83",
          500: "#4A5759",  // your dark teal
          600: "#3A4546",
          700: "#2D3A3C",
          800: "#1E2728",
          900: "#111819",
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["DM Sans", "sans-serif"],
      },

      // ── Font sizes ────────────────────────────────────────────────────────
      fontSize: {
        "2xs": "0.65rem",
        xs:    "0.75rem",
        sm:    "0.875rem",
        base:  "1rem",
        lg:    "1.125rem",
        xl:    "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        sm:     "0 1px 3px rgba(28,25,23,0.08)",
        md:     "0 4px 16px rgba(28,25,23,0.10)",
        lg:     "0 8px 32px rgba(28,25,23,0.14)",
        orange: "0 4px 20px rgba(232,69,10,0.25)",
        card:   "0 2px 12px rgba(28,25,23,0.08)",
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        xs:  "4px",
        sm:  "6px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
        "2xl": "20px",
        "3xl": "24px",
        full: "9999px",
      },

      // ── Height / Width ────────────────────────────────────────────────────
      height: {
        navbar:    "64px",
        "city-tab": "42px",
        hero:      "100vh",
      },

      // ── Animation ─────────────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInDown: {
          "0%":   { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up":       "fadeUp 0.6s ease forwards",
        "fade-in":       "fadeIn 0.2s ease forwards",
        "slide-in-right": "slideInRight 0.3s ease forwards",
        "slide-in-down": "slideInDown 0.2s ease forwards",
      },

      // ── Screens (responsive breakpoints) ─────────────────────────────────
      screens: {
        xs:  "375px",
        sm:  "640px",
        md:  "768px",
        lg:  "1024px",
        xl:  "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}

export default config;