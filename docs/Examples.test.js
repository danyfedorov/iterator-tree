const when = require('when')
const ITRERATOR_TREE = '../../iterator-tree'
const { ITree } = require(ITRERATOR_TREE)
const {
  iTreeToObject,
  collect,
  travPre,
  travPost,
  rewritePre,
  rewritePost,
  pITreeToObject,
  pCollect,
  pTravPre,
  pTravPost,
  pRewritePre,
  pRewritePost
} = require(`${ITRERATOR_TREE}/traverse-itree`).depthFirst
const { setStopTraversal } = require(`${ITRERATOR_TREE}/metadataAccess`)
const { SEQUENCE } = require(`${ITRERATOR_TREE}/traverse-itree/childrenResolutionTypes`)

describe('iterator-tree examples', () => {
  describe('Examples 1-2: Making an ITree', () => {
    function getChildren (lvl) {
      const nextLvl = lvl + 1
      return [ { lvl: nextLvl, i: 0 }, { lvl: nextLvl, i: 1 } ]
    }

    /**
     * A tree which vertices have a name made of two numbers:
     * - a number of tree level
     * - a number of this vertex among the children.
     */
    const expectedTree = {
      n: 'root',
      children: [
        {
          n: '1-0',
          children: [
            {
              n: '2-0',
              children: [
                { n: '3-0', children: [ '4-0', '4-1' ] },
                { n: '3-1', children: [ '4-0', '4-1' ] }
              ]
            },
            {
              n: '2-1',
              children: [
                { n: '3-0', children: [ '4-0', '4-1' ] },
                { n: '3-1', children: [ '4-0', '4-1' ] }
              ]
            }
          ]
        },
        {
          n: '1-1',
          children: [
            {
              n: '2-0',
              children: [
                { n: '3-0', children: [ '4-0', '4-1' ] },
                { n: '3-1', children: [ '4-0', '4-1' ] }
              ]
            },
            {
              n: '2-1',
              children: [
                { n: '3-0', children: [ '4-0', '4-1' ] },
                { n: '3-1', children: [ '4-0', '4-1' ] }
              ]
            }
          ]
        }
      ]
    }

    it('Example 1: Make ITree instance with the class extending the ITree class', () => {
      class NumberITree extends ITree {
        root () {
          return {
            n: 'root',
            children: getChildren(0)
          }
        }

        vertex ({ lvl, i }) {
          const N = `${lvl}-${i}`
          if (lvl < 4) {
            return {
              n: N,
              children: getChildren(lvl)
            }
          }
          return N
        }
      }

      const iTree = new NumberITree()
      const objectTree = iTreeToObject(iTree)
      expect(objectTree).toEqual(expectedTree)
    })

    it('Example 2: Make ITree instance with the object literal', () => {
      /**
       * Notice using the object literal to create an ITree instance
       */
      const iTree = {
        root: () => ({ n: 'root', children: getChildren(0) }),
        vertex: ({ lvl, i }) => {
          const N = `${lvl}-${i}`
          if (lvl < 4) {
            return {
              n: N,
              children: getChildren(lvl)
            }
          }
          return N
        }
      }
      const objectTree = iTreeToObject(iTree)
      expect(objectTree).toEqual(expectedTree)
    })
  })

  describe('Examples 3-10: Regular traversals', () => {
    /**
     * This tree is used for regular traversal examples
     */
    class TestITree extends ITree {
      root () {
        return { n: 'root', children: [ 1, 2, 3 ] }
      }
      vertex (n) {
        if (n < 3) {
          return {
            n,
            children: [ n + 1, n + 2, n + 3 ]
          }
        }
        return n
      }
    }

    it('Example 3: iTreeToObject', () => {
      const iTree = new TestITree()
      const objectTree = iTreeToObject(iTree)
      expect(objectTree).toEqual({
        n: 'root',
        children: [
          { n: 1, children: [ { n: 2, children: [ 3, 4, 5 ] }, 3, 4 ] },
          { n: 2, children: [ 3, 4, 5 ] },
          3
        ]
      })
    })

    it('Example 4: collect', () => {
      const iTree = new TestITree()
      const collected = collect(iTree, (v) => {
        if (typeof v === 'object') {
          return `(VERTEX ${v.n} [${v.children.join(' ')}])`
        }
        return `(LEAF ${v})`
      })
      expect(collected).toEqual([
        '(VERTEX root [1 2 3])',
        '(VERTEX 1 [2 3 4])',
        '(VERTEX 2 [3 4 5])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(LEAF 3)',
        '(LEAF 4)',
        '(VERTEX 2 [3 4 5])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(LEAF 3)'
      ])
    })

    const callbackForRegularTravPreAndTravPost = (collected) => {
      const toSexp = (v) => {
        if (typeof v === 'object') {
          return `(VERTEX ${v.n} [${v.children.map(toSexp).join(' ')}])`
        }
        return `(LEAF ${v})`
      }
      return (v) => {
        collected.push(toSexp(v))
      }
    }

    it('Example 5: travPre', () => {
      const iTree = new TestITree()
      const collected = []
      travPre(iTree, callbackForRegularTravPreAndTravPost(collected))
      expect(collected).toEqual([
        '(VERTEX root [(LEAF 1) (LEAF 2) (LEAF 3)])',
        '(VERTEX 1 [(LEAF 2) (LEAF 3) (LEAF 4)])',
        '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(LEAF 3)',
        '(LEAF 4)',
        '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(LEAF 3)'
      ])
    })

    it('Example 6: travPost', () => {
      const iTree = new TestITree()
      const collected = []
      travPost(iTree, callbackForRegularTravPreAndTravPost(collected))
      /**
       * Notice the difference from the previous example.
       * Travesing in the post-order callback gets a "released" subtree,
       * while traversing in pre-order callback gets "unreleased" ITreeVertex.
       */
      expect(collected).toEqual([
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(VERTEX 1 [(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3) (LEAF 4)])',
        '(LEAF 3)',
        '(LEAF 4)',
        '(LEAF 5)',
        '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
        '(LEAF 3)',
        '(VERTEX root [(VERTEX 1 [(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3) (LEAF 4)]) (VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3)])'
      ])
    })

    const callbackForRegularRewiritePreAndRewritePost = (rewritingIndexIni) => {
      let rewritingIndex = rewritingIndexIni
      return (v) => {
        rewritingIndex++
        return { rewritingIndex, n: `changed-${typeof v === 'object' ? v.n : v}`, kids: v.children }
      }
    }

    it('Example 7: rewritePre [1]', () => {
      const iTree = new TestITree()
      const tree = rewritePre(iTree, callbackForRegularRewiritePreAndRewritePost(0))
      /**
       * Notice that the tree was not traversed. That is because the rewritePre
       * attempts to traverse the rewritten vertex.
       * With this callback the rewritten root has no children prop.
       */
      expect(tree).toEqual({ n: 'changed-root', rewritingIndex: 1, kids: [ 1, 2, 3 ] })
    })

    it('Example 8: rewritePost', () => {
      const iTree = new TestITree()
      const tree = rewritePost(iTree, callbackForRegularRewiritePreAndRewritePost(0))
      expect(tree).toEqual({
        n: 'changed-root',
        rewritingIndex: 13,
        kids: [
          {
            n: 'changed-1',
            rewritingIndex: 7,
            kids: [
              {
                n: 'changed-2',
                rewritingIndex: 4,
                kids: [
                  { kids: undefined, n: 'changed-3', rewritingIndex: 1 },
                  { kids: undefined, n: 'changed-4', rewritingIndex: 2 },
                  { kids: undefined, n: 'changed-5', rewritingIndex: 3 }
                ]
              },
              { kids: undefined, n: 'changed-3', rewritingIndex: 5 },
              { kids: undefined, n: 'changed-4', rewritingIndex: 6 }
            ]
          },
          {
            n: 'changed-2',
            rewritingIndex: 11,
            kids: [
              { kids: undefined, n: 'changed-3', rewritingIndex: 8 },
              { kids: undefined, n: 'changed-4', rewritingIndex: 9 },
              { kids: undefined, n: 'changed-5', rewritingIndex: 10 }
            ]
          },
          { kids: undefined, n: 'changed-3', rewritingIndex: 12 }
        ]
      })
    })

    it('Example 9: rewritePre [2]', () => {
      const iTree = new TestITree()
      const cb = callbackForRegularRewiritePreAndRewritePost(0)
      const tree = rewritePre(iTree, (v) => {
        const o = cb(v)
        return Object.assign({}, o, { children: o.kids })
      })
      /**
       * This time we are adding children back to an object returned by the callback
       */
      expect(tree).toEqual({
        n: 'changed-root',
        rewritingIndex: 1,
        kids: [ 1, 2, 3 ],
        children: [
          {
            n: 'changed-1',
            rewritingIndex: 2,
            kids: [ 2, 3, 4 ],
            children: [
              {
                n: 'changed-2',
                rewritingIndex: 3,
                kids: [ 3, 4, 5 ],
                children: [
                  { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 4 },
                  { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 5 },
                  { children: undefined, kids: undefined, n: 'changed-5', rewritingIndex: 6 }
                ]
              },
              { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 7 },
              { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 8 }
            ]
          },
          {
            n: 'changed-2',
            rewritingIndex: 9,
            kids: [ 3, 4, 5 ],
            children: [
              { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 10 },
              { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 11 },
              { children: undefined, kids: undefined, n: 'changed-5', rewritingIndex: 12 }
            ]
          },
          { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 13 }
        ]
      })
    })
  })

  describe('Examples 10-16: Promising traversals', () => {
    /**
     * This tree is used for promising traversal examples
     */
    class TestITreeWithPromises extends ITree {
      root () {
        return when.promise((resolve) => {
          setTimeout(() => resolve({ n: 'root', children: [ 1, 2, 3 ] }), 10)
        })
      }
      vertex (n) {
        if (n < 3) {
          return when({
            n,
            children: [ n + 1, n + 2, n + 3 ]
          })
        }
        return when(n)
      }
    }

    it('Example 10: pITreeToObject', () => {
      const iTree = new TestITreeWithPromises()
      return pITreeToObject(iTree, SEQUENCE).then((objectTree) =>
        expect(objectTree).toEqual({
          n: 'root',
          children: [
            { n: 1, children: [ { n: 2, children: [ 3, 4, 5 ] }, 3, 4 ] },
            { n: 2, children: [ 3, 4, 5 ] },
            3
          ]
        })
      )
    })

    it('Example 11: pCollect', () => {
      const iTree = new TestITreeWithPromises()
      return pCollect(
        iTree,
        (v) => {
          if (typeof v === 'object') {
            return `(VERTEX ${v.n} [${v.children.join(' ')}])`
          }
          return `(LEAF ${v})`
        },
        undefined,
        SEQUENCE
      ).then((collected) =>
        expect(collected).toEqual([
          '(VERTEX root [1 2 3])',
          '(VERTEX 1 [2 3 4])',
          '(VERTEX 2 [3 4 5])',
          '(LEAF 3)',
          '(LEAF 4)',
          '(LEAF 5)',
          '(LEAF 3)',
          '(LEAF 4)',
          '(VERTEX 2 [3 4 5])',
          '(LEAF 3)',
          '(LEAF 4)',
          '(LEAF 5)',
          '(LEAF 3)'
        ])
      )
    })

    const callbackForPromisingTravPreAndTravPost = (collected) => {
      const toSexp = (v) => {
        if (typeof v === 'object') {
          return `(VERTEX ${v.n} [${v.children.map(toSexp).join(' ')}])`
        }
        return `(LEAF ${v})`
      }
      return (v) => {
        when(collected.push(toSexp(v)))
      }
    }

    it('Example 12: pTravPre', () => {
      const iTree = new TestITreeWithPromises()
      const collected = []
      return pTravPre(iTree, callbackForPromisingTravPreAndTravPost(collected), SEQUENCE).then(() =>
        expect(collected).toEqual([
          '(VERTEX root [(LEAF 1) (LEAF 2) (LEAF 3)])',
          '(VERTEX 1 [(LEAF 2) (LEAF 3) (LEAF 4)])',
          '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
          '(LEAF 3)',
          '(LEAF 4)',
          '(LEAF 5)',
          '(LEAF 3)',
          '(LEAF 4)',
          '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
          '(LEAF 3)',
          '(LEAF 4)',
          '(LEAF 5)',
          '(LEAF 3)'
        ])
      )
    })

    it('Example 13: pTravPost', () => {
      const iTree = new TestITreeWithPromises()
      const collected = []
      return pTravPost(iTree, callbackForPromisingTravPreAndTravPost(collected), SEQUENCE).then(
        () =>
          expect(collected).toEqual([
            '(LEAF 3)',
            '(LEAF 4)',
            '(LEAF 5)',
            '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
            '(LEAF 3)',
            '(LEAF 4)',
            '(VERTEX 1 [(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3) (LEAF 4)])',
            '(LEAF 3)',
            '(LEAF 4)',
            '(LEAF 5)',
            '(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)])',
            '(LEAF 3)',
            '(VERTEX root [(VERTEX 1 [(VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3) (LEAF 4)]) (VERTEX 2 [(LEAF 3) (LEAF 4) (LEAF 5)]) (LEAF 3)])'
          ])
      )
    })

    const callbackForPromisingRewiritePreAndRewritePost = (rewritingIndexIni) => {
      let rewritingIndex = rewritingIndexIni
      return (v) => {
        rewritingIndex++
        return when({
          rewritingIndex,
          n: `changed-${typeof v === 'object' ? v.n : v}`,
          kids: v.children
        })
      }
    }

    it('Example 14: pRewritePre [1]', () => {
      const iTree = new TestITreeWithPromises()
      return pRewritePre(iTree, callbackForPromisingRewiritePreAndRewritePost(0), SEQUENCE).then(
        (tree) => expect(tree).toEqual({ n: 'changed-root', rewritingIndex: 1, kids: [ 1, 2, 3 ] })
      )
    })

    it('Example 15: pRewritePost', () => {
      const iTree = new TestITreeWithPromises()
      return pRewritePost(iTree, callbackForPromisingRewiritePreAndRewritePost(0), SEQUENCE).then(
        (tree) =>
          expect(tree).toEqual({
            n: 'changed-root',
            rewritingIndex: 13,
            kids: [
              {
                n: 'changed-1',
                rewritingIndex: 7,
                kids: [
                  {
                    n: 'changed-2',
                    rewritingIndex: 4,
                    kids: [
                      { kids: undefined, n: 'changed-3', rewritingIndex: 1 },
                      { kids: undefined, n: 'changed-4', rewritingIndex: 2 },
                      { kids: undefined, n: 'changed-5', rewritingIndex: 3 }
                    ]
                  },
                  { kids: undefined, n: 'changed-3', rewritingIndex: 5 },
                  { kids: undefined, n: 'changed-4', rewritingIndex: 6 }
                ]
              },
              {
                n: 'changed-2',
                rewritingIndex: 11,
                kids: [
                  { kids: undefined, n: 'changed-3', rewritingIndex: 8 },
                  { kids: undefined, n: 'changed-4', rewritingIndex: 9 },
                  { kids: undefined, n: 'changed-5', rewritingIndex: 10 }
                ]
              },
              { kids: undefined, n: 'changed-3', rewritingIndex: 12 }
            ]
          })
      )
    })

    it('Example 16: pRewritePre [2]', () => {
      const iTree = new TestITreeWithPromises()
      const cb = callbackForPromisingRewiritePreAndRewritePost(0)
      return pRewritePre(
        iTree,
        (v) => cb(v).then((o) => Object.assign({}, o, { children: o.kids })),
        SEQUENCE
      ).then((tree) =>
        expect(tree).toEqual({
          n: 'changed-root',
          rewritingIndex: 1,
          kids: [ 1, 2, 3 ],
          children: [
            {
              n: 'changed-1',
              rewritingIndex: 2,
              kids: [ 2, 3, 4 ],
              children: [
                {
                  n: 'changed-2',
                  rewritingIndex: 3,
                  kids: [ 3, 4, 5 ],
                  children: [
                    { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 4 },
                    { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 5 },
                    { children: undefined, kids: undefined, n: 'changed-5', rewritingIndex: 6 }
                  ]
                },
                { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 7 },
                { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 8 }
              ]
            },
            {
              n: 'changed-2',
              rewritingIndex: 9,
              kids: [ 3, 4, 5 ],
              children: [
                { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 10 },
                { children: undefined, kids: undefined, n: 'changed-4', rewritingIndex: 11 },
                { children: undefined, kids: undefined, n: 'changed-5', rewritingIndex: 12 }
              ]
            },
            { children: undefined, kids: undefined, n: 'changed-3', rewritingIndex: 13 }
          ]
        })
      )
    })
  })

  describe('Examples 17-18: Metadata', () => {
    it('Example 17: Without stopTraversal', () => {
      const tree = {
        n: 'root',
        children: [
          {
            n: '1-0',
            children: [
              { n: '2-0', children: [ { n: '3-0', children: [ '4-0', '4-1' ] } ] },
              { n: '2-1', children: [ { n: '3-0', children: [ '4-0', '4-1' ] } ] }
            ]
          },
          { n: '1-1' }
        ]
      }
      const { collect } = require(`${ITRERATOR_TREE}/traverse-object`).depthFirst
      expect(collect(tree, (v) => v.n)).toEqual([ 'root', '1-0', '2-0', '3-0', '2-1', '3-0', '1-1' ])
    })

    it('Example 18: With stopTraversal', () => {
      /**
       * Notice the setStopTraversal call
       */
      const tree = {
        n: 'root',
        children: [
          setStopTraversal({
            n: '1-0',
            children: [
              { n: '2-0', children: [ { n: '3-0', children: [ '4-0', '4-1' ] } ] },
              { n: '2-1', children: [ { n: '3-0', children: [ '4-0', '4-1' ] } ] }
            ]
          }),
          { n: '1-1' }
        ]
      }
      const { collect } = require(`${ITRERATOR_TREE}/traverse-object`).depthFirst
      /**
       * The las visited vertex is the one with the stopTraversal metasymbol
       */
      expect(collect(tree, (v) => v.n)).toEqual([ 'root', '1-0', '1-1' ])
    })
  })
})
