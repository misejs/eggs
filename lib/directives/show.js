var show = function(key,val,element){
  if(val){
    element.show();
  } else {
    element.hide();
  }
};

show.requiredMethods = ['show','hide'];

module.exports = show;
