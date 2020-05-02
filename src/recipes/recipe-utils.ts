export interface AppSchematicParams {
  name: string
  directory?: string
  tags: string
}
export interface AppSchematic {
  collection: string
  schematic: string
  params: AppSchematicParams
  files?: AppRecipeFiles
}
export interface AppRecipe {
  schematics: AppSchematic[]
  deps?: string[]
  files?: AppRecipeFiles
  template?: string
}
export type AppRecipeFiles = { [key: string]: string }
export type AppRecipeFn = (name: string) => AppRecipe

export const collections = {
  nest: '@nrwl/nest',
}

export const createTask = (
  collection: string,
  schematic: string,
  { name, directory, tags }: AppSchematicParams,
  files?: AppRecipeFiles,
): AppSchematic => {
  return {
    collection,
    schematic,
    params: {
      name,
      directory,
      tags,
    },
    files,
  }
}

export const createApp = (
  collection: string,
  name: string,
  tags: string,
  files?: AppRecipeFiles,
): AppSchematic => createTask(collection, 'app', { name, tags }, files)

export const createLib = (
  collection: string,
  name: string,
  directory: string,
  tags: string,
  files?: AppRecipeFiles,
): AppSchematic => createTask(collection, 'lib', { name, directory, tags }, files)
