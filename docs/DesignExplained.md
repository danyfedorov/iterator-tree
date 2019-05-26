< [UseCases](UseCases.md#use-cases) | [Table Of Contents](../README.md#table-of-contents) | [Examples.test.js](Examples.test.js)>

# Design Explained

- [Design Explained](#design-explained)
  - [Introduction: Iterators and Generators](#introduction-iterators-and-generators)
  - [The Problem](#the-problem)
  - [Interface made of functions](#interface-made-of-functions)
  - [Introducing the _`ITree Protocol`_](#introducing-the-itree-protocol)
  - [Traversal With _`ITree Protocol`_ Step By Step](#traversal-with-itree-protocol-step-by-step)

## Introduction: Iterators and Generators

JavaScript has the concept of [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).
A Generator object can be iterated over the same way as an array or a list.

The difference is that an array and a list are allocated in memory, but a Generator object produces a new value
only when it is needed during the iteration.

The process of iteration is trivial - once a new value is created it can be processed.

## The Problem

Now let's look at a tree. Iteration over a tree (traversal) is more complicated than
the one over a list or over an array. Once you have a tree vertex you can process it, but then you
have children of the vertex and it means you have several "nexts". Which one to choose?
There are many ways you can traverse a tree and each of them is basically defined
by the order of processing children.

To enable creating vertices on the fly there must be a way to allow getting an Nth child
from a vertex. This means that the vertex must have enough information to produce N children.

## Interface made of functions

My first attempt was to describe a tree with functions.

The first thing you want when iterating over a tree is the root of the tree.
So lets have a `root` function in our interface that returns the root vertex: `() => Vertex`.
Once you have a root vertex you process it somehow (or not) and then you'd want to get children.

Tempting thing to do is to introduce `children` function: `type children = (v: Vertex) => Array<Vertex>`.
This is not the best decision because it means that producing children is
always done in the same order but the desired behavior is to produce children in order of iteration.
For example, children need to be produced from left to right one by one
only in case of breadth-first traversal, in case of depth-first traversal you want to
take the first child and then take the first child of the first child, etc.

One way is to add a `child` function: `type child = (v: Vertex, n: number) => Vertex`. It would return an `nth`
child vertex when there is one and `undefined` when there is no `nth` child.

First thing is that you cannot have a child with the value `undefined` because `undefined` is reserved
to mean there is no child.

To counter this, `child` function can return two values where the first would be an actual
vertex and the second would tell if it is the value to actually use for cases when
the vertex is `undefined`. Common Lisp has this issue covered gracefully by having a
feature of returning several values. Because most of the times you don't care about the
second value as you almost never want a value that is `nil`. But with JavaScript, it becomes
kinda clumsy as you need to return an array or an object.

Another way to have a vertex that is `undefined` is to add `hasChild` function -
`type hasChild = (v: Vertex, n: number) => boolean`. But it means adding another
function to the interface which is not good. You may also want to get the number of vertex's
children by something like `function childrenLength (v: Vertex): number`.

Also, if you wanted to make a traversal that would rewrite a tree, you'd need something to set
new (rewritten) children. Which means that you need one more function:
`type setChild => (v: Vertex, newChild: Vertex, n: number): Vertex`.

Now the interface has five functions and four of them are devoted to obtaining children from
vertex and modifying them.

I think I came up with a better way to do this by introducing some restrictions to the form
of vertices.

This is how I came up with **ITreeVertex** and **ITreeVertexHint**.

## Introducing the _`ITree Protocol`_

**ITreeVertex** can be of any type, but if it is supposed to have children it must be an
object with the "children" property (**ITreeVertexWithChildren**) that has an array of **ITreeVertexHints** in it.

The idea is that **ITreeVertexHint** is a thing that has enough information in it to
produce a new vertex from it but itself is not hard to produce.
And an array is a natural (for JS) way to address
the need in `child`, `hasChild`, `childrenLength` and `setChild` methods.

Also, vertex must contain information about its children anyway.
An array is natural for this purpose.

This way it is possible to have only two definitions for functions: **root** and **vertex**,
and three type definitions: **ITreeVertexHint**, **ITreeVertexWithChildren** and **ITreeVertex**.

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

Is having these five definitions better than having another five with `root`, `child`, `hasChild`, `childrenLength` and `setChild`?
I believe it is.

One thing is that all three type definitions actually serve the purpose of describing
a single restriction: a vertex with children has to be an object with "children" property.

Another thing is that it is already very common to implement a tree in JS as an object
with "children" property. So most of the time it won't feel like a restriction at all and
you have to define two functions instead of four.

`root`, `child`, `hasChild`, `childrenLength` and `setChild` definition would be more versatile because the protocol is fully described by functions.
I transfer some responsibilities from functions to a data structure which is not that nice as having a totally "functional" interface.

But I think it turns out more convenient.

## Traversal With _`ITree Protocol`_ Step By Step

Now that I've described _`ITree Protocol`_ let's try to walk through how it
is going to be used by traversals.

- Call **root** function. The call returns an **ITreeVertex** which is an object
  with "children" property. "Children" property has **ITreeVertexHints**.

```js
{
    data: { 'IMPORTANT': 'VERTEX DATA HERE' },
    children: [ hint1, hint2, hint3 ]
}
```

- Call **vertex** function passing it a hint. The call returns another **ITreeVertex**
  like the one that was returned by **root** function.
- Repeat.

This way if a tree is defined conforming to _`ITree Protocol`_
it can be traversed and processed in any order.

< [UseCases](UseCases.md#use-cases) | [Table Of Contents](../README.md#table-of-contents) | [Examples.test.js](Examples.test.js)>
