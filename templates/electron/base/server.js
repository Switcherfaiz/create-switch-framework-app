require('dotenv').config();

const switchFrameworkBackend = require('switch-framework-backend');

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  staticRoot: __dirname,
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  const restrictConfig = {
    public: ['/', '/login'],
    rules: [
      { prefix: '/admin', roles: ['admin'] },
      { prefix: '/billing', roles: ['billing', 'admin'] },
      { path: '/login', roles: ['*'] }
    ]
  };
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
