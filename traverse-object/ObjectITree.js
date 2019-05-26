const ITree = require('../ITree.js')

/**
 * @class ObjectITree
 * @description
 * Wrapper for a tree represented in a standard way with nested objects.
 */
class ObjectITree extends ITree {
  constructor (treeObject) {
    super()
    this.treeObject = treeObject
  }

  root () {
    return this.treeObject
  }

  vertex (v) {
    return v
  }
}

module.exports = ObjectITree
