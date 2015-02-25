var stringify = require('vdom-to-html');
var virtualize = require('../virtualize').html;
var select = require('vtree-select');
var utils = require('./utils');
var h = require('virtual-dom/virtual-hyperscript');
var isVNode = require('virtual-dom/vnode/is-vnode');

var template_attr = 'eggs-if-template';
var template_selector = '['+template_attr+']';
var template_tag = 'eggstemplatetag';
var shimmed = false;

// shims a custom tag in IE so it's not unhappy.
var shimCustomTag = function(){
  if(shimmed) return;
  if(typeof document != 'undefined') document.createElement(template_tag);
  shimmed = true;
}

var ifDirective = function(key,val,node,model,keydefined,parent){
  shimCustomTag();
  var showing = val === true;
  var isTemplateTag = new RegExp('\^'+template_tag+'\$','i').test(node.tagName);
  var needsRender = (showing && isTemplateTag) || (!showing && !isTemplateTag);
  // no need to re-render if we're already in the right state
  if(needsRender){
    // we're changing state, so assemble the correct element for the new state
    var newNode;
    if(showing){
      var template = node.properties.attributes[template_attr];
      newNode = virtualize(template);
    } else {
      var template = stringify(node);
      var ifAttr = node.properties.attributes['e-if'];
      var attributes = {
        'e-if' : ifAttr
      };
      attributes[template_attr] = template;
      newNode = h(template_tag,{
        style : { display : 'none' },
        attributes : attributes
      });
    }
    // swap out the old node with the new one
    var uid = node.properties.attributes.uid = utils.uid();
    utils.reverseEnumerate(parent.children,function(child,i){
      if(isVNode(child) && child.properties.attributes.uid === uid){
        parent.children[i] = newNode;
        return true;
      }
    });
  }
};

ifDirective.parseChildDirectives = false;

module.exports = ifDirective;
