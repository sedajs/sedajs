'use strict';

module.exports = function injectToService(checks) {
  function Service(definition) {
    checks.assertIsAServiceDefinition(definition);

    this.name = definition.name;
    this._definition = definition;
  }

  const proto = Service.prototype;

  proto.setTransport = function setTransport(serviceTransport) {
    this._transport = serviceTransport;
  };

  proto.start = function start() {
    return this._definition.start(this);
  };

  proto.listen = async function listen(eventNames, handler) {
    if (arguments.length !== 2) {
      throw new Error('"listen" function expects two arguments');
    }
    if (typeof eventNames !== 'string' && !Array.isArray(eventNames)) {
      throw new Error('"listen" first argument should be a string or array');
    }
    if (typeof handler !== 'function') {
      throw new Error('"listen" second argument should be a function');
    }

    const names = Array.isArray(eventNames) ? eventNames : [eventNames];

    names.forEach((name) => this._transport.addListener(name, handler));
  };

  function isObject(obj) {
    return obj && obj instanceof Object && !Array.isArray(obj);
  }

  proto.ask = async function ask(eventName, payload, metadata={}) {
    if (arguments.length < 2 || arguments.length > 3) {
      throw new Error('"ask" function expects two or three arguments');
    }
    if (typeof eventName !== 'string') {
      throw new Error('"ask" first argument (event name) should be a string');
    }
    if (!isObject(payload)) {
      throw new Error('"ask" second argument (event payload) should be an object');
    }
    if (!isObject(metadata)) {
      throw new Error('"ask" third argument (event metadata) should be an object');
    }

    const event = {
      metadata,
      payload
    };
    event.metadata.name = eventName;

    return new Promise((resolve, reject) => {
      function handler(err, event) {
        if (err) return reject(err);
        resolve(event);
      }
      this._transport.ask(event, handler);
    });
  };

  function isReceivedEvent(event) {
    if (!isObject(event)) return false;
    if (!event.metadata) return false;
    const replyTo = event.metadata.replyTo;
    return replyTo && replyTo.queue && replyTo.tag;
  }

  proto.reply = async function reply(originalEvent, replyPayload, replyMetadata={}) {
    if (arguments.length < 2 || arguments.length > 3) {
      throw new Error('"reply" function expects two or three arguments');
    }
    if (!isReceivedEvent(originalEvent)) {
      throw new Error('"reply" first argument should be the received event');
    }
    if (!isObject(replyPayload)) {
      throw new Error('"reply" second argument (event body) should be an object');
    }
    if (!isObject(replyMetadata)) {
      throw new Error('"reply" third argument (event payload) should be an object');
    }

    const replyEvent = {
      metadata: replyMetadata,
      payload: replyPayload
    };

    await this._transport.reply(originalEvent, replyEvent);
  };

  proto.publish = async function publish(eventName, payload, metadata={}) {
    if (arguments.length < 2 || arguments.length > 3) {
      throw new Error('"publish" function expects two or three arguments');
    }
    if (typeof eventName !== 'string') {
      throw new Error('"publish" first argument (event name) should be a string');
    }
    if (!isObject(payload)) {
      throw new Error('"publish" second argument (event payload) should be an object');
    }
    if (!isObject(metadata)) {
      throw new Error('"publish" third argument (event metadata) should be an object');
    }

    const event = {
      metadata,
      payload
    };
    event.metadata.name = eventName;

    return await this._transport.publish(event);
  };

  return Service;
};
