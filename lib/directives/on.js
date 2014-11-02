var on = function(key,val,element){
  if(typeof value == 'function'){
    element.on(key,value);
  }
};

on.requiredMethods = ['on'];

module.exports = on;
