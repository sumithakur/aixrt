import type { Config } from "tailwindcss";
import tokens from "./design/tokens.json";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: tokens.color.bg.base,
          raised: tokens.color.bg.raised,
          surface: tokens.color.bg.surface,
          overlay: tokens.color.bg.overlay,
        },
        text: {
          primary: tokens.color.text.primary,
          secondary: tokens.color.text.secondary,
          muted: tokens.color.text.muted,
          inverse: tokens.color.text.inverse,
        },
        brand: {
          primary: tokens.color.brand.primary,
          "primary-hover": tokens.color.brand.primaryHover,
          secondary: tokens.color.brand.secondary,
          "secondary-hover": tokens.color.brand.secondaryHover,
          neonFuchsia: tokens.color.brand.neonFuchsia,
          brightAqua: tokens.color.brand.brightAqua,
          mediumSlateBlue: tokens.color.brand.mediumSlateBlue,
          electricLilac: tokens.color.brand.electricLilac,
          indigoPurple: tokens.color.brand.indigoPurple,
          slateBlue: tokens.color.brand.slateBlue,
          amethystPurple: tokens.color.brand.amethystPurple,
          deepMagenta: tokens.color.brand.deepMagenta,
          brightTeal: tokens.color.brand.brightTeal,
        },
        border: {
          subtle: tokens.color.border.subtle,
          prominent: tokens.color.border.prominent,
          highlight: tokens.color.border.highlight,
        },
        accent: {
          fintech: tokens.color.accent.fintech,
          industrial: tokens.color.accent.industrial,
          cybersecurity: tokens.color.accent.cybersecurity,
          state: tokens.color.accent.state,
          agentic: tokens.color.accent.agentic,
        },
        status: {
          confirmed: tokens.color.status.confirmed,
          pending: tokens.color.status.pending,
        },
      },
      fontFamily: {
        display: ["var(--font-ubuntu)", "Ubuntu", "sans-serif"],
        body: ["var(--font-roboto)", "Roboto", "sans-serif"],
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        pill: tokens.radius.pill,
      },
      boxShadow: {
        card: tokens.shadow.card,
        raised: tokens.shadow.raised,
        glow: tokens.shadow.glow,
      },
      transitionDuration: {
        fast: tokens.motion.duration.fast,
        base: tokens.motion.duration.base,
        slow: tokens.motion.duration.slow,
      },
      transitionTimingFunction: {
        standard: tokens.motion.ease.standard,
        out: tokens.motion.ease.out,
      },
      backgroundImage: {
        "hero-gradient": tokens.gradient.hero,
        "brand-gradient": tokens.gradient.brand,
        "aqua-fuchsia": tokens.gradient.aquaToFuchsia,
        "text-gradient": tokens.gradient.text,
        "surface-gradient": tokens.gradient.surface,
      },
    },
  },
  plugins: [],
};

export default config;
