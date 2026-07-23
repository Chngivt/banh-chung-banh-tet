import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/banh-chung-banh-tet/', // Đúng tên repository trên link GitHub của bạn
})
