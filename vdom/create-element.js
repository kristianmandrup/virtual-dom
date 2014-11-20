var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vtree/is-vnode.js")
var isVText = require("../vtree/is-vtext.js")
var isWidget = require("../vtree/is-widget.js")
var handleThunk = require("../vtree/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    // try fix: https://github.com/Matt-Esch/virtual-dom/issues/115
    addChildren(vnode, opts);
    setProperties(vnode);

    return node

}

function setProperties(vnode) {
  var props = vnode.properties
  applyProperties(node, props)
}

function addChildren(vnode, opts) {
  var children = vnode.children

  for (var i = 0; i < children.length; i++) {
      var childNode = createElement(children[i], opts)
      if (childNode) {
          node.appendChild(childNode)
      }
  }
}
