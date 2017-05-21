'use strict';

const checks = require('./checks');
const injectToService = require('./service');
const injectToSeda = require('./seda');

const Service = injectToService(checks);
const Seda = injectToSeda(Service, checks);

module.exports = { Service, Seda };
