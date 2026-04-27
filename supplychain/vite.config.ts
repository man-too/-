import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
  '/api': {
    target: 'http://127.0.0.1:4523',   // 只留到域名和端口
    changeOrigin: true,
    rewrite: (path) =>
      path.replace(/^\/api/, '/m1/8055396-7810801-default') // 映射到项目基础路径
  }
}
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
