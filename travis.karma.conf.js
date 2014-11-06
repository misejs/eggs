module.exports = function(config) {
  // inherit the local config
  require('./saucelabs.karma.conf.js')(config);
  // override necessary stuff
  config.set({
    capabilities : {
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER
    }
  });
};
