import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
    alias: {
      three: path.resolve('./node_modules/three'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lenis',
      'lenis/react',
    ],
    // Pre-bundle these so they don't cause waterfall requests
    exclude: ['@react-three/postprocessing'],
  },

  build: {
    target: 'esnext',
    // Raise chunk size warning limit — ogl + framer-motion are large but acceptable
    chunkSizeWarningLimit: 1000,
  },

  // Faster HMR — skip transform for large files
  server: {
    hmr: { overlay: true },
    warmup: {
      clientFiles: [
        './src/components/Hero.tsx',
        './src/components/Navbar.tsx',
        './src/components/Skills.tsx',
      ],
    },
  },
})
