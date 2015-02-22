var utils = require('./utils');

var classDirective = function(key,val,node,model,keydefined){
  var classname = keydefined ? key : val;
  var classes = (node.properties.className || '').split(' ');
  if(val !== false){
    classes.push(classname);
  } else {
    utils.reverseEnumerate(classes,function(c,i){
      if(c == classname) classes.splice(i,1);
    });
  }
  var classMap = classes.reduce(function(o,n){
    if(n) o[n] = true;
    return o;
  },{});
  node.properties.className = Object.keys(classMap).join(' ');
};

module.exports = classDirective;
