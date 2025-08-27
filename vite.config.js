import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// имя репозитория будет как поддиректория
export default defineConfig({
  plugins: [react()],
  base: '/demo-lession/',
})
