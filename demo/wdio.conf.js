const videoRecorder = require('../index.js');

const rec = videoRecorder.getHooks({
  usingAllure: true,     // Update Allurereport with videos
  saveAllVideos: false,  // If true, also saves videos for successful test cases
  removeSteps: true,     // Remove all steps, and only save video
});

const config = {
  before: function (capabilities, specs) {
    // Setup the browser window
    browser.windowHandlePosition({x: 0, y: 0});
    browser.windowHandleSize({width: 1320, height: 768});
  },
  // =============================
  // Hooks bound to video recorder
  // =============================
  beforeTest: function (test) {
    rec.beforeTest(browser, test, config.outputDir);
  },
  afterCommand: function (commandName, args, result, error) {
    rec.afterCommand(browser, config.outputDir);
  },
  afterTest: function (test) {
    rec.afterTest(browser, test, config.outputDir);
  },
  onComplete: function(exitCode, config, capabilities) {
    rec.onComplete(config);
  },

  // ============
  // Capabilities
  // ============
  capabilities: [{
      maxInstances: 1,
      browserName: 'chrome',
  }],


  // ===============
  // Custom settings
  // ===============
  // host: 'localhost',                         // Selenium host url (uncomment for use with Selenoid)
  services: ['selenium-standalone'],            // Run selenium through service (comment for use with Selenoid)
  specs: [
    './specs/**/*.e2e.js',
  ],
  outputDir: './e2e/results/',                  // Output dir for the report
  reporters: ['dot', 'allure'],
  reporterOptions: {
    allure: {
      outputDir: './e2e/results/allure-raw/',   // Output dir for raw report
    },
  },


  // ==================
  // Some nice defaults
  // ==================
  deprecationWarnings: false,
  maxInstances: 10,
  sync: true,
  logLevel: 'silent',
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

require("babel-core/register")({
  presets: ['es2015']
});

