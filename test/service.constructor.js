'use strict';

const Service = require('../lib').Service;
const assert = require('assert');
const sinon = require('sinon');


const fakeServiceDefinition = {
  name: 'foo',
  start: () => {}
};

describe('Service constructor', function() {
  let instance;
  beforeEach(function() {
    instance = new Service(fakeServiceDefinition);
  });

  it('should check the service definition parameter is a service definition', function() {
    const mockedChecks = {
      assertIsAServiceDefinition: sinon.spy()
    };
    const MockedService = require('../lib/service')(mockedChecks);
    new MockedService(fakeServiceDefinition);
    assert.ok(mockedChecks.assertIsAServiceDefinition.called, 'checking function not called');
  });

  it('should be instantiable', function() {
    const instance = new Service(fakeServiceDefinition);
    assert.ok(instance instanceof Service);
  });

  it('should create a name property', function() {
    assert.strictEqual(instance.name, fakeServiceDefinition.name, 'name differs from service definition');
  });

  it('should create a private definition property', function() {
    assert.strictEqual(instance._definition, fakeServiceDefinition, '_definition is not the service definition');
  });
});
