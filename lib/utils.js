const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function docufy(text) {
    var dom = new JSDOM(text);
    return dom.window.document;
}

module.exports = {
    docufy
};
