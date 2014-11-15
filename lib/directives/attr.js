var attr = function(key,val,element,model,keydefined){
  if(val === false){
    element.removeAttr(key);
  } else if(!keydefined) {
    element.attr(val,val);
  } else {
    element.attr(key,val);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
