const express = require('express');
const session = require('express-session');
const path = require('node:path');
require('dotenv').config();

const { checkRestrict } = require('switch-framework-backend/middleware');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false
}));

// Serve switch-framework to the browser from node_modules
app.use('/switch-framework', express.static(path.join(__dirname, 'node_modules', 'switch-framework')));

// Serve project files
app.use(express.static(path.join(__dirname, '.')));

const restrictConfig = {
  public: ['/', '/login'],
  rules: [
    { prefix: '/admin', roles: ['admin'] },
    { prefix: '/billing', roles: ['billing', 'admin'] },
    { path: '/login', roles: ['*'] }
  ]
};

app.use(checkRestrict(restrictConfig));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Switch Framework app running at http://localhost:' + PORT);
});
