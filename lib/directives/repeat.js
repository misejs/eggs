var stringify = require('vdom-to-html');
var isVNode = require('virtual-dom/vnode/is-vnode');
var virtualize = require('../virtualize').html;
var utils = require('./utils');

var template_attr = 'eggs-repeat-template';

var repeat = function(key,val,node){
  var self = this;
  if(Array.isArray(val)){
    var template = node.properties.attributes && node.properties.attributes[template_attr];
    if(!template){
      // node hasn't been rendered yet, make the content the template
      var template = '';
      node.children.forEach(function(child){
        if(isVNode(child)) template += stringify(child);
      });
      node.properties.attributes[template_attr] = template;
    } else {
      template = utils.htmlUnescape(template);
    }
    node.children = [];
    val.forEach(function(item,index){;
      var content = virtualize(template);
      node.children.push(content);
      self.parseChildDirective(item,node,node.children[node.children.length-1]);
    });
  } else {
    console.log('repeat directive called with non-array value.',val);
  }
};

repeat.parseChildDirectives = false;

module.exports = repeat;
