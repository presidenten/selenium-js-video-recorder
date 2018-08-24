const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const config = require('./lib/config.js');
const allure = require('./lib/allure.js');

const generateFilename = (browser, test) => {
  const { browserName } = browser.desiredCapabilities;

  const timestamp = new Date().toLocaleString('iso', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/[ ]/g, '--').replace(':', '-');

  const filename = encodeURIComponent(
    `${
      test.fullName.replace(/\s+/g, '-')
    }-${browserName}-${timestamp}`.replace(/[/]/g, '__')
  ).replace(/%../, '.');

  return filename;
};

const recorder = {
  beforeTest(browser, test, outputDir) {
    browser.globals = browser.globals || {};
    browser.globals.videoFilename = generateFilename(browser, test);
    browser.globals.currentFrameNr = 0;
    const recordingPath = path.resolve(outputDir, config.rawPath, browser.globals.videoFilename);
    mkdirp.sync(recordingPath);
  },

  afterCommand(browser, outputDir) {
    const dirname = browser.globals.videoFilename;
    const dirPath = path.resolve(outputDir, config.rawPath, dirname);
    const filename = browser.globals.currentFrameNr.toString().padStart(4, '0') + '.png';
    const filePath = path.resolve(dirPath, filename);
    browser.saveScreenshot(filePath);
    browser.globals.currentFrameNr++;
  },

  afterTest(browser, test, outputDir) {
    if (config.usingAllure && (!test.passed || config.saveAllVideos)) {
      allure.addVideoAttachment(browser, test, outputDir);
    }
    const dirname = browser.globals.videoFilename;
    const dirPath = path.resolve(outputDir, config.rawPath, dirname);
    const outPath = path.resolve(outputDir);

    if (config.saveAllVideos || !test.passed) {
      const command = `docker container run --rm -d -v ${dirPath}:/in -v ${outPath}:/out -e VIDEONAME=${browser.globals.videoFilename} presidenten/ffmpeg-pngs-to-mp4:1.0.0-ffmpeg4.0`;
      spawn(command, {
        stdio: 'ignore',
        shell: true,
      });
    }
  },

  /**
   * Finalize report if using allure
   * Close all video recorders
   */
  onComplete(wdioConfig, shortenSeleniumUrls) {
    if (config.usingAllure) {
      allure.finalizeReport(wdioConfig, shortenSeleniumUrls);
    }
    fs.removeSync(path.resolve(wdioConfig.outputDir, config.rawPath));
  },
};


module.exports = {
  getHooks({ usingAllure=true, saveAllVideos=false, removeSteps=false }) {
    config.usingAllure = usingAllure;
    config.saveAllVideos = saveAllVideos;
    config.removeSteps = removeSteps;

    return recorder;
  },
};
