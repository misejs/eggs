var text = function(key,val,element){
  if(val){
    element.text(val);
  }
};

text.requiredMethods = ['text'];

module.exports = text;
