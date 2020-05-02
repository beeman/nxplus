import { expect, test } from '@oclif/test'

describe('scope:get', () => {
  test
    .stdout()
    .command(['scope:get', '--help'])
    .it('runs hello', (ctx) => {
      expect('true').to.be('true')
    })
})
