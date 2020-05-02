import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import { basename } from 'path'
import { replaceInFile } from 'replace-in-file'
import { error, getNxJson, log, validateScope } from '../../lib/utils'

export default class ScopeSet extends Command {
  static description = 'Set the NPM Scope of an Nx Workspace'

  static flags = {
    help: flags.help({ char: 'h' }),
    'dry-run': flags.boolean({ default: false }),
    silent: flags.boolean({ default: false, char: 's' }),
  }

  static args = [
    {
      name: 'scope',
      required: false,
    },
  ]

  async run(): Promise<void> {
    const { args, flags } = this.parse(ScopeSet)
    const nxJson = getNxJson()

    let scope = args.scope
    if (!scope) {
      scope = await cli.prompt('Enter NPM Scope', {
        default: basename(process.cwd()),
      })
      if (!validateScope(scope)) {
        error(`Invalid scope`)
        this.exit(0)
      }
    }
    if (nxJson.npmScope === scope) {
      log('Done', `NPM Scope is already set to ${scope}`)
    } else {
      if (!flags.silent) {
        const confirm = await cli.confirm(
          `Do you want to replace all occurrences of ${nxJson.npmScope} to ${scope}?`,
        )
        if (!confirm) {
          this.exit(1)
        }
      }
      const res = await replaceInFile({
        dry: flags['dry-run'],
        files: '**/*.*',
        ignore: ['.git/**', 'node_modules/**', 'dist/**', 'tmp/**'],
        from: nxJson.npmScope,
        to: scope,
      })
      const changed = res.filter((item) => item.hasChanged)
      log('Updated', `${changed.length} files: ${changed.map((c) => c.file).join(',')}`)
    }
  }
}
