const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')

/**
 * Traverses the tree in `post-order`.
 *
 * `callback` results rewrite vertices
 * on which `callback` was called.
 *
 * As it is a `post-order` traversal, each time
 * `callback` gets a vertex, it is a vertex
 * with already rewritten children.
 *
 * @param {ITree} iTree
 * @param {Function} callback
 * @returns {Object}
 */
function rewritePost (iTree, callback) {
  validateITree(iTree)

  function recur (iTreeVertex) {
    if (stopTraversal(iTreeVertex)) {
      return callback(iTreeVertex)
    }
    const hintChildren = iTreeVertex.children
    const childrenSubtrees = hintChildren.map((hintChild, hintNum) =>
      recur(iTree.vertex(hintChild, { parent: iTreeVertex, hintNum }))
    )
    const subtree = Object.assign({}, iTreeVertex, { children: childrenSubtrees })
    return callback(subtree)
  }

  return recur(iTree.root())
}

module.exports = rewritePost
