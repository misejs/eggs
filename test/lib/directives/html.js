var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs html directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div id="content"><div e-html="html"></div></div>'
    function VM(){
      this.html = '<a href="http://prixfixeapp.com"></a>';
    };
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should set the html of the div with the directive',function(){
    assert.equal('<div id="content"><div e-html="html"><a href="http://prixfixeapp.com"></a></div></div>',e.html());
  });

});
