const pTravPre = require('./pTravPre.js')
const { ALL } = require('./../childrenResolutionTypes')

/**
 * The default children resolution type is ALL
 * which does not guarantee any order.
 *
 * @param {ITree} iTree
 * @param {Function} [callback=(vertex) => vertex]
 * @param {Function} [predicate=(val) => val !== undefined]
 * @param {String} [childrenResolutionType=ALL]
 * @returns {Promise<Array>}
 */
function pCollect (
  iTree,
  callback = (vertex) => vertex,
  predicate = (val) => val !== undefined,
  childrenResolutionType = ALL
) {
  const result = []
  return pTravPre(
    iTree,
    (iTreeVertex) => {
      const cbRes = callback(iTreeVertex)
      if (predicate(cbRes)) {
        result.push(cbRes)
      }
    },
    childrenResolutionType
  ).then(() => result)
}

module.exports = pCollect
