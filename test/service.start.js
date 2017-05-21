'use strict';

const Service = require('../lib').Service;
const assert = require('assert');
const sinon = require('sinon');


const fakeServiceDefinition = {
  name: 'foo',
  start: () => {}
};

describe('Service#start()', function() {
  let instance;
  beforeEach(function() {
    instance = new Service(fakeServiceDefinition);
  });

  it('should exists as a function', function() {
    assert.ok(instance.start, 'property not found');
    assert.strictEqual(typeof instance.start, 'function', 'it is not a function');
  });

  it('should call the service definition start function', function() {
    const fakeServiceDefinition = {
      name: 'foo',
      start: sinon.stub().returns(Promise.resolve())
    }
    instance = new Service(fakeServiceDefinition);
    instance.start();
    assert.ok(fakeServiceDefinition.start.called, 'start not called');
  });

  it('should pass itself to the service defintion start function', function() {
    const fakeServiceDefinition = {
      name: 'foo',
      start: sinon.stub().returns(Promise.resolve())
    }
    instance = new Service(fakeServiceDefinition);
    instance.start();
    const arg = fakeServiceDefinition.start.args[0][0];
    assert.strictEqual(arg, instance);
  });

  it('should call the service definition start function', function() {
    const fakeServiceDefinition = {
      name: 'foo',
      start: sinon.stub().returns(Promise.resolve())
    }
    instance = new Service(fakeServiceDefinition);
    instance.start();
    assert.ok(fakeServiceDefinition.start.called, 'start not called');
  });

});
