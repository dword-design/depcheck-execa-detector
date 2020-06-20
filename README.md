<!-- TITLE/ -->
# depcheck-detector-execa
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/depcheck-detector-execa.svg)](https://npmjs.org/package/depcheck-detector-execa)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://img.shields.io/github/workflow/status/dword-design/depcheck-detector-execa/build)](https://github.com/dword-design/depcheck-detector-execa/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/depcheck-detector-execa)](https://coveralls.io/github/dword-design/depcheck-detector-execa)
[![Dependency status](https://img.shields.io/david/dword-design/depcheck-detector-execa)](https://david-dm.org/dword-design/depcheck-detector-execa)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dword-design/depcheck-detector-execa)
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Detector for depcheck that finds dependencies in execa calls.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# NPM
$ npm install depcheck-detector-execa

# Yarn
$ yarn add depcheck-detector-execa
```
<!-- /INSTALL -->

## Usage

Custom detectors are currently only supported when using `depcheck` via the Node.js API. Simply add the detector to your depcheck config and run depcheck:

```js
import depcheck from 'depcheck'
import execaDetector from 'depcheck-detector-execa'

const options = {
  detectors: [
    execaDetector,
  ],
}

depcheck('/path/to/your/project', options, (unused) => {
  console.log(unused.dependencies); // an array containing the unused dependencies
  console.log(unused.devDependencies); // an array containing the unused devDependencies
  console.log(unused.missing); // a lookup containing the dependencies missing in `package.json` and where they are used
  console.log(unused.using); // a lookup indicating each dependency is used by which files
  console.log(unused.invalidFiles); // files that cannot access or parse
  console.log(unused.invalidDirs); // directories that cannot access
})
```

The detector detects calls like

```js
import execa from 'execa'

execa('foo')
execa('foo', ['--verbose'])
execa.command('foo bar')
```

<!-- LICENSE/ -->
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
