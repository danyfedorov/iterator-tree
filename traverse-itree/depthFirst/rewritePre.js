const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')

/**
 * Traverses the tree in `pre-order`.
 *
 * `callback` results rewrite vertices
 * on which `callback` was called.
 *
 * As it is a `pre-order` traversal each time
 * `callback` gets a vertex, it is a vertex
 * with not rewritten children.
 * And if you change the vertex's children
 * in the `callback`, the traversal
 * would iterate over these new children
 * and not the old ones.
 *
 * @param {ITree} iTree
 * @param {Function} callback
 * @returns {Object}
 */
function rewritePre (iTree, callback) {
  validateITree(iTree)

  function recur (iTreeVertex) {
    const iTreeVertexRewritten = callback(iTreeVertex)
    if (!stopTraversal(iTreeVertexRewritten)) {
      const hintChildren = iTreeVertexRewritten.children
      const childrenSubtrees = hintChildren.map((hintChild, hintNum) => {
        const childITreeVertex = iTree.vertex(hintChild, { parent: iTreeVertex, hintNum })
        return recur(childITreeVertex)
      })
      return Object.assign({}, iTreeVertexRewritten, { children: childrenSubtrees })
    }
    return iTreeVertexRewritten
  }

  return recur(iTree.root())
}

module.exports = rewritePre
