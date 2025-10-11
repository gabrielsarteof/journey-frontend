import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no mode (development, production, etc)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      svgr({
        // Permite importar SVG como componentes React usando ?react
        svgrOptions: {
          icon: true,
          dimensions: false,
        },
      }),
      tailwindcss(),
      TanStackRouterVite()
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      // Configuração do servidor de desenvolvimento
      port: parseInt(env.VITE_PORT || '3000', 10),
      host: env.VITE_HOST || 'localhost',
      strictPort: true, // Falha se a porta já estiver em uso
      open: false, // Não abre o navegador automaticamente
      cors: true, // Habilita CORS
    },
    preview: {
      // Configuração do servidor de preview (após build)
      port: parseInt(env.VITE_PORT || '3000', 10),
      host: env.VITE_HOST || 'localhost',
      strictPort: true,
      cors: true,
    },
  }
})
