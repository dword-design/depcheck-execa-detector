import { map, filter, keys, compact, flatMap, flatten, groupBy, mapValues, uniq, split } from '@dword-design/functions'
import resolveFrom from 'resolve-from'

export default (node, deps) => {
  if (node.type === 'CallExpression') {
    const segments = node.callee?.object?.name === 'execa'
      && node.callee?.property?.name === 'command'
      && node.arguments[0].type === 'StringLiteral'
      ? node.arguments[0].value |> split(' ')
      : node.callee?.name === 'execa'
        ? [
          ...node.arguments[0].type === 'StringLiteral' ? [node.arguments[0].value] : [],
          ...node.arguments[1]?.type === 'ArrayExpression'
            ? node.arguments[1].elements |> filter({ type: 'StringLiteral' }) |> map('value')
            : [],
        ]
        : []
    if (segments.length > 0) {
      const binaryPackageMap = deps
        |> flatMap(dep => {
          const { name, bin = {} } = require(resolveFrom(process.cwd(), `${dep}/package.json`))
          const binaries = typeof bin === 'string' ? [name] : bin |> keys
          return binaries |> map(binary => ({ dep, binary }))
        })
        |> groupBy('binary')
        |> mapValues(tuples => tuples |> map('dep'))

      return segments |> map(segment => binaryPackageMap[segment]) |> compact |> flatten |> uniq
    }
  }
  return []
}
