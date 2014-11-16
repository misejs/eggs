var on = function(key,val,element,model){
  element.on(key,function(){
    if(typeof model[val] == 'function'){
      var args = Array.prototype.slice.call(arguments);
      model[val].apply(this,args);
    } else {
      console.error('Attempt to fire .on handler with a vm value that was not a function.');
    }
  });
};

on.requiredMethods = ['on'];

module.exports = on;
