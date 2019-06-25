/* global describe, it */
"use strict";

describe("popman", function() {
  it("renders popover on body");
  it("repositions popover when window is resized");
  it("maintains correct position when document is scrolled");

  it(
    "positions popover to the left if it would otherwise overflow left of viewport"
  );
  it(
    "positions popover to the right if it would otherwise overflow right of viewport"
  );
  it(
    "positions popover to the top if it would otherwise overflow top of viewport"
  );
  it(
    "positions popover to the bottom if it would otherwise overflow bottom of viewport"
  );

  describe("prop: open", function() {
    it("shows popover set to true");
    it("hides popover set to false");
  });

  describe("prop: position", function() {
    it("sets the default position");
    it("overflows if forcePosition is set to true");
  });

  describe("prop: className", function() {
    it("uses className over .Popover");
  });

  describe("prop: children", function() {
    it("renders children in place of popover component");
  });

  describe("prop: around", function() {
    it("positions popover around provided react component");

    it("positions popover top left of provided react component");
    it("positions popover top right of provided react component");
    it("positions popover top center of provided react component");

    it("positions popover bottom left of provided react component");
    it("positions popover bottom right of provided react component");
    it("positions popover bottom center of provided react component");

    it("positions popover center left of provided react component");
    it("positions popover center right of provided react component");
    it("positions popover center center of provided react component");
  });

  describe("prop: constrainTo: scrollParent", function() {
    it("throws an error if set to anything other than scrollParent");
    it("constrains x to scrollParent if constrainX is set");
    it("constrains y to scrollParent if constrainY is set");
  });
});
