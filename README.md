# nxplus

Utilities for Nx Workspace

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nxplus.svg)](https://npmjs.org/package/nxplus)
[![CircleCI](https://circleci.com/gh/beeman/nxplus/tree/master.svg?style=shield)](https://circleci.com/gh/beeman/nxplus/tree/master)
[![Codecov](https://codecov.io/gh/beeman/nxplus/branch/master/graph/badge.svg)](https://codecov.io/gh/beeman/nxplus)
[![Downloads/week](https://img.shields.io/npm/dw/nxplus.svg)](https://npmjs.org/package/nxplus)
[![License](https://img.shields.io/npm/l/nxplus.svg)](https://github.com/beeman/nxplus/blob/master/package.json)

<!-- toc -->

- [nxplus](#nxplus)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g nxplus
$ nxplus COMMAND
running command...
$ nxplus (-v|--version|version)
nxplus/1.1.0 darwin-x64 node-v12.16.2
$ nxplus --help [COMMAND]
USAGE
  $ nxplus COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`nxplus create NAME`](#nxplus-create-name)
- [`nxplus help [COMMAND]`](#nxplus-help-command)
- [`nxplus scope:get`](#nxplus-scopeget)
- [`nxplus scope:set [SCOPE]`](#nxplus-scopeset-scope)

## `nxplus create NAME`

Create an empty Nx Workspace

```
USAGE
  $ nxplus create NAME

OPTIONS
  -h, --help                    show CLI help
  --cli=(angular|nx)            [default: nx]
  --dry-run
  --package-manager=(yarn|npm)  [default: yarn]
  --skip-git
  --skip-install
```

_See code: [src/commands/create.ts](https://github.com/beeman/nxplus/blob/v1.1.0/src/commands/create.ts)_

## `nxplus help [COMMAND]`

display help for nxplus

```
USAGE
  $ nxplus help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `nxplus scope:get`

Get the NPM Scope of an Nx Workspace

```
USAGE
  $ nxplus scope:get

OPTIONS
  -h, --help  show CLI help
  -j, --json
```

_See code: [src/commands/scope/get.ts](https://github.com/beeman/nxplus/blob/v1.1.0/src/commands/scope/get.ts)_

## `nxplus scope:set [SCOPE]`

Set the NPM Scope of an Nx Workspace

```
USAGE
  $ nxplus scope:set [SCOPE]

OPTIONS
  -h, --help    show CLI help
  -s, --silent
  --dry-run
```

_See code: [src/commands/scope/set.ts](https://github.com/beeman/nxplus/blob/v1.1.0/src/commands/scope/set.ts)_

<!-- commandsstop -->
