import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Deployed as a GitHub Pages *project* site under the profile repo:
// https://tommy90112.github.io/tommy90112/
export default defineConfig({
  plugins: [vue()],
  base: '/tommy90112/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
})
