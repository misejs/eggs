var model = function(key,val,element,model){
  if(element.is('input,textarea,select,[contenteditable]')){
    element.on('input',function(e){
      model[key] = e.val();
    });
  } else {
    console.warn('model directive used on incomatible element:',element);
  }
};

model.requiredMethods = ['is','on'];

module.exports = model;
