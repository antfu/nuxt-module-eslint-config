import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module.ts',
    'src/config.ts',
  ],
  rollup: {
    emitCJS: true,
  },
})
