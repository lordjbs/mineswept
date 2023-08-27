import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: parseInt(process.env.WEBSOCKET_CLIENT_PORT) || 3000,
  },
  plugins: [react()],
});
