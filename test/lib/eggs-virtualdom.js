var assert = require('assert');
var $ = require('jquery');

var eggs = require('../../lib/eggs');
var utils = require('../utils');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var virtualize = require('../../lib/virtualize');

describe('eggs',function(){

  describe('patching', function() {
    var VM, e, vm, updated;

    before(function(ready) {
      $('body').append('<div id="content">\
        <ul id="ul" e-repeat="items">\
          <li>\
            <h3 e-text="key"></h3>\
          </li>\
        </ul>\
      </div>');

      VM = function(){
        this.items = [
          { key : 'item one' },
          { key : 'item two' },
          { key : 'item three' }
        ]
      };

      e = eggs({selector : '#content'}, VM);
      var modelUpdated = e._modelUpdated;
      e._modelUpdated = function(viewModel) {
        this._parseChildDirective(viewModel,null,this.rootNode);
        if(this.renderNode){
          var currentTree = virtualize.dom(this.renderNode);
          var patches = diff(currentTree,this.rootNode);
          if(updated) updated(patches, currentTree, this.rootNode);
        }
        ready();
      };
      vm = e.viewModel;
    });

    after(function() {
      $('#content').remove();
    });

    it('should only patch a subelement of an array of objects when changed', function(done) {
      updated = function(patches, currentTree, rootNode) {
        console.log(patches);
        assert.equal(patches.length, 1);
        done();
      };
      vm.items[1].key = 'testing';
    });

  });

});
