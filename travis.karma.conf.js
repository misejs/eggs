module.exports = function(config) {
  // inherit the local config
  require('./saucelabs.karma.conf.js')(config);
  // override necessary stuff
  config.set({
    sauceLabs : {
      verbose : true,
      verboseDebugging : true,
      recordScreenshots: false,
      testName : 'eggs',
      tunnelIdentifier : process.env.TRAVIS_JOB_NUMBER,
      build : process.env.TRAVIS_BUILD_NUMBER
    }
  });

  console.log(config);
};
