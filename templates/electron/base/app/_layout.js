import { StackLayout, createState, registerComponents } from '/switch-framework/index.js';
import { SwStarterSplashScreen } from '/components/SwStarterSplashScreen.js';
import { SwTabBar } from '/components/SwTabBar.js';

registerComponents([SwStarterSplashScreen, SwTabBar]);
import { SwIndexScreen } from './index.js';
import NotFoundScreen from './+not-found.js';
import { SwTabsLayout } from './(tabs)/_layout.js';

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    createState([], 'patient-list');
    createState(0, 'docs-helpful-count');
    createState(false, 'search-open');
    await new Promise((r) => setTimeout(r, 2000));
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();
