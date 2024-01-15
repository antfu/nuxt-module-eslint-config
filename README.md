# Nuxt Module Eslint Config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A module that generates project-aware [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) for Nuxt.

> [!IMPORTANT]
> Work in progress

## Quick Setup

```bash
npm i -D nuxt-module-eslint-config
```

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-module-eslint-config'
  ]
})
```

And create an `eslint.config.js` file in your project root, with the following content:

```js
import NuxtEslintConfig from './.nuxt/eslint.config.mjs'

export default [
  ...NuxtEslintConfig
  // your custom flat config here.
]
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-module-eslint-config/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-module-eslint-config

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-module-eslint-config.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-module-eslint-config

[license-src]: https://img.shields.io/npm/l/nuxt-module-eslint-config.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-module-eslint-config

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
