'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Service = require('../lib').Service;

describe('Service#listen', function() {
  const listen = Service.prototype.listen;

  it('should exists as method', function testExists() {
    assert.notDeepEqual(listen, undefined, '#listen not present');
    assert.deepEqual(typeof listen, 'function', '#listen is not a function');
  });

  it('should return a promise', function() {
    const value = listen();

    assert.ok(value instanceof Promise, 'returned value is not a function');

    // Ignored unrelated errors
    value.catch(() => {});
  });

  it('should fail when wrong number of arguments passed', async function() {
    let value;
    try {
      value = await listen();
    } catch (err) {
      assert.strictEqual(err.message, '"listen" function expects two arguments');
    }
  });

  it('should fail if first parameter is not an string or array', async function() {
    async function check(firstParam) {
      let value;
      try {
        value = await listen(firstParam, () => {});
      } catch (err) {
        assert.strictEqual(err.message, '"listen" first argument should be a string or array');
      }
    }
    await check({});
    await check(33);
    await check(null);
    await check(undefined);
    await check(Infinity);
    await check(function() {});
  });

  it('should fail if second string is not a function', async function() {
    async function check(secondParam) {
      let value;
      try {
        value = await listen('.test', secondParam);
      } catch (err) {
        assert.strictEqual(err.message, '"listen" second argument should be a function');
      }
    }
    await check({});
    await check(33);
    await check(null);
    await check(undefined);
    await check(Infinity);
    await check([]);
    await check('asdf');
  });

  it('should call the transport addListener method one time when first argument is a string', async function() {
    const stub = sinon.stub().returns(Promise.resolve());
    const context = {
      _transport: {
        addListener: stub
      }
    };
    const eventName = '.test';
    const handler = function handler() {};
    await listen.call(context, eventName, handler);
    assert.ok(stub.called, 'addListener not called');
    assert.ok(stub.calledOnce, 'addListener called more than once');
    const args = stub.getCall(0).args;
    assert.strictEqual(args[0], eventName, 'addListener first parameter differs');
    assert.strictEqual(args[1], handler, 'addListener second parameter differs');
  });

  it('should call the transport addListener once per item when the first argument is an array', async function() {
    const stub = sinon.stub().returns(Promise.resolve());
    const context = {
      _transport: {
        addListener: stub
      }
    };
    const eventNames = ['foo', 'bar', 'foobar'];
    const handler = function handler() {};
    await listen.call(context, eventNames, handler);
    assert.ok(stub.called, 'addListener not called');
    assert.strictEqual(stub.callCount, eventNames.length, 'addListener called a different number of times');
    eventNames.forEach(function(name, index) {
      const args = stub.getCall(index).args;
      assert.strictEqual(args[0], name, `addListener first argument differs for ${name}`);
      assert.strictEqual(args[1], handler, `addListener second argument differs for ${name}`);
    });
  });
});
