
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode (development, production)
  // This will load .env, .env.local, .env.[mode], .env.[mode].local
  // Ensure API_KEY is available in your environment or .env file
  // Fix: Cast process to NodeJS.Process to ensure cwd() is recognized by TypeScript.
  const env = loadEnv(mode, (process as NodeJS.Process).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Makes process.env.API_KEY available in client code.
      // Vite replaces this string directly, so JSON.stringify is important.
      // It will take the value from the environment where Vite is run,
      // or from an .env file loaded by Vite.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts', // Optional setup file for tests
      css: false, // If you need to test CSS, set to true or configure specific loaders
    },
    server: {
      port: 3000, // Optional: define a port
      open: true, // Optional: open browser on start
    },
  };
});
