var style = function(key,val,element){
  var styles = {};
  if(val){
    styles[key] = val;
  } else {
    styles[key] = "";
  }
  element.css(styles);
};

style.requiredMethods = ['css'];

module.exports = style;
