'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Service = require('../lib').Service;

describe('Service#ask', function() {
  const ask = Service.prototype.ask;

  it('should exists as method', function testExists() {
    assert.notDeepEqual(ask, undefined, '#ask not present');
    assert.deepEqual(typeof ask, 'function', '#ask is not a function');
  });

  it('should return a promise', function() {
    const value = ask();

    assert.ok(value instanceof Promise, 'returned value is not a function');

    // Ignored unrelated errors
    value.catch(() => {});
  });

  it('should fail when wrong number of arguments passed', async function() {
    function testError(promise) {
      return promise.then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"ask" function expects two or three arguments');
      });
    };
    let value;
    await testError(ask());
    await testError(ask('one'));
    await testError(ask('one', {}, {}, 'four'));
  });

  it('should fail if first parameter is not an string', async function() {
    async function check(firstParam) {
      return ask(firstParam, {}).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"ask" first argument (event name) should be a string');
      });
    }
    await check({});
    await check(33);
    await check(null);
    await check(undefined);
    await check(Infinity);
    await check(NaN);
    await check(function() {});
    await check([]);
  });

  it('should fail if second parameter is not an object', async function() {
    async function check(secondParam) {
      return ask('.test', secondParam).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"ask" second argument (event payload) should be an object');
      });
    }
    await check(33);
    await check(null);
    await check(undefined);
    await check(Infinity);
    await check(NaN);
    await check([]);
    await check('asdf');
  });

  it('should fail if third parameter is not an object', async function() {
    async function check(thirdParam) {
      return ask('.test', {}, thirdParam).then(function() {
        console.log(thirdParam);
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"ask" third argument (event metadata) should be an object');
      });
    }
    await check(33);
    await check(null);
    await check(Infinity);
    await check(NaN);
    await check([]);
    await check('asdf');
  });


  it('should call the transport ask method and return its response', async function() {
    const payload = {};
    const metadata = {};
    const stub = sinon.stub().callsFake(function(event, handler) {
      handler(null, { metadata, payload });
    });

    const context = {
      _transport: {
        ask: stub
      }
    }

    const eventName = '.test';
    const reply = await ask.call(context, eventName, payload, metadata);
    assert.ok(reply, 'No reply');
    assert.strictEqual(reply.metadata, metadata, 'Metadata differs');
    assert.strictEqual(reply.payload, payload, 'Payload differs');
    assert.ok(stub.called, 'ask not called');
    assert.ok(stub.calledOnce, 'ask called more than once');
    const args = stub.getCall(0).args;
    assert.strictEqual(args[0].payload, payload, '_transport.ask event payload differs');
    assert.strictEqual(args[0].metadata, metadata, '_transport.ask event metadata differs');
    assert.strictEqual(args[0].metadata.name, eventName, '_transport.ask metadata name property differs');
    assert.strictEqual(typeof args[1], 'function', '_transport.ask handler parameter is not a function');
  });

  it('should  fail if transport ask method fails', async function() {
    const payload = {};
    const metadata = {};
    const error = new Error('foobar');
    const stub = sinon.stub().callsFake(function(event, handler) {
      handler(error);
    });

    const context = {
      _transport: {
        ask: stub
      }
    }

    const eventName = '.test';
    return ask.call(context, eventName, payload, metadata).then(function() {
      throw new Error('It did not failed');
    }, function(err) {
      assert.strictEqual(err, error);
    });
  });
});
