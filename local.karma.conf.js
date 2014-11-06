module.exports = function(config) {
  config.set({
    logLevel: 'LOG_DEBUG',
    reporters: ['spec'],
    singleRun : true,
    autoWatch : false,
    frameworks: [
      'mocha',
      'browserify'
    ],
    files: [
      'test/lib/**/*.js'
    ],
    preprocessors: {
      'test/lib/**/*.js': ['browserify']
    },
    browserify: {
      debug: true
    },
    browsers: ['PhantomJS']
  });
};
