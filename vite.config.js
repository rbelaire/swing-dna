import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use '/' by default so Netlify/Vercel/Render deployments work out of the box.
// Override with VITE_BASE_PATH (for example '/swing-dna/' for GitHub Pages project sites).
const basePath = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
})
