import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true, // important
  },
  theme: {
    extend: {
      fontFamily: {
        segoe: ['"Segoe UI"', "system-ui", "sans-serif"],
      },
    },
  },
});
