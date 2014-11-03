var on = function(key,val,element){
  if(typeof val == 'function'){
    element.on(key,val);
  }
};

on.requiredMethods = ['on'];

module.exports = on;
