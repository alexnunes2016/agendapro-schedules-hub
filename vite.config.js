
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    historyApiFallback: true
  },
  plugins: [
    react({
      tsDecorators: false,
      exclude: /\.ts$|\.tsx$/
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      },
      tsconfig: './tsconfig.custom.json'
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    target: 'esnext',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent'
    },
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: /\.ts$|\.tsx$/,
    jsxInject: `import React from 'react'`,
    tsconfig: './tsconfig.custom.json'
  },
  define: {
    global: 'globalThis',
  }
}));
