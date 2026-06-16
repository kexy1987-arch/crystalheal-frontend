import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['pickiest-sandi-unlawfully.ngrok-free.dev'],
  },
})