'use strict';

const Seda = require('../lib').Seda;
const assert = require('assert');

describe('Seda constructor', function() {
  it('should be instantiable', function() {
    const instance = new Seda();
    assert.ok(instance instanceof Seda);
  });

  it('should be instantiable without new keyword', function() {
    const instance = Seda();
    assert.ok(instance instanceof Seda);
  });

  it('should initialise _services properties as empty object', function() {
    const instance = new Seda();
    assert.ok(instance._services, 'property does not exists');
    assert.strictEqual(typeof instance._services, 'object', 'property is not an object');
    assert.strictEqual(Object.keys(instance._services).length, 0, 'is not empty');
  });
});
