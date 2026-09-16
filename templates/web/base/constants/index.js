'use strict';

const pkg = require('../package.json');

const PREFERRED_PORT = pkg.switchFramework?.port || 3000;
const HOST = process.env.SWITCH_BIND_HOST || '127.0.0.1';
const PORT = process.env.PORT !== undefined && process.env.PORT !== ''
  ? Number(process.env.PORT)
  : PREFERRED_PORT;

module.exports = {
  PREFERRED_PORT,
  HOST,
  PORT,
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
};
