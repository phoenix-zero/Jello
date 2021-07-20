import viteSvg from './vite-img';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import reactJsx from 'vite-react-jsx';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSvg(), reactRefresh(), eslintPlugin(), reactJsx()],
  resolve: {
    alias: {
      '@/gql': path.resolve(__dirname, '/gql'),
      '@': path.resolve(__dirname, '/src'),
    },
  },
});
