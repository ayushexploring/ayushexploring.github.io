import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))

// Deployed as a GitHub user page (ayushexploring.github.io), so base stays '/'.
// For a project page, set base to '/<repo-name>/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // The site, and the content editor at /admin.html — separate entries so
        // the editor's code never ships to visitors.
        main: here('index.html'),
        admin: here('admin.html'),
      },
    },
  },
})
