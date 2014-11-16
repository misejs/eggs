var model = function(key,val,element,model){
  if(element.is('input,textarea,select,[contenteditable]')){
    var contenteditable = element.is('[contenteditable]');
    // cheerio doesn't support this, so we'll ignore it if there is no .on method.
    if(typeof element.on == 'function'){
      var changed = function(e){
        el = $(e.currentTarget);
        var value;
        if (contenteditable) {
          value = el.text();
        } else {
          value = el.val();
        }
        model[key] = value;
      };
      element.on('change',changed);
      element.on('input',changed);
    }
    if (contenteditable) {
      element.text(val);
    } else {
      element.val(val);
    }
  } else {
    console.warn('model directive used on incomatible element:',element);
  }
};

model.requiredMethods = ['is','on'];

module.exports = model;
