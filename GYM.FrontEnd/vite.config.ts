import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from "vite-plugin-istanbul";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //Istanbul provides coverage instrumentation. 
    istanbul({
      include:'src/*',
      extension:['.ts', '.tsx'],
      requireEnv: false
    })
  ],
})
