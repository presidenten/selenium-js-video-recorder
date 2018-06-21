const reporter = require('wdio-allure-reporter');

const path = require('path');
const fs = require('fs-extra');
const sleep = require('sleep');

const config = require('./config.js');
const helpers = require('./helpers.js');

const homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

const allure = {
  addVideoAttachment(browser, test, outputDir) {
    if (!test.passed) {
      const filename = browser.globals.videoFilename;
      const videoPath = path.resolve(outputDir, filename + '.mp4');
      reporter.createAttachment('Execution video', videoPath, 'video/mp4');
    }
  },

  finalizeReport(wdioConfig, shortenSeleniumUrls=true) {
    allureReportDir = path.resolve(wdioConfig.outputDir, 'allure-raw');
    console.log('- Waiting for videos to render');


    fs
      .readdirSync(allureReportDir)
      .filter(line=>line.includes('.mp4'))
      .map(filename => allureReportDir + '/' + filename)
      .forEach((filepath) => {
        const videoFilePath = fs.readFileSync(filepath).toString(); // Contents of placeholder file is real video path
        const filename = videoFilePath.toString().match(/[^\/]*\.mp4$/)[0];

        // Wait for video files to render
        let fileStats = fs.statSync(videoFilePath);
        let lastSize = 0;
        let videoIsReady = false;
        do {
          fileStats = fs.statSync(videoFilePath);
          videoIsReady = fileStats.size > 48 && lastSize === fileStats.size;
          lastSize = fileStats.size > 48 ? fileStats.size : 0;
          sleep.msleep(100);
        } while (fileStats.size === 48 || !videoIsReady);

        fs.copySync(videoFilePath, filepath);
      });

    // Make report pretty by moving attachments from final step to test body
    fs
      .readdirSync(allureReportDir)
      .filter(line=>line.includes('.xml'))
      .map(filename => allureReportDir + '/' + filename)
      .forEach((filePath) => {
        let file = fs.readFileSync(filePath).toString();

        const homeDirRegExp = new RegExp(homePath, 'g');
        file = file.replace(homeDirRegExp, '~');

        if(shortenSeleniumUrls) {
          const captureActionRegexp = /\/wd\/hub.*(\/\w+<\/)/g;
          file = file.replace(captureActionRegexp, '$1');
        }

        const cleanUpNestedSteps = new RegExp('.*<step\\s.*\n.*\/screenshot(?:(?!video)[\\s|\\S|.])*?(?:<steps>|<\/step>)', 'gm');
        const cleanUpClosingTags = new RegExp('<\/step>\n.*<\/steps>', 'gm');

        file = file.replace(cleanUpNestedSteps, '').replace(cleanUpClosingTags, '');


        const faileStepToTestAttachmentsRegexp = new RegExp('.*<step\\s[^\/]*>(?:.*\n){2}.*<attachments>\n(?:.*\n)?.*(<attachment title=\'Execution.*?\/>)$(?:.*\n){1,2}.*<\/attachments>[\\s|\\S|.]*?<attachments\/>', 'gm');

        file = file.replace(faileStepToTestAttachmentsRegexp, '</steps>\n\t\t\t\t<attachments>$1</attachments>');
        fs.writeFileSync(filePath, file);
      });

    console.log('  [Done]\n\n');
  },
}

module.exports = allure;
