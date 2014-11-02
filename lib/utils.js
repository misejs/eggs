
var parseArguments = function(model,string,argCallback){
  var optionsMatcher = /([^\s]+)\s:\s([^\s]+),?/g;
  var match = optionsMatcher.match(string);
  var value = model[string];
  if(match){
    // add these classes based on their values
    do {
      var name = match[1];
      var val = model[match[2]];
      if(typeof classVal != 'undefined'){
        argCallback(name,val);
      }
    } while(match = optionsMatcher.match(val));
  } else if(typeof value != 'undefined'){
    setClass(value,true);
  }
}

var utils = {
  parseArguments : parseArguments
};
return utils;
