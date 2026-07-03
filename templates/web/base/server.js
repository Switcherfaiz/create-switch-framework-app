require('dotenv').config();

const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const pkg = require('./package.json');
const port = Number(process.env.PORT) || pkg.switchFramework?.port;

switchFrameworkBackend.config({
  PORT: port,
  staticRoot: path.join(__dirname, '.'),
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const { createApiRouter } = require('./routes/api.js');

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', createApiRouter());

  // server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});

// const restrictConfig = {
//   public: ['/', '/login'],
//   rules: [
//     { prefix: '/admin', roles: ['admin'] },
//     { prefix: '/billing', roles: ['billing', 'admin'] },
//     { path: '/login', roles: ['*'] }
//   ]
// };
