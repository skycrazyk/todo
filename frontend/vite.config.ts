import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import deno from '@deno/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    react(),
    checker({
      // e.g. use TypeScript check
      typescript: true
    })
  ]
})
