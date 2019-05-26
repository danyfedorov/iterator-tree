const validateITree = require('../utils/validateITree')
const stopTraversal = require('../utils/stopTraversal')
const getChildrenResolver = require('../utils/getChildrenResolver')
const { SEQUENCE } = require('../childrenResolutionTypes')
const when = require('when')

/**
 * @param {ITree} iTree
 * @param {Function} callback
 * @param {String} [childrenResolutionType=SEQUENCE]
 * @returns {Promise<Object>}
 */
function pRewritePre (iTree, callback, childrenResolutionType = SEQUENCE) {
  validateITree(iTree)
  const resolveChildren = getChildrenResolver(childrenResolutionType)

  const recur = (iTreeVertex) =>
    when(callback(iTreeVertex)).then((iTreeVertexRewritten) => {
      if (!stopTraversal(iTreeVertexRewritten)) {
        const hintChildren = iTreeVertexRewritten.children
        return resolveChildren(
          hintChildren.map((hintChild, hintNum) => () =>
            when(iTree.vertex(hintChild, { parent: iTreeVertex, hintNum })).then(recur)
          )
        ).then((childrenSubtrees) =>
          Object.assign({}, iTreeVertexRewritten, { children: childrenSubtrees })
        )
      }
      return iTreeVertexRewritten
    })

  return when(iTree.root()).then(recur)
}

module.exports = pRewritePre
