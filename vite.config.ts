/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
import { ViteDevServer } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';

const configureServerPlugin: Plugin = {
  name: 'configure-server',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/pdf-lib', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const filePath = path.resolve(__dirname, 'public', 'AI Moonshot Stock Analysis.pdf');
      fs.readFile(filePath, (err: any, data: Buffer) => {
        if (err) {
          console.error('Error reading PDF file:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('PDF file not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/pdf' });
          res.end(data);
        }
      });
    });
  }
};

export default defineConfig({
  plugins: [
    react(),
    configureServerPlugin,
  ],
  server: {},
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