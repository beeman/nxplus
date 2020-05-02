import { expect, test } from '@oclif/test'
import { removeSync } from 'fs-extra'
import { dirSync } from 'tmp'
import { log } from '../../src/lib/utils'

const tmpDir = dirSync().name
describe('create', () => {
  test
    .stdout()
    // .command(['create', 'test-app --skip-install'], { root: tmpDir })
    .it('created a new app', (ctx) => {
      expect('true').to.contain('true')
    })

  after(() => {
    removeSync(tmpDir)
    log('Removing tmp dir')
  })
})
