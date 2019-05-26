< [Documentation](Documentation.md#examples) | [Table Of Contents](../README.md#table-of-contents) | [Design Explained](DesignExplained.md#design-explained) >

- [Use Cases](#use-cases)
    - [Consequent Queries To The Server](#consequent-queries-to-the-server)
    - [Converting A Map To A Tree](#converting-a-map-to-a-tree)

# Use Cases

So far I've found two use cases that can take advantage of the iterating nature of
iterator-tree.

## Consequent Queries To The Server

The server has information about a tree. Each vertex has a unique id (uid).
I can query a vertex by its uid and the server would return json like the following.

```javascript
const response = {
  uid: rootUid,
  data: rootData,
  children: [
    {
      uid: 'uid1',
      data: 'data1'
    },
    {
      uid: 'uid2',
      data: 'data2'
    }
  ]
}
```

But if I wanted to get children of `uid1` or `uid2` I'd have to
make another query. Traversing such tree is nicely abstracted by _`ITree Protocol`_ like this.

```javascript
const { pTravPre } = require('iterator-tree/traverse-itree').depthFirst
const iTree = {
  root: () => queryVertex(rootUid),
  vertex: ({ uid }) => queryVertex(uid)
}
pTravPre(iTree, doSomethingToVertex).then(() => doOtherThings())
```

## Converting A Map To A Tree

The server returns information about a tree in a form of a map.
Mapping is from vertex name (unique) to its data and a list of children names.

```javascript
const responseMap = {
  root: { data: rootData, children: ['name1', 'name2'] },
  name1: { data: data1, children: ['name3'] },
  name2: { data: data2 },
  name3: { data: data3 }
}
```

It is convenient to convert this map back to a tree using _`ITree protocol`_.

```javascript
const { rewritePost } = require('iterator-tree/traverse-itree').depthFirst
const iTree = {
  root: () => responseMap.root,
  vertex: (name) => responseMap[name]
}
const tree = rewritePost(iTree, (v) => v)
```

< [Documentation](Documentation.md#examples) | [Table Of Contents](../README.md#table-of-contents) | [Design Explained](DesignExplained.md#design-explained) >
