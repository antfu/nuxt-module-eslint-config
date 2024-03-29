import type { Linter } from 'eslint'

export interface NuxtESLintConfigOptions {
  features?: {
    /**
     * Setup basic JavaScript, TypeScript and Vue plugins and rules.
     *
     * You might want to disable it when you are using other ESLint config that handles the basic setup.
     *
     * @default true
     */
    setup?: boolean
  }

  dirs?: {
    /**
     * Nuxt source directory
     */
    src?: string

    /**
     * Directory for pages
     */
    pages?: string[]

    /**
     * Directory for layouts
     */
    layouts?: string[]

    /**
     * Directory for components
     */
    components?: string[]

    /**
     * Directory for composobles
     */
    composables?: string[]

    /**
     * Directory for plugins
     */
    plugins?: string[]

    /**
     * Directory for modules
     */
    modules?: string[]

    /**
     * Directory for middleware
     */
    middleware?: string[]

    /**
     * Directory for server
     */
    servers?: string[]

    /**
     * Directory for layers
     */
    layers?: string[]
  }
}

export interface FlatConfig extends Linter.FlatConfig {
  name?: string
}
