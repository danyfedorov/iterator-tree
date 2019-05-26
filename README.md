# `ITERATOR-TREE`

The _`ITree Protocol`_ and traversals for it.

# tl;dr

See [Examples.test.js](docs/Examples.test.js).

# Table Of Contents

- [Documentation](docs/Documentation.md#documentation)
  - [The _`ITree Protocol`_](docs/Documentation.md#the-itree-protocol)
  - [The `ITree` Abstract Class](docs/Documentation.md#the-itree-abstract-class)
  - [Traversals](docs/Documentation.md#traversals)
    - [Promising traversals](docs/Documentation.md#promising-traversals)
      - [Children Resolution Types: 'sequence' and 'all'](docs/Documentation.md#children-resolution-types-sequence-and-all)
    - [Traversals For Objects](docs/Documentation.md#traversals-for-objects)
    - [ITreeToObject](docs/Documentation.md#itreetoobject)
    - [List Of Traversals](docs/Documentation.md#list-of-traversals)
      - [depthFirst](docs/Documentation.md#depthfirst)
  - [Metadata](docs/Documentation.md#metadata)
- [Use Cases](docs/UseCases.md#use-cases)
  - [Consequent Queries To The Server](docs/UseCases.md#consequent-queries-to-the-server)
  - [Converting A Map To A Tree](docs/UseCases.md#converting-a-map-to-a-tree)
- [Design Explained](docs/DesignExplained.md#design-explained)
  - [Introduction: Iterators and Generators](docs/DesignExplained.md#introduction-iterators-and-generators)
  - [The Problem](docs/DesignExplained.md#the-problem)
  - [Interface made of functions](docs/DesignExplained.md#interface-made-of-functions)
  - [Introducing the _`ITree Protocol`_](docs/DesignExplained.md#introducing-the-itree-protocol)
  - [Traversal With _`ITree Protocol`_ Step By Step](docs/DesignExplained.md#traversal-with-itree-protocol-step-by-step)
- [Examples.test.js](docs/Examples.test.js)
