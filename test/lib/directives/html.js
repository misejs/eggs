var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs html directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div id="content"><div e-html="html"></div>');
    function VM(){
      this.html = '<a href="http://prixfixeapp.com"></a>';
    };
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should set the html of the div with the directive',function(){
    assert.equal('<div e-html="html"><a href="http://prixfixeapp.com"></a></div>',$('#content').html());
  });

});
