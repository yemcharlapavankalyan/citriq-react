import { defineConfig } from 'vite'
// Trigger HMR
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Fail if port is busy instead of switching
  }
})
