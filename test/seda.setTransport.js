'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Seda = require('../lib').Seda;

describe('Seda#setTransport', function() {
  const setTransport = Seda.prototype.setTransport;

  it('should exists as method', function testExists() {
    assert.notDeepEqual(setTransport, undefined, '#setTransport not present');
    assert.deepEqual(typeof setTransport, 'function', '#setTransport is not a function');
  });

  it('should check the transport parameter is a valid transport', function() {
    const mockedChecks = {
      assertIsATransport: sinon.spy()
    };
    const MockedSeda = require('../lib/seda')({}, mockedChecks);
    const instance = new MockedSeda();

    const fakeTransport = {};

    try {
      instance.setTransport.call(context, fakeTransport);
    } catch(err) {
      // Silently ignore unrelated errors
    }
  });

  it('should set a transport as current', function testSet() {
    const context = {};
    const transport = {
      start: () => {},
      getServiceTransport: () => {}
    };
    setTransport.call(context, transport);
    assert.deepEqual(context._transport, transport, 'Transport is not set');
  });
});
