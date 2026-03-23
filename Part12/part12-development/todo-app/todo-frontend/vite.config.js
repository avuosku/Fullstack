import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lue build-argit ympäristöstä
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
  },
})
