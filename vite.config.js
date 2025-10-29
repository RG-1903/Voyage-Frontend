import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration to pin the dev server to a stable port
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: false,
  },
})


