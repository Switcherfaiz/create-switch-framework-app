'use strict';

const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const { PORT, SESSION_SECRET } = require('./constants/index.js');
const { localAuthMiddleware } = require('./server/local-auth.js');
const { createApiRouter } = require('./routes/api.js');

switchFrameworkBackend.config({
  PORT,
  staticRoot: path.join(__dirname, '.'),
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
