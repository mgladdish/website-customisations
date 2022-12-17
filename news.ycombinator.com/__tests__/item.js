const common = require("./common");

describe('https://news.ycombinator.com/item', () => {

    let newItempage = null;

    beforeAll(async() => {
        newItempage = await browser.newPage();
        await common.loadWithAndWithoutUserscript(newItempage, page, 'resources/item.html');
    });

    it('should make the linked article heading bigger', async () => {
        const oldFontSize = await common.getCssProperty(page, '.titleline', 'font-size');
        const newFontSize = await common.getCssProperty(newItempage, '.titleline', 'font-size');
        expect(oldFontSize).toMatch('13.3333px');
        expect(newFontSize).toMatch('19.2px');
    });

    it('should make the article subheading bigger', async () => {
        const oldFontSize = await common.getCssProperty(page, '.subline', 'font-size');
        const newFontSize = await common.getCssProperty(newItempage, '.subline', 'font-size');
        expect(oldFontSize).toMatch('9.33333px');
        expect(newFontSize).toMatch('12px');
    })
})