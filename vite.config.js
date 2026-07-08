import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),
  tailwindcss(),

  ],
  base: '/Books/',
  server: {
    proxy: {
      '/api': {
        target: 'http://core-api.test',
        changeOrigin: true,
        headers: { 'X-Panel-Domain': 'b2b.com' },
      },
    },
  },
})
