var attr = function(key,val,element,model,keydefined){
  if(val === false){
    element.removeAttr(key);
  } else if(!keydefined) {
    try {
      element.prop(val,val);
    } catch(e) {
      element.attr(val,val);
    }
  } else {
    try {
      element.prop(key,val);
    } catch(e) {
      element.attr(key,val);
    }
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
