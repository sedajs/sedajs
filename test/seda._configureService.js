'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Seda = require('../lib').Seda;
const Service = require('../lib').Service;

describe('Seda#_configureService', function() {
  let instance;
  let fakeServiceTransport;
  let fakeTransport;
  let fakeService;
  beforeEach(function() {
    instance = new Seda();

    fakeServiceTransport = {
      start: sinon.stub().returns(Promise.resolve())
    };
    fakeTransport = {
      start: sinon.stub().returns(Promise.resolve(fakeServiceTransport)),
      getServiceTransport: sinon.stub().returns(Promise.resolve(fakeServiceTransport))
    };
    instance.setTransport(fakeTransport);

    fakeService = {
      setTransport: sinon.stub().returns(Promise.resolve()),
      start: sinon.stub().returns(Promise.resolve())
    };
  });

  it('should exists as method', function() {
    assert.notDeepEqual(instance._configureService, undefined, 'not present');
    assert.deepEqual(typeof instance._configureService, 'function', 'it is not a function');
  });

  it('should return a promise', function() {
    let value = instance._configureService();

    assert.ok(value instanceof Promise, 'returned something else');

    // Silently ignore unrelated errors
    value.catch(() => {});
  });

  it('should call transport "getServiceTransport" method', async function() {
    await instance._configureService(fakeService);
    assert.ok(fakeTransport.getServiceTransport.called, 'transport.getServiceTransport not called');
  });

  it('should call service "setTransport" method', async function() {
    await instance._configureService(fakeService);
    assert.ok(fakeService.setTransport.called, 'service.setTransport not called');
  });

  it('should call service "start" method', async function() {
    await instance._configureService(fakeService);
    assert.ok(fakeService.start.called, 'service.start not called');
  });

  it('should call service transport "start" method', async function() {
    await instance._configureService(fakeService);
    assert.ok(fakeServiceTransport.start.called, 'ServiceTransport start method not called');
  });
});
