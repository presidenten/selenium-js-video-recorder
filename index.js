const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const helpers = require('./lib/helpers.js');
const config = require('./lib/config.js');
const allure = require('./lib/allure.js');
const notAvailableImage = require('./lib/not-available-img.js');

const recorder = {
  /**
   * Setup filename based on test name and prepare storage directory
   */
  beforeTest(browser, test, wdioConfig) {
    browser.globals = browser.globals || {};
    browser.globals.videoFilename = helpers.generateFilename(browser, test);
    browser.globals.currentFrameNr = 0;
    const recordingPath = path.resolve(wdioConfig.outputDir, config.rawPath, browser.globals.videoFilename);
    mkdirp.sync(recordingPath);
  },
  
  /**
   * Save screenshot or add not available image movie stills
   */
  afterCommand(browser, commandName, args, wdioConfig) {
    // Filter out non-action commands and keep only last action command
    if (!config.VIPjsonWireActions.includes(commandName) && (!config.jsonWireActions.includes(commandName) || args.length > 0)) {
      return;
    }
    const dirname = browser.globals.videoFilename;
    const dirPath = path.resolve(wdioConfig.outputDir, config.rawPath, dirname);
    const filename = browser.globals.currentFrameNr.toString().padStart(4, '0') + '.png';
    const filePath = path.resolve(dirPath, filename)

    try {
      browser.saveScreenshot(filePath);
    } catch (e) {
      fs.writeFile(filePath, notAvailableImage, 'base64');
    }
    browser.globals.currentFrameNr++;
  },

  /**
   * Add attachment to Allue if applicable and start to generate the video
   */
  afterTest(browser, test, wdioConfig) {
    if (config.usingAllure && (!test.passed || config.saveAllVideos)) {
      allure.addVideoAttachment(browser, test, wdioConfig.outputDir);
    }
    const dirname = browser.globals.videoFilename;
    const dirPath = path.resolve(wdioConfig.outputDir, config.rawPath, dirname);
    const outPath = path.resolve(wdioConfig.outputDir);

    if (config.saveAllVideos || !test.passed) {
      const command = `docker container run --rm -d -v ${dirPath}:/in -v ${outPath}:/out -e VIDEONAME=${browser.globals.videoFilename} -e SLOWDOWN=${config.videoSlowdownMultiplier} presidenten/ffmpeg-pngs-to-mp4:1.1.0-ffmpeg4.0`;
      spawn(command, {
        stdio: 'ignore',
        shell: true,
      });
    }
  },

  /**ss
   * Finalize report if using allure and clean up
   */
  onComplete(wdioConfig, shortenSeleniumUrls) {
    if (config.usingAllure) {
      allure.finalizeReport(wdioConfig, shortenSeleniumUrls);
    }
    if (!config.saveRaw) {
      fs.removeSync(path.resolve(wdioConfig.outputDir, config.rawPath));
    }
  },
};


module.exports = {
  getHooks({
    usingAllure = config.usingAllure,
    saveAllVideos = config.saveAllVideos,
    saveRaw = config.saveRaw,
    videoSlowdownMultiplier = config.videoSlowdownMultiplier,
    moreVIPjsonWireActions = config.VIPjsonWireActions,
    moreJsonWireActions = config.jsonWireActions,
  }) {
    config.usingAllure = usingAllure;
    config.saveAllVideos = saveAllVideos;
    config.saveRaw = saveRaw;
    config.videoSlowdownMultiplier = videoSlowdownMultiplier;
    config.VIPjsonWireActions.push(...moreVIPjsonWireActions);
    config.jsonWireActions.push(...moreJsonWireActions);

    return recorder;
  },
};
