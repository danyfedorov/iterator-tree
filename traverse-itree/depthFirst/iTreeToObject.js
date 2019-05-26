const rewritePost = require('./rewritePost')

/**
 * Traverses the iTree and returns object tree
 * @param {ITree} iTree
 * @returns {Object}
 */
const iTreeToObject = (iTree) => rewritePost(iTree, (v) => v)

module.exports = iTreeToObject
