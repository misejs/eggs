var classDirective = function(key,val,element){
  if(value){
    element.addClass(key);
  } else {
    element.removeClass(key);
  }
};

classDirective.requiredMethods = ['addClass','removeClass'];

module.exports = classDirective;
