import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import {writeFile} from 'fs/promises'
import { join } from 'path'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-module-eslint-config',
    configKey: 'eslintConfig'
  },
  defaults: {},
  setup (options, nuxt) {
    if (!nuxt.options.dev)
    return

    nuxt.hook('app:resolve', ()=>{
      nuxt.hook('imports:extend', (imports) => {
        writeFile(join(     nuxt.options.buildDir, '.unimport.json'), JSON.stringify(imports, null, 2), 'utf-8')
      })
    })
  }
})
