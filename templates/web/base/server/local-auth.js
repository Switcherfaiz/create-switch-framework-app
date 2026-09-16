'use strict';

function localAuthMiddleware(_req, _res, next) {
  next();
}

module.exports = { localAuthMiddleware };
