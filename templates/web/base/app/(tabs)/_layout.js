import { Tabs } from '/switch-framework/index.js';

export const tabsLayout = Tabs({
  name: 'sw-tabs-layout',
  initialTab: 'home',
  tabs: [
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
  ],
  options: {
    position: 'bottom'
  }
});

export class SwTabsLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  getContentContainer() {
    return this.shadowRoot.querySelector('.tabcontainer');
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
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
    width: 100%;
    height: inherit;
    overflow: hidden;
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
}

* {
    box-sizing: border-box;
    font-family: inherit
}


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

if (!customElements.get('sw-tabs-layout')) {
  customElements.define('sw-tabs-layout', SwTabsLayout);
}

export const screens = [
  Tabs.screen({
    name: 'home',
    path: '/home',
    title: 'Home',
    tag: 'sw-home-screen',
    layout: 'tabs'
  }),
  Tabs.screen({
    name: 'explore',
    path: '/explore',
    title: 'Explore',
    tag: 'sw-explore-screen',
    layout: 'tabs'
  })
];

tabsLayout.screens = screens;

export default tabsLayout;
