
DEPRECATED
==========

Please use https://github.com/presidenten/wdio-video-reporter

Easier to use and solves a few issues.



Selenium-js-video-recorder
==========================

This is an easy way to get video recordings of your javascript selenium testcases.


This library binds to a couple of webdriver hooks to take screenshots after each command has executed,
then uses `ffmpeg` to stitch these together to one mp4-movie per test case.

It uses docker to run ffmpeg for multi-platform support

Pros:
- Nice videos in your allure reports. Yey.
- Works with selenium grid
- Works with all webdrivers that support saveScreenshot

Cons:
- Makes the tests a bit slower


Be sure to take a look at `demo/wdio.conf.js` to see how to get started.


Installation
============

Install docker
--------------
- Mac https://download.docker.com/mac/stable/Docker.dmg
- Win https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe
- Linux `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker $USER`

Sync wdio.conf.js 
-----------------
- Check `demo/wdio.conf.js` line 1-48 and sync to your own `wdioi.conf.js`
Or
- Clone the boilerplate and work from there https://github.com/presidenten/WebdriverIO-wdio-v5-boilerplate-with-videos-and-docker

