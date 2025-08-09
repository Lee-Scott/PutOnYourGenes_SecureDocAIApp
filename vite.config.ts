/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/components/chat/index.ts',
        'src/components/questionnaire/index.ts',
        'src/models',
        'src/enum',
        'src/store',
        'src/utils/ToastUtils.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__',
       ],
    },
  },
})
