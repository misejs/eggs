var show = function(key,val,element){
  var show = val ? '' : 'none';
  console.log(show);
  element.css('display',show);
};

show.requiredMethods = ['css'];

module.exports = show;
