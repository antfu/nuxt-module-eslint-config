import type { FlatConfig, NuxtESLintConfigOptions } from './types'
import setup from './parts/setup'
import disbales from './parts/disables'

export function createBasicNuxtConfig(options: NuxtESLintConfigOptions = {}): FlatConfig[] {
  const items: FlatConfig[] = []

  if (options.features?.setup !== false)
    items.push(...setup())

  items.push(...disbales(options))

  return items
}
