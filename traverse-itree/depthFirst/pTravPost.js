const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')
const getChildrenResolver = require('../utils/getChildrenResolver')
const { SEQUENCE } = require('../childrenResolutionTypes')
const when = require('when')

/**
 * @param {ITree} iTree
 * @param {Function} callback
 * @param {String} [childrenResolutionType=SEQUENCE]
 * @returns {Promise<undefined>}
 */
function pTravPost (iTree, callback, childrenResolutionType = SEQUENCE) {
  validateITree(iTree)
  const resolveChildren = getChildrenResolver(childrenResolutionType)

  function recur (iTreeVertex) {
    if (stopTraversal(iTreeVertex)) {
      return when(callback(iTreeVertex)).then(() => iTreeVertex)
    }
    const hintChildren = iTreeVertex.children
    return resolveChildren(
      hintChildren.map((hintChild, hintNum) => () =>
        when(iTree.vertex(hintChild, { parent: iTreeVertex, hintNum })).then(recur)
      )
    ).then((childrenSubtrees) => {
      const subtree = Object.assign({}, iTreeVertex, { children: childrenSubtrees })
      return when(callback(subtree)).then(() => subtree)
    })
  }

  return when(iTree.root())
    .then(recur)
    .then(() => undefined)
}

module.exports = pTravPost
