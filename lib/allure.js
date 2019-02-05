const reporter = require('@wdio/allure-reporter').default;

const path = require('path');
const fs = require('fs-extra');
const sleep = require('system-sleep');

const config = require('./config.js');

const allure = {
  /**
   * Add mp4 attachment to Allure report with fake mp4
   */
  addVideoAttachment(browser, test, outputDir) {
    if (!test.passed || config.saveAllVideos) {
      const filename = browser.globals.videoFilename;
      const videoPath = path.resolve(outputDir, filename + '.mp4');
      reporter.addAttachment('Execution video', videoPath, 'video/mp4');
    }
  },

  /**
   * Wait until videos are ready
   * Add actual video to Allure
   */
  finalizeReport(wdioConfig, shortenSeleniumUrls=true) {
    allureReportDir = path.resolve(wdioConfig.outputDir, 'allure-raw');

    fs
      .readdirSync(allureReportDir)
      .filter(line=>line.includes('.mp4'))
      .map(filename => allureReportDir + '/' + filename)
      .forEach((filepath) => {
        const videoFilePath = fs.readFileSync(filepath).toString(); // Contents of placeholder file is real video path

        do {
          sleep(100);
        } while (!fs.existsSync(videoFilePath));

        // Wait for video files to render
        let fileStats = fs.statSync(videoFilePath);
        let lastSize = 0;
        let videoIsReady = false;
        do {
          fileStats = fs.statSync(videoFilePath);
          videoIsReady = fileStats.size > 48 && lastSize === fileStats.size;
          lastSize = fileStats.size > 48 ? fileStats.size : 0;
          sleep(100);
        } while (fileStats.size === 48 || !videoIsReady);

        fs.copySync(videoFilePath, filepath);
      });
  },
}

module.exports = allure;
