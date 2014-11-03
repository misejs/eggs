var attr = function(key,val,element){
  if(!key && val){
    element.attr(val,val);
  } else if(val){
    element.attr(key,val);
  } else {
    element.removeAttr(key);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
