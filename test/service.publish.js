'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Service = require('../lib').Service;

describe('Service#publish', function() {
  const publish = Service.prototype.publish;

  it('should exists as method', function testExists() {
    assert.notDeepEqual(publish, undefined, '#publish not present');
    assert.deepEqual(typeof publish, 'function', '#publish is not a function');
  });

  it('should return a promise', function() {
    const value = publish();

    assert.ok(value instanceof Promise, 'returned value is not a function');

    // Ignored unrelated errors
    value.catch(() => {});
  });

  it('should fail when wrong number of arguments passed', async function() {
    function testError(promise) {
      return promise.then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"publish" function expects two or three arguments');
      });
    };
    let value;
    await testError(publish());
    await testError(publish('one'));
    await testError(publish('one', {}, {}, 'four'));
  });

  it('should fail if first parameter is not an string', async function() {
    async function check(firstParam) {
      return publish(firstParam, {}).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"publish" first argument (event name) should be a string');
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
      return publish('.test', secondParam).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"publish" second argument (event payload) should be an object');
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
      return publish('.test', {}, thirdParam).then(function() {
        console.log(thirdParam);
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"publish" third argument (event metadata) should be an object');
      });
    }
    await check(33);
    await check(null);
    await check(Infinity);
    await check(NaN);
    await check([]);
    await check('asdf');
  });


  it('should call the transport publish method', async function() {
    const payload = {};
    const metadata = {};
    const stub = sinon.stub().resolves();

    const context = {
      _transport: {
        publish: stub
      }
    }

    const eventName = '.test';
    await publish.call(context, eventName, payload, metadata);
    assert.ok(stub.called, 'publish not called');
    assert.ok(stub.calledOnce, 'publish called more than once');
    const args = stub.getCall(0).args;
    assert.strictEqual(args[0].payload, payload, '_transport.publish event payload differs');
    assert.strictEqual(args[0].metadata, metadata, '_transport.publish event metadata differs');
    assert.strictEqual(args[0].metadata.name, eventName, '_transport.publish metadata name property differs');
  });

  it('should  fail if transport publish method fails', async function() {
    const payload = {};
    const metadata = {};
    const error = new Error('foobar');
    const stub = sinon.stub().callsFake(function() {
      throw error;
    });

    const context = {
      _transport: {
        publish: stub
      }
    }

    const eventName = '.test';
    return publish.call(context, eventName, payload, metadata).then(function() {
      throw new Error('It did not failed');
    }, function(err) {
      assert.strictEqual(err, error);
    });
  });
});
