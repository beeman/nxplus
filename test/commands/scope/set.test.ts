import { expect, test } from '@oclif/test'

describe('scope:set', () => {
  test
    .stdout()
    .command(['scope:set', '--help'])
    .it('runs hello', (ctx) => {
      expect('true').to.be('true')
    })
})
