export class SwTabBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();
    this.updateActive();

    if (globalStates?.subscribe) {
      this._unsub = globalStates.subscribe(() => this.updateActive());
    }

    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button[data-route]');
      if (!btn) return;
      const route = btn.getAttribute('data-route');
      const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
      if (typeof navigate === 'function') navigate(route);
    });
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }

  getTabs() {
    const layout = globalStates?.getState ? globalStates.getState('tabsLayout') : null;
    const tabs = Array.isArray(layout?.tabs) ? layout.tabs : [];
    return tabs;
  }

  updateActive() {
    const activeRoute = globalStates?.getState ? globalStates.getState('activeRoute') : '';
    const tabs = this.getTabs();

    tabs.forEach((t) => {
      const el = this.shadowRoot.getElementById(`tab-${t.name}`);
      if (!el) return;
      const isActive = String(activeRoute || '').startsWith(String(t.name));
      el.classList.toggle('active', isActive);
    });
  }

  render() {
    const tabs = this.getTabs();

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <nav class="bar" aria-label="Bottom tabs">
        ${tabs.map((t) => `
          <button class="tab" id="tab-${t.name}" data-route="${t.name}" type="button">
            <span class="icon">${this.getIcon(t.icon)}</span>
            <span class="label">${t.title || t.name}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  getIcon(name) {
    const map = {
      home: `<span class='switch_icon_house'></span>`,
      compass: `<span class='switch_icon_compass'></span>`,
      settings: `<span class='switch_icon_gear'></span>`
    };
    return map[name] || map.home;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          background: transparent;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid var(--border_color, #e5e5e5);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: saturate(180%) blur(10px);
        }

        :root[data-theme="dark"] .bar {
          background: rgba(11, 15, 20, 0.95);
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        .tab {
          appearance: none;
          border: none;
          background: transparent;
          border-radius: 20px;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--sub_text, #666);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .tab:active {
          transform: scale(0.95);
        }

        .tab.active {
          background: rgba(0, 0, 0, 0.06);
          color: var(--main_text, #000);
        }

        :root[data-theme="dark"] .tab.active {
          background: rgba(255, 255, 255, 0.1);
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          line-height: 1;
        }

        .label {
          display: block;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-tab-bar')) {
  customElements.define('sw-tab-bar', SwTabBar);
}