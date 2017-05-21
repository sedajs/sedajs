'use strict';

const Seda = require('../lib').Seda;
const assert = require('assert');
const sinon = require('sinon');

const fakeServiceDefinition = {
  name: 'foo',
  start: () => {}
};

describe('Seda#addService', function() {
  let instance;
  beforeEach(function() {
    instance = new Seda();
  });

  it('should have an addService method', function() {
    assert.notStrictEqual(instance.addService, undefined, '#addService not present');
    assert.strictEqual(typeof instance.addService, 'function', '#addService is not a function');
  });

  it('should check the service definition parameter is a service definition', function() {
    const mockedChecks = {
      assertIsAServiceDefinition: sinon.spy()
    };
    const MockedSeda = require('../lib/seda')({}, mockedChecks);
    const instance = new MockedSeda();

    try {
      instance.addService.call(context, fakeServiceDefinition);
    } catch(err) {
      // Silently ignore unrelated errors
    }

    assert.ok(mockedChecks.assertIsAServiceDefinition.called, 'checking function not called');
  });

  it('should register the service internally', function() {
    instance.addService(fakeServiceDefinition);
    assert.strictEqual(Object.keys(instance._services).length, 1, 'Number of services is not 1');
    assert.notStrictEqual(instance._services.foo, undefined, 'Services does not have a property with the service name');
  });

  it('should not allow adding two services with the same name', function() {
    instance._services['foo'] = {};

    assert.throws(() => {
      instance.addService(fakeServiceDefinition);
    }, /Service \"foo\" already added/);
  });

  it('should create a service from the service definition', function() {
    const ServiceFake = function() {};
    const MockedSeda = require('../lib/seda')(ServiceFake, require('../lib/checks'));
    const instance = new MockedSeda();

    instance.addService(fakeServiceDefinition)
    assert(instance._services['foo'] instanceof ServiceFake, 'It is not an instance of Service')
  });

});
