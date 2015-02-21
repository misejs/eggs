var isVText = require('virtual-dom/vnode/is-vtext');
var VText = require('virtual-dom/vnode/vtext');

var text = function(key,val,node){
  // remove any previous text node
  for(var i=0;i<node.children;i++){
    if(isVText(node.children[i])){
      node.children.splice(i,1);
      break;
    }
  }
  if(val){
    node.children.push(new VText(val));
  }
  return node;
};

module.exports = text;
