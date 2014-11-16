var classDirective = function(key,val,element,model,keydefined){
  var classname = keydefined ? key : val;
  console.log('class : ',classname, keydefined, key, val);
  if(val !== false){
    element.addClass(classname);
  } else {
    element.removeClass(classname);
  }
};

classDirective.requiredMethods = ['addClass','removeClass'];

module.exports = classDirective;
