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
  'text' : function(value,model,element){
    var val = model[value];
    if(val){
      element.text(val);
    }
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
            directive.call(self,atts[attribute],model,element);
          }
        }
      })
    }
  });
};

var assertAPI = function(){
  assert(this.$,'You must set a $ variable on eggs for it to function properly.');
  // TODO: assert all the methods that we require of our $
}

eggs.bind = function(viewModel,options){
  // assert that the necessary api methods exist
  assertAPI.call(this);

  var elements = this.$(options.selector).toArray();
  elements.forEach(parseDirectives.bind(this,viewModel));
}

module.exports = eggs;
