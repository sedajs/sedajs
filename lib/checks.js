'use strict';

const checks = {};
module.exports = checks;

checks.assertIsAServiceDefinition = function assertIsAServiceDefinition(definition) {
  if (!definition) {
    throw new Error('Missing required parameter');
  }
  if (!definition.name) {
    throw new Error('Missing required "name" property in service definition');
  }
  if (!definition.start) {
    throw new Error('Missing required "start" method in service definition');
  }
  if (typeof definition.start !== 'function') {
    throw new Error('Service definition "start" property should be a function');
  }
};

checks.assertIsATransport = function assertIsATransport(transport) {
  if (!transport) {
    throw new Error('Missing required parameter');
  }
  if (!transport.start) {
    throw new Error('Missing required transport "start" method');
  }
  if (typeof transport.start !== 'function') {
    throw new Error('Transport "start" property should be a function');
  }
  if (!transport.getServiceTransport) {
    throw new Error('Missing required transport "getServiceTransport" method');
  }
  if (typeof transport.getServiceTransport !== 'function') {
    throw new Error('Transport "getServiceTransport" property should be a function');
  }
};
