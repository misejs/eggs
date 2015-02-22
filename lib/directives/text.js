var utils = require('./utils');

var text = function(key,val,node){
  utils.setText(node,val);
};

module.exports = text;
