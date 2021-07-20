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
      '@/graphql': path.resolve(__dirname, '/graphql/index'),
      '@': path.resolve(__dirname, '/src'),
    },
  },
});
