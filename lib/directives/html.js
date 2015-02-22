var virtualize = require('../virtualize');

var html = function(key,val,node){
  var children = [];
  if(val){
    children.push(virtualize(val));
  }
  node.children = children;
};

module.exports = html;
