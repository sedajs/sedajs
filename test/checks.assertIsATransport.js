'use strict';

const assertIsATransport = require('../lib/checks').assertIsATransport;
const assert = require('assert');

describe('checks#assertIsATransport', function() {
  it('should require the transport as parameter', function() {
    assert.throws(() => {
      assertIsATransport();
    }, /Missing required parameter/);
  });

  it('should require the property "start" in transport', function() {
    const transport = {};

    assert.throws(() => {
      assertIsATransport(transport);
    }, /Missing required transport \"start\" method/);
  });

  it('should fail if the property "start" is not a method', function() {
    const transport = {
      start: []
    };

    assert.throws(() => {
      assertIsATransport(transport);
    }, /Transport \"start\" property should be a function/);
  });

  it('should require the property "getServiceTransport" in transport', function() {
    const transport = {
      start: () => {}
    };

    assert.throws(() => {
      assertIsATransport(transport);
    }, /Missing required transport \"getServiceTransport\" method/);
  });

  it('should fail if the property "getServiceTransport" is not a method', function() {
    const transport = {
      start: () => {},
      getServiceTransport: []
    };

    assert.throws(() => {
      assertIsATransport(transport);
    }, /Transport \"getServiceTransport\" property should be a function/);
  });
});
