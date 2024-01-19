import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { stringifyImports } from 'unimport'
import type { Import } from 'unimport'
import type { Nuxt } from '@nuxt/schema'
import { relative, resolve } from 'pathe'
import { getPort } from 'get-port-please'
import { startSubprocess } from '@nuxt/devtools-kit'
import type { ESLintPluginData } from './utils'
import { Unimport } from './addons/unimport'
import type { NuxtESLintConfigOptions } from './config/types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Setup basic JavaScript, TypeScript and Vue plugins and rules.
   *
   * You might want to disable it when you are using other ESLint config that handles the basic setup.
   *
   * @default true
   */
  setup?: boolean

  /**
   * Enable experimental features.
   */
  experimental?: {
    /**
     * Enable unimport plugin that inserts import statements automatically.
     *
     * @experimental
     * @default false
     */
    unimport?: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-module-eslint-config',
    configKey: 'eslintConfig',
  },
  defaults: {
    setup: true,
    experimental: {
      unimport: false,
    },
  },
  setup(options, nuxt) {
    const addons: ESLintPluginData[] = []

    if (options.experimental?.unimport)
      addons.push(Unimport(nuxt))

    addTemplate({
      filename: 'eslint.config.mjs',
      write: true,
      async getContents() {
        return generateESLintConfig(options, nuxt, addons)
      },
    })

    setupDevToolsIntegration(nuxt)
  },
})

function generateESLintConfig(options: ModuleOptions, nuxt: Nuxt, addons: ESLintPluginData[]) {
  const importLines: Import[] = []
  const configLines: string[] = []

  importLines.push({
    from: 'nuxt-module-eslint-config/config',
    name: 'createBasicNuxtConfig',
  })

  const basicOptions: NuxtESLintConfigOptions = {
    features: {
      setup: options.setup,
    },
    dirs: getDirs(nuxt),
  }

  configLines.push(`...createBasicNuxtConfig(\n${JSON.stringify(basicOptions, null, 2)}\n),`)

  for (const mod of addons) {
    importLines.push(...mod.imports)
    configLines.push(...mod.configLines)
  }

  return [
    '// ESLint config generated by Nuxt',
    stringifyImports(importLines, false),
`export default [`,
...configLines,
`]`,
'',
  ].join('\n')
}

function setupDevToolsIntegration(nuxt: Nuxt) {
  let viewerProcess: ReturnType<typeof startSubprocess> | undefined
  let viewerPort: number | undefined
  let viewerUrl: string | undefined

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      name: 'eslint-config',
      title: 'ESLint Config',
      icon: 'https://raw.githubusercontent.com/antfu/eslint-flat-config-viewer/main/public/favicon.svg',
      view: viewerUrl
        ? {
            type: 'iframe',
            src: viewerUrl,
          }
        : {
            type: 'launch',
            description: 'Start ESLint config viewer to inspect the local ESLint config',
            actions: [
              {
                label: 'Launch',
                pending: !!viewerProcess,
                handle: async () => {
                  viewerPort = await getPort({
                    port: 8123,
                    portRange: [8123, 10000],
                  })
                  viewerProcess = startSubprocess(
                    {
                      command: 'npx',
                      args: ['eslint-flat-config-viewer'],
                      cwd: nuxt.options.rootDir,
                      env: {
                        PORT: viewerPort.toString(),
                        NO_OPEN: 'true',
                      },
                    },
                    {
                      id: 'eslint-flat-config-viewer',
                      name: 'ESLint Config Viewer',
                    },
                    nuxt,
                  )
                  nuxt.callHook('devtools:customTabs:refresh')

                  // Wait for viewer to be ready
                  const url = `http://localhost:${viewerPort}`
                  for (let i = 0; i < 100; i++) {
                    if (await fetch(url).then(r => r.ok).catch(() => false))
                      break
                    await new Promise(resolve => setTimeout(resolve, 500))
                  }
                  await new Promise(resolve => setTimeout(resolve, 2000))
                  viewerUrl = url
                },
              },
            ],
          },
    })
  })
}

function getDirs(nuxt: Nuxt): NuxtESLintConfigOptions['dirs'] {
  const dirs = {
    pages: [] as string[],
    composables: [] as string[],
    components: [] as string[],
    layouts: [] as string[],
    plugins: [] as string[],
    middleware: [] as string[],
    modules: [] as string[],
    layers: [] as string[],
  }

  for (const layer of nuxt.options._layers) {
    const r = (t: string) => relative(nuxt.options.rootDir, resolve(layer.config.srcDir, t))

    dirs.layers.push(r(''))
    dirs.pages.push(r(nuxt.options.dir.pages || 'pages'))
    dirs.layouts.push(r(nuxt.options.dir.layouts || 'layouts'))
    dirs.plugins.push(r(nuxt.options.dir.plugins || 'plugins'))
    dirs.middleware.push(r(nuxt.options.dir.middleware || 'middleware'))
    dirs.modules.push(r(nuxt.options.dir.modules || 'modules'))

    dirs.composables.push(r('composables'))
    dirs.composables.push(r('utils'))
    for (const dir of (layer.config.imports?.dirs ?? [])) {
      if (dir)
        dirs.composables.push(r(dir))
    }

    if (layer.config.components !== false) {
      const options = layer.config.components || {}
      if (options !== true && 'dirs' in options) {
        for (const dir of options.dirs || []) {
          if (typeof dir === 'string')
            dirs.components.push(r(dir))
          else if (dir && 'path' in dir && typeof dir.path === 'string')
            dirs.components.push(r(dir.path))
        }
      }
    }
    else {
      dirs.components.push(r('components'))
    }
  }

  return dirs
}
