import type { FlatConfig, NuxtESLintConfigOptions } from './types'
import setup from './parts/setup'
import disbales from './parts/disables'
import nuxt from './parts/nuxt'

export function createBasicNuxtConfig(options: NuxtESLintConfigOptions = {}): FlatConfig[] {
  const items: FlatConfig[] = []

  if (options.features?.setup !== false)
    items.push(...setup())

  items.push(...nuxt())
  items.push(...disbales(options))

  return items
}
