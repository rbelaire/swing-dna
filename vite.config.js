import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeBasePath(rawBase) {
  if (!rawBase) return '/swing-dna/'
  const withLeadingSlash = rawBase.startsWith('/') ? rawBase : `/${rawBase}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

// Default to GitHub Pages project-site base path for this repo.
// Can be overridden with VITE_BASE_PATH (e.g. '/' for root hosting).
const basePath = normalizeBasePath(process.env.VITE_BASE_PATH)

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
})
