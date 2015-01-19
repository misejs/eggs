var utils = require('./utils');

var model = function(key,val,element,model,keydefined){
  // cheerio doesn't support this, so we'll ignore it if there is no .on method.
  if(typeof element.on == 'function'){
    var changed = function(e){
      var el = $(e.currentTarget);
      model[key] = utils.value(el);
    };
    element.on('change',changed);
    element.on('input',changed);
  }
  utils.value(element,val);
};

model.requiredMethods = ['on'].concat(utils.value.requiredMethods);

module.exports = model;
