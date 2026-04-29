import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
<<<<<<< HEAD
import basicSsl from '@vitejs/plugin-basic-ssl'

=======
>>>>>>> 39961af (update vite)
export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
<<<<<<< HEAD
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://be.kidocanteen.kidoedu.vn',
=======
    proxy: {
      '/api': {
        target: 'http://160.250.132.143:3001',
>>>>>>> 39961af (update vite)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
