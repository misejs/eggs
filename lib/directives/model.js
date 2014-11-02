var model = function(key,val,element,model){
  if(typeof value == 'function'){
    element.on(key,value);
  }
};

on.requiredMethods = ['on'];

module.exports = on;
