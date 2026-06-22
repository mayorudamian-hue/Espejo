import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base relativa: funciona tanto en localhost como al publicar en
// https://<usuario>.github.io/<repo>/ sin tener que tocar nada.
// Si algún recurso no carga al desplegar, fijar base: '/<repo>/' explícitamente.
export default defineConfig({
  plugins: [react()],
  base: './',
})
