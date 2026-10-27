import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        admin: 'index.html',
        productTrace: 'product-trace.html',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
})
