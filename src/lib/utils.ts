// This file borrows heavily from https://github.com/nrwl/nx/blob/master/packages/create-nx-workspace/bin/create-nx-workspace.ts
import { bold, inverse, magentaBright, yellowBright, redBright } from 'chalk'
import { execSync, ExecSyncOptions } from 'child_process'
import { readFileSync } from 'fs'
import { removeSync, writeFileSync } from 'fs-extra'
import { join } from 'path'
import { dirSync } from 'tmp'

export const info = (label = 'NXPLUS'): string => inverse(magentaBright(bold(` ${label} `)))
export const err = (label = 'ERROR'): string => inverse(redBright(bold(` ${label} `)))
export const log = (msg: string, ...params: unknown[]): void =>
  console.log(` ${info()} `, `${yellowBright(msg)}`, ...params)

export const error = (msg: string, ...params: unknown[]): void =>
  console.log(` ${err()} `, `${yellowBright(msg)}`, ...params)

export const exec = (command: string, options?: ExecSyncOptions): Buffer =>
  execSync(command, { stdio: [0, 1, 2], ...options })

const tsVersion = '3.8.3'
const cliVersion = '9.2.4'
const angularCliVersion = '9.1.4'
const prettierVersion = '2.0.5'

export interface NxCli {
  package: string
  version: string
  command: string
}

export function validateScope(scope: string): boolean {
  const re = new RegExp(/^[a-z0-9-]+$/i)

  return re.test(scope)
}

export function getNxJson(): { [key: string]: any } {
  return JSON.parse(readFileSync(join(process.cwd(), 'nx.json'), 'utf8'))
}

export function getPkgJson(): { [key: string]: any } {
  return JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))
}

export function determineCli(cli: string): NxCli | null {
  switch (cli) {
    case 'angular':
      return {
        package: '@angular/cli',
        version: angularCliVersion,
        command: 'ng',
      }
    case 'nx':
      return {
        package: '@nrwl/tao',
        version: cliVersion,
        command: 'tao',
      }
    default:
      return null
  }
}

export function removeSandbox(path: string): void {
  log(`Removing sandbox...`)
  removeSync(path)
}

export function createSandbox(
  packageManager: string,
  cli: { package: string; version: string },
): string {
  log(`Creating sandbox...`)
  const tmpDir = dirSync().name
  writeFileSync(
    join(tmpDir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@nrwl/workspace': cliVersion,
        [cli.package]: cli.version,
        typescript: tsVersion,
        prettier: prettierVersion,
      },
      license: 'MIT',
    }),
  )

  exec(`${packageManager} install --silent`, { cwd: tmpDir })

  return tmpDir
}

export function createApp(
  tmpDir: string,
  { skipInstall, cli, dryRun, name, skipGit }: CreateAppOptions,
): void {
  const appNameArg = ` --appName="${name}"`
  const styleArg = ` --style="scss"`
  const skipGitArg = skipGit ? ` --skipGit` : ``
  const skipInstallArg = skipInstall ? ` --skipInstall` : ``
  const dryRunArg = dryRun ? ` --dryRun` : ``

  const collectionArg = '--collection=@nrwl/workspace'
  const params = [
    `new`,
    name,
    'empty',
    appNameArg,
    styleArg,
    dryRunArg,
    '--interactive=false',
    collectionArg,
    skipGitArg,
    skipInstallArg,
  ].join(' ')

  log('Creating app', `${cli.command} ${params}`)
  exec(`"${join(tmpDir, 'node_modules', '.bin', cli.command)}" ${params}`)
}

export interface CreateAppOptions {
  name: string
  cli: NxCli
  dryRun: boolean
  skipGit: boolean
  skipInstall: boolean
}

export interface NxWorkspaceOptions extends CreateAppOptions {
  packageManager: string
}

export function createNxWorkspace({
  packageManager,
  cli,
  dryRun,
  name,
  skipGit,
  skipInstall,
}: NxWorkspaceOptions): void {
  const tmpDir = createSandbox(packageManager, cli)
  createApp(tmpDir, { cli, name, skipInstall, dryRun, skipGit })
  removeSandbox(tmpDir)
}
