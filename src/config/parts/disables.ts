import { join, relative } from 'pathe'
import { GLOB_EXTS } from '../constants'
import type { FlatConfig, NuxtESLintConfigOptions } from '../types'

export default function disables(options: NuxtESLintConfigOptions): FlatConfig[] {
  const nestedGlobPattern = ['**,', `*.${GLOB_EXTS}`] as const

  return [
    {
      name: 'nuxt:vue-routes-disables',
      files: [
        relative(options.srcDir, `app.${GLOB_EXTS}`),
        relative(options.srcDir, `error.${GLOB_EXTS}`),

        // Layouts and pages are not used directly by users so they can have one-word names.
        ...options.dirs.layouts.map(layoutsDir => join(layoutsDir, ...nestedGlobPattern)),
        ...options.dirs.pages.map(pagesDir => join(pagesDir, ...nestedGlobPattern)),

        // These files should have multiple words in their names as they are within subdirectories.
        ...options.dirs.components.map(componentsDir => join(componentsDir, ...nestedGlobPattern)),
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    // Layouts and pages are required to have a single root element if transitions are enabled.
    {
      name: 'nuxt:vue-single-root',
      files: [
        ...options.dirs.layouts.map(layoutsDir => join(layoutsDir, ...nestedGlobPattern)),
        ...options.dirs.pages.map(pagesDir => join(pagesDir, ...nestedGlobPattern)),
      ],
      rules: {
        'vue/no-multiple-template-root': 'error',
      },
    },
  ]
}
