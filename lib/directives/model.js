var model = function(key,val,element,model,keydefined){
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
    element.text(model[key]);
  } else {
    element.val(model[key]);
  }
};

model.requiredMethods = ['is'];

module.exports = model;
