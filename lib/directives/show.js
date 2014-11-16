var show = function(key,val,element){
  var show = val ? '' : 'none';
  element.css('display',show);
};

show.requiredMethods = ['css'];

module.exports = show;
