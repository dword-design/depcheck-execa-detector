import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'
import execa from 'execa'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'depcheck.config.js': endent`
      const execaDetector = require('@dword-design/depcheck-execa-detector')

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
    'src/index.js': 'execa(\'bar\')',
  })
  await execa.command('depcheck --config depcheck.config.js')
})
