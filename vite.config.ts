import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base can be overridden for GitHub Project Pages (e.g. /immersive-platform-demo/).
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
});
