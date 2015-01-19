var parseVariable = require('./parseVariable');

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s:,]+)\s*(?:\:\s*([^\s,]+))?,?/g;
  var match = optionsMatcher.exec(string);
  do {
    var name, val, keydefined;
    if(match[2]){
      keydefined = true;
      name = match[1];
      val = parseVariable(model,match[2]);
    } else {
      keydefined = false;
      name = match[1];
      val = parseVariable(model,match[1]);
    }
    argCallback(name,val,keydefined);
  } while(match = optionsMatcher.exec(string));
}

module.exports = parseOptions;
