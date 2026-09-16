'use strict';

function readCookie(req, name) {
  const header = String(req.headers.cookie || '');
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

function isWebViewingAllowed() {
  const raw = process.env.ALLOW_WEB_VIEWING;
  return raw === '1' || raw === 'true' || raw === 'TRUE';
}

function localAuthMiddleware(req, res, next) {
  if (isWebViewingAllowed()) return next();

  const expected = process.env.SWITCH_LOCAL_AUTH_TOKEN;
  if (!expected) return next();

  const token = req.headers['x-auth-token']
    || req.query.token
    || readCookie(req, 'switch-local-auth');

  if (token === expected) return next();
  return res.status(403).send('Unauthorized request.');
}

module.exports = { localAuthMiddleware };
