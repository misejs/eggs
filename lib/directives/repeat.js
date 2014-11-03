var template_attr = 'data-eggs-repeat-template';
var template_selector = '['+template_attr+']';

var repeat = function(key,val,element){
  var self = this;
  var childViews = [];
  if(Array.isArray(val)){
    var template = element.attr(template_attr);
    if(!template){
      // node hasn't been rendered yet, make the content the template
      template = element.html();
      element.attr(template_attr,template);
    }
    element.empty();
    val.forEach(function(item,index){
      var content = self.$(template);
      element.append(content);
      self.parseDirectives(item,content,'repeat');
    });
  } else {
    console.log('repeat directive called with non-array value.',val);
  }
};

repeat.requiredMethods = ['attr','html','append','empty'];
repeat.parseChildDirectives = false;

module.exports = repeat;
