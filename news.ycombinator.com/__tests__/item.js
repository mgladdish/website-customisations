const common = require("./helpers/common");

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
    });

    it('should stop downvoted comments from being greyed out and hard to read', async () => {
        let selector = "[id='34011085'] .commtext";
        const oldDownvotedComment = await common.getCssProperty(page, selector, 'color');
        const newDownvotedComment = await common.getCssProperty(newItempage, selector, 'color');
        expect(oldDownvotedComment).toMatch('rgb(136, 136, 136)');
        expect(newDownvotedComment).toMatch('rgb(0, 0, 0)');

        const backgroundColour = await common.getCssProperty(newItempage, "[id='34011085'] .downvoted", 'background-color');
        expect(backgroundColour).toMatch('rgb(245, 245, 245)');
        const backgroundRadius = await common.getCssProperty(newItempage, "[id='34011085'] .downvoted", 'border-radius');
        expect(backgroundRadius).toMatch('3px');
    })

    it('should add a rounded orange border to input elements', async () => {

    })
})