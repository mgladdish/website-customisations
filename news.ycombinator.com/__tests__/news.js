const common = require('./helpers/common');

describe('https://news.ycombinator.com/news', () => {

  let newHomepage = null;

  beforeAll(async() => {
    newHomepage = await browser.newPage();
    await common.loadWithAndWithoutUserscript(newHomepage, page, 'resources/news.html');
  });

  it('should make item titles more readable', async() => {
    const oldFontSize = await common.getCssProperty(page, '.titleline', 'font-size');
    expect(oldFontSize).toMatch('13.3333px');
    const newFontSize = await common.getCssProperty(newHomepage, '.titleline', 'font-size');
    expect(newFontSize).toMatch('16px');
  })

  it('should make the orange top menu full width', async() => {
    const windowWidth = await page.evaluate(() => window.outerWidth);
    const oldMenuWidth = await common.getCssProperty(page, '#hnmain', 'width');
    const newMenuWidth = await common.getCssProperty(newHomepage, '#hnmain', 'width');

    expect(oldMenuWidth).not.toMatch(newMenuWidth);
    expect(newMenuWidth).toMatch(`${windowWidth}px`);
  })

  it('should hide numbers from item titles', async() => {
    const oldNumberVisibility = await common.getCssProperty(page, '.rank', 'display');
    const newNumberVisibility = await common.getCssProperty(newHomepage, '.rank', 'display');

    expect(oldNumberVisibility).toMatch('inline');
    expect(newNumberVisibility).toMatch('none');
  })

  it('should make item subheading more readable', async() => {
    const oldSubheadingFontSize = await common.getCssProperty(page, '.subline', 'font-size');
    const newSubheadingFontSize = await common.getCssProperty(newHomepage, '.subline', 'font-size');

    expect(oldSubheadingFontSize).toMatch('9.33333px');
    expect(newSubheadingFontSize).toMatch('12px');
  })
});