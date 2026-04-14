import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5172,
    strictPort: true,
  },
})