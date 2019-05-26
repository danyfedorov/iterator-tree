const travPre = require('./travPre')

/**
 * Traverses tree in `pre-order`.
 *
 * Uses `callback` on each vertex.
 * Then uses `predicate` on the `callback` return value to decide
 * whether to gather this result.
 *
 * @param {ITree} iTree
 * @param {Function} [callback=(vertex) => vertex] - Default callback just returns the vertex.
 * @param {Function} [predicate=(val) => val !== undefined] -
 * By default if callback returns `undefined` it is not gathered.
 * @returns {Array}
 */
function collect (iTree, callback = (vertex) => vertex, predicate = (val) => val !== undefined) {
  const result = []
  travPre(iTree, (iTreeVertex) => {
    const cbRes = callback(iTreeVertex)
    if (predicate(cbRes)) {
      result.push(cbRes)
    }
  })
  return result
}

module.exports = collect
