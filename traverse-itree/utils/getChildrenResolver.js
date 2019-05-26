const when = require('when')
const sequence = require('when/sequence')
const { ALL, SEQUENCE } = require('../childrenResolutionTypes')

const getChildrenResolver = (childrenResolutionType) => (promiseGetters) => {
  if (childrenResolutionType === ALL) {
    return when.all(promiseGetters.map((getPromise) => getPromise()))
  } else if (childrenResolutionType === SEQUENCE) {
    return sequence(promiseGetters)
  } else {
    throw new Error(`Bad children resolution type: ${childrenResolutionType}`)
  }
}

module.exports = getChildrenResolver
