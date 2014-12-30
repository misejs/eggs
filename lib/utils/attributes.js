/*!
 * Attributes from $
 * returns an object of attributes given a $ element
 * These APIs differ from jQuery to cheerio, so this adapter is necessary.
 */

module.exports = function(el){
  var atts = {};
  // API differs here between cheerio & jQuery, so we'll use whatever is available.
  if (el.attribs) {
    atts = el.attribs;
  } else if(el.type) {
    atts = Array.prototype.slice.call(el.attributes).reduce(function(o,item){
      o[item.name] = item.value;
      return o;
    },{});
  }
  return atts;
};
