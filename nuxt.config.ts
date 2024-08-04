export default defineNuxtConfig({
  ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  css: ["@/assets/main.scss", "@fortawesome/fontawesome-svg-core/styles.css"],
  vite: {
    vue: {
      script: {
        defineModel: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/_variables.scss";',
        },
      },
    },
  },
  plugins: ["~/plugins/locator/index.ts"],
  modules: ["@pinia/nuxt", "nuxt-electron"],
  electron: {
    build: [
      {
        entry: "electron/main.mjs",
      },
    ],
  },
});
