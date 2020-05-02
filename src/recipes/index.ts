import { AppRecipe, AppRecipeFn, collections, createApp, createLib } from './recipe-utils'

const coreFiles = {
  'src/lib/api-core.module.ts': [
    `import { Module } from '@nestjs/common'`,
    `// I am overwritten
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiCoreModule {}`,
  ].join('\n'),
}

export const recipes: { [key: string]: AppRecipeFn } = {
  'nest-graphql': (name: string): AppRecipe => {
    const collection = collections.nest
    const tags = 'api,nest'
    const template = 'https://github.com/beeman/nx-nest-graphql'
    return {
      schematics: [
        createApp(collection, name, tags),
        createLib(collection, 'core', name, tags, coreFiles),
        createLib(collection, 'data', name, tags),
      ],
      deps: ['@nestjs/graphql', 'graphql-tools', 'graphql', 'class-validator', 'class-transformer'],
      template,
      files: {},
    }
  },
}

export function getRecipe(name: string): AppRecipeFn | null {
  return recipes[name] ? recipes[name] : null
}
