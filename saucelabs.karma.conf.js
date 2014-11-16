var browsers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '35'
  },
  'SL_Firefox': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '26'
  },
  'SL_Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  'SL_IE_9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  'SL_IE_10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

module.exports = function(config) {
  // inherit the local config
  require('./local.karma.conf.js')(config);
  // override necessary stuff
  config.set({
    sauceLabs : {
      recordScreenshots: false,
      testName : 'eggs',
    },
    singleRun : true,
    autoWatch : false,
    reporters: ['saucelabs', 'spec'],
    browsers: Object.keys(browsers),
    customLaunchers: browsers
  });
};
