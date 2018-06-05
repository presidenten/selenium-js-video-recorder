Selenium-js-video-recorder
==========================

This is an easy way to get video recordings of your javascript selenium testcases.


This library binds to a couple of webdriver hooks to take screenshots after each command has executed,
then uses `ffmpeg` to stitch these together to one mp4-movie per test case.

It also contains a helper that cleans up allure reports and adds videos to the testcases as attachments.


Pros:
- Easy setup, no vnc needed
- Works with selenium grid
- Works with all webdrivers that support saveScreenshot

Cons:
- Makes the tests a bit slower
- Allure reports looks really messy without cleaning
  (The library cleans allure reports by default)


Checkout the demo `wdio.conf.js` to see how the hooks are set up.
