import { startApp } from 'switch-framework';
import { initTheme } from 'switch-framework/themes';
import layout from './app/_layout.js';
initTheme();
startApp(layout);
