var show = function(key,val,node){
  if(!!val && node.properties.style){
    delete node.properties.style.display;
  } else {
    node.properties.style = node.properties.style || {};
    node.properties.style.display = 'none';
  }
};

module.exports = show;
