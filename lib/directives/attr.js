var attr = function(value,model,element){
  if(value === true){
    element.attr(key);
  } else if(value){
    element.attr(key,value);
  } else {
    element.removeAttr(key);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
