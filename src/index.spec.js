import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'
import execa from 'execa'

export default {
  'bin object': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'depcheck.config.js': endent`
        const execaDetector = require('../src')

        module.exports = {
          detectors: [
            execaDetector,
          ],
        }
      `,
        'node_modules/foo/package.json': endent`
        {
          "bin": {
            "bar": "./dist/cli.js"
          }
        }
      `,
        'package.json': endent`
        {
          "dependencies": {
            "foo": "^1.0.0"
          }
        }
      `,
        'src/index.js': "execa('bar')",
      })
      await execa.command('depcheck --config depcheck.config.js')
    }),
  'bin string': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'depcheck.config.js': endent`
        const execaDetector = require('../src')

        module.exports = {
          detectors: [
            execaDetector,
          ],
        }
      `,
        'node_modules/foo/package.json': endent`
        {
          "name": "foo",
          "bin": "./dist/cli.js"
        }
      `,
        'package.json': endent`
        {
          "dependencies": {
            "foo": "^1.0.0"
          }
        }
      `,
        'src/index.js': "execa('foo')",
      })
      await execa.command('depcheck --config depcheck.config.js')
    }),
  command: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'depcheck.config.js': endent`
        const execaDetector = require('../src')

        module.exports = {
          detectors: [
            execaDetector,
          ],
        }
      `,
        'node_modules/foo/package.json': endent`
        {
          "name": "foo",
          "bin": "./dist/cli.js"
        }
      `,
        'package.json': endent`
        {
          "dependencies": {
            "foo": "^1.0.0"
          }
        }
      `,
        'src/index.js': "execa.command('foo bar')",
      })
      await execa.command('depcheck --config depcheck.config.js')
    }),
}
