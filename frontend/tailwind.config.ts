import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        surface: "#111827",
        "surface-border": "#1F2937",
        brand: {
          gold: "#F59E0B",
          amber: "#FF9900",
          blue: "#3B82F6",
          navy: "#1E3A8A",
          cyan: "#06B6D4",
        }
      },
    },
  },
  plugins: [],
};
export default config;
