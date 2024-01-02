export default defineNuxtConfig({
  modules: ['../src/module'],
  eslintConfig: {
    unimport: false,
  },
  devtools: { enabled: true },
})
