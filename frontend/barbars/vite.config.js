import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Forward /api browser requests to Express while Vite serves the frontend.
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
