'use strict';

const Seda = require('../lib').Seda;
let Service = require('../lib').Service;
const assert = require('assert');
const sinon = require('sinon');

describe('Seda#start', function() {
  let instance;
  let fakeTransport;
  beforeEach(function() {
    instance = new Seda();
    fakeTransport = {
      start: sinon.stub().returns(Promise.resolve()),
      getServiceTransport: () => {}
    };
    instance.setTransport(fakeTransport);
  });

  it('should exists as method', function() {
    assert.notDeepEqual(instance.start, undefined, 'not present');
    assert.deepEqual(typeof instance.start, 'function', 'it is not a function');
  });

  it('should return a promise', function() {
    const value = instance.start();
    assert.ok(value instanceof Promise, 'returned something else');
  });

  it('should fail if no transport established', async function() {
    instance = new Seda();
    try {
      await instance.start();
    } catch (err) {
      assert.strictEqual(err.message, 'Transport should be set before starting Seda', 'Unexpected error');
      return;
    }
    throw new Error('No error thrown');
  });

  it('should call the transport start function', async function() {
    await instance.start();
    assert.ok(fakeTransport.start.called, 'Function not called');
  });

  it('should call "_configureService" method for each service', async function() {
    const stub = sinon.stub().returns(Promise.resolve());
    instance._configureService = stub;

    const fakeService = {
      name: 'foo',
      start: () => {}
    };
    instance.addService(fakeService);
    await instance.start();
    assert.ok(stub.called, '"_configureService" method not called');
  });

});
