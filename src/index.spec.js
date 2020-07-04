import { endent, mapValues } from '@dword-design/functions'
import execa from 'execa'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

const runTest = files => () =>
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
      ...files,
    })
    await execa.command('depcheck --config depcheck.config.js')
  })

export default {
  'bin object': {
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
  },
  'bin string': {
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
  },
  command: {
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
  },
  'template tag: params': {
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
    'src/index.js': "execa.command(`foo bar ${'bar'}`)",
  },
  'template tag: simple': {
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
    'src/index.js': "execa.command(`foo ${'bar'} baz`)",
  },
} |> mapValues(runTest)
