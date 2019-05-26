const travDf = require('./travDf')
// const {
//   travPre,
//   travPost,
//   rewritePre,
//   rewritePost,
//   collect,
//   iTreeToObject,
//   pTravPre,
//   pTravPost,
//   pRewritePre,
//   pRewritePost,
//   pCollect,
//   pITreeToObject
// } = require('./depthFirst')
const { ALL, SEQUENCE } = require('./childrenResolutionTypes')
const ObjectITree = require('../traverse-object/ObjectITree')
const when = require('when')

describe('traverse-itree/depthFirst', () => {
  /**
   * 11 -+- 21 -+- 31
   *     |      |
   *     `- 22  `- 32 -+- 41
   *                   |
   *                   `- 42
   */
  const getObjectTree = () => ({
    name: 11,
    children: [
      {
        name: 21,
        children: [
          { name: 31 },
          {
            name: 32,
            children: [ { name: 41 }, { name: 42 } ]
          }
        ]
      },
      { name: 22 }
    ]
  })

  class TestITree extends ObjectITree {}

  class TestITreeWithPromises extends TestITree {
    root () {
      return when.promise((resolve) => {
        setTimeout(() => resolve(super.root()), 10)
      })
    }
    vertex (h) {
      return when.promise((resolve) => {
        setTimeout(() => resolve(super.vertex(h)), 10)
      })
    }
  }

  const getTestITreeInstance = () => new TestITree(getObjectTree())

  const getTestITreeWithPromisesInstance = () => new TestITreeWithPromises(getObjectTree())

  describe(`Traversal order is correct.
    (For promising traversals children resolution type is 'sequence')`, () => {
    function testVisitOrder ({ travFn, expectedVisitOrder, travWithPromises }) {
      const visited = []
      const visitor = (vertex) => {
        const fn = () => {
          visited.push(vertex.name)
          return vertex
        }
        if (travWithPromises) {
          return when.promise((resolve) => resolve(fn()))
        } else {
          return fn()
        }
      }
      expect.assertions(1)
      if (travWithPromises) {
        return travFn(getTestITreeWithPromisesInstance(), visitor, SEQUENCE).then(() =>
          expect(visited).toEqual(expectedVisitOrder)
        )
      } else {
        travFn(getTestITreeInstance(), visitor)
        expect(visited).toEqual(expectedVisitOrder)
      }
    }

    const preVisitOrder = [ 11, 21, 31, 32, 41, 42, 22 ]
    const postVisitOrder = [ 31, 41, 42, 32, 21, 22, 11 ]

    it('travPre', () =>
      testVisitOrder({
        travFn: (tree, visitPre) => travDf(tree, { visitPre }),
        expectedVisitOrder: preVisitOrder
      }))
    // it('rewritePre', () =>
    //   testVisitOrder({
    //     travFn: rewritePre,
    //     expectedVisitOrder: preVisitOrder
    //   }))
    it('travPost', () =>
      testVisitOrder({
        travFn: (tree, visitPost) => travDf(tree, { visitPost }),
        expectedVisitOrder: postVisitOrder
      }))
    // it('rewritePost', () =>
    //   testVisitOrder({
    //     travFn: rewritePost,
    //     expectedVisitOrder: postVisitOrder
    //   }))
    // it('pTravPre', () =>
    //   testVisitOrder({
    //     travFn: pTravPre,
    //     expectedVisitOrder: preVisitOrder,
    //     travWithPromises: true
    //   }))
    // it('pRewritePre', () =>
    //   testVisitOrder({
    //     travFn: pRewritePre,
    //     expectedVisitOrder: preVisitOrder,
    //     travWithPromises: true
    //   }))
    // it('pTravPost', () =>
    //   testVisitOrder({
    //     travFn: pTravPost,
    //     expectedVisitOrder: postVisitOrder,
    //     travWithPromises: true
    //   }))
    // it('pRewritePost', () =>
    //   testVisitOrder({
    //     travFn: pRewritePost,
    //     expectedVisitOrder: postVisitOrder,
    //     travWithPromises: true
    //   }))
  })

  describe(`Simple rewriting works as expected.
    (For promising traversals children resolution type is 'sequence')`, () => {
    function testRewriting ({ travFn, travWithPromises }) {
      const expectedRewrittenTree = {
        name: 'changed-11',
        children: [
          {
            name: 'changed-21',
            children: [
              { name: 'changed-31' },
              {
                name: 'changed-32',
                children: [ { name: 'changed-41' }, { name: 'changed-42' } ]
              }
            ]
          },
          { name: 'changed-22' }
        ]
      }
      const visitor = (vertex) => {
        const fn = () => {
          vertex.name = `changed-${vertex.name}`
          return vertex
        }
        if (travWithPromises) {
          return when.promise((resolve) => resolve(fn()))
        } else {
          return fn()
        }
      }
      expect.assertions(1)
      if (travWithPromises) {
        return travFn(getTestITreeWithPromisesInstance(), visitor, SEQUENCE).then((rewrittenTree) =>
          expect(rewrittenTree).toEqual(expectedRewrittenTree)
        )
      } else {
        expect(travFn(getTestITreeInstance(), visitor)).toEqual(expectedRewrittenTree)
      }
    }

    // it('rewritePre', () => testRewriting({ travFn: rewritePre }))
    // it('rewritePost', () => testRewriting({ travFn: rewritePost }))
    // it('pRewritePre', () => testRewriting({ travFn: pRewritePre, travWithPromises: true }))
    // it('pRewritePost', () => testRewriting({ travFn: pRewritePost, travWithPromises: true }))
  })

  describe('Converting ITree to object', () => {
    function testConvertingITreeToObject ({ convertFn, travWithPromises }) {
      if (travWithPromises) {
        return convertFn(getTestITreeWithPromisesInstance(), SEQUENCE).then((rewrittenTree) =>
          expect(rewrittenTree).toEqual(getObjectTree())
        )
      } else {
        expect(convertFn(getTestITreeInstance())).toEqual(getObjectTree())
      }
    }
    // it('iTreeToObject', () => testConvertingITreeToObject({ convertFn: iTreeToObject }))
    // it('pITreeToObject', () =>
    //   testConvertingITreeToObject({ convertFn: pITreeToObject, travWithPromises: true }))
  })

  /**
   * The order is disregarded, but turns out it is the breadth first order
   * in case of 'pre-order' because of vertex event loop's internal queue
   * - [ 11, 21, 22, 31, 32, 41, 42 ].
   * In case of 'post-order' it turns out to be an order without a name
   * but still very distinctive - [ 22, 31, 41, 42, 32, 21 ]
   */
  describe("Promising traversals with children resolution type 'all' visit all vertexs", () => {
    function testPromisingVisitingWithALL (travFn) {
      const expectedVisitedNames = new Set([ 11, 21, 22, 31, 32, 41, 42 ])
      const visited = new Set()
      const visitor = (vertex) => {
        return when.promise((resolve) => {
          visited.add(vertex.name)
          resolve(vertex)
        })
      }
      expect.assertions(1)
      return travFn(getTestITreeWithPromisesInstance(), visitor, ALL).then(() => {
        expect(visited).toEqual(expectedVisitedNames)
      })
    }
    // it('pTravPre', () => testPromisingVisitingWithALL(pTravPre))
    // it('pTravPost', () => testPromisingVisitingWithALL(pTravPost))
    // it('pRewritePre', () => testPromisingVisitingWithALL(pRewritePre))
    // it('pRewritePost', () => testPromisingVisitingWithALL(pTravPost))
  })

  describe('Collecting', () => {
    // it('collect', () => {
    //   const expectedToCollect = new Set([ 11, 21, 22, 31, 32, 41, 42 ])
    //   const visitor = (vertex) => vertex.name
    //   const setOfCollected = new Set(collect(getTestITreeInstance(), visitor))
    //   expect(setOfCollected).toEqual(expectedToCollect)
    // })
    // it('pCollect', () => {
    //   const expectedToCollect = new Set([ 11, 21, 22, 31, 32, 41, 42 ])
    //   const visitor = (vertex) => vertex.name
    //   expect.assertions(1)
    //   return pCollect(getTestITreeInstance(), visitor).then((collected) => {
    //     const setOfCollected = new Set(collected)
    //     expect(setOfCollected).toEqual(expectedToCollect)
    //   })
    // })
  })
})
