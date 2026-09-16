'use strict';

const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const { PORT, SESSION_SECRET, ALLOW_WEB_VIEWING } = require('./constants/index.js');
const { localAuthMiddleware } = require('./server/local-auth.js');
const { createApiRouter } = require('./web/routes/api.js');

process.env.ALLOW_WEB_VIEWING = ALLOW_WEB_VIEWING ? '1' : '0';

switchFrameworkBackend.config({
  PORT,
  staticRoot: path.join(__dirname, 'web'),
  session: {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  },
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use(localAuthMiddleware);
  server.use('/api', createApiRouter());
});
