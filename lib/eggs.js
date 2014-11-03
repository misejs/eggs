/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// include the Object.observe polyfill
require('./polyfills/Object.observe.poly');

// recursive observation
var deepObserve = function(object,callback){
  if(Array.observe && Array.isArray(object)){
    Array.observe(object,callback);
    object.forEach(function(o){
      deepObserve(o,callback);
    })
  } else if(typeof object == 'object') {
    Object.observe(object,callback);
    for (var k in object) {
      deepObserve(object[k],callback);
    }
  }
}

var nonParsedDirectiveSelector = function(){
  var self = this;
  var selector = Object.keys(self.directives).reduce(function(str,name){
    var directive = self.directives[name];
    if(directive.parseChildDirectives === false){
      str += '['+self.prefix+'-'+name+'],';
    }
    return str;
  },'');
  return selector.slice(0,-1);
}

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s]+)\s:\s([^\s,]+),?/g;
  var match = optionsMatcher.exec(string);
  var value = model[string];
  if(match){
    do {
      var name = match[1];
      var val = model[match[2]];
      argCallback(name,val || match[2]);
    } while(match = optionsMatcher.exec(string));
  } else if(typeof value != 'undefined'){
    argCallback(null,value);
  }
}

var parseDirectives = function(model,el,parentTag){
  var self = this;
  self.parseDirectives = parseDirectives.bind(self);
  var $ = self.$;
  var elements = $(el).find('*');
  elements.each(function(index,el){
    var element = $(el);
    var nonParsed = nonParsedDirectiveSelector.call(self);
    nonParsed = nonParsed.replace('[' + self.prefix + '-' + parentTag + ']','');
    if (nonParsed && element.parents(nonParsed).length) {
      // skip non parsed selectors
      return;
    }
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
    if(attNames.length){
      attNames.forEach(function(attribute){
        if(prefixTest.test(attribute)){
          var directiveName = attribute.replace(prefixTest,'');
          var directive = self.directives[directiveName];
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
  if (!$ || typeof $ != 'function') throw new Error('You must set a $ variable on eggs for it to function properly.');
}

var modelUpdated = function(viewModel,changes){
  var elements = this.$(this.selector).toArray();
  elements.forEach(parseDirectives.bind(this,viewModel));
}

var factory = function(options){
  var eggs = {
    prefix : 'e'
  };

  eggs.directives = {
    'text' : require('./directives/text'),
    'html' : require('./directives/html'),
    'show' : require('./directives/show'),
    'class' : require('./directives/class'),
    'attr' : require('./directives/attr'),
    'style' : require('./directives/style'),
    'on' : require('./directives/on'),
    'model' : require('./directives/model'),
    'repeat' : require('./directives/repeat')
  }

  eggs.bind = function(viewModel){
    // make sure the necessary api methods exist
    var self = this;
    assertAPI.call(self);

    deepObserve(viewModel,modelUpdated.bind(self,viewModel));
    modelUpdated.call(self,viewModel);
  }

  // defaults & options parsing
  options = options || {};
  if (options.prefix) eggs.prefix = options.prefix;
  eggs.selector = options.selector || 'body';
  if(options.directives){
    eggs.directives = Object.keys(options.directives).reduce(function(directives,name){
      var directive = options.directives[name];
      if(directives[name] && !directive.override){
        throw new Error('Tried to override a built-in directive ('+name+') without specifying it as an override.');
      } else {
        directives[name] = directive;
      }
      return directives;
    },eggs.directives);
  }

  return eggs;
}

module.exports = factory;
