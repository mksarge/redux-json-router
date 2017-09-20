// Enzyme/Mocha setup: https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md

require('babel-register')();
var JSDOM = require('jsdom').JSDOM;

var jsdom = new JSDOM('<!doctype html><html><body></body></html>');
var window = jsdom.window;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === 'undefined')
    .map((prop) => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.navigator = { userAgent: 'node.js' };

copyProps(window, global);
