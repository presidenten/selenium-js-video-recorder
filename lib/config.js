
module.exports = {
  // Where to save screenshots
  rawPath: 'rawSeleniumVideoGrabs',

  // Save raw files after videos are rendered
  saveRaw: false,

  // Should an allure report be updated with videos
  // There is a bug, or just bad design really, where
  // Allure is needed to make sure the videos have 
  // time to be saved before the process exits
  usingAllure: true,

  // Should all videos be saved, or only from failed tests
  saveAllVideos: false,

  // Which commands should result in a screenshot 
  // Selected from: 
  jsonWireActions: [
    // https://webdriver.io/docs/api.html
    'click',
    'switchWindow',
    'scrollIntoView',
    'touchAction',
    // https://webdriver.io/docs/api/jsonwp.html
    'navigateTo',
    'back',
    'forward',
    'refresh',
    'closeWindow',
    'setWindowPosition',
    'setWindowSize',
    'maximizeWindow',
    'elementClick',
    'elementSubmit',
    'elementClear',
    'elementSendKeys',
    'sendKeys',
    'dismissAlert',
    'acceptAlert',
    'sendAlertText',
    'setOrientation',
    'moveToElement',
    'buttonDown',
    'buttonUp',
    'positionClick',
    'positionDoubleClick',
    'touchClick',
    'touchDown',
    'touchUp',
    'touchMove',
    'touchScroll',
    'touchDoubleClick',
    'touchLongClick',
    'touchFlick',
    'setGeoLocation',
    // https://webdriver.io/docs/api/mjsonwp.html
    'touchPerform',
    'multiTouchPerform',
    // https://webdriver.io/docs/api/appium.html
    'shake',
    'lock',
    'unlock',
    'pressKeyCode',
    'longPressKeyCode',
    'sendKeyEvent',
    'rotateDevice',
    'installApp',
    'removeApp',
    'hideKeyboard',
    'pushFile',
    'pullFile',
    'pullFolder',
    'toggleAirplaneMode',
    'toggleData',
    'toggleWiFi',
    'toggleLocationServices',
    'openNotifications',
    'startActivity',
    'touchId',
    'toggleEnrollTouchId',
    'launchApp',
    'closeApp',
    'reset',
    'background',
    'endCoverage',
    'setValueImmediate',
    'replaceValue',
    'updateSettings',
    'gsmCall',
    'gsmSignal',
    'gsmVoice',
    'sendSms',
    'fingerPrint',
    'touchPerform',
    'multiTouchPerform',
  ],
};
