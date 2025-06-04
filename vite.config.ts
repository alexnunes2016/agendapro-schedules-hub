
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
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
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
    tsconfigRaw: {
      compilerOptions: {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        strict: true,
        noEmit: true,
        jsx: 'react-jsx',
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        useDefineForClassFields: true,
        baseUrl: '.',
        paths: {
          "@/*": ["./src/*"]
        },
        types: ['vite/client', 'node'],
        lib: ['DOM', 'DOM.Iterable', 'ES6'],
        declaration: false,
        composite: false,
        incremental: false
      },
      exclude: [
        'node_modules',
        'dist',
        '**/*.test.ts',
        '**/*.test.tsx'
      ],
      include: [
        'src/**/*',
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.d.ts'
      ]
    }
  },
  define: {
    global: 'globalThis',
  }
}));
