var template_attr = 'data-eggs-if-template';
var template_selector = '['+template_attr+']';
var template_tag = 'eggstemplatetag';

// shims a custom tag in IE so it's not unhappy.
var shimCustomTag = function(){
  if(typeof window != 'undefined') document.createElement(template_tag);
}

var ifDirective = function(key,val,element){
  shimCustomTag();
  var template = element.attr(template_attr);
  if(!template){
    // node hasn't been rendered yet, make the content the template
    template = element[0].outerHTML;
  }
  var el;
  if(val === true){
    el = template;
  } else {
    el = '<'+template_tag+' style="display:none">';
  }
  element.replaceWith(el);
  element.attr(template_attr,template);
};

ifDirective.requiredMethods = ['replaceWith','attr','html','style'];

module.exports = ifDirective;
