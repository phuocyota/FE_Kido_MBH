import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5171,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://be.kidocanteen.kidoedu.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
