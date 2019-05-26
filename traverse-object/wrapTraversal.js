const ObjectITree = require('./ObjectITree')

const wrapTraversal = (iTreeTraversal) => (objTree, callback) => {
  const objITree = new ObjectITree(objTree)
  return iTreeTraversal(objITree, callback)
}

module.exports = wrapTraversal
