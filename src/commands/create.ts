import { Command, flags } from '@oclif/command'
import { existsSync } from 'fs'
import { join } from 'path'
import { createNxWorkspace, determineCli } from '../lib/utils'

export default class Create extends Command {
  static description = 'Create an empty Nx Workspace'

  static flags = {
    help: flags.help({ char: 'h' }),
    'dry-run': flags.boolean({ default: false }),
    'skip-git': flags.boolean({ default: false }),
    'skip-install': flags.boolean({ default: false }),
    cli: flags.enum({
      options: ['angular', 'nx'],
      default: 'nx',
    }),
    'package-manager': flags.enum({
      options: ['yarn', 'npm'],
      default: 'yarn',
    }),
  }

  static args = [
    {
      name: 'name',
      required: true,
    },
  ]

  async run(): Promise<void> {
    const { args, flags } = this.parse(Create)

    const name = args.name
    if (existsSync(join(process.cwd(), name))) {
      this.error(`Directory ${name} already exists`)
      return this.exit(1)
    }

    const cli = determineCli(flags.cli)

    if (!cli) {
      this.error(`Cannot determine which CLI I should use`)
    }

    createNxWorkspace({
      name,
      cli,
      packageManager: flags['package-manager'],
      dryRun: flags['dry-run'],
      skipGit: flags['skip-git'],
      skipInstall: flags['skip-install'],
    })
  }
}
