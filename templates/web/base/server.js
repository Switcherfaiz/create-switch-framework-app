require('dotenv').config();

const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 8000,
  staticRoot: path.join(__dirname, '.'),
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const app = switchFrameworkBackend();

app.initServer();



// app.initServer((server) => {
//   //when u want to pass your middlewares
//   // server.use('/api', createApiRouter({ ... }));
//   // server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
// });

// const restrictConfig = {
//   public: ['/', '/login'],
//   rules: [
//     { prefix: '/admin', roles: ['admin'] },
//     { prefix: '/billing', roles: ['billing', 'admin'] },
//     { path: '/login', roles: ['*'] }
//   ]
// };
