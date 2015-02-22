var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var html = require('html-to-vdom')({
  VNode : VNode,
  VText : VText
});
var dom = require('vdom-virtualize');
module.exports = {
  html : html,
  dom : dom
};
