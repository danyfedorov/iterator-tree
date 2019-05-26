const invalidITreeMsg = require('../../utils/invalidITreeMsg')
const assert = require('assert')

const COMMON_NOTE = `

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex`

const failMsg = (cause) => invalidITreeMsg(`${cause}${COMMON_NOTE}`)

const undefinedMsg = (methodName) => `'${methodName}' method is undefined.`

const notFunctionMsg = (methodName, value) =>
  `'${methodName}' method is not a function but a value of type ${typeof value}: ${value}.`

const invaldArgsAmount = (methodName, argsNum, expectedMinArgsNum, expectedMaxArgsNum) => {
  const expectedArgsMessage =
    expectedMinArgsNum === expectedMaxArgsNum
      ? `Expected ${expectedMinArgsNum}.`
      : `Expected from ${expectedMinArgsNum} to ${expectedMaxArgsNum}.`
  return `'${methodName}' method has invalid amount of arguments: ${argsNum}. ${expectedArgsMessage}`
}

const assertMethod = (tree) => (methodName, expectedMinArgsNum, expectedMaxArgsNum) => {
  assert.notStrictEqual(tree[methodName], undefined, failMsg(undefinedMsg(methodName)))
  assert.strictEqual(
    typeof tree[methodName],
    'function',
    failMsg(notFunctionMsg(methodName, tree[methodName]))
  )
  if (expectedMaxArgsNum === undefined) {
    expectedMaxArgsNum = expectedMinArgsNum
  }
  // debugger
  assert(
    tree[methodName].length >= expectedMinArgsNum && tree[methodName].length <= expectedMaxArgsNum,
    failMsg(
      invaldArgsAmount(methodName, tree[methodName].length, expectedMinArgsNum, expectedMaxArgsNum)
    )
  )
}

function validateITree (tree) {
  const assertTreeMethod = assertMethod(tree)
  assertTreeMethod('root', 0)
  assertTreeMethod('vertex', 1, 2)
}

module.exports = validateITree
