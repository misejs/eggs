var assert = require('assert');

var path = require('path');
var request = require('supertest');
var express = require('express');
var eggs = require('../../lib/eggs');
var utils = require('../utils');

describe.only('eggs view engine',function(){

  var app;
  var server;

  before(function(ready){
    app = express();
    app.engine('html',eggs.__express);
    app.set('views',path.join(__dirname,'../fixtures/views'));
    app.set('view engine','html');

    app.get('/',function(req,res){
      res.render('index');
    });

    server = app.listen(3333,ready);
  });

  after(function(){
    server.close();
  });

  describe('GET /', function(){
    it('should respond 200 with a valid view', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });

});
