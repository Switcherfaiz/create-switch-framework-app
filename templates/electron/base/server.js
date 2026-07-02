require('dotenv').config();

const switchFrameworkBackend = require('switch-framework-backend');
const pkg = require('./package.json');
const port = Number(process.env.PORT) || pkg.switchFramework?.port;

switchFrameworkBackend.config({
  PORT: port,
  staticRoot: __dirname,
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
