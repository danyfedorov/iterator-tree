const invalidITreeMsg = require('./utils/invalidITreeMsg')

/**
 * @typedef {any} ITreeVertexHint
 * @description
 * Data that can be passed to `vertex` method to produce new `ITreeVertex`.
 * Expected to be found in `children` property of `ITreeVertex`.
 */
/**
 * @typedef {Object} ITreeVertexWithChildren
 * @property {any} ... - Arbitrary amount of vertex data
 * @property {Array<ITreeVertexHint>} children
 * @description
 * An object that contains `children` property which is
 * an array of `ITreeVertexHints`.
 * Should look like this: `{ ... , children: [ ITreeVertexHints, ... ] }`
 */
/**
 * @typedef {any|ITreeVertexWithChildren} ITreeVertex
 * @description
 * `ITreeVertex` can be of any type, but if it is supposed to
 * have children it must be `ITreeVertexWithChildren`.
 */

/**
 * @class ITree
 * @abstract
 * @description
 * Abstract class that represents ITree Protocol.
 * It is not mandatory to extend it to make your own ITree
 * and use traversals on it. But you can do it to make it
 * more obvious for code reader you're using ITree Protocol.
 */
class ITree {
  /**
   * Provides a starting point for tree traversal, returns new ITree vertex.
   * @abstract
   * @returns {ITreeVertex}
   */
  root () {
    throw new Error(invalidITreeMsg("'root' method unimplemented"))
  }

  /**
   * Constructs new vertex.
   * @method vertex
   * @abstract
   * @param {ITreeVertexHint} hint
   * @param {Object} hintInfo
   * @returns {ITreeVertex}
   */
  // eslint-disable-next-line no-unused-vars
  vertex (hint, hintInfo) {
    throw new Error(invalidITreeMsg("'vertex' method unimplemented"))
  }
}

module.exports = ITree
