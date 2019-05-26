[Table Of Contents](../README.md#table-of-contents) | [Use Cases](UseCases.md#use-cases) >

# Documentation

- [Documentation](#documentation)
  - [The _`ITree Protocol`_](#the-itree-protocol)
  - [The `ITree` Abstract Class](#the-itree-abstract-class)
  - [Traversals](#traversals)
    - [Promising traversals](#promising-traversals)
      - [Children Resolution Types: 'sequence' and 'all'](#children-resolution-types-sequence-and-all)
    - [Traversals For Objects](#traversals-for-objects)
    - [ITreeToObject](#itreetoobject)
    - [List Of Traversals](#list-of-traversals)
      - [depthFirst](#depthfirst)
  - [Metadata](#metadata)

## The _`ITree Protocol`_

The _`ITree Protocol`_ allows describing a tree that would create its vertices during the traversal, on the fly.

The _`ITree Protocol`_ consists of five definitions.

- **root**  
  `type root = () => ITreeVertex`
- **vertex**  
  `type vertex = (hint: ITreeVertexHint, hintInfo: { parent: ITreeVertex, hintNum: number }) => ITreeVertex`
- **ITreeVertex**  
  `type ITreeVertex = ITreeVertexWithChildren | any`
- **ITreeVertexWithChildren**  
  `type ITreeVertexWithChildren = { [key: string]: any, children: Array<ITreeVertexHint>; }`
- **ITreeVertexHint**  
  `type ITreeVertexHint = any`

Tree traversals accept `ITree` instance (an object) with `root` and `vertex` functions.

The way it works is:

- The **root** function produces an **ITreeVertex**. This is the root vertex of a tree.
- **ITreeVertex** can be anything, but if it is supposed to have children it must
  be an object with a "children" property - **ITreeVertexWithChildren**.
- A "children" property must contain an array of **ITreeVertexHints**.
- Then **ITreeVertexHint** can be passed to the **vertex** function to produce new **ITreeVertex**.
  **vertex** function also takes additional info with the parent vertex and the number of the hint
  among other children.

## The `ITree` Abstract Class

([src](../ITree.js)) ([examples 1-2](Examples.test.js))

You can extend the `ITree` class and redefine `root` and `vertex` methods.
Extend it to show the code reader that you're going to use _`ITree Protocol`_.

But it is not mandatory to extend it to make an ITree instance and use traversals on it.

In a [duck typing](https://en.wikipedia.org/wiki/Duck_typing) manner,
traversals only care for the presence of `root` and `vertex` functions in the `ITree` instance.

## Traversals

([src](../traverse-itree))

Names of traversals are mostly self-explanatory.
Traversals take an `ITree` instance and a `callback`.

There are two kinds of traversals:

- **Regular (non-promising) traversals**  
  They expect `root`, `vertex` and `callback` functions to execute synchronous code and return regular values.
- **Promising traversals**  
  They can handle promises if they are returned from `root`, `vertex` or `callback` functions.
  They also take the third argument - `childrenResolutionType`.

### Promising traversals

Handling promises means that these traversals expect that `root` and `vertex` functions, as well as traversal `callback` function, may return promises. The functions mentioned may also return values other than promises.
When these functions return promises, traversal waits for them to resolve and then proceeds.

Promising traversals are prefixed with the `p` letter.
For example, there are `travPre` and `pTravPre`.

#### Children Resolution Types: 'sequence' and 'all'

Promising traversals have three arguments: `tree`, `callback` and _`childrenResolutionType`_.

- `'sequence'`

The default children resolution type is `'sequence'` which means that promises for children are executed
one by one in order of traversal. The `'sequence'` is default in all traversals except for `pCollect`
because it is assumed that if you want to collect data from a tree you don't need to do it
in any specific order.

- `'all'`

The other children resolution type is `'all'` which means that promises for children returned
by `vertex` function start resolving as soon as possible. It means that no order of traversal is
guaranteed. Use with caution.

### Traversals For Objects

There are also traversals for simple object trees in [`iterator-tree/traverse-object`](../traverse-object).
They work the same as ITree traversals, but for trees represented with objects like this

```js
// An object tree - nested objects with arrays of children vertices in "children" properties
{ ... , children: [ { ... ,  children: [ leaf1, leaf2, ... ] }, ... ]}
```

### ITreeToObject

`iTreeToObject` and `pITreeToObject` take an `ITree` instance and return the _"released"_ object tree.

### List Of Traversals

#### depthFirst

([src](../traverse-itree/depthFirst/index.js)) ([examples 3-16](Examples.test.js))

- iTreeToObject ([src](../traverse-itree/depthFirst/iTreeToObject.js))
- collect ([src](../traverse-itree/depthFirst/collect.js))
- travPre ([src](../traverse-itree/depthFirst/travPre.js))
- travPost ([src](../traverse-itree/depthFirst/travPost.js))
- rewritePre ([src](../traverse-itree/depthFirst/rewritePre.js))
- rewritePost ([src](../traverse-itree/depthFirst/rewritePost.js))
- pITreeToObject ([src](../traverse-itree/depthFirst/pITreeToObject.js))
- pCollect ([src](../traverse-itree/depthFirst/pCollect.js))
- pTravPre ([src](../traverse-itree/depthFirst/pTravPre.js))
- pTravPost ([src](../traverse-itree/depthFirst/pTravPost.js))
- pRewritePre ([src](../traverse-itree/depthFirst/pRewritePre.js))
- pRewritePost ([src](../traverse-itree/depthFirst/pRewritePost.js))

## Metadata

([src](../metadataAccess.js)) ([examples 17-18](Examples.test.js))

There is a single metadata symbol you can mark a vertex with.
Use `setStopTraversal` to make traversal stop on this vertex
and do not attempt to descend further into its children.

- setStopTraversal
- getStopTraversal

[Table Of Contents](../README.md#table-of-contents) | [Use Cases](UseCases.md#use-cases) >
