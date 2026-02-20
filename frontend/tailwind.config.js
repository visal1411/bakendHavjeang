/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Blue - Main brand color
        primary: {
          50: "#E8F0FF",
          100: "#D1E1FF",
          200: "#A3C3FF",
          300: "#75A5FF",
          400: "#4787FF",
          500: "#155DFC", // Main primary
          600: "#0D47D4",
          700: "#0A35A0",
          800: "#07246C",
          900: "#041338",
          DEFAULT: "#155DFC",
        },
        // Secondary Orange - Warm contrast
        secondary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          DEFAULT: "#F97316",
        },
        // Accent Purple - Premium feel
        accent: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7E22CE",
          800: "#6B21A8",
          900: "#581C87",
          DEFAULT: "#A855F7",
        },
        // Success Green
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          DEFAULT: "#22C55E",
        },
        // Warning Amber
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          DEFAULT: "#F59E0B",
        },
        // Error Red
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          DEFAULT: "#EF4444",
        },
        "text-primary": "#101828",
        "text-secondary": "#6A7282",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #155DFC 0%, #0D47D4 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        "gradient-accent": "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, rgba(21, 93, 252, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(249, 115, 22, 0.15) 0px, transparent 50%)",
      },
      boxShadow: {
        primary: "0 4px 14px 0 rgba(21, 93, 252, 0.25)",
        "primary-lg": "0 10px 40px 0 rgba(21, 93, 252, 0.35)",
        secondary: "0 4px 14px 0 rgba(249, 115, 22, 0.25)",
        accent: "0 4px 14px 0 rgba(168, 85, 247, 0.25)",
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      spacing: {
        safe: "max(env(safe-area-inset-top), 16px)",
        "safe-bottom": "max(env(safe-area-inset-bottom), 16px)",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
