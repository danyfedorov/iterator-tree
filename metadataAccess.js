const { STOP_TRAVERSAL } = require('./utils/metadataSymbols')
const _ = require('lodash')

function setStopTraversal (object, value = true) {
  object[STOP_TRAVERSAL] = value
  return object
}

function getStopTraversal (object) {
  if (_.isObject(object)) {
    return object[STOP_TRAVERSAL]
  }
  return false
}

module.exports = {
  setStopTraversal,
  getStopTraversal
}
