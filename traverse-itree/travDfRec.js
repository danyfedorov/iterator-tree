const validateITree = require('./utils/validateITree')
const stopTraversal = require('./utils/stopTraversal')

function travDfRec (iTree, { visitPre, visitPost }) {
  validateITree(iTree)

  function recur (iTreeVertex, iTreeVertexInfo) {
    visitPre != null && visitPre(iTreeVertex, iTreeVertexInfo)
    if (stopTraversal(iTreeVertex)) {
      visitPost != null && visitPost(iTreeVertex, iTreeVertexInfo)
      return iTreeVertex
    }
    const hintChildren = iTreeVertex.children
    const childrenSubtrees = hintChildren.map((hintChild, index) => {
      const childITreeVertexInfo = { parent: iTreeVertex, index }
      const childITreeVertex = iTree.vertex(hintChild, childITreeVertexInfo)
      return recur(childITreeVertex, childITreeVertexInfo)
    })
    const subtree = Object.assign({}, iTreeVertex, { children: childrenSubtrees })
    visitPost != null && visitPost(subtree, iTreeVertexInfo)
    return subtree
  }

  recur(iTree.root(), { parent: null, index: 0 })
}

module.exports = travDfRec
