const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')

/**
 * `pre-order` traversal.
 * @param {ITree} iTree
 * @param {Function} callback
 * @returns {undefined}
 */
function travPre (iTree, callback) {
  validateITree(iTree)

  function recur (iTreeVertex) {
    callback(iTreeVertex)
    if (!stopTraversal(iTreeVertex)) {
      const hintChildren = iTreeVertex.children
      hintChildren.forEach((hintChild, hintNum) => {
        const childITreeVertex = iTree.vertex(hintChild, { parent: iTreeVertex, hintNum })
        recur(childITreeVertex)
      })
    }
  }

  recur(iTree.root())
}

module.exports = travPre
