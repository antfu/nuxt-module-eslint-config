export default defineNuxtConfig({
  modules: ['../src/module'],
  eslintConfig: {
    unimport: true,
  },
  devtools: { enabled: true },
})
