var html = function(key,val,element){
  if(val){
    element.html(val);
  }
};

html.requiredMethods = ['html'];

module.exports = html;
