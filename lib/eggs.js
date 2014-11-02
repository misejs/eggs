/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

var assert = require('assert');

var eggs = {
  prefix : 'e'
};

var directives = {
  'text' : require('./directives/text'),
  'html' : require('./directives/html'),
  'show' : require('./directives/show'),
  'class' : require('./directives/class'),
  'attr' : require('./directives/attr'),
  'style' : require('./directives/style'),
  'on' : require('./directives/on')
}

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s]+)\s:\s([^\s,]+),?/g;
  var match = optionsMatcher.exec(string);
  var value = model[string];
  if(match){
    // add these classes based on their values
    do {
      var name = match[1];
      var val = model[match[2]];
      argCallback(name,val || match[2]);
    } while(match = optionsMatcher.exec(string));
  } else if(typeof value != 'undefined'){
    argCallback(null,value);
  }
}

var parseDirectives = function(model,el){
  var self = this;
  var $ = self.$;
  var elements = $(el).children();
  elements.each(function(index,el){
    var element = $(el);
    var prefixTest = new RegExp('^'+self.prefix+'-','i');
    var atts = {};
    // API differs here between cheerio & jQuery, so we'll use whatever is available.
    if (el.attribs) {
      atts = el.attribs;
    } else {
      atts = Array.prototype.slice.call(el.attributes).reduce(function(o,item){
        o[item.name] = item.value;
        return o;
      },{});
    }
    attNames = Object.keys(atts);
    if(attNames.length || ~el.name.indexOf('-')){
      attNames.forEach(function(attribute){
        if(prefixTest.test(attribute)){
          var directiveName = attribute.replace(prefixTest,'');
          var directive = directives[directiveName];
          if(directive){
            parseOptions(model,atts[attribute],function(key,value){
              directive.call(self,key,value,element,model);
            });
          }
        }
      })
    }
  });
};

var assertAPI = function(){
  var $ = this.$;
  assert($,'You must set a $ variable on eggs for it to function properly.');
  // Object.keys(directives).forEach(function(name){
  //   var methods = directives[name].requiredMethods;
  //   if(methods){
  //     methods.forEach(function(method){
  //       console.log(typeof $[method] == 'function','Your dollar sign must support the ' + method + ' method for the ' + name + ' directive.');
  //     });
  //   }
  // });
}

eggs.bind = function(viewModel,options){
  // assert that the necessary api methods exist
  assertAPI.call(this);

  var elements = this.$(options.selector).toArray();
  elements.forEach(parseDirectives.bind(this,viewModel));
}

module.exports = eggs;
