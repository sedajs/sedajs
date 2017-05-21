'use strict';

const assertIsAServiceDefinition = require('../lib/checks').assertIsAServiceDefinition;
const assert = require('assert');

describe('checks#assertIsAServiceDefinition', function() {
  it('should require the service definition as parameter', function() {
    assert.throws(() => {
      assertIsAServiceDefinition();
    }, /Missing required parameter/);
  });

  it('should require the property "name" in service definition', function() {
    const definition = {};

    assert.throws(() => {
      assertIsAServiceDefinition(definition);
    }, /Missing required \"name\" property in service definition/);
  });

  it('should require the property "start" in service definition', function() {
    const definition = { name: 'foo' };

    assert.throws(() => {
      assertIsAServiceDefinition(definition);
    }, /Missing required \"start\" method in service definition/);
  });

  it('should fail if service definition "start" property is no a method', function() {
    const definition = {
      name: 'foo',
      start: []
    };

    assert.throws(() => {
      assertIsAServiceDefinition(definition);
    }, /Service definition "start" property should be a function/);
  });
});
