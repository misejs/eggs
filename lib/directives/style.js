var style = function(key,val,node){
  node.properties.style = node.properties.style || {};
  if(val){
    node.properties.style[key] = val;
  } else {
    delete node.properties.style[key];
  }
};

module.exports = style;
