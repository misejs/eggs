
var updateAttr = function(element,key,val){
  try {
    element.attr(key,val);
  } catch(e) {
    // jQuery will flip out if we change the type, so we'll fall back to setting the attribute directly.
    var el = element.length ? element[0] : element;
    if(el.setAttribute){
      el.setAttribute(key,val);
    } else {
      el[key] = val;
    }
  }
}

var attr = function(key,val,element,model,keydefined){
  if(val === false){
    element.removeAttr(key);
  } else if(!keydefined) {
    updateAttr(element,val,val);
  } else {
    updateAttr(element,key,val);
  }
};

attr.requiredMethods = ['attr','removeAttr'];

module.exports = attr;
