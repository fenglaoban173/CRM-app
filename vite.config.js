import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/CRM-app/',  // GitHub Pages 项目页路径（非根域名）
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
