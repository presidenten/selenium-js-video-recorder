
describe('User interactions', () => {
  beforeEach(() => {
    browser.url('http://www.seleniumeasy.com/test/');
    $('body #btn_basic_example').click();
  });
  
  it('should be able edit input', () => {
    $('.list-group .list-group-item').click();

    $('body #get-input input').setValue('Presidenten');
    $('body #get-input button').click();

    const name = $('body #user-message #display').getText();
    
    $('body #user-message #display').scrollIntoView();
    expect(name).toBe('Presidenten');
  });


  it('should be able to move slider (fails by design to make video)', () => {
    $('body #advanced_example').click();
    $('.list-group-item[href^="./drag-drop-range"]').click();

    $('body #slider1 input').moveTo(10, 10);
    browser.positionClick();
    $('body #slider1 input').moveTo(100, 10);
    browser.positionClick();

    const range = $('body #slider1 #range').getText();
    expect(range).toBe(30);
  });


  it('should be able to multi-select in dropdown (fails by design to make video)', () => {
    $('.list-group-item[href^="./basic-select-dropdown"]').click();

    const modifierKey = process.platform == 'darwin' ? 'Meta' : 'Control';
    browser.keys(modifierKey);
    $('body #multi-select option[value="Florida"]').click();
    $('body #multi-select option[value="Ohio"]').click();
    $('body #multi-select option[value="Texas"]').click();

    $('body #printAll').click();

    $('body #printAll').scrollIntoView();
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

    $('button.btn.btn-default').click();
    browser.acceptAlert();
    $('button.btn.btn-default.btn-lg').click();
    browser.acceptAlert();
   });
});