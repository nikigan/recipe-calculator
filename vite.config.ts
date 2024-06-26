import { VitePWA } from 'vite-plugin-pwa'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
const vitePWA = VitePWA({
  registerType: 'autoUpdate',
  injectRegister: false,
  pwaAssets: {
    disabled: false,
    config: true,
  },
  manifest: {
    name: 'recipe-calculator',
    short_name: 'recipe-calculator',
    description: 'recipe-calculator',
    theme_color: '#ffffff',
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
  },
  devOptions: {
    enabled: false,
    navigateFallback: 'index.html',
    suppressWarnings: true,
    type: 'module',
  },
})

export default (configEnv: ConfigEnv) => {
  const env = { ...process.env, ...loadEnv(configEnv.mode, process.cwd(), '') }

  return defineConfig({
    base: env.VITE_BASE,
    plugins: [react(), vitePWA],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
}
