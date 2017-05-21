'use strict';

const assert = require('assert');
const sinon = require('sinon');

const Service = require('../lib').Service;

describe('Service#reply', function() {
  let receivedEvent;
  let context;
  let reply;
  beforeEach(function() {
    receivedEvent = {
      metadata: {
        replyTo: {
          queue: 'foo',
          tag: 'bar'
        }
      },
      payload: {
        success: true
      }
    };

    context = {
      _transport: {
        reply: sinon.stub().resolves()
      }
    };

    reply = Service.prototype.reply.bind(context);
  });

  it('should exists as method', function testExists() {
    assert.notDeepEqual(reply, undefined, '#reply not present');
    assert.deepEqual(typeof reply, 'function', '#reply is not a function');
  });

  it('should return a promise', function() {
    const value = reply();

    assert.ok(value instanceof Promise, 'returned value is not a function');

    // Ignored unrelated errors
    value.catch(() => {});
  });

  it('should fail when wrong number of arguments passed', async function() {
    function testError(promise) {
      return promise.then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"reply" function expects two or three arguments');
      });
    };
    let value;
    await testError(reply());
    await testError(reply(receivedEvent));
    await testError(reply(receivedEvent, { thisIsPayload: true }, { thisIsMetadata: true }, 'extraParameter'));
  });

  it('should fail if first parameter is not a received event', async function() {
    async function check(firstParam) {
      return reply(firstParam, {}).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"reply" first argument should be the received event');
      });
    }
    await check({});
    await check({ replyTo: {}});
    await check({ replyTo: { queue: 'blabla' }});
    await check({ replyTo: { tag: 'blabla' }});
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
      return reply(receivedEvent, secondParam).then(function() {
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"reply" second argument (event body) should be an object');
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

  it('should fail if third parameter is present and is not an object', async function() {
    async function check(thirdParameter) {
      return reply(receivedEvent, {}, thirdParameter).then(function() {
        console.log(thirdParameter);
        throw new Error('It did not failed');
      }, function(err) {
        assert.strictEqual(err.message, '"reply" third argument (event payload) should be an object');
      });
    }
    await check(33);
    await check(null);
    await check(Infinity);
    await check(NaN);
    await check([]);
    await check('asdf');
  });

  it('should call the transport reply method with the provided events', async function() {
    const stub = context._transport.reply;

    const outputPayload = {
      success: true
    }

    const eventName = '.test';
    await reply.call(context, receivedEvent, outputPayload);
    assert.ok(stub.called, '_transport.reply not called');
    assert.ok(stub.calledOnce, '_transport.reply called more than once');
    const args = stub.getCall(0).args;
    assert.strictEqual(args[0], receivedEvent, 'called _transport.ask with a different input event');
    assert.strictEqual(args[1].payload, outputPayload , 'called _transport.ask with a different output event');
  });

  it('should  fail if transport reply method fails', async function() {
    const payload = {};
    const metadata = {};
    const error = new Error('foobar');
    context._transport.reply = sinon.stub().callsFake(function() {
      throw error;
    });

    const eventName = '.test';
    return reply.call(context, receivedEvent, payload, metadata).then(function() {
      throw new Error('It did not failed');
    }, function(err) {
      assert.strictEqual(err, error);
    });
  });
});
