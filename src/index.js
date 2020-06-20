import {
  map,
  filter,
  keys,
  compact,
  flatMap,
  flatten,
  groupBy,
  mapValues,
  uniq,
  split,
  trim,
} from '@dword-design/functions'
import resolveFrom from 'resolve-from'

const getSegments = node => {
  if (
    node.callee?.object?.name === 'execa' &&
    node.callee?.property?.name === 'command'
  ) {
    switch (node.arguments[0].type) {
      case 'StringLiteral':
        return node.arguments[0].value |> split(' ')
      case 'TemplateLiteral':
        return (
          node.arguments[0].quasis |> map('value.raw') |> map(trim) |> compact
        )
      default:
        return []
    }
  }
  if (node.callee?.name === 'execa') {
    return [
      ...(node.arguments[0].type === 'StringLiteral'
        ? [node.arguments[0].value]
        : []),
      ...(node.arguments[1]?.type === 'ArrayExpression'
        ? node.arguments[1].elements
          |> filter({ type: 'StringLiteral' })
          |> map('value')
        : []),
    ]
  }
  return []
}
export default (node, deps) => {
  if (node.type === 'CallExpression') {
    const segments = getSegments(node)
    if (segments.length > 0) {
      const binaryPackageMap =
        deps
        |> flatMap(dep => {
          const packageConfig = require(resolveFrom(
            process.cwd(),
            `${dep}/package.json`
          ))
          const bin = packageConfig.bin || {}
          const binaries =
            typeof bin === 'string' ? [packageConfig.name] : bin |> keys
          return binaries |> map(binary => ({ dep, binary }))
        })
        |> groupBy('binary')
        |> mapValues(tuples => tuples |> map('dep'))

      return (
        segments
        |> map(segment => binaryPackageMap[segment])
        |> compact
        |> flatten
        |> uniq
      )
    }
  }
  return []
}
