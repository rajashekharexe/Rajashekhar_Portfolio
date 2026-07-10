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
    minify: 'esbuild',
    // Raise chunk size warning limit — ogl + framer-motion are large but acceptable
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cached long-term
          'vendor-react':  ['react', 'react-dom'],
          // Animation — loads after React
          'vendor-motion': ['framer-motion'],
          // Scroll — small, bundle with motion
          'vendor-lenis':  ['lenis', 'lenis/react'],
          // WebGL galaxy (lazy-loaded chunk)
          'vendor-ogl':    ['ogl'],
        },
      },
    },
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
