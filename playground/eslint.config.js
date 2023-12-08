// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    isInEditor: false,
  },
  import('./.nuxt/eslint.config.mjs').then(r => r.default),
)
