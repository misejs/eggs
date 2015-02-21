var template_attr = 'data-eggs-if-template';
var template_selector = '['+template_attr+']';
var template_tag = 'eggstemplatetag';
var shimmed = false;

// shims a custom tag in IE so it's not unhappy.
var shimCustomTag = function(){
  if(shimmed) return;
  if(typeof document != 'undefined') document.createElement(template_tag);
  shimmed = true;
}

var ifDirective = function(key,val,element,model){
  shimCustomTag();
  var $ = this.$;
  var showing = val === true;
  var needsRender = (showing && element.is(template_tag)) || (!showing && !element.is(template_tag));
  // no need to re-render if we're already in the right state
  if(needsRender){
    // we're changing state, so assemble the correct element for the new state
    var newElement;
    if(showing){
      var template = element.attr(template_attr);
      newElement = $(template);
    } else {
      var template = utils.outerHTML($,element);
      var ifAttr = element.attr('e-if');
      newElement = $('<'+template_tag+' style="display:none">');
      newElement.attr('e-if',ifAttr);
      newElement.attr(template_attr,template);
    }
    // swap out the new element with the old one, then return it so eggs will parse the new element.
    element.after(newElement);
    element.remove();
    return newElement;
  }
};

module.exports = ifDirective;
