import { JSDOM } from "jsdom";

// Set up a DOM environment for tests
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
// Don't override navigator if it already exists (causes error in some Node versions)
if (!global.navigator) {
  global.navigator = dom.window.navigator;
}
global.HTMLElement = dom.window.HTMLElement;
global.SVGElement = dom.window.SVGElement;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
