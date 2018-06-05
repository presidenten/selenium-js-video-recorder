const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;

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
    const outPath = path.resolve(outputDir, browser.globals.videoFilename);

    if (config.saveAllVideos || !test.passed) {
      exec(`ffmpeg -r 10 -i ${dirPath}/%04d.png -vcodec libx264 -crf 32 -vf fps=10 -pix_fmt yuv420p ${outPath}.mp4`);
      //exec(`ffmpeg -r 10 -i ${dirPath}/%04d.png -vcodec libx264 -crf 24 -vf fps=10 -pix_fmt yuv420p -vf scale="1200:trunc(ow/a/2)*2" ${outPath}.mp4`);
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
  getHooks({ usingAllure=true, saveAllVideos=false }) {
    config.usingAllure = usingAllure;
    config.saveAllVideos = saveAllVideos;

    return recorder;
  },
};
