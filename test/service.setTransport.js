'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Service = require('../lib').Service;

describe('Service#setTransport', function() {
  const setTransport = Service.prototype.setTransport;

  it('should exists as method', function testExists() {
    assert.notDeepEqual(setTransport, undefined, '#setTransport not present');
    assert.deepEqual(typeof setTransport, 'function', '#setTransport is not a function');
  });

  it('should set a transport as current', function testSet() {
    const context = {};
    const transport = {};
    setTransport.call(context, transport);
    assert.deepEqual(context._transport, transport, 'Transport is not set');
  });
});
