export default defineNuxtConfig({
  modules: ['../src/module'],
  eslintConfig: {
    // unimport: true,
    typescript: true,
  },
  devtools: { enabled: true },
})
