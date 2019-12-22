import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'
import { spawn } from 'child-process-promise'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'depcheck.config.js': endent`
      const spawnDetector = require('@dword-design/depcheck-spawn-detector')

      module.exports = {
        detectors: [
          spawnDetector,
        ],
      }
    `,
    'node_modules/foo/package.json': JSON.stringify({ bin: { bar: './dist/cli.js' } }),
    'package.json': JSON.stringify({
      dependencies: {
        foo: '^1.0.0',
      },
    }),
    'src/index.js': 'spawn(\'bar\')',
  })
  await spawn('depcheck', ['--config', 'depcheck.config.js', '.'])
})
