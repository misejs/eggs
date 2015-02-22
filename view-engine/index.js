// eggs view engine setup
var async = require('async');
var fs = require('fs');
var eggs = require('../lib/eggs');

var render = function(filePath,options,html,callback){
  html = html.toString();
  // TODO: require viewmodels
  console.log(html);
  callback(null,html);
};

var engine = function (filePath, options, callback) {
  async.waterfall([
    fs.readFile.bind(fs,filePath,'utf8'),
    render.bind(this,filePath,options)
  ],callback);
};

module.exports = engine;
