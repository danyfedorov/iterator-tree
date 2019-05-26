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
function pTravPre (iTree, callback, childrenResolutionType = SEQUENCE) {
  validateITree(iTree)
  const resolveChildren = getChildrenResolver(childrenResolutionType)

  const recur = (iTreeVertex) =>
    when(callback(iTreeVertex)).then(() => {
      if (!stopTraversal(iTreeVertex)) {
        const hintChildren = iTreeVertex.children
        return resolveChildren(
          hintChildren.map((hintChild, hintNum) => () =>
            when(iTree.vertex(hintChild, { parent: iTreeVertex, hintNum })).then(recur)
          )
        )
      }
    })

  return when(iTree.root())
    .then(recur)
    .then(() => undefined)
}

module.exports = pTravPre
