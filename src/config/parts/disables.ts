import { GLOB_EXTS } from '../constants'
import type { FlatConfig, NuxtESLintConfigOptions } from '../types'

export default function disables(options: { dirs?: NuxtESLintConfigOptions['dirs'] }): FlatConfig[] {
  const dirs = options.dirs ?? {}

  return [
    {
      name: 'nuxt:vue-routes-disables',
      files: [
        '**/app.{js,ts,jsx,tsx,vue}',
        '**/error.{js,ts,jsx,tsx,vue}',
        // These pages are not used directly by users so they can have one-word names.
        ...dirs.pages?.map(dir => `${dir}/**/*.${GLOB_EXTS}`) ?? [],
        ...dirs.layouts?.map(dir => `${dir}/**/*.${GLOB_EXTS}`) ?? [],
        // These files should have multiple words in their names as they are within subdirectories.
        ...dirs.components?.map(dir => `${dir}/**/*.${GLOB_EXTS}`) ?? [],
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    // Pages and layouts are required to have a single root element if transitions are enabled.
    {
      name: 'nuxt:vue-single-root',
      files: [
        ...dirs.pages?.map(dir => `${dir}/**/*.${GLOB_EXTS}`) ?? [],
        ...dirs.layouts?.map(dir => `${dir}/**/*.${GLOB_EXTS}`) ?? [],
      ],
      rules: {
        'vue/no-multiple-template-root': 'error',
      },
    },
  ]
}
