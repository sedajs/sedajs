'use strict';

module.exports = function injectToSeda(Service, checks) {
  function Seda() {
    if (!(this instanceof Seda)) return new Seda();
    this._services = {};
  }

  const proto = Seda.prototype;

  proto.setTransport = function setTransport(transport) {
    checks.assertIsATransport(transport);
    this._transport = transport;
  };

  proto.addService = function addService(definition) {
    checks.assertIsAServiceDefinition(definition);

    if (this._services[definition.name]) {
      throw new Error(`Service "${definition.name}" already added`);
    }

    this._services[definition.name] = new Service(definition);
  };

  proto.start = async function start() {
    if (!this._transport) throw new Error('Transport should be set before starting Seda');

    await this._transport.start();

    const promises = [];
    Object.keys(this._services).forEach((key) => {
      let service = this._services[key];
      promises.push(this._configureService(service));
    });
    await Promise.all(promises);
  };

  proto._configureService = async function(service) {
    const serviceTransport = await this._transport.getServiceTransport(service.name);
    service.setTransport(serviceTransport);
    await service.start();
    await serviceTransport.start();
  };

  return Seda;
};
