import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚡ penting untuk GitHub Pages
  // kalau repo kamu namanya "ReconTes", base HARUS "/ReconTes/"
  base: '/ReconTes/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true, // auto buka browser pas npm run dev
  },
})
