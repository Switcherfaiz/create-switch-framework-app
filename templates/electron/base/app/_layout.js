import { StackLayout, createState, registerComponents } from 'switch-framework';
import { SwStarterSplashScreen } from '../components/SwStarterSplashScreen.js';
import { SwTabBar } from '../components/SwTabBar.js';
import { SwIndexScreen } from './index.js';
import NotFoundScreen from './+not-found.js';
import { SwTabsLayout } from './(tabs)/_layout.js';

registerComponents([SwStarterSplashScreen, SwTabBar]);

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');

    // Example: create app-level state
    createState('example-counter', 0);

    // Simulate async init (e.g. load config, auth check)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }

  // Called by app-shell to inject markup directly into its shadow DOM.
  // Wrap popup components in <div class="popups" data-popups> — they get
  // hoisted to #app-popups automatically. Everything else goes to #layout-content.
  static render() {
    return `
      <div class="popups" data-popups>
        <h1>Bichwa</h1>
      </div>
    `;
  }

  // Called by app-shell to inject styles directly into its shadow DOM.
  static styleSheet() {
    return `
      <style>
        h1 { font-size: 30px; }
      </style>
    `;
  }
}

export default SwStackLayout.getAppLayout();