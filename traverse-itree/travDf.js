const validateITree = require('./utils/validateITree')
const stopTraversal = require('./utils/stopTraversal')

/**
 * TODO: refactor
 */
function travDf (iTree, { visitPre, visitPost }) {
  validateITree(iTree)
  const stack = []
  const context = { iTreeVertex: iTree.root(), childIndex: 0 }

  while (true) {
    const { iTreeVertex, childIndex } = context
    if (childIndex === 0) {
      visitPre != null && visitPre(iTreeVertex, { parent: iTreeVertex, index: context.childIndex })
    }
    if (!stopTraversal(iTreeVertex) && childIndex < iTreeVertex.children.length) {
      const hintChildren = iTreeVertex.children
      const childITreeVertex = iTree.vertex(hintChildren[context.childIndex], {
        parent: iTreeVertex,
        index: context.childIndex
      })
      stack.push({ iTreeVertex, childIndex: context.childIndex + 1 })
      context.iTreeVertex = childITreeVertex
      context.childIndex = 0
    } else {
      visitPost != null &&
        visitPost(iTreeVertex, { parent: iTreeVertex, index: context.childIndex })
      if (stack.length > 0) {
        const stackC = stack.pop()
        context.childIndex = stackC.childIndex
        context.iTreeVertex = stackC.iTreeVertex
      } else {
        break
      }
    }
  }
}

module.exports = travDf
