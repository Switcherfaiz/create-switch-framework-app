import { startApp } from '/switch-framework/index.js';
import layout from './app/_layout.js';
import { appRegisters } from './app/register.js';

startApp(layout, appRegisters);
