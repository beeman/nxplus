import { Command, flags } from '@oclif/command'
import { getNxJson, log } from '../../lib/utils'

export default class ScopeGet extends Command {
  static description = 'Get the NPM Scope of an Nx Workspace'

  static flags = {
    help: flags.help({ char: 'h' }),
    json: flags.boolean({ char: 'j' }),
  }

  async run(): Promise<void> {
    const nxJson = getNxJson()
    const { flags } = this.parse(ScopeGet)
    if (flags.json) {
      return console.log(JSON.stringify({ scope: nxJson.npmScope }))
    }
    log(nxJson.npmScope)
  }
}
