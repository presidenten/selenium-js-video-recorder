
describe('User interactions', () => {
  beforeEach(() => {
    browser.url('http://www.seleniumeasy.com/test/');
  });

  it('should be able edit input', () => {
    browser.click('body #btn_basic_example');

    browser.waitForExist('.list-group .list-group-item');
    browser.pause(300);
    browser.click('.list-group .list-group-item');

    browser.waitForExist('body #get-input');
    browser.setValue('body #get-input input', 'Presidenten');
    browser.click('body #get-input button');

    let name = $('body #user-message #display').getText();

    expect(name).toBe('Presidenten');
  });


  it('should be able to move slider', () => {
    browser.click('body #btn_basic_example');

    browser.waitForExist('.list-group .list-group-item');
    browser.pause(300);
    browser.click('body #advanced_example');
    browser.waitForExist('.list-group .list-group-item');
    browser.pause(300);

    browser.click('.list-group-item[href^="./drag-drop-range"]');

    browser.waitForExist('body #slider1');
    browser.pause(300);

    const sliderPos = browser.getLocation('body #slider1 input');

    browser.leftClick('body #slider1 input', 10, 10);
    browser.leftClick('body #slider1 input', 100, 10);

    let range = $('body #slider1 #range').getText();
    expect(range).toBe(30);
  });


  it('should be able to multi-select in dropdown', () => {
    browser.click('body #btn_basic_example');

    browser.waitForExist('.list-group .list-group-item');
    browser.pause(300);
    browser.click('.list-group-item[href^="./basic-select-dropdown"]');

    browser.waitForExist('body #multi-select');
    browser.pause(300);

    const modifierKey = process.platform == 'darwin' ? 'Meta' : 'Control';
    browser.keys(modifierKey);
    browser.click('body #multi-select option[value="Florida"]');
    browser.click('body #multi-select option[value="Ohio"]');
    browser.click('body #multi-select option[value="Texas"]');

    browser.click('body #printAll');

    const values = $('.getall-selected').getText();

    expect(values.includes('Florida')).toBe(true);
    expect(values.includes('Ohio')).toBe(true);
    expect(values.includes('Texas')).toBe(true);
  });

});


describe('Library bug fixes (these should pass)', () => {
  beforeEach(() => {
    browser.url('http://www.seleniumeasy.com/test/');
  });

  it('should handle modals blocking screenshots', () => {
    browser.url('https://www.seleniumeasy.com/test/javascript-alert-box-demo.html');

    browser.click('button.btn.btn-default');
    browser.alertAccept();
    browser.click('button.btn.btn-default.btn-lg');
    browser.alertAccept();
   });
});