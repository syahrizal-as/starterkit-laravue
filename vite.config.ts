import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/src/main.ts'],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    vueJsx(),

    // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      styles: {
        configFile: 'resources/js/src/assets/styles/variables/_vuetify.scss',
      },
    }),
    Components({
      dirs: ['resources/js/src/@core/components', 'resources/js/src/components'],
      dts: true,
      resolvers: [
        componentName => {
          // Auto import `VueApexCharts`
          if (componentName === 'VueApexCharts')
            return { name: 'default', from: 'vue3-apexcharts', as: 'VueApexCharts' }
        },
      ],
    }),

    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
      vueTemplate: true,

      // ℹ️ Disabled to avoid confusion & accidental usage
      ignore: ['useCookies', 'useStorage'],
    }),
    svgLoader(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources/js/src', import.meta.url)),
      '@core': fileURLToPath(new URL('./resources/js/src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./resources/js/src/@layouts', import.meta.url)),
      '@images': fileURLToPath(new URL('./resources/js/src/assets/images/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./resources/js/src/assets/styles/', import.meta.url)),
      '@configured-variables': fileURLToPath(new URL('./resources/js/src/assets/styles/variables/_template.scss', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
    manifest: true,
    outDir: 'public/build',
    rollupOptions: {
      input: 'resources/js/src/main.ts',
    },
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: [
      './resources/js/src/**/*.vue',
    ],
  },
  server: {
    watch: {
      ignored: ['**/storage/framework/views/**'],
    },
  },
})
