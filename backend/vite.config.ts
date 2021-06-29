import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import './src/env';

const config = defineConfig({
  plugins: [
    ...VitePluginNode({
      server: 'express',
      appPath: './index.ts',
      port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
      tsCompiler: 'swc',
    }),
  ],
});

export default config;
