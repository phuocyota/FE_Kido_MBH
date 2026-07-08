import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — cached long-term
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Date libraries — only loaded by History page
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/react-date-range')) {
            return 'vendor-date';
          }
          // Icons — loaded on demand by pages
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Toast — small, used by most pages
          if (id.includes('node_modules/react-hot-toast')) {
            return 'vendor-toast';
          }
        },
      },
    },
  },
  server: {
    port: 5171,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://be.kidocanteen.kidoedu.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 5171,
    strictPort: true,
  },
})
