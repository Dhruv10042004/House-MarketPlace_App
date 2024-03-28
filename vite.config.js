import { defineConfig } from 'vite';

export default defineConfig({
  // Other configurations...
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
});
