/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    colors: {
      primary: {
        950: "#2E2000",
        900: "#573E28",
        800: "#896022",
        700: "#C97E00",
        600: "#EEA00F",
        500: "#EAB308",
        400: "#FFD21D",
        300: "#FFDE59",
        200: "#F2E280",
        100: "#FFECCF",
        50: "#FFF9F0",
        30: "#F6EFE5",
      },
      neutral: {
        950: "#0A0A0A",
        900: "#171717",
        800: "#262626",
        700: "#404040",
        600: "#525252",
        500: "#737373",
        400: "#A3A3A3",
        300: "#D4D4D4",
        200: "#E5E5E5",
        100: "#F5F5F5",
        50: "#FAFAFA",
      },
      white: "#FFFFFF",
      red: {
        800: "#9F1239",
        500: "#EF4444",
        100: "#FEE2E2",
        50: "#FEF2F2",
      },
    },
    boxShadow: {
      "mui-shadow-1": "0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      "mui-shadow-2": "0 4px 5px 0 rgba(0, 0, 0, 0.14)",
      "mui-shadow-3": "0 1px 10px 0 rgba(0, 0, 0, 0.12)",
      "mui-shadow":
        "0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)",
      "card-1": "0 4px 40px 0 rgba(0, 0, 0, 1)",
      "sidebar-shadow": "0 1px 8px 0 rgba(63, 43, 7, 0.1)",
      "search-input-box-shadow": "0 0 0 2px rgba(212, 187, 162, 0.25)",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
