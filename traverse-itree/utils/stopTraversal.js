const { getStopTraversal } = require('../../metadataAccess')
const _ = require('lodash')

function stopTraversal (iTreeVertex) {
  // If it is not an object it cannot have 'children' prop,
  // hence the traversal should stop
  if (!_.isObject(iTreeVertex)) {
    return true
  }
  const { children } = iTreeVertex
  return !children || !Array.isArray(children) || getStopTraversal(iTreeVertex)
}

module.exports = stopTraversal
