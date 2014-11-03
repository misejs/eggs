var text = function(key,val,element){
  if(key){
    element.text(key);
  }
};

text.requiredMethods = ['text'];

module.exports = text;
