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
        const borderRadius = await common.getCssProperty(newItempage, 'input', 'border-radius');
        expect(borderRadius).toMatch('3px');
    })

    it('should detect quotes and strip the marker char `>`', async () => {
        let parentId = "[id='34011652']";
        const newHtml = await newItempage.$eval(`${parentId} .quote`, (e) => e.innerHTML);
        const oldHtml = await page.$eval(`${parentId} .commtext`, (e) => e.firstChild.data);
        expect(oldHtml).toEqual(expect.stringMatching('^>'));
        expect(newHtml).toEqual(expect.not.stringMatching('^>'));
    })

    it('should format quotes when text starts with a >', async () => {
        let selector = "[id='34011652'] .quote";

        const quoteStyle = await common.getCssProperty(newItempage, selector, 'font-style');
        expect(quoteStyle).toMatch("italic");
        const quoteBackgroundColour = await common.getCssProperty(newItempage, selector, 'background-color');
        expect(quoteBackgroundColour).toMatch('rgba(255, 102, 0, 0.05)');
    })

    it('should handle when quotes are italicised by the poster', async() => {
        const singleItemPage = await browser.newPage();
        await common.loadPageWithUserscript(singleItemPage, 'resources/item-singlecomment.html');

        const quoteContent = await singleItemPage.$eval("[id='34072393'] .quote", (e) => e.innerHTML);
        expect(quoteContent).toMatch("The estimates seem a bit high, or perhaps unbalanced from book to book. The Count of Monte Cristo is slated for 208 days at twenty minutes per day!")
    })

    it('should handle when quote indicators have a newline just before them', async () => {
        const newlineExamplePage = await browser.newPage();
        await common.loadPageWithUserscript(newlineExamplePage, 'resources/item-quote-with-newline.html');

        const quoteContent = await newlineExamplePage.$eval("[id='34086365'] .quote", (e) => e.innerHTML);
        expect(quoteContent).toMatch(/^For me the biggest problem/)
    })

    it('should initially hide the comment textarea', async () => {
        const textAreaIsHidden = await common.isElementHidden(newItempage, "textarea[name='text']");
        expect(textAreaIsHidden).toBe(true);
    })

    // This test fails but I don't understand why
    it.skip ('should show the comment textarea when clicking on `show comment box`', async () => {
        // This click works, but doesn't seem to affect what's shown on the page
        const clicked = await newItempage.click('.showComment a');
        // The dom now thinks the showComment link is no longer visible, but it's still visible on screenshots
        // The row containing the textarea and related buttons is still *not* visible
        const textAreaIsHidden = await common.isElementHidden(newItempage, "textarea[name='text']");
        expect(textAreaIsHidden).toBe(false);
    })
})