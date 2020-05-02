import { Command, flags } from '@oclif/command'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import * as inquirer from 'inquirer'
import { uniq } from 'lodash'
import { error, getPkgJson, log } from '../lib/utils'
import { getRecipe } from '../recipes'

export default class Generate extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Name of the app', required: true }),
    'dry-run': flags.boolean({ default: false }),
  }

  static args = [{ name: 'preset' }]

  async run(): Promise<void> {
    const { args, flags } = this.parse(Generate)

    const name = flags.name
    const dryRun = flags['dry-run']
    let preset = args.preset

    if (!preset) {
      const response = await inquirer.prompt([
        {
          name: 'preset',
          type: 'list',
          message: 'Select preset',
          choices: ['nest-graphql'],
        },
      ])
      preset = response.preset
    }
    const recipe = getRecipe(preset)

    if (!recipe) {
      error(`Cannot find preset ${preset}`)
      this.exit(1)
    }

    const ingredients = recipe(name)
    const pkgJson = getPkgJson()
    const deps = [
      ...Object.keys(pkgJson?.dependencies || []),
      ...Object.keys(pkgJson?.devDependencies || []),
    ]

    const collections = uniq(ingredients.schematics.map((item) => item.collection)).filter(
      (dep) => !deps.includes(dep),
    )

    if (collections.length) {
      log(`Installing collections: ${collections.join(' ')}`)
      if (!dryRun) {
        execSync(`yarn add ${collections.join(' ')}`)
      }
    } else {
      log(`All dependencies are installed`)
    }

    for (const ingredient of ingredients.schematics) {
      log(`Generating ${ingredient.schematic} ${ingredient?.params?.name}`)
      const command = [
        `nx`,
        `generate`,
        `${ingredient?.collection}:${ingredient?.schematic}`,
        `${ingredient?.params?.name}`,
        `--tags ${ingredient?.params?.tags}`,
        ingredient?.params?.directory ? `--directory ${ingredient?.params?.directory}` : '',
        dryRun ? `--dry-run` : '',
      ].join(' ')
      if (dryRun) {
        log('Command', command)
      } else {
        execSync(command, { stdio: [0, 1, 2] })
      }
    }

    if (ingredients.files) {
      for (const path of Object.keys(ingredients.files)) {
        log(`Writing file ${path}`)
        if (!dryRun) {
          writeFileSync(path, ingredients.files[path])
        }
      }
    }
  }
}
