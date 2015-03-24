var updateAttr = function(node,key,val){
  node.properties[key] = val;
}

var attr = function(key,val,node,model,keydefined){
  if(val === false){
    delete node.properties[key];
  } else if(!keydefined) {
    updateAttr(node,key,key);
  } else {
    updateAttr(node,key,val);
  }
};

module.exports = attr;
