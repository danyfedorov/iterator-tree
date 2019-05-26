const validateITree = require('./validateITree')

describe('validateITree', () => {
  const correctRoot = () => {}
  const correctVertex1 = (h) => h
  const correctVertex2 = (h, info) => [ h, info ]

  const getITree = (root, vertex) => ({ root, vertex })

  it('Does not throw when ITree is correct: 1', () => {
    validateITree(getITree(correctRoot, correctVertex1))
  })

  it('Does not throw when ITree is correct: 2', () => {
    validateITree(getITree(correctRoot, correctVertex2))
  })

  const correctVertexITree = (root) => getITree(root, correctVertex1)

  it("'root' method is undefined", () => {
    const iTree = correctVertexITree(undefined)
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'root' method is undefined.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })

  it("'root' method is of wrong type", () => {
    const iTree = correctVertexITree('not a function')
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'root' method is not a function but a value of type string: not a function.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })

  it("'root' method has bad amount of arguments", () => {
    const iTree = correctVertexITree((a, b) => [ a, b ])
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'root' method has invalid amount of arguments: 2. Expected 0.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })

  const correctRootITree = (vertex) => getITree(correctRoot, vertex)

  it("'vertex' method is undefined", () => {
    const iTree = correctRootITree(undefined)
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'vertex' method is undefined.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })

  it("'vertex' method is of wrong type", () => {
    const iTree = correctRootITree('not a function')
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'vertex' method is not a function but a value of type string: not a function.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })

  it("'vertex' method has bad amount of arguments", () => {
    const iTree = correctRootITree((a, b, c) => [ a, b, c ])
    expect(() => validateITree(iTree)).toThrowErrorMatchingInlineSnapshot(`
"INVALID ITREE: 'vertex' method has invalid amount of arguments: 3. Expected from 1 to 2.

NOTE: To conform to ITree Protocol an object must contain:
  a 'root' method which takes no arguments and returns an ITreeVertex,
  a 'vertex' method which takes an ITreeVertexHint and returns ITreeVertex"
`)
  })
})
