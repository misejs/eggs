var attr = function(key,val,element){
  if(val === false){
    element.removeAttr(key);
  } else if (!key){
    element.attr(val,val);
  } else {
    element.attr(key,val);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
