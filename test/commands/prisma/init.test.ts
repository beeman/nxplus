import { expect, test } from '@oclif/test'

describe('prisma:init', () => {
  test
    .stdout()
    .command(['prisma:init'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['prisma:init', '--name', 'jeff'])
    .it('runs hello --name jeff', (ctx) => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
