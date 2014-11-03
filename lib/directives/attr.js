var attr = function(key,val,element){
  if(val === false){
    element.removeAttr(key);
  } else if (val === true){
    element.attr(key,key);
  } else {
    element.attr(key,val);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
