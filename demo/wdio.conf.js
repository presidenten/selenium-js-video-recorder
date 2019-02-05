const videoRecorder = require('../index.js');
require('@babel/register')({
  presets: [[
    '@babel/preset-env',
    { targets: { node: 10 } },
  ]],
  babelrc: false,
});

const rec = videoRecorder.getHooks({
  saveAllVideos: false,        // If true, also saves videos for successful test cases
  videoSlowdownMultiplier: 2,  // Higher to get slower videos, lower for faster videos [Value 1-100]
});

const config = {
  // Setup the browser window
  before: function (capabilities, specs) {
    browser.setWindowPosition(0, 0);
    browser.setWindowSize(1320, 768);
  },
  // =============================
  // Hooks bound to video recorder
  // =============================
  beforeTest: function (test) {
    rec.beforeTest(browser, test, config);
  },
  afterCommand: function (commandName, args, result, error) {
    rec.afterCommand(browser, commandName, args, config);
  },
  afterTest: function (test) {
    rec.afterTest(browser, test, config);
  },
  onComplete: function(exitCode, config, capabilities) {
    rec.onComplete(config);
  },

  // ===============
  // Custom settings
  // ===============
  outputDir: './e2e/results/',
  reporters: [
    'concise',
    ['allure', {
      outputDir: './e2e/results/allure-raw/',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: true,  // Must be set to true   
    }],
  ],
  
  
  
  // ============
  // Capabilities
  // ============
  services: ['selenium-standalone'],
  capabilities: [{
    maxInstances: 1,
    browserName: 'chrome',
  }],
  
  
  
  
  // ==================
  // Some nice defaults
  // ==================
  specs: [
    './specs/**/*.e2e.js',
  ],
  deprecationWarnings: true,
  maxInstances: 10,
  sync: true,
  logLevel: 'info',
  coloredLogs: true,
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 100000,
    expectationResultHandler: function(passed, assertion) {
    }
  },
};

module.exports = {
  config,
};

