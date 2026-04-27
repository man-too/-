import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Socket } from 'dgram'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
