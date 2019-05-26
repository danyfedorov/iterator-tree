const wrapTraversal = require('./wrapTraversal.js')
const ti = require('../traverse-itree/depthFirst')

module.exports = {
  collect: wrapTraversal(ti.collect),
  travPre: wrapTraversal(ti.travPre),
  travPost: wrapTraversal(ti.travPost),
  rewritePre: wrapTraversal(ti.rewritePre),
  rewritePost: wrapTraversal(ti.rewritePost),
  pCollect: wrapTraversal(ti.pCollect),
  pTravPre: wrapTraversal(ti.pTravPre),
  pTravPost: wrapTraversal(ti.pTravPost),
  pRewritePre: wrapTraversal(ti.pRewritePre),
  pRewritePost: wrapTraversal(ti.pRewritePost),
  pITreeToObject: wrapTraversal(ti.pITreeToObject)
}
