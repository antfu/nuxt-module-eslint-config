import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { toImports } from 'unimport'
import type { Import } from 'unimport'
import type { ESLintPluginData } from './utils'
import { Unimport } from './addons/unimport'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable unimport plugin that insert import statements automatically
   */
  unimport?: boolean

  /**
   * Enable TypeScript support
   */
  typescript?: boolean

  /**
   * Enable Vue support
   */
  vue?: boolean
}

const dir = fileURLToPath(new URL('./', import.meta.url))

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-module-eslint-config',
    configKey: 'eslintConfig',
  },
  defaults: {},
  setup(options, nuxt) {
    const addons: ESLintPluginData[] = []

    if (options.unimport)
      addons.push(Unimport(nuxt))

    addTemplate({
      filename: 'eslint.config.mjs',
      write: true,
      async getContents() {
        const importLines: Import[] = []
        const configLines: string[] = []

        importLines.push({
          from: join(dir, '../dist/runtime/preset.mjs'),
          name: 'createBasicNuxtConfig',
        })

        configLines.push(`...createBasicNuxtConfig(),`)

        for (const mod of addons) {
          importLines.push(...mod.imports)
          configLines.push(...mod.configLines)
        }

        return [
          '// ESLint config generated by Nuxt',
          toImports(importLines, false),
          `export default [`,
          ...configLines,
          `]`,
          '',
        ].join('\n')
      },
    })
  },
})
