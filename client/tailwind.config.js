/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    colors: {
      primary: {
        30: "#F6EFE5",
        50: "#FFF9F0",
        100: "#FFECCF",
        200: "#F2E280",
        300: "#FFDE59",
        400: "#FFD21D",
        500: "#EAB308",
        600: "#EEA00F",
        700: "#C97E00",
        800: "#896022",
        900: "#573E28",
        950: "#2E2000",
      },
      neutral: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0A0A0A",
      },
      white: "#FFFFFF",
      red: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        500: "#EF4444",
        800: "#9F1239",
      },
      green: {
        800: "#1D6E3E",
        600: "#28A960",
        500: "#10B981",
        200: "#D7F7E7",
      },
      blue: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BAE6FD",
        500: "#0EA5E9",
        800: "#1E40AF",
        900: "#1E3A8A",
      },
      pink: {
        50: "#FDF4FF",
        500: "#D946EF",
        900: "#701A75",
      },
    },
    boxShadow: {
      "shadow-none": "0 0 0 0 rgba(0, 0, 0, 0)",
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
