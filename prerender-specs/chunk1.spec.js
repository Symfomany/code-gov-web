const { browser } =require('protractor');
const { writeFileSync } =require('fs');

describe('page', () => {
  it('should have stuff', () => {
    browser.get('/');
    browser.getPageSource()
      .then(source => {
        console.log('source', source)
        writeFileSync('./pre-rendered.html', source);
      })
  });
});