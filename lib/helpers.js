const helpers = {

  generateFilename(browser, test) {
    const { browserName } = browser.capabilities;
    
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
    ).replace(/%../, '.')
     .replace(/[\(|\)]/g, '')
     .replace(/[\<|\>]/g, '')
     .replace(/[\[|\]]/g, '');
    
    return filename;
  },

};

module.exports = helpers;
