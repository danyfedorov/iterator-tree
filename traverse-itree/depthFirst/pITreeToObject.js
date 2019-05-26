const { SEQUENCE } = require('../childrenResolutionTypes')
const pRewritePost = require('./pRewritePost')

/**
 * @param {ITree} iTree
 * @param {String} [childrenResolutionType=SEQUENCE]
 * @returns {Promise<Object>}
 */
const pITreeToObject = (iTree, childrenResolutionType = SEQUENCE) =>
  pRewritePost(iTree, (v) => v, childrenResolutionType)

module.exports = pITreeToObject
