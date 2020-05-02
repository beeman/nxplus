// This file borrows heavily from https://github.com/nrwl/nx/blob/master/packages/create-nx-workspace/bin/create-nx-workspace.ts
import { bold, inverse, magentaBright, yellowBright } from 'chalk'
import { execSync } from 'child_process'
import { removeSync, writeFileSync } from 'fs-extra'
import { join } from 'path'
import { dirSync } from 'tmp'

const tag = (label = 'NXPLUS'): string => inverse(magentaBright(bold(` ${label} `)))
const log = (msg: string, ...params: unknown[]): void =>
  console.log(`  ${tag()}  `, `${yellowBright(msg)}`, ...params)

const tsVersion = '3.8.3'
const cliVersion = '9.2.3'
const angularCliVersion = '9.1.4'
const prettierVersion = '2.0.5'

export interface NxCli {
  package: string
  version: string
  command: string
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

  execSync(`${packageManager} install --silent`, {
    cwd: tmpDir,
    stdio: [0, 1, 2],
  })

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
  execSync(`"${join(tmpDir, 'node_modules', '.bin', cli.command)}" ${params}`, {
    stdio: [0, 1, 2],
  })
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