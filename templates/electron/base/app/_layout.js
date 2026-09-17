import { StackLayout, ensureState } from 'switch-framework';
import '../components/SwStarterSplashScreen.js';
import { SwIndexScreen } from './index.js';
import NotFoundScreen from './+not-found.js';
import { SwTabsLayout } from './(tabs)/_layout.js';
import { checkIntro } from '../hooks/checkIntro.js';

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  static async init({ renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');

    ensureState('example-counter', 0);

    const intro = await checkIntro();
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      splash: 'sw-starter-splash',
      initialRoute: intro.shouldShowIntro ? 'index' : 'index',
    };
  }

  static render() {
    return ``;
  }

  static styleSheet() {
    return `
      <style>
        h1 { font-size: 30px; }
      </style>
    `;
  }
}
