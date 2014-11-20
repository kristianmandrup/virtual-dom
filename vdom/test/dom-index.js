var test = require("tape")
var VNode = require("../../vtree/vnode")
var VText = require("../../vtree/vtext")
var diff = require("../../vtree/diff")

var createElement = require("../create-element")
var patch = require("../patch")

test("indexing over thunk root", function (assert) {
    var leftThunk = {
        type: "Thunk",
        render: function () {
            return new VNode("div", {
                className:"test"
            }, [new VText("Left")])
        }
    }

    var rightThunk = {
        type: "Thunk",
        render: function () {
            return new VNode("div", {
                className: "test"
            }, [new VText("Right")])
        }
    }

    var root = createElement(leftThunk)
    var patches = diff(leftThunk, rightThunk)
    var newRoot = patch(root, patches)

    assert.equal(newRoot.childNodes[0].data, "Right")
    assert.end()
})

test("indexing over thunk child", function (assert) {
    var leftNode = new VNode("div", {
        className: "parent-node"
    }, [
        new VNode("div"),
        new VText("test"),
        {
            type: "Thunk",
            render: function () {
                return new VNode("div", {
                    className:"test"
                }, [new VText("Left")])
            }
        },
        new VNode("div"),
        new VText("test")
    ])

    var rightNode = new VNode("div", {
        className: "parent-node"
    }, [
        new VNode("div"),
        new VText("test"),
        {
            type: "Thunk",
            render: function () {
                return new VNode("div", {
                    className:"test"
                }, [new VText("Right")])
            }
        },
        new VNode("div"),
        new VText("test")
    ])

    var root = createElement(leftNode)
    var patches = diff(leftNode, rightNode)
    patch(root, patches)
    assert.equal(root.childNodes[2].childNodes[0].data, "Right")
    assert.end()
})

// Test for issue: https://github.com/Matt-Esch/virtual-dom/issues/115
test("Select with options", function (assert) {
    var leftNode = new VNode("select", {
        className: "parent-node",
        id: 'my-select'
    }, [
        new VNode("option"),
        new VNode("option"),
        new VNode("option"),
    ])

    var rightNode = new VNode("select", {
        className: "parent-node",
        id: 'my-new-select'
    }, [
        new VNode("option"),
        new VNode("option"),
    ])

    var root = createElement(leftNode);
    var patches = diff(leftNode, rightNode);
    patch(root, patches);
    // assert here!?
    assert.end()
})
