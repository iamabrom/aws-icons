// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Served from the root of the custom domain (aws-icons.abrom.dev)
  base: '/',
})
