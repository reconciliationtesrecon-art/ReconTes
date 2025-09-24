import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ReconTes/", // <-- WAJIB, sesuai nama repo
  build: {
    outDir: "dist",
  },
});
