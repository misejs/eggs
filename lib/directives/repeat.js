var template_attr = 'data-eggs-repeat-template';
var template_selector = '['+template_attr+']';
var stringify = require('vdom-to-html');
var virtualize = require('../virtualize');

var repeat = function(key,val,node){
  var self = this;
  if(Array.isArray(val)){
    var template = node.properties[template_attr];
    if(!template){
      // node hasn't been rendered yet, make the content the template
      template = stringify(node);
      node.properties[template_attr] = template;
    }
    node.children = [];
    val.forEach(function(item,index){
      var content = virtualize(template);
      node.children.push(content);
      self.parseDirectives(item,content,'repeat');
    });
  } else {
    console.log('repeat directive called with non-array value.',val);
  }
};

repeat.parseChildDirectives = false;

module.exports = repeat;
