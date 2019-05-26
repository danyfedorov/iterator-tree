const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')

/**
 * `post-order` traversal.
 * @param {ITree} iTree
 * @param {Function} callback
 * @returns {undefined}
 */
function travPost (iTree, callback) {
  validateITree(iTree)

  function recur (iTreeVertex) {
    if (stopTraversal(iTreeVertex)) {
      callback(iTreeVertex)
      return iTreeVertex
    }
    const hintChildren = iTreeVertex.children
    const childrenSubtrees = hintChildren.map((hintChild, hintNum) =>
      recur(iTree.vertex(hintChild, { parent: iTreeVertex, hintNum }))
    )
    const subtree = Object.assign({}, iTreeVertex, { children: childrenSubtrees })
    callback(subtree)
    return subtree
  }

  recur(iTree.root())
}

module.exports = travPost
