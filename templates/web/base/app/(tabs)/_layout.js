import { TabLayout, registerComponents } from '/switch-framework/index.js';
import { SwTabBar } from '/components/SwTabBar.js';

registerComponents([SwTabBar]);
import { SwHomeScreen } from './index.js';
import { SwExploreScreen } from './explore.js';

export class SwTabsLayout extends TabLayout {
  static tag = 'sw-tabs-layout';
  static initialTab = 'home';
  static tabs = [
    {
      name: 'home',
      title: 'Home',
      icon: 'home',
      path: '/home',
      screen: 'sw-home-screen',
      match: ['home']
    },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'compass',
      path: '/explore',
      screen: 'sw-explore-screen',
      match: ['explore']
    }
  ];
  static options = { position: 'bottom' };
  static screens = [SwHomeScreen, SwExploreScreen];

  render() {
    return `
      <div class="layout">
        <div class="tabcontainer"></div>
        <div class="tabbar">
          <sw-tab-bar></sw-tab-bar>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: inherit;
          overflow: hidden;
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }
        * { box-sizing: border-box; font-family: inherit; }
        .layout {
          min-height: 0;
          height: 100%;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          overflow: hidden;
        }
        .tabbar {
          height: auto;
          position: sticky;
          bottom: 0;
          z-index: 50;
        }
        .tabcontainer {
          z-index: 1;
          min-height: 0;
          overflow: auto;
          overflow-x: hidden;
          padding-bottom: calc(12px + 56px + env(safe-area-inset-bottom, 0px));
        }
      </style>
    `;
  }
}
