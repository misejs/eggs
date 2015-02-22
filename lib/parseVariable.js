
var parseVariable = function(model,variable){
  var parts = variable.split('.');
  var value;
  var prev = model;
  parts.forEach(function(part){
    value = prev[part];
    if(!value){
      return undefined;
    } else {
      prev = value;
    }
  });
  return value;
}

module.exports = parseVariable;
