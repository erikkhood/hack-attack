import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: Update base to match your repository name
  // Example: if repo is "hack-attack-adventure", use base: '/hack-attack-adventure/'
  // For user/organization pages (username.github.io), use base: '/'
  base: '/',
})


