import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ReconTes/",   // HARUS sama persis dengan nama repo (case-sensitive)
  plugins: [react()],
});
