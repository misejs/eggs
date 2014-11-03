var classDirective = function(key,val,element){
  if(val !== false){
    element.addClass(key || val);
  } else {
    element.removeClass(key || val);
  }
};

classDirective.requiredMethods = ['addClass','removeClass'];

module.exports = classDirective;
