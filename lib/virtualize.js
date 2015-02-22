var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var virtualize = require('html-to-vdom')({
  VNode : VNode,
  VText : VText
});
module.exports = virtualize;
