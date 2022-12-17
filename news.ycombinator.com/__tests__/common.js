const path = require('path');
const {injectTampermonkeyScript} = require("./common");


exports.injectTampermonkeyScript = async (page) => {
    const tampermonkeyScript = path.resolve(__dirname, '../tampermonkey.js');
    await page.addScriptTag({path: tampermonkeyScript});
    await page.evaluate(() => tampermonkeyScript());
};

exports.getCssProperty = (page, query, propertyName) => {
    return page.$eval(query, (el, pn) => {
        return getComputedStyle(el).getPropertyValue(pn)
    }, propertyName);
}

exports.loadWithAndWithoutUserscript = async (pageWithScript, pageWithoutScript, htmlFilenameToLoad) => {
    const htmlFilename = path.resolve(__dirname, htmlFilenameToLoad);
    await pageWithScript.goto(`file://${htmlFilename}`);
    await pageWithoutScript.goto(`file://${htmlFilename}`);

    await this.injectTampermonkeyScript(pageWithScript);
}